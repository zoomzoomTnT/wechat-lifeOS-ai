---
name: life-db
description: >
  Life OS SQLite kernel: backup and raw SQL against life.db. Use for backup,
  schema questions, or life.py query/exec. Do not use as the first skill for
  冰箱, 记账, 小票, 持仓, or 提醒. Do not run init before inserts.
version: 1.0.0
metadata:
  openclaw:
    emoji: "📒"
    requires:
      bins: ["python3"]
    os: ["darwin", "linux"]
---

# life-db — 生活台账内核

```
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py"
```

写数据直接 `fridge-add` / `exec`。**不要**先 `init`。表不存在时 CLI 会自己建一次。

| 项 | 值 |
|---|---|
| DB | `$HOME/.openclaw/workspace/data/life.db`（`LIFE_DB` 可覆盖） |
| 时区 | 默认 `Asia/Tokyo` |

```bash
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" path
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" query "SELECT ..." --params '[]'
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" exec  "INSERT ..." --params '["a",1]'
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" due --within-hours 36
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" backup "$HOME/backup/life.db"
```

- 一条用户请求里不要单独跑 `init`。
- stdout 永远是 JSON。省略 `--db`。不要传 `--db "$LIFE_DB"`。
- 金额整数分。时间 UTC ISO。

| 用户意图 | 技能 |
|---|---|
| 冰箱、过期、食品 | `life-fridge` |
| 小票、记账 | `life-finance` |
| 提醒、cron、期权到期 | `life-memos` |
| 持仓 | `life-stocks` |
| 心跳 | `life-proactive` |
