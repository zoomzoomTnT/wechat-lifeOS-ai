# Life OS（贴进工作区 AGENTS.md）

生活数据走 `life.db`。CLI：

`python3 ~/.openclaw/workspace/skills/life-os-skills/scripts/life.py`

- 冰箱加东西（西瓜等）→ **直接** `fridge-add --name 西瓜`。不要先 `init`。
- 小票 → `life-finance`（barcode + 票面时间戳去重）
- 提醒 / 期权 → `life-memos`；过期食品靠心跳 `due`，不必为每颗西瓜建 cron
- 心跳渠道 `openclaw-weixin`，时区 `Asia/Tokyo`
- 备份：`python3 .../life.py backup ~/backup/life.db`

禁止反复跑 `init`。金额用整数分。
