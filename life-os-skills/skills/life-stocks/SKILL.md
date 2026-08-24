---
name: life-stocks
description: >
  Trial portfolio tracker in Life OS. Use when the user mentions 股票, 持仓,
  portfolio, options, 期权到期, earnings, 财报, ticker symbols, or asks to
  follow a position. Writes holdings / stock_events and creates memos so the
  agent can ping first (e.g. Friday 8:25 America/New_York options expiry).
version: 1.0.0
metadata:
  openclaw:
    emoji: "📈"
    requires:
      bins: ["python3"]
---

# life-stocks — 持仓（试用）

先读 `skills/life-db/SKILL.md`。主动提醒走 `skills/life-memos/SKILL.md`。

这是试用 schema：记持仓、事件、跟进，不接券商下单。没有行情权限时不要编造现价；可以说「我没有实时行情，只按你登记的持仓提醒」。

## 持仓

```sql
INSERT INTO holdings (owner_id, symbol, market, name, qty, avg_cost, currency, notes)
VALUES (?,?,?,?,?,?,?,?)
ON CONFLICT(owner_id, symbol, market) DO UPDATE SET
  qty=excluded.qty, avg_cost=excluded.avg_cost, notes=excluded.notes,
  updated_at=datetime('now')
```

`market`: `US` | `HK` | `CN`。美股期权默认 `timezone=America/New_York`。

## 事件 → memo

用户说「每周五美东 8:25 提醒我期权到期」：

1. 对相关 holding 插 `stock_events`（kind=`options_expiry`）
2. 插 **循环** memo：`kind='options'`，`cron_expr='25 8 * * 5'`，`cron_tz='America/New_York'`
3. 按 memos 技能创建 OpenClaw cron，delivery 到 `openclaw-weixin`

财报、分红同理，一次性 `due_at` 即可。

## 主动跟进时问什么

短，带持仓事实，问一个决策：

> 美东周五 8:25。AAPL 还挂着 2 张到期期权（按你上次登记）。要持有到到期、提前平，还是我只做记录？

不要给投资建议装权威。可以整理用户自己说过的计划。

## 以后

行情、希腊值、自动下单都不在本技能。需要时另做 skill，仍然只往 `holdings` / `stock_events` / `memos` 写。
