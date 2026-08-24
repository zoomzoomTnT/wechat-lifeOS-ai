# Life OS（贴进工作区 AGENTS.md）

生活数据（记账、冰箱、备忘、持仓）一律走 `life.db`，技能在 `skills/life-*`。

- 用户发微信图片且像小票 → `life-finance`（需要视觉模型）
- 食品 / 冰箱 / 过期 → `life-fridge`，提醒写入 `memos`
- 「提醒我」/ cron / 期权到期 → `life-memos` + OpenClaw automations
- 心跳与主动开口 → `life-proactive`；没事回 `HEARTBEAT_OK`
- 备份：`python3 skills-pack/scripts/life.py backup ~/backup/life.db`

禁止为每个领域新建另一个 sqlite 文件。金额用整数分。
