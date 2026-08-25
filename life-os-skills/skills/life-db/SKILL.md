---
name: life-db
description: >
  Life OS SQLite kernel: init/ensure, backup, and raw SQL against life.db.
  Use for database bootstrap, backup, schema questions, or when a domain skill
  says to run life.py query/exec. Do not use this as the first skill for 冰箱,
  西瓜, fridge, 记账, 小票, 持仓, or 提醒 — those have their own skills and
  already call life.py. Never run init in a loop; prefer fridge-add / ensure.
version: 1.0.0
metadata:
  openclaw:
    emoji: "📒"
    requires:
      bins: ["python3"]
    os: ["darwin", "linux"]
---

# life-db — 生活台账内核

脚本（固定路径，不要写 `{baseDir}` 占位符）：

```
LIFE=~/.openclaw/workspace/skills/life-os-skills/scripts/life.py
```

`life.py` 自己会找到 schema。**加冰箱不要跑 init**，直接 `fridge-add`。

## 路径

| 项 | 值 |
|---|---|
| DB | `~/.openclaw/workspace/data/life.db`（可用 `LIFE_DB` 覆盖） |
| CLI | `python3 $LIFE` |
| 时区 | 主人本地默认 `Asia/Tokyo` |

## 命令

```bash
python3 "$LIFE" path                 # 打印 db 路径，瞬间返回
python3 "$LIFE" ensure               # 已有库则秒退，不要用 init
python3 "$LIFE" fridge-add --name 西瓜
python3 "$LIFE" fridge-list
python3 "$LIFE" query "SELECT ..." --params '[]'
python3 "$LIFE" exec  "INSERT ..." --params '["a",1]'
python3 "$LIFE" due --within-hours 36
python3 "$LIFE" backup ~/backup/life-$(date +%Y%m%d).db
```

规则：

- 一次用户请求最多跑 **一条** `ensure`/`init`。库已存在时用 `ensure`。禁止反复 init。
- stdout 永远是 JSON。超时 8 秒就停，不要空等。
- 金额用整数分。时间存 UTC ISO。
- 不要导出 `$LIFE_DB` 再传 `--db "$LIFE_DB"`（空变量会把路径搞乱）。省略 `--db` 即可。

## 路由

| 用户意图 | 用哪个技能，不要停在本文件 |
|---|---|
| 冰箱、西瓜、过期、冰茶 | `life-fridge` → `fridge-add` |
| 小票、记账 | `life-finance` |
| 提醒、cron、期权到期 | `life-memos` |
| 持仓 | `life-stocks` |
| 心跳 | `life-proactive` |
