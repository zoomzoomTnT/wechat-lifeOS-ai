import { createFileRoute } from "@tanstack/react-router";
import { TABLES } from "@/lib/pack";

export const Route = createFileRoute("/schema")({ component: SchemaPage });

function SchemaPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">表结构</h1>
        <p className="mt-3 text-muted">
          一张库。金额是整数分，时间是 UTC。memos 是开口用的队列，不是又一个待办 App。
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        {TABLES.map((t) => (
          <article
            key={t.name}
            className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
          >
            <p className="font-mono text-sm text-accent">{t.name}</p>
            <p className="mt-1 text-sm text-muted">{t.role}</p>
            <dl className="mt-4 space-y-2">
              {t.cols.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] gap-3 text-sm">
                  <dt className="font-mono text-xs text-fg">{k}</dt>
                  <dd className="text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
