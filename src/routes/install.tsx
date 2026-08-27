import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/install")({ component: InstallPage });

function InstallPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">不从这里安装</h1>
        <p className="mt-3 text-muted">
          本仓库不再提供 OpenClaw skill。不要下 zip，不要拷 life-os-skills，不要跑 life.py。
        </p>
        <p className="mt-4 font-mono text-sm">
          安装只走 https://github.com/zoomzoomTnT/lifeOS-ai 的 docker compose + skill-sync。
        </p>
      </header>
    </div>
  );
}
