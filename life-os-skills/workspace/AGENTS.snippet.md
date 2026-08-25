# Life OS（贴进工作区 AGENTS.md）

```
python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py"
```

- 冰箱 → `fridge-add --name "<物品>"`（不要先 init）
- 小票 → `life-finance`
- 提醒 / 期权 → `life-memos`；食品过期靠心跳 `due`
- 心跳渠道 `openclaw-weixin`，时区 `Asia/Tokyo`
- 备份：`life.py backup ~/backup/life.db`

金额用整数分。

## 先开口

微信没有「正在思考」。**每一次** tool call（`exec` / `life.py` / 读文件）之前，必须先让用户看到一句中文。

1. 有 `message` 工具：先发到**当前微信会话**（不要填别人的 `to`），再跑命令。
2. 没有：同一轮助手文本里先写那句话，再 tool。禁止一轮里只有 tool、一个字都没有。
3. 工具返回后马上用中文说结果，再决定要不要下一个 tool。不要连续静默 tool。

心跳空转仍只回 `HEARTBEAT_OK`，不要为心跳寒暄。
