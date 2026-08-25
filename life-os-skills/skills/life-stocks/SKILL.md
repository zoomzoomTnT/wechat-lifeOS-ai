---
name: life-stocks
description: >
  Trial portfolio tracker in Life OS. Use for 股票, 持仓, portfolio, options,
  期权到期, earnings, 财报, ticker. Before every exec, send a short Chinese
  ack (message tool or assistant text). Do not init first.
version: 1.0.0
metadata:
  openclaw:
    emoji: "📈"
    requires:
      bins: ["python3"]
---

# life-stocks — 持仓（试用）

## 先开口

写库前先给当前微信一句中文，再 `exec`。不要静默，不要先 `init`。

```bash
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" exec \
  "INSERT INTO holdings (owner_id, symbol, market, name, qty, avg_cost, currency) VALUES (1,?,?,?,?,?,?)" \
  --params '["AAPL","US","Apple",2,0,"USD"]'
```

`market`: `US` | `HK` | `CN`。没有行情就不要编现价。提醒走 `life-memos`。
