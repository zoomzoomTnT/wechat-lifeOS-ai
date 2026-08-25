---
name: life-stocks
description: >
  Trial portfolio tracker in Life OS. Use when the user mentions 股票, 持仓,
  portfolio, options, 期权到期, earnings, 财报, ticker symbols, or asks to
  follow a position.
version: 1.0.0
metadata:
  openclaw:
    emoji: "📈"
    requires:
      bins: ["python3"]
---

# life-stocks — 持仓（试用）

直接 `exec` 写 `holdings`，不要先 `init`。提醒走 `life-memos`。

```bash
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" exec \
  "INSERT INTO holdings (owner_id, symbol, market, name, qty, avg_cost, currency) VALUES (1,?,?,?,?,?,?)" \
  --params '["AAPL","US","Apple",2,0,"USD"]'
```

`market`: `US` | `HK` | `CN`。没有行情就不要编现价。期权循环提醒：`cron_expr='25 8 * * 5'`，`cron_tz='America/New_York'`。
