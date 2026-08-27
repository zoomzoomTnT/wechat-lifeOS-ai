import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/cn";

const NAV = [{ to: "/", label: "retired" }] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="pointer-events-none fixed inset-0 ledger-rules opacity-[0.35]" />
      <header className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Link to="/" className="flex items-baseline gap-3">
            <span className="font-display text-xl tracking-tight text-fg">
              wechat-lifeOS-ai
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-muted">
              retired
            </span>
          </Link>
          <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0 lg:pb-0">
            {NAV.map((item) => {
              const active = pathname === "/";
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-2 text-sm min-h-11 inline-flex items-center transition-colors duration-[var(--motion-quick)]",
                    active
                      ? "bg-accent text-accent-fg"
                      : "text-muted hover:bg-surface-2 hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
      <footer className="relative border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-muted sm:px-6">
          <p>不再交付 Life OS skill。本仓库与 lifeOS-ai 没有运行时关联。</p>
        </div>
      </footer>
    </div>
  );
}
