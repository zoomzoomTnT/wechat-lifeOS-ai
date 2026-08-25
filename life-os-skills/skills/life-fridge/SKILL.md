---
name: life-fridge
description: >
  Track fridge food in Life OS. Use for 冰箱, 冷冻, 过期, 蔬菜, 水果, 肉,
  牛奶, 剩菜, 冰水, 冰茶, 吃完了, 扔掉. Ack in WeChat first, then one
  foreground exec (timeoutSeconds 15) of fridge-add. If no toolResult, retry
  once and still reply. Do not run init.
version: 1.0.0
metadata:
  openclaw:
    emoji: "🧊"
    requires:
      bins: ["python3"]
---

# life-fridge — 冰箱

## 先开口，再前台 exec

1. 先给当前微信一句中文（`message` 或助手文本）：「好，记进冰箱。」
2. **立刻**一条前台 `exec`，禁止 background / yieldMs：
   - `timeoutSeconds`: **15**
   - command:

```bash
python3 -u "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" fridge-add --name "<物品>"
```

3. 有 JSON 且 `ok: true` → 「记下了，大约 ×月×日过期。」
4. **15 秒内没有 toolResult**（上一轮 `stopReason: toolUse` 被掐掉也算）：马上再说「刚才没写上，我再记一次」，用同样命令再 exec **一次**。第二次仍无结果 → 「这次没写进库，你再说一声我再试。」然后 **停**，不要第三轮静默等。
5. 不要 `init`，不要连续两条 life.py。

切开加 `--cut`。用户给了天数用 `--days N`。
