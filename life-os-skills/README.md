# 生活台账 Life OS

给 **OpenClaw + 腾讯 `openclaw-weixin` 通道** 用的技能包：一个 SQLite 文件记下生活数据，并按备忘录 **主动用微信找你**。

微信插件只负责收发（含图片）。技能装在 **workspace**，不要塞进 weixin 插件目录。

## 为什么拆成多个 skill

OpenClaw 平时只把每个 skill 的 `name` + `description` 放进上下文。一个「全能 skill」会在你说「记 38 块午饭」时，把期权 cron、冰箱保质期、持仓说明全部灌进模型。

拆开之后：

| Skill | 何时进上下文 |
|---|---|
| `life-db` | 备份、裸 SQL、问库本身 |
| `life-finance` | 小票 / 记账 / 商家 |
| `life-fridge` | 冰箱 / 过期 / 食品 |
| `life-memos` | 提醒 / cron / 到期 |
| `life-stocks` | 持仓 / 期权（试用） |
| `life-proactive` | heartbeat 与主动开口 |

**一个库、多份说明书。** 食品从记账进入冰箱，再变成两条过期 memo——靠外键，不靠把三个领域写成一个 prompt。

## 主动对话怎么真正发生

Schema 不会自己说话。必须叫醒模型：

1. **精确时刻**（美东周五 8:25 期权）→ OpenClaw automation cron，`--channel openclaw-weixin`
2. **模糊窗口**（食品快过期、待确认小票）→ heartbeat 每 10 分钟跑 `life.py due`（调试用；稳定后可改回 30m）

`memos` 表是唯一出口。别的表只存事实。

## 视觉模型

微信可以传图；插件会把图片交给 OpenClaw。小票 OCR 是 **agent 看图**，不依赖外接 OCR。把 agent 配成带视觉的模型，否则 finance 技能会拒绝瞎编金额。

## 备份

```bash
python3 scripts/life.py backup ~/backup/life-$(date +%Y%m%d).db
```

拷这一个 `.db` 即可带到 OpenClaw 外面。

安装步骤见 [INSTALL.md](INSTALL.md)。
