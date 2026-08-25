# Life OS（贴进工作区 AGENTS.md）

生活数据（记账、冰箱、备忘、持仓）一律走 `life.db`。技能包在 `skills/life-os-skills/`。

- 用户发微信图片且像小票 → `life-finance`（需要视觉模型；去重用票面 barcode + 时间戳）
- 食品 / 冰箱 / 过期 → `life-fridge`，提醒写入 `memos`
- 「提醒我」/ cron / 期权到期 → `life-memos` + OpenClaw automations
- 心跳与主动开口 → `life-proactive`，渠道 `openclaw-weixin`，时区 `Asia/Tokyo`；没事回 `HEARTBEAT_OK`
- 备份：`python3 ~/.openclaw/workspace/skills/life-os-skills/scripts/life.py backup ~/backup/life.db`

禁止为每个领域新建另一个 sqlite 文件。金额用整数分。本地时间默认东京。
