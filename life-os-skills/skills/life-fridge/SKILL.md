---
name: life-fridge
description: >
  Add and track fridge food in Life OS. Use immediately when the user says
  冰箱, 冷冻, 西瓜, watermelon, 过期, 蔬菜, 水果, 肉, 牛奶, 剩菜, 冰水,
  冰茶, 吃完了, 扔掉, or "add X to the fridge". Run fridge-add; do not run
  life.py init first.
version: 1.0.0
metadata:
  openclaw:
    emoji: "🧊"
    requires:
      bins: ["python3"]
---

# life-fridge — 冰箱

脚本：

```
LIFE=~/.openclaw/workspace/skills/life-os-skills/scripts/life.py
```

## 加一样东西（一条命令）

用户说「冰箱加个西瓜 / add a watermelon」时，**只跑这个**，不要先 `init`，不要先读 life-db：

```bash
python3 "$LIFE" fridge-add --name 西瓜
```

切开的西瓜加 `--cut`（强制冷藏 3 天）：

```bash
python3 "$LIFE" fridge-add --name 西瓜 --cut
```

命令会：ensure schema（已存在则跳过）、查 `food_knowledge`、插入 `fridge_items`、写过期 memo。stdout JSON。用里面的 `expires_at` / `memos` 用中文回用户。

**不要**再为过期建 OpenClaw cron：心跳会跑 `life.py due`。

列出现有：

```bash
python3 "$LIFE" fridge-list
```

## 保质期

`fridge-add` 已查表。西瓜整颗冷藏约 3 天；切开 3 天。包装日期优先，用 `--days N` 覆盖。

矿泉水等不坏的东西：知识库没有 `fridge_days` 时不建 expiry memo。

## 到期怎么问

心跳触发后短问：

> 西瓜今天该处理了。吃完了还是扔了？

- 吃完 → `status='eaten'`，可记 preference 1–5
- 扔了 → `status='discarded'`
- 还在 → `expires_at` +1 day

```bash
python3 "$LIFE" exec \
  "UPDATE fridge_items SET status=?, updated_at=datetime('now') WHERE id=?" \
  --params '["eaten", 3]'
```

## 其它用户

`--owner-id` / `--added-by-id` 默认 1。别人放的再改。
