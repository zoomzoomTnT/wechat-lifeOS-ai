---
name: life-memos
description: >
  Capture reminders into Life OS memos and schedule OpenClaw automations / cron
  so the agent can message first. Use for 提醒我, 备忘, memo, cron, 到期,
  期权到期, Friday 8:25 ET, snooze, 完成了. Before every exec, send a short
  Chinese ack with the message tool (or assistant text).
version: 1.0.0
metadata:
  openclaw:
    emoji: "⏰"
    requires:
      bins: ["python3"]
---

# life-memos — 提醒总线

## 先开口

每次备忘：**不要 exec python**。write `data/life-inbox/<id>.json`：

```json
{"op": "memo-add", "title": "<标题>", "due_at": "<UTC ISO>", "kind": "reminder"}
```

然后 read `data/life-inbox/<id>.result.json`。循环提醒加 `"cron": "25 8 * * 5", "cron_tz": "America/New_York"`。

直接 `exec` 插入 memo，不要先 `init`。

```bash
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" exec \
  "INSERT INTO memos (owner_id, title, body, kind, due_at, timezone) VALUES (1,?,?, 'reminder',?, 'Asia/Tokyo')" \
  --params '["<title>","<body>","<due_at_utc>"]'
```

循环提醒再加 `cron_expr` + `cron_tz`，然后：

```bash
openclaw automations create "25 8 * * 5" \
  --name "options-expiry-et" \
  --tz "America/New_York" \
  --session isolated \
  --announce \
  --channel openclaw-weixin \
  --to "<owner-weixin-id>" \
  --message "Read skills/life-proactive/SKILL.md. Memo id=<ID>. 现在是美东周五 8:25，用中文主动提醒。不要回复 HEARTBEAT_OK。"
```

渠道名 **`openclaw-weixin`**。完成/推迟/取消要改 `memos.status`。

```bash
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" due --within-hours 36
```
