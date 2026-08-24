import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Database, SplitSquareVertical, Bell, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ADVICE, SKILLS } from "@/lib/pack";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="flex flex-col gap-14">
      <section className="max-w-3xl">
        <Badge tone="pine">给 OpenClaw + 微信</Badge>
        <h1 className="mt-4 font-display text-4xl leading-[1.15] tracking-[-0.03em] text-fg sm:text-5xl">
          想法落成一张表，到期自己来找你。
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          不要做一个全能 skill。拆成六份说明书，共用一个
          <span className="text-fg"> life.db</span>
          。微信负责传图和主动消息；技能放在工作区，数据库随时拷走。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/playground">
              演练一张小票
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/install">安装技能包</Link>
          </Button>
          <Button variant="ghost" asChild>
            <a href="/life-os-skills.zip" download>
              下载 zip
            </a>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {ADVICE.map((item) => (
          <article
            key={item.title}
            className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6"
          >
            <h2 className="font-display text-xl tracking-tight">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </article>
        ))}
      </section>

      <section>
        <h2 className="font-display text-2xl tracking-tight">数据怎么流</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          微信通道进，领域表存事实，memos 出。心跳做便宜巡检，cron 对准整点。
        </p>
        <ol className="mt-6 grid gap-3 md:grid-cols-4">
          {[
            {
              icon: Eye,
              t: "微信",
              d: "文字、小票照片。渠道名 openclaw-weixin。",
            },
            {
              icon: SplitSquareVertical,
              t: "六份 skill",
              d: "按意图加载说明书，不把持仓灌进午饭。",
            },
            {
              icon: Database,
              t: "life.db",
              d: "一个文件。金额用分，时间用 UTC。",
            },
            {
              icon: Bell,
              t: "开口",
              d: "memo → automation / heartbeat → 微信短讯。",
            },
          ].map((s) => (
            <li
              key={s.t}
              className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
            >
              <s.icon className="size-5 text-accent" strokeWidth={1.6} />
              <p className="mt-3 font-medium">{s.t}</p>
              <p className="mt-1 text-sm text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl tracking-tight">六份说明书</h2>
          <Link to="/skills" className="text-sm text-accent hover:underline">
            全部
          </Link>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((s) => (
            <li key={s.id}>
              <Link
                to="/skills/$id"
                params={{ id: s.id }}
                className="block h-full rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] transition-transform duration-[var(--motion-quick)] hover:-translate-y-0.5"
              >
                <p className="font-mono text-xs text-muted">{s.name}</p>
                <p className="mt-1 font-display text-xl">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
