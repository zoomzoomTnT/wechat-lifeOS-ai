---
name: life-proactive
description: >
  Proactive WeChat pings for Life OS. Use on heartbeat, cron wakes, 主动提醒,
  巡检, due memos, expiring fridge, pending receipts. If due() has work, send
  a short Chinese message first; if empty, only HEARTBEAT_OK.
version: 1.0.0
metadata:
  openclaw:
    emoji: "📡"
    requires:
      bins: ["python3"]
---

# life-proactive — 主动开口

心跳里跑 `due` 可以静默（结果是 `HEARTBEAT_OK`）。**一旦有事要跟用户说**，先发中文再继续 tool。

```bash
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" due --within-hours 36
```

- 三类全空 → 只回 `HEARTBEAT_OK`，不要寒暄，不要 message。
- 有事 → 先 `message`（或助手文本）最多 2 条短微信，再更新 `last_fired_at`。
- 渠道 `openclaw-weixin`。东京 22:00–08:00 非紧急不发。
