import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/skills/")({ component: SkillsIndex });

function SkillsIndex() {
  return (
    <>
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">不在这里</h1>
        <p className="mt-3 text-muted">
          本仓库不再宿主 OpenClaw skill。请只用 lifeOS-ai 的 skills/life-os。
        </p>
      </header>
    </>
  );
}
