---
name: life-db
description: >
  Life OS SQLite kernel: backup and raw SQL against life.db. Use for backup,
  schema questions, or life.py query/exec. Do not use as the first skill for
  冰箱, 记账, 小票, 持仓, or 提醒. Before every exec, send a short Chinese
  ack (message tool or assistant text). Do not run init before inserts.
version: 1.0.0
metadata:
  openclaw:
    emoji: "📒"
    requires:
      bins: ["python3"]
    os: ["darwin", "linux"]
---

# life-db — 生活台账内核

## 先开口

不要 exec python。write `data/life-inbox/<id>.json`（`op` = fridge-add / query / sql-exec / due），再 read `*.result.json`。电脑上必须常开 `life.py serve`。

```
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py"
```

写数据直接 `fridge-add` / `exec`。**不要**先 `init`。

```bash
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" path
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" query "SELECT ..." --params '[]'
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" exec  "INSERT ..." --params '["a",1]'
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" due --within-hours 36
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" backup "$HOME/backup/life.db"
```

stdout 是 JSON。省略 `--db`。金额整数分。时间 UTC ISO。
