---
name: life-fridge
description: >
  Track fridge food in Life OS. Use for 冰箱, 冷冻, 过期, 蔬菜, 水果, 肉,
  牛奶, 剩菜, 冰水, 冰茶, 吃完了, 扔掉. Ack as assistant text (not the
  message tool), then one gateway exec of fridge-add. yieldMs MUST be 60000
  so OpenClaw does not background at 10s. ask=off. Do not run init.
version: 1.0.0
metadata:
  openclaw:
    emoji: "🧊"
    requires:
      bins: ["python3"]
---

# life-fridge — 冰箱

脚本在终端里是秒回的。微信里「发出去没结果」是 **OpenClaw exec 默认 10 秒把命令丢进后台**，WeChat 收不到 `Exec finished`，于是 `stopReason: toolUse`、没有 toolResult。

## exec 参数（必须原样带上）

不要用 `message` 工具先发微信（会把这一轮结束掉，后面的 exec 被丢掉）。**助手文本里先写一句**，同一轮再 exec：

```json
{
  "command": "python3 -u \"$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py\" fridge-add --name \"<物品>\"",
  "host": "gateway",
  "ask": "off",
  "background": false,
  "yieldMs": 60000,
  "timeoutSeconds": 15
}
```

- `yieldMs` 默认是 **10000**。设成 60000，让 15s `timeoutSeconds` 先到，**一定要有 toolResult**（成功或超时 JSON），禁止被丢进后台。
- `host: gateway`：和你手动跑是同一台机器、同一个 `life.db`。不要 `sandbox`。
- `ask: off`：不要等电脑上的批准弹窗（微信里看不到）。

## 结果

- `ok: true` → 「记下了，大约 ×月×日过期。」
- 有 toolResult 但是失败 → 把 `error` 说给用户，停。
- **没有 toolResult**：说「刚才没写上」，用同样参数再 exec **一次**。仍没有就停。

不要 `init`。切开加 `--cut`。
