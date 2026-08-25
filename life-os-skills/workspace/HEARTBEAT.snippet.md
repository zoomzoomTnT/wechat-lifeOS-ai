# Heartbeat — Life OS（整文件保持 < 50 行）

时区 Asia/Tokyo。渠道 openclaw-weixin。调试期间心跳 **每 10 分钟**（`openclaw.json` 里 `every: "10m"`）。每次：

1. `python3 "$HOME/.openclaw/workspace/skills/life-os-skills/scripts/life.py" due --within-hours 36`
2. 读 `life-proactive` 技能的规则
3. 无到期 memo、无 48h 内过期食品、无超 24h 待确认小票 → 只回 `HEARTBEAT_OK`
4. 有事 → 最多两条短微信（事实 + 问句），更新 `memos.last_fired_at`

不要在心跳里做小票 OCR、不要拉行情、不要闲聊。
