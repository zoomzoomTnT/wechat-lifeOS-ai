# 安装

默认工作区：`~/.openclaw/workspace`

```bash
mkdir -p ~/.openclaw/workspace/skills
cp -R . ~/.openclaw/workspace/skills/life-os-skills
```

不要拷进 `openclaw-weixin` 插件目录。不必先 `init`：第一次 `fridge-add` / `exec` 会建库。

把 `workspace/AGENTS.snippet.md` 贴进 `AGENTS.md`（含「先开口」：每次 tool 前先给微信一句话），把 `workspace/HEARTBEAT.snippet.md` 合并进 `HEARTBEAT.md`（< 50 行）。

心跳 `every: "10m"`（调试），`target: "openclaw-weixin"`，时区 `Asia/Tokyo`。把 `workspace/openclaw.heartbeat.example.json5` 合进 `~/.openclaw/openclaw.json` 后重启 gateway。小票需要带视觉的模型。

微信里 exec 必须跑在 **gateway**。不要设 `tools.exec.ask`，也不要 `config set tools.exec.timeoutSeconds`（你这版 schema 里这两项会判非法）。15 秒超时由每次 exec 调用自己带。

用 CLI：

```bash
openclaw config set tools.exec.host gateway
openclaw config set tools.exec.mode full
openclaw config set tools.exec.backgroundMs 60000
openclaw gateway restart
```

`backgroundMs` 默认 10000：命令超过约 10 秒会被丢进后台，微信等不到 toolResult。改成 60000 即可。

不确定键名时先看本机 schema：

```bash
openclaw config get tools.exec
openclaw config schema tools.exec
```



自检：微信说「冰箱加个冰茶」，agent 应只跑 `fridge-add --name "冰茶"`，JSON 里 `ok: true`。
