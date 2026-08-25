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

每次叫醒只跑：

```bash
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" due --within-hours 36
```

不要 `init`。不要 OCR。不要闲聊。

- 三类全空 → `HEARTBEAT_OK`
- 有事 → 最多 2 条短微信（事实 + 问句）。同一 memo 6 小时内不重复。
- 渠道 `openclaw-weixin`。东京 22:00–08:00 非紧急不发。
