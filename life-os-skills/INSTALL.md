# 安装

默认工作区：`~/.openclaw/workspace`

```bash
mkdir -p ~/.openclaw/workspace/skills
cp -R . ~/.openclaw/workspace/skills/life-os-skills
```

不要拷进 `openclaw-weixin` 插件目录。不必先 `init`：第一次 `fridge-add` / `exec` 会建库。

把 `workspace/AGENTS.snippet.md` 贴进 `AGENTS.md`（含「先开口」：每次 tool 前先给微信一句话），把 `workspace/HEARTBEAT.snippet.md` 合并进 `HEARTBEAT.md`（< 50 行）。

心跳 `target: "openclaw-weixin"`，时区 `Asia/Tokyo`。小票需要带视觉的模型。

自检：微信说「冰箱加个冰茶」，agent 应只跑 `fridge-add --name "冰茶"`，JSON 里 `ok: true`。
