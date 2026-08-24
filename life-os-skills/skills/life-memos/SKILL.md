---
name: life-memos
description: >
  Capture reminders into Life OS memos and schedule OpenClaw automations / cron
  so the agent can message first. Use when the user says 提醒我, 备忘, memo,
  cron, 到期, 期权到期, Friday 8:25 ET, snooze, 完成了, or any domain skill
  needs a follow-up ping (fridge expiry, stock event).
version: 1.0.0
metadata:
  openclaw:
    emoji: "⏰"
    requires:
      bins: ["python3"]
---

# life-memos — 提醒总线

**memos 表是主动对话的唯一出口。** finance / fridge / stocks 不自己私发 cron；它们插入 memo，由这里挂 OpenClaw automation。

先读并遵守 `skills/life-db/SKILL.md`。

## 何时写一条 memo

- 用户说「提醒我…」
- 冰箱食品：过期前 2 天 + 过期当天（两条，kind=`expiry`）
- 期权到期、财报、需要跟进的持仓（kind=`options` / `brief`）
- 记账后需要确认「吃完/丢掉了吗」（kind=`followup`）

## 写入

```sql
INSERT INTO memos (
  owner_id, title, body, kind, status, priority,
  due_at, timezone, cron_expr, cron_tz,
  source_domain, source_table, source_id, payload_json
) VALUES (?,?,?,?, 'open', ?, ?, ?, ?, ?, ?, ?, ?, ?)
```

- 一次性：填 `due_at`（UTC），`cron_expr` 为空
- 循环：填 `cron_expr` + `cron_tz`，`due_at` = 下一次触发的 UTC

然后 **立刻** 创建 OpenClaw job，把返回的 id 写回 `memos.automation_id`。

## 创建 OpenClaw automation

精确时刻（例：美东每周五 08:25 提醒期权到期）：

```bash
openclaw automations create "25 8 * * 5" \
  --name "options-expiry-et" \
  --tz "America/New_York" \
  --session isolated \
  --announce \
  --channel openclaw-weixin \
  --to "<owner-weixin-id>" \
  --message "Read skills/life-proactive/SKILL.md. Memo id=<ID>. 现在是美东周五 8:25，检查 memos 与 holdings，用中文主动提醒主人期权到期。不要回复 HEARTBEAT_OK。"
```

一次性：

```bash
openclaw automations add \
  --name "memo-<id>" \
  --at "<ISO due_at>" \
  --session isolated \
  --announce \
  --channel openclaw-weixin \
  --to "<owner-weixin-id>" \
  --message "Read skills/life-proactive/SKILL.md. 到期备忘 id=<ID>：<title>。用中文短讯主动问主人。"
```

渠道名必须是 **`openclaw-weixin`**（腾讯插件），`--to` 用 `people.handle`。若当前就在这条私聊里，可省略 `--channel/--to` 并改 `--session main`，让提醒进当前会话。

不确定 job 是否建成功：`openclaw automations list`，把 id 存进 memo。

## 用户改状态

| 说法 | 动作 |
|---|---|
| 完成了 / 吃完了 / 丢掉了 | `status='done'`，disable 对应 automation |
| 推迟 N | `status='snoozed'`，改 `due_at`，edit automation |
| 取消 | `status='cancelled'`，remove automation |
| 改时间 | 更新 `due_at`/`cron_*`，edit automation |

## 说话方式

短、像微信：一句事实 + 一句问句。不要列表倾泻。

> 美东现在周五 8:25。你标过这周有期权到期——要不要我把持仓过一遍？

> 冰箱里的生菜今天到期。吃完了还是扔了？我帮你记状态。

同一条 memo 不要在 6 小时内重复 fire（看 `last_fired_at`）。发出后更新 `last_fired_at`。

## 查询到期

```bash
python3 {baseDir}/scripts/life.py due --within-hours 36
```

详细字段见 `{baseDir}/schema.sql` 的 `memos`。
