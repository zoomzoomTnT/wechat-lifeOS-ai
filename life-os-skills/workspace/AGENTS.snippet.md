# Life OS（贴进工作区 AGENTS.md）

```
python3 -u "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py"
```

- 冰箱 → `fridge-add --name "<物品>"`（不要先 init）
- 小票 → `life-finance`
- 提醒 / 期权 → `life-memos`

金额用整数分。

## 先开口 + exec 不要进后台

微信没有「正在思考」。先在**助手文本**写一句中文，再 exec。不要先调 `message` 工具（会结束本轮，exec 被丢掉）。

`exec` 必须带：

```
host=gateway  ask=off  background=false  yieldMs=60000  timeoutSeconds=15
```

OpenClaw 默认 `yieldMs=10000`：命令超过 10 秒就被丢进后台，微信会话**永远等不到 toolResult**。`yieldMs=60000` 让 15 秒超时先触发，一定会回来。

用户下一条若发现上一轮卡在 toolUse：补跑那次写入，不要当没发生。

心跳空转只回 `HEARTBEAT_OK`。
