# 安装

默认工作区：`~/.openclaw/workspace`

技能包整目录放进 workspace skills（OpenClaw 会向下找到各 `SKILL.md`）。

`{baseDir}` = `~/.openclaw/workspace/skills/life-os-skills`

## 1. 拷贝技能包

在本目录（解压后的 `life-os-skills/`）执行：

```bash
mkdir -p ~/.openclaw/workspace/skills
cp -R . ~/.openclaw/workspace/skills/life-os-skills
```

不要再为每个 skill 做 symlink。不要拷进 `openclaw-weixin` 插件目录。

## 2. 初始化数据库

```bash
python3 ~/.openclaw/workspace/skills/life-os-skills/scripts/life.py init
python3 ~/.openclaw/workspace/skills/life-os-skills/scripts/life.py path
```

把主人的微信 peer id 写进 `people.handle`（在微信里问 OpenClaw「我的 id 是什么」或看会话日志）。默认时区是 `Asia/Tokyo`。

## 3. 工作区文件

把 `workspace/AGENTS.snippet.md` 贴进 `~/.openclaw/workspace/AGENTS.md`。

把 `workspace/HEARTBEAT.snippet.md` 合并进 `~/.openclaw/workspace/HEARTBEAT.md`（全文件 < 50 行）。

## 4. Heartbeat 与渠道

`~/.openclaw/openclaw.json` 示例：

```json5
{
  agents: {
    defaults: {
      heartbeat: {
        every: "30m",
        target: "openclaw-weixin",
        activeHours: { start: "08:00", end: "22:00", timezone: "Asia/Tokyo" }
      }
    }
  },
  channels: {
    "openclaw-weixin": { /* 已由插件登录 */ }
  }
}
```

主动投递使用 `--channel openclaw-weixin --to <handle>`。心跳 `target` 也走微信通道。

## 5. 视觉模型

给主 session 配带视觉的模型，否则微信小票只能当附件，不能分录。Heartbeat 可用更便宜的文本模型。

## 6. 自检

微信发：

- 「初始化生活台账」
- 「提醒我每周五美东 8:25 期权到期」
- 拍一张小票
- 「冰箱里有冰茶」

确认 `life.db` 有行，`openclaw automations list` 能看到 cron。
