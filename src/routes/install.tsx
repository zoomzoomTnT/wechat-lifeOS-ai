import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";
import { INSTALL_STEPS } from "@/lib/pack";

export const Route = createFileRoute("/install")({ component: InstallPage });

function InstallPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">安装</h1>
        <p className="mt-3 text-muted">
          拷到 OpenClaw 工作区即可，不要放进腾讯 weixin 插件目录。主会话需要带视觉的模型才能分录小票。
        </p>
        <div className="mt-5">
          <Button asChild>
            <a href="/life-os-skills.zip" download>
              下载 life-os-skills.zip
            </a>
          </Button>
        </div>
      </header>
      {INSTALL_STEPS.map((step, i) => (
        <section key={step.title}>
          <h2 className="font-display text-xl">
            <span className="font-mono text-sm text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>{" "}
            {step.title}
          </h2>
          <CodeBlock className="mt-3" code={step.code} />
        </section>
      ))}
      <section>
        <h2 className="font-display text-xl">备份</h2>
        <CodeBlock
          className="mt-3"
          code={`python3 ~/.openclaw/workspace/life-os-skills/scripts/life.py backup ~/backup/life-$(date +%Y%m%d).db`}
        />
        <p className="mt-3 text-sm text-muted">
          用 CLI 的 backup，不要直接拷正在写入的 db（WAL）。这一个文件就可以带到 OpenClaw 外面。
        </p>
      </section>
    </div>
  );
}
