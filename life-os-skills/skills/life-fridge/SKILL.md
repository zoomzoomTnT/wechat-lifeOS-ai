---
name: life-fridge
description: >
  Track fridge / freezer / pantry food in Life OS. Use when the user mentions
  冰箱, 冷冻, 过期, 蔬菜, 水果, 肉, 牛奶, 剩菜, 冰水, 冰茶, 吃完了, 扔掉,
  or adding food to the fridge. Before every exec, send a short Chinese ack
  with the message tool (or assistant text). Then fridge-add; do not run init.
version: 1.0.0
metadata:
  openclaw:
    emoji: "🧊"
    requires:
      bins: ["python3"]
---

# life-fridge — 冰箱

## 先开口

每次 `life.py` / `exec` **之前**先让用户看到字：有 `message` 工具就先发到当前微信；否则同一轮先写一句中文再 tool。禁止静默 tool。

例：「好，记进冰箱。」→ 再跑命令 → 「记下了，大约 ×月×日过期。」

```
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py"
```

不要先 `init`。库不存在时 `fridge-add` 自己建。

## 放入

```bash
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" fridge-add --name "<物品>"
```

切开加 `--cut`。用户给了天数用 `--days N`。用 JSON 的 `expires_at` 回用户。不必为过期建 cron。

```bash
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" fridge-list
```

## 保质期

查 `food_knowledge`。没有则：叶菜/草莓 2 天，生鱼虾 1 天，肉禽冷藏 2 天，奶 5 天，矿泉水不建过期提醒，剩菜 1–2 天。包装日期优先。

## 到期当天

> \<名称\>今天该处理了。吃完了、扔了，还是我再记一天？

```bash
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" exec \
  "UPDATE fridge_items SET status=?, updated_at=datetime('now') WHERE id=?" \
  --params '["eaten", <id>]'
```
