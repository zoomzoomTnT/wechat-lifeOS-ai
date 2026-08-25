# Life OS（贴进工作区 AGENTS.md）

```
python3 -u "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py"
```

- 冰箱 → `fridge-add --name "<物品>"`（不要先 init）
- 小票 → `life-finance`
- 提醒 / 期权 → `life-memos`；食品过期靠心跳 `due`
- 心跳渠道 `openclaw-weixin`，时区 `Asia/Tokyo`

金额用整数分。

## 先开口 + 短超时

微信没有「正在思考」。每次 tool 之前先让用户看到一句中文。

跑 `life.py` 时：

- `python3 -u ...`
- exec **前台**，`timeoutSeconds: 15`，不要 background / yieldMs
- 15 秒没有 toolResult：立刻用中文说「刚才没写上，我再试」，**重跑一次**。仍失败就停，并告诉用户。
- 用户下一条消息若发现上一轮卡在 toolUse：不要当没发生，补跑那次写入。

心跳空转仍只回 `HEARTBEAT_OK`。
