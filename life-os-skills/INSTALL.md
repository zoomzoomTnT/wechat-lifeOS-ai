# 安装

默认工作区：`~/.openclaw/workspace`

## 1. 拷贝技能包

```bash
# 技能（最高优先级）
cp -R skills/life-* ~/.openclaw/workspace/skills/

# 内核脚本与 schema（CLI 按这个相对位置找文件）
mkdir -p ~/.openclaw/workspace/life-os
cp schema.sql ~/.openclaw/workspace/life-os/
cp -R scripts ~/.openclaw/workspace/life-os/
```

若你希望 `{baseDir}` 就是工作区根：把 `schema.sql` 和 `scripts/` 放在 `~/.openclaw/workspace/`，并把各 `SKILL.md` 里的 `{baseDir}` 理解成该路径。

更省事的做法：整个目录放进去。

```bash
cp -R . ~/.openclaw/workspace/life-os-skills
mkdir -p ~/.openclaw/workspace/skills
ln -s ../life-os-skills/skills/life-db ~/.openclaw/workspace/skills/life-db
ln -s ../life-os-skills/skills/life-memos ~/.openclaw/workspace/skills/life-memos
ln -s ../life-os-skills/skills/life-finance ~/.openclaw/workspace/skills/life-finance
ln -s ../life-os-skills/skills/life-fridge ~/.openclaw/workspace/skills/life-fridge
ln -s ../life-os-skills/skills/life-stocks ~/.openclaw/workspace/skills/life-stocks
ln -s ../life-os-skills/skills/life-proactive ~/.openclaw/workspace/skills/life-proactive
```

各 SKILL 中 `{baseDir}` = `~/.openclaw/workspace/life-os-skills`。

## 2. 初始化数据库

```bash
python3 ~/.openclaw/workspace/life-os-skills/scripts/life.py init
python3 ~/.openclaw/workspace/life-os-skills/scripts/life.py path
```

把主人的微信 peer id 写进 `people.handle`（在微信里问 OpenClaw「我的 id 是什么」或看会话日志）。

## 3. 工作区文件

把 `workspace/AGENTS.snippet.md` 贴进 `AGENTS.md`。

把 `workspace/HEARTBEAT.snippet.md` 合并进 `HEARTBEAT.md`（全文件 < 50 行）。

## 4. Heartbeat 与渠道

`~/.openclaw/openclaw.json` 示例：

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "owner",
        activeHours: { start: "08:00", end: "22:00", timezone: "Asia/Shanghai" }
      }
    }
  },
  channels: {
    "openclaw-weixin": { /* 已由插件登录 */ }
  }
}
```

主动投递使用 `--channel openclaw-weixin --to <handle>`。

## 5. 视觉模型

给主 session 配带视觉的模型，否则微信小票只能当附件，不能分录。Heartbeat 可用更便宜的文本模型。

## 6. 自检

微信发：

- 「初始化生活台账」
- 「提醒我每周五美东 8:25 期权到期」
- 拍一张小票
- 「冰箱里有冰茶」

确认 `life.db` 有行，`openclaw automations list` 能看到 cron。
