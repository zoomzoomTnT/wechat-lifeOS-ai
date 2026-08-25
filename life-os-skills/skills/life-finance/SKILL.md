---
name: life-finance
description: >
  Log expenses and WeChat receipt photos into Life OS. Use when the user sends
  a 小票 / 收据 / receipt image, says 记账, 花了, 买单, 超市, 饭店, 盒马,
  美团, 对一下总价, or mentions merchants near home/office.
version: 1.0.0
metadata:
  openclaw:
    emoji: "🧾"
    requires:
      bins: ["python3"]
---

# life-finance — 记账与小票

直接 `exec` / `lookup-receipt` 写入，不要先 `init`。食品行确认后再交给 `life-fridge`。

```
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py"
```

当前模型必须能看图。看不到就说读不到，不要编金额。

## 顺序

1. 识别商家、票面时间戳、barcode/流水号、行项目、底部总价。
2. 行项目合计 vs 底部，容差 ±2 分。
3. 查/插 `merchants`。
4. `lookup-receipt --barcode --printed-at` 去重；命中则不要再插票。
5. 默认付款人 = 当前微信用户。`pending_confirm` 入库，请用户回「对」。
6. 确认后食品行问要不要进冰箱，同意再 `fridge-add --name "<物品>"`。

金额用整数分。OCR JSON 进 `receipts.raw_ocr_json`。
