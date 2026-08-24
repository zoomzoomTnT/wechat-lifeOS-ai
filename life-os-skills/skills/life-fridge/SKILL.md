---
name: life-fridge
description: >
  Track fridge / freezer / pantry food in Life OS. Use when the user mentions
  冰箱, 冷冻, 过期, 蔬菜, 水果, 肉, 牛奶, 剩菜, 冰水, 冰茶, 吃完了, 扔掉,
  or when life-finance confirms grocery line items that are food. Creates expiry
  memos and records preference / repurchase.
version: 1.0.0
metadata:
  openclaw:
    emoji: "🧊"
    requires:
      bins: ["python3"]
---

# life-fridge — 冰箱

先读 `skills/life-db/SKILL.md`。过期提醒写 memos，遵守 `skills/life-memos/SKILL.md`。

## 来源

1. **记账转入**（常见）：`receipt_items.is_food=1` 且用户同意入冰箱
2. **手动**：冰水、冰茶、剩菜、别人放进来的
3. **其它用户**：`added_by_id` = 操作者，`owner_id` = 这格食品的主人（默认主人；用户说「给爸妈的」再改）

## 保质期常识

查 `food_knowledge`（`name_norm` / `aliases_json`）。查不到就用保守默认：

| 类 | 默认 |
|---|---|
| 叶菜 / 草莓 / 生鱼虾 | 2 天 / 2 天 / 1 天 |
| 肉禽 | 冷藏 2 天，否则建议冷冻 |
| 奶 | 看包装；没有就 5 天 |
| 矿泉水 / 未开封饮料 | **不要**造过期提醒 |
| 剩菜 / 剩饭 | 1–2 天 |

`expires_at` = `purchased_at`（没有就 now）+ days，存 UTC。包装上有日期则用包装，不要用常识覆盖明确日期。

## 写入后立刻挂两条 memo

对 **会坏** 的 in_stock 食品（有 `expires_at`）：

1. kind=`expiry`，`due_at` = 过期前 2 天 18:00 用户时区（若保质期 <2 天则跳过这条）
2. kind=`expiry`，`due_at` = 过期日 18:00 用户时区，body 要问「吃完了还是扔了？」

`source_domain='fridge'`，`source_table='fridge_items'`，`source_id=<id>`。然后按 memos 技能挂 automation。

矿泉水等不坏的东西：不建 expiry memo。

## 到期当天的对话

主动、短、要一个状态：

> 鸡胸今天该处理了。吃完了、扔了，还是我再记一天？

用户回答后：

- 吃完 → `status='eaten'`，问喜爱程度 1–5（可跳过），更新 `food_prefs.repurchase`
- 扔了 → `status='discarded'`，若叶菜连续丢弃 2 次，建议 `repurchase='no'` 或 `'maybe'`
- 还在 → 把 `expires_at` +1 day，memo snooze

对应 memo → `done`。

## 喜爱与再买

`fridge_items.preference` 是这一次；`food_prefs` 是这个人对这个 `name_norm` 的长期印象。推荐下次是否购买时：

- `repurchase='no'` → 明确不建议
- 最近 3 次 discarded 且 preference ≤2 → 建议少买
- preference ≥4 且常吃完 → 可以再买；结合 `merchants.favorite_score` 推荐去哪家

## 手动添加例

「冰箱放了冰茶」→ category=`drink`，location=`fridge`，expires_at=+3d，owner=当前用户。
