---
name: life-fridge
description: >
  Track fridge food in Life OS. Use for 冰箱, 冷冻, 过期, 蔬菜, 水果, 肉,
  牛奶, 剩菜, 冰水, 冰茶, 吃完了, 扔掉. Do NOT exec python. Write a JSON
  job to data/life-inbox/ then read the .result.json. life.py serve must be running.
version: 1.0.0
metadata:
  openclaw:
    emoji: "🧊"
    requires: {}
---

# life-fridge — 冰箱

**不要 `exec python3 life.py`。** OpenClaw 的 python exec 在微信里经常发了没结果。

## 写入（用 write 工具，不是 exec）

1. 助手文本先说一句：「好，记进冰箱。」
2. **write** 这个文件（workspace 相对路径）：

`data/life-inbox/<随便唯一名>.json`

```json
{"op": "fridge-add", "name": "<物品>"}
```

切开加 `"cut": true`。有天数加 `"days": 3`。

3. **read** `data/life-inbox/<同名>.result.json`。没有就隔一下再 read，最多 5 次。
4. `ok: true` → 「记下了，大约 ×月×日过期。」把 JSON 里的 `expires_at` 换成本地日期。
5. 没有 result → 「本大王这边的入库服务没在跑。你在电脑上开一下 `life.py serve`。」然后停。不要改去 exec python。

列出：write `{"op":"fridge-list"}`，同样读 `.result.json`。
