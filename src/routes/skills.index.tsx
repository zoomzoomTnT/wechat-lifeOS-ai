import { createFileRoute, Link } from "@tanstack/react-router";
import { SKILLS } from "@/lib/pack";

export const Route = createFileRoute("/skills/")({ component: SkillsIndex });

function SkillsIndex() {
  return (
    <>
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">技能</h1>
        <p className="mt-3 text-muted">
          description 决定会不会被点到；正文才是步骤。拆开是为了省上下文，不是为了拆库。
        </p>
      </header>
      <ul className="grid gap-4 md:grid-cols-2">
        {SKILLS.map((s) => (
          <li key={s.id}>
            <Link
              to="/skills/$id"
              params={{ id: s.id }}
              className="flex h-full flex-col rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
            >
              <p className="font-mono text-xs text-muted">{s.name}</p>
              <h2 className="mt-1 font-display text-2xl">{s.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {s.blurb}
              </p>
              <p className="mt-4 text-xs text-muted">触发：{s.triggers}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
