# 安装

默认工作区：`~/.openclaw/workspace`

```bash
mkdir -p ~/.openclaw/workspace/skills
cp -R . ~/.openclaw/workspace/skills/life-os-skills
```

不要拷进 `openclaw-weixin` 插件目录。不必先 `init`：第一次 `fridge-add` / `exec` 会建库。

把 `workspace/AGENTS.snippet.md` 贴进 `AGENTS.md`（含「先开口」：每次 tool 前先给微信一句话），把 `workspace/HEARTBEAT.snippet.md` 合并进 `HEARTBEAT.md`（< 50 行）。

心跳 `every: "10m"`（调试），`target: "openclaw-weixin"`，时区 `Asia/Tokyo`。把 `workspace/openclaw.heartbeat.example.json5` 合进 `~/.openclaw/openclaw.json` 后重启 gateway。小票需要带视觉的模型。

微信里 exec 必须跑在 **gateway**（和手动测试同一台）。`ask` 不是 `openclaw.json` 里的字段，要用 `mode`。不要另贴一整段 `tools` 把原文件盖掉，只把下面三行合进已有的 `tools.exec`：

```json5
{
  tools: {
    exec: {
      host: "gateway",
      timeoutSeconds: 15,
      mode: "full", // full => 不弹批准窗
    },
  },
}
```

更稳是用 CLI（会写对 schema）：

```bash
openclaw config set tools.exec.host gateway
openclaw config set tools.exec.timeoutSeconds 15
openclaw config set tools.exec.mode full
openclaw exec-policy set --host gateway --security full --ask off
openclaw gateway restart
```



自检：微信说「冰箱加个冰茶」，agent 应只跑 `fridge-add --name "冰茶"`，JSON 里 `ok: true`。
