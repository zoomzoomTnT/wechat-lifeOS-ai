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

**memos 表是主动对话的唯一出口。** 直接 `exec` 插入，不要先 `init`。

```
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" exec \
  "INSERT INTO memos (owner_id, title, body, kind, due_at, timezone) VALUES (1,?,?, 'reminder',?, 'Asia/Tokyo')" \
  --params '["<title>","<body>","<due_at_utc>"]'
```

- 一次性：填 `due_at`（UTC）
- 循环：再加 `cron_expr` + `cron_tz`，然后建 OpenClaw automation

精确时刻（美东每周五 08:25）：

```bash
openclaw automations create "25 8 * * 5" \
  --name "options-expiry-et" \
  --tz "America/New_York" \
  --session isolated \
  --announce \
  --channel openclaw-weixin \
  --to "<owner-weixin-id>" \
  --message "Read skills/life-proactive/SKILL.md. Memo id=<ID>. 现在是美东周五 8:25，检查 memos 与 holdings，用中文主动提醒。不要回复 HEARTBEAT_OK。"
```

渠道名必须是 **`openclaw-weixin`**。`--to` 用 `people.handle`。

| 说法 | 动作 |
|---|---|
| 完成了 / 吃完了 / 丢掉了 | `status='done'` |
| 推迟 N | `status='snoozed'`，改 `due_at` |
| 取消 | `status='cancelled'` |

短讯：一句事实 + 一句问句。同一 memo 6 小时内不重复。

```bash
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" due --within-hours 36
```
