---
name: life-finance
description: >
  Log expenses and WeChat receipt photos into Life OS. Use for 小票, 收据,
  receipt image, 记账, 花了, 买单, 超市, 饭店, 盒马, 美团. Before every
  exec, send a short Chinese ack (message tool or assistant text). Do not init.
version: 1.0.0
metadata:
  openclaw:
    emoji: "🧾"
    requires:
      bins: ["python3"]
---

# life-finance — 记账与小票

## 先开口

看图或写库之前先说一句。exec 用 `python3 -u`、前台、`timeoutSeconds: 15`。无 toolResult 则重试一次并回微信。

不要先 `init`。食品行确认后再 `fridge-add --name "<物品>"`。

```
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py"
```

看不到图就说读不到，不要编金额。

1. 认商家、票面时间、barcode、行项目、底部总价。
2. 行项目合计 vs 底部，±2 分。
3. `lookup-receipt --barcode --printed-at` 去重。
4. `pending_confirm` 入库，请用户回「对」。
5. 确认后问食品要不要进冰箱。

金额整数分。
