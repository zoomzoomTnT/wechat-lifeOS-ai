---
name: life-fridge
description: >
  Track fridge / freezer / pantry food in Life OS. Use when the user mentions
  冰箱, 冷冻, 过期, 蔬菜, 水果, 肉, 牛奶, 剩菜, 冰水, 冰茶, 吃完了, 扔掉,
  or adding food to the fridge. Insert with fridge-add; do not run init.
version: 1.0.0
metadata:
  openclaw:
    emoji: "🧊"
    requires:
      bins: ["python3"]
---

# life-fridge — 冰箱

```
CLI=python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py"
```

一条命令写入，**不要**先跑 `init` / `ensure`，**不要**先读 life-db。库不存在时 `fridge-add` 自己建。

## 放入

把用户说的物品名填进 `--name`：

```bash
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" fridge-add --name "<物品>"
```

切开的果蔬加 `--cut`（冷藏按 3 天）。包装日期或用户说了天数时用 `--days N`。

stdout 是 JSON。用 `expires_at` 回用户。过期 memo 已写入，心跳会扫 `due`，不必再为每样食品建 cron。

```bash
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" fridge-list
```

## 保质期

先查 `food_knowledge`（`name_norm` / `aliases_json`）。没有就用保守默认：

| 类 | 默认 |
|---|---|
| 叶菜 / 草莓 / 生鱼虾 | 2 天 / 2 天 / 1 天 |
| 肉禽 | 冷藏 2 天，否则建议冷冻 |
| 奶 | 看包装；没有就 5 天 |
| 矿泉水 / 未开封饮料 | **不要**造过期提醒 |
| 剩菜 / 剩饭 | 1–2 天 |

`expires_at` = `purchased_at`（没有就 now）+ days，存 UTC。包装日期优先。

## 到期当天

> \<名称\>今天该处理了。吃完了、扔了，还是我再记一天？

- 吃完 → `status='eaten'`，可问喜爱 1–5
- 扔了 → `status='discarded'`
- 还在 → `expires_at` +1 day

```bash
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" exec \
  "UPDATE fridge_items SET status=?, updated_at=datetime('now') WHERE id=?" \
  --params '["eaten", <id>]'
```

`--owner-id` / `--added-by-id` 默认 1。
