import { createFileRoute } from "@tanstack/react-router";
import { FLOWS } from "@/lib/pack";

export const Route = createFileRoute("/flows")({ component: FlowsPage });

function FlowsPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">流程</h1>
        <p className="mt-3 text-muted">
          跨技能靠外键，不靠把三段说明写进同一份 SKILL.md。
        </p>
      </header>
      {FLOWS.map((flow) => (
        <article key={flow.id} className="max-w-3xl">
          <h2 className="font-display text-2xl tracking-tight">{flow.title}</h2>
          <ol className="mt-4 space-y-3">
            {flow.steps.map((step, i) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
              >
                <span className="font-mono text-sm tabular-nums text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </article>
      ))}
    </div>
  );
}
