# 安装

默认工作区：`~/.openclaw/workspace`

```bash
mkdir -p ~/.openclaw/workspace/skills ~/.openclaw/workspace/data/life-inbox
cp -R . ~/.openclaw/workspace/skills/life-os-skills
```

把 `workspace/AGENTS.snippet.md` 贴进 `AGENTS.md`，`workspace/HEARTBEAT.snippet.md` 合并进 `HEARTBEAT.md`。

## 常开入库服务（必须）

OpenClaw 微信 **不要** 靠 python exec 写库。在电脑上另开一个终端，保持运行：

```bash
python3 ~/.openclaw/workspace/skills/life-os-skills/scripts/life.py serve
```

应打印 `listen: http://127.0.0.1:8788` 和 `inbox` 路径。Agent 往 `~/.openclaw/workspace/data/life-inbox/*.json` 丢任务，服务写出 `*.result.json`。

自检：

```bash
echo '{"op":"fridge-add","name":"冰茶"}' > ~/.openclaw/workspace/data/life-inbox/test.json
sleep 0.5
cat ~/.openclaw/workspace/data/life-inbox/test.result.json
```
