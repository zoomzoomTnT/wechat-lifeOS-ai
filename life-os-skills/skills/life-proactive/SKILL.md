---
name: life-proactive
description: >
  Proactive WeChat pings for Life OS. Use on heartbeat, OpenClaw cron/automation
  wakes, 主动提醒, 巡检, due memos, expiring fridge items, pending receipts,
  and options-expiry jobs. Decides whether to message first or reply HEARTBEAT_OK.
version: 1.0.0
metadata:
  openclaw:
    emoji: "📡"
    requires:
      bins: ["python3"]
---

# life-proactive — 主动开口

OpenClaw 不会「因为你写了 schema 就找我」。必须有人 **叫醒** 模型：heartbeat 或 automation。本技能规定叫醒之后做什么。

先读 `skills/life-db/SKILL.md`。

## 叫醒源

| 源 | 用途 |
|---|---|
| Heartbeat（建议 30m，限制 activeHours） | 便宜巡检：到期 memo、冰箱 48h 内过期、待确认小票 |
| Automation cron（精确到分钟） | 期权 8:25 ET、每天 18:00 冰箱、用户定制 |

精确时刻用 cron，**不要**指望 30 分钟 heartbeat 对准 8:25。

## 巡检（每次叫醒）

```bash
python3 {baseDir}/scripts/life.py due --within-hours 36
```

然后：

1. 若三类全空 → 只回 `HEARTBEAT_OK`（heartbeat）或保持沉默（cron 且无事）。**不要寒暄。**
2. 有事 → 最多 **2 条** 微信，按优先级：
   - priority 1–2 memo / 今天过期的食品
   - 待确认小票超过 24h
   - 期权/财报
3. 同一 `memos.id` 若 `last_fired_at` 在 6 小时内 → 跳过
4. 发出后：`UPDATE memos SET last_fired_at=datetime('now') WHERE id=?`

## 文案

中文、像朋友、一句事实 + 一句问句。禁止长报告。禁止「作为你的 AI 助手」。

夜间（Asia/Tokyo 22:00–08:00）除非 priority=1，否则不发。Heartbeat 应配 `activeHours`，`target: "openclaw-weixin"`。

## 渠道

主动消息走微信插件渠道名 **`openclaw-weixin`**，收件人 `people.handle`（主人）。cron 创建时带 `--announce --channel openclaw-weixin --to <handle>`。

## HEARTBEAT.md

把 `{baseDir}/workspace/HEARTBEAT.snippet.md` 的内容 **合并进** 工作区 `HEARTBEAT.md`，保持全文件 < 50 行。不要把 schema 贴进 heartbeat。

## 模型

看小票需要 **带视觉** 的模型。Heartbeat 巡检只跑 SQL，可用便宜文本模型。给期权/小票 cron 单独指定视觉或更强模型（`openclaw automations ... --model`）。
