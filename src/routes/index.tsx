import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <section>
        <Badge tone="pine">retired</Badge>
        <h1 className="mt-4 font-display text-4xl leading-[1.15] tracking-[-0.03em] text-fg">
          这个仓库不再交付 Life OS。
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          不要从这里装 skill，不要下 life-os-skills.zip，不要跑 life.py。
          OpenClaw skill 只住在 lifeOS-ai 的
          <span className="text-fg"> skills/life-os/</span>。
        </p>
        <p className="mt-4 font-mono text-sm text-muted">
          https://github.com/zoomzoomTnT/lifeOS-ai
        </p>
      </section>
    </div>
  );
}
