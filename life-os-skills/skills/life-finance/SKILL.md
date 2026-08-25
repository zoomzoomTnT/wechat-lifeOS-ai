---
name: life-finance
description: >
  Log expenses and WeChat receipt photos into Life OS. Use when the user sends
  a 小票 / 收据 / receipt image, says 记账, 花了, 买单, 超市, 饭店, 盒马,
  美团, 对一下总价, or mentions merchants near home/office. Handles OCR,
  line-item split, total reconciliation, payer attribution, and ticket de-dupe.
version: 1.0.0
metadata:
  openclaw:
    emoji: "🧾"
    requires:
      bins: ["python3"]
---

# life-finance — 记账与小票

先读 `skills/life-db/SKILL.md`。涉及食品行项目时，记完再读 `skills/life-fridge/SKILL.md`。

## 微信图片

当前模型必须能看图。若看不到图片内容，明确说「我这边读不到这张小票，请换一个带视觉的模型或再发一张更清晰的」，不要瞎编金额。

收到图片后先判断：小票 / 食品外观 / 其它。只有小票走本技能。

## 小票工作流（必须按序）

1. **识别** 商家、时间、币种、行项目（名称、数量、单价、金额）、税费、折扣、**底部总价**。
2. **算** `computed_total_cents = sum(amount_cents)`，与底部总价比，容差 ±2 分。
3. **对商家**：`name_norm` 查 `merchants`；没有则插入。家/公司附近的熟店标 `location_tag`。
4. **去重**：识别小票中 barcode 和时间戳。命中已有小票 → 告诉用户「这张已经记过」，给另一用户加 `receipt_claims`，**不要**再插一张。
5. **归属**：默认付款人 = 当前微信用户对应的 `people` 行。若说「给公司报 / 是某某买的」，改 `payer_id`。
6. **先以 `pending_confirm` 入库**，把清单用微信格式回给用户核对：
   - 商家、时间、行数、计算合计 vs 小票合计、是否一致
   - 每行：名称 × 数量 = 金额，食品行打标
7. 用户说对 / 没问题 → `status='confirmed'`。不一致时先问哪一行错了，禁止在合计对不上时 confirmed。
8. 已确认且存在 `is_food=1` 的行 → 按 fridge 技能提议入冰箱（蔬菜水果肉等），**不要静默写入**。

OCR JSON 存 `receipts.raw_ocr_json`。图片能落到 workspace 时存 `image_path`。

## 金额

全部 **分**。展示「¥128.50」。

## 回给用户的核对稿（例）

```
盒马鲜生 · 今天 19:12 · 付款人：你
生菜 1     ¥4.90
西红柿 2   ¥9.80
鸡胸 1     ¥29.90
合计行项目 ¥44.60  小票底部 ¥44.60  ✓ 一致
这张小票我先记成待确认。回「对」我就入账。
生菜/西红柿/鸡胸 要不要一并进冰箱？我按常识写保质期。
```

## 熟店

家和公司附近长期去的超市/饭店：识别后写入 `merchants`，`location_tag` = `home_nearby` | `office_nearby`。之后推荐去哪买时看 `favorite_score`、最近折扣（notes）、以及 `food_prefs.repurchase`。

用户说「这家不错 / 别去了」→ 调整 `favorite_score`（+0.5 / −0.5，夹在 −2..2）。

## 其它用户共用表

- 同一张票：fingerprint / sha 去重 + `receipt_claims`
- 开销归属：只看 `payer_id`，不要把「谁拍的」当成「谁付的」
- 家庭汇总可以按票去重后再按 payer 分组

## 没有照片的一句话记账

「午饭 38」→ 一行 receipt + 一行 item，商家未知也行，照样走 pending_confirm（金额很小且用户很明确时可直接 confirmed）。

详细列见 `{baseDir}/schema.sql`。分类枚举见 `skills/life-db/references/conventions.md`。
