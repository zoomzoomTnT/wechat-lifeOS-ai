---
name: life-db
description: >
  Life OS SQLite kernel (life.db) shared by memos, finance, fridge, and stocks.
  Use whenever the user records life data, asks to 记账 / 备忘 / 冰箱 / 持仓,
  initialize or backup the database, run SQL against life.db, or any life-*
  skill needs the schema. Always use this skill before writing to the DB.
version: 1.0.0
metadata:
  openclaw:
    emoji: "📒"
    requires:
      bins: ["python3"]
    os: ["darwin", "linux"]
---

# life-db — 生活台账内核

所有生活数据写进 **一个** SQLite 文件，方便整文件拷出备份。

## 路径

| 项 | 值 |
|---|---|
| DB | `$OPENCLAW_WORKSPACE_DIR/data/life.db` 或 `~/.openclaw/workspace/data/life.db` |
| 覆盖 | 环境变量 `LIFE_DB` |
| Schema | 本技能包 `schema.sql` |
| CLI | `python3 {baseDir}/scripts/life.py` |

`{baseDir}` = 本技能包根目录（`life-os-skills/`，与 `skills/` 同级）。

## 每次会话先做

```bash
python3 {baseDir}/scripts/life.py --db "$LIFE_DB" path
python3 {baseDir}/scripts/life.py init          # 幂等
```

若 `people.handle` 仍是 `'owner'`，用当前微信 peer id upsert 主人：

```bash
python3 {baseDir}/scripts/life.py exec \
  "UPDATE people SET handle=?, display_name=?, updated_at=datetime('now') WHERE id=1" \
  --params '["<weixin-peer-id>","主人"]'
```

多用户：`INSERT` 新 `people` 行，`role` 为 `member` / `guest`。凭微信 id 认人，不要凭昵称。

## CLI 合同

stdout **永远是 JSON**。不要自己拼 `sqlite3` 除非用户明确要求。

```bash
python3 {baseDir}/scripts/life.py query "SELECT ..." --params '[]'
python3 {baseDir}/scripts/life.py exec  "INSERT ..." --params '["a",1]'
python3 {baseDir}/scripts/life.py due --within-hours 36
python3 {baseDir}/scripts/life.py backup ~/backup/life-$(date +%Y%m%d).db
python3 {baseDir}/scripts/life.py fingerprint --name-norm "盒马鲜生" --date "2026-08-24" --total-cents 12850 --sha "<sha256>"
```

规则：

- `query` 只允许 **一条** SELECT。写操作用 `exec`。
- 金额用 **整数分**（元 × 100）。禁止 float 存钱。
- 时间存 **UTC ISO**（`2026-08-24T12:25:00Z`）。展示时按 `people.timezone` 或 memo 自己的 `timezone`。
- 改数据后写一行 `events`（domain/action/actor/entity）。

## 备份

用户说「备份数据库 / 把 db 拷出去」：

1. `life.py backup <目标路径>`（会 checkpoint WAL，拷的是一致快照）
2. 告诉用户：拷贝这一个 `.db` 即可；不要只拷正在写入的原文件而不 backup
3. 不要把 `life.db` 提交到 git 或发到群里

## 读详细 schema

需要列定义、枚举、跨表关系时，读 `{baseDir}/schema.sql` 和 `{baseDir}/skills/life-db/references/conventions.md`。

## 路由到领域技能

| 用户意图 | 接着读 |
|---|---|
| 提醒、cron、到期、期权周五 | `skills/life-memos/SKILL.md` |
| 小票、花了、记账、商家 | `skills/life-finance/SKILL.md` |
| 冰箱、过期、蔬菜水果肉 | `skills/life-fridge/SKILL.md` |
| 持仓、期权、股票 | `skills/life-stocks/SKILL.md` |
| heartbeat / 主动找我 | `skills/life-proactive/SKILL.md` |

跨领域写入顺序：**先 finance/fridge/stocks 行，再写 memos**（memos 挂 `source_*`）。
