# Life OS（贴进工作区 AGENTS.md）

**不要 exec python3 / life.py。** 微信里这条经常发了没 toolResult。

入库服务由主人在电脑终端常开：

`python3 ~/.openclaw/workspace/skills/life-os-skills/scripts/life.py serve`

Agent 只做：

1. 助手文本先开口
2. **write** `data/life-inbox/<id>.json`，例如 `{"op":"fridge-add","name":"<物品>"}`
3. **read** `data/life-inbox/<id>.result.json`（可连读几次）
4. 用 JSON 回用户

其它 op：`fridge-list`、`memo-add`、`due`、`sql-exec`。

心跳空转只回 `HEARTBEAT_OK`。
