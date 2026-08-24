import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { RECEIPT_DEMO } from "@/lib/pack";

export const Route = createFileRoute("/playground")({ component: Playground });

const STEPS = ["小票", "对账", "入账", "冰箱", "备忘"] as const;

function yuan(cents: number) {
  return `¥${(cents / 100).toFixed(2)}`;
}

function Playground() {
  const [step, setStep] = useState(0);
  const sum = useMemo(
    () => RECEIPT_DEMO.lines.reduce((a, l) => a + l.cents, 0),
    [],
  );
  const match = sum === RECEIPT_DEMO.footer;
  const foods = RECEIPT_DEMO.lines.filter((l) => l.food && l.days != null);

  return (
    <div className="flex flex-col gap-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">演练</h1>
        <p className="mt-3 text-muted">
          一张盒马小票从看图到过期提醒。真实环境里由微信图片触发；这里用固定样本，让你看清表怎么连。
        </p>
      </header>

      <ol className="flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => setStep(i)}
              className={cn(
                "min-h-11 rounded-full px-3 py-2 text-sm transition-colors duration-[var(--motion-quick)]",
                i === step
                  ? "bg-accent text-accent-fg"
                  : "bg-surface text-muted hover:text-fg",
              )}
            >
              {String(i + 1).padStart(2, "0")} {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6">
          {step === 0 && (
            <>
              <Badge tone="pine">life-finance · 视觉</Badge>
              <h2 className="mt-3 font-display text-2xl">
                {RECEIPT_DEMO.merchant}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {RECEIPT_DEMO.when} · 付款人 {RECEIPT_DEMO.payer}
              </p>
              <ul className="mt-5 divide-y divide-border">
                {RECEIPT_DEMO.lines.map((l) => (
                  <li key={l.name} className="flex items-center justify-between py-3 text-sm">
                    <span>
                      {l.name}
                      <span className="ml-2 text-muted">× {l.qty}</span>
                    </span>
                    <span className="tabular-nums">{yuan(l.cents)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {step === 1 && (
            <>
              <Badge tone={match ? "ok" : "warn"}>
                {match ? "总价一致" : "不一致"}
              </Badge>
              <h2 className="mt-3 font-display text-2xl">对账</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">行项目合计</dt>
                  <dd className="tabular-nums">{yuan(sum)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">小票底部</dt>
                  <dd className="tabular-nums">{yuan(RECEIPT_DEMO.footer)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">容差</dt>
                  <dd>±2 分</dd>
                </div>
              </dl>
              <p className="mt-5 text-sm leading-relaxed text-muted">
                对不上就停在 pending_confirm，不准 confirmed。另一人再传同一张票只加
                receipt_claims，不建第二张。
              </p>
            </>
          )}
          {step === 2 && (
            <>
              <Badge tone="pine">status = confirmed</Badge>
              <h2 className="mt-3 font-display text-2xl">入账</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                写入 receipts + receipt_items。商家 upsert 到 merchants（家附近超市可标
                home_nearby）。食品行 is_food=1，下一步才进冰箱。
              </p>
              <pre className="mt-5 overflow-x-auto rounded-lg bg-ink p-4 font-mono text-[12px] text-paper/90">
{`INSERT receipts (payer_id, total_cents, status…)
INSERT receipt_items × ${RECEIPT_DEMO.lines.length}
fingerprint 未命中 → 新票`}
              </pre>
            </>
          )}
          {step === 3 && (
            <>
              <Badge tone="pine">life-fridge</Badge>
              <h2 className="mt-3 font-display text-2xl">提议进冰箱</h2>
              <ul className="mt-5 space-y-3">
                {RECEIPT_DEMO.lines.map((l) => (
                  <li
                    key={l.name}
                    className="flex items-center justify-between rounded-lg bg-bg px-3 py-3 text-sm"
                  >
                    <span>{l.name}</span>
                    <span className="text-muted">
                      {l.days == null
                        ? "不提醒过期"
                        : `${l.loc} · ${l.days} 天`}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">
                矿泉水按常识不建过期备忘。叶菜与鸡胸会。
              </p>
            </>
          )}
          {step === 4 && (
            <>
              <Badge tone="pine">life-memos</Badge>
              <h2 className="mt-3 font-display text-2xl">到期会来问你</h2>
              <ul className="mt-5 space-y-3 text-sm">
                {foods.flatMap((l) => [
                  <li key={`${l.name}-soon`} className="rounded-lg bg-bg px-3 py-3">
                    {l.name} · 过期前 2 天 18:00 ·「快要坏了」
                  </li>,
                  <li key={`${l.name}-day`} className="rounded-lg bg-bg px-3 py-3">
                    {l.name} · 过期当天 18:00 ·「吃完了还是扔了？」
                  </li>,
                ])}
              </ul>
              <p className="mt-4 text-sm text-muted">
                每条 memo 挂一条 OpenClaw automation。心跳只负责扫 due，不对准整点。
              </p>
            </>
          )}
        </section>

        <aside className="rounded-xl bg-ink p-5 text-paper shadow-[var(--shadow-border)] sm:p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-paper/50">
            微信会怎么说
          </p>
          <p className="mt-4 font-display text-xl leading-snug">
            {step === 0 &&
              "这张盒马小票我看到 4 行。先对一下总价，再问你要不要进冰箱。"}
            {step === 1 &&
              `行项目 ${yuan(sum)}，底部 ${yuan(RECEIPT_DEMO.footer)}，一致。回「对」我就入账。`}
            {step === 2 &&
              "已入账，记在你名下。生菜、西红柿、鸡胸要不要一并进冰箱？"}
            {step === 3 &&
              "生菜按 2 天、鸡胸 2 天、西红柿 5 天。矿泉水不提醒过期。"}
            {step === 4 &&
              "鸡胸今天该处理了。吃完了、扔了，还是我再记一天？"}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-paper/60">
            一句事实，一句问句。不发长报告。
          </p>
        </aside>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          上一步
        </Button>
        <Button
          disabled={step === STEPS.length - 1}
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
        >
          下一步
        </Button>
      </div>
    </div>
  );
}
