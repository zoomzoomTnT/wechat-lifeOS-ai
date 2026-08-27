import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/skills/$id")({
  component: SkillPage,
});

function SkillPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl tracking-tight">retired</h1>
      <p className="mt-3 text-muted">Skill 不在这个仓库。</p>
    </div>
  );
}
