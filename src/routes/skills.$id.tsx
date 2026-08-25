import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SKILLS } from "@/lib/pack";

const BODIES: Record<string, { why: string; does: string[]; not: string[] }> = {
  "life-db": {
    why: "所有领域共用约定：路径、CLI、金额用分、UTC、认人用 handle。",
    does: [
      "幂等 init / migrate",
      "JSON 输出的 query / exec / due / backup",
      "把微信 peer id upsert 成 people.handle",
    ],
    not: ["不解释小票", "不创建 cron", "不跟用户闲聊"],
  },
  "life-finance": {
    why: "看图分录是最容易编造金额的地方，必须对总价、去重、先确认再入账。",
    does: [
      "视觉抽取行项目与底部总价",
      "±2 分对账，对不上禁止 confirmed",
      "barcode + 票面时间戳去重 + receipt_claims 归属",
      "熟店写入 merchants，食品行交给 fridge",
    ],
    not: ["看不见图时不准编金额", "不把拍照人当成付款人"],
  },
  "life-fridge": {
    why: "食品有保质期。常识写进 food_knowledge，过期必须变成 memo 才会找你。",
    does: [
      "从记账食品行或手动（冰茶）入库",
      "过期前 2 天 + 当天两条 expiry memo",
      "吃完/丢掉后记 preference 与 repurchase",
    ],
    not: ["矿泉水不建过期提醒", "不在没确认时标 eaten"],
  },
  "life-memos": {
    why: "主动对话的总线。精确时刻用 OpenClaw automation，时区写在 cron_tz。",
    does: [
      "一次性 due_at 或循环 cron_expr",
      "创建/改/停 automation，渠道 openclaw-weixin",
      "完成、推迟、取消与 job 同步",
    ],
    not: ["不在 finance 里私建 cron", "不发长报告"],
  },
  "life-stocks": {
    why: "试用。登记持仓与事件，把「周五 8:25 ET」落成循环 memo。",
    does: [
      "upsert holdings",
      "options_expiry 事件挂 memo",
      "到点用中文问你怎么处理，不装投资顾问",
    ],
    not: ["不编造现价", "不接下单"],
  },
  "life-proactive": {
    why: "被叫醒之后才准开口。没事回 HEARTBEAT_OK。",
    does: [
      "life.py due 巡检",
      "最多两条短讯，6 小时去重",
      "夜间非紧急不发",
    ],
    not: ["心跳里不做 OCR", "不准点的时刻不要用 30 分钟心跳硬撞"],
  },
};

export const Route = createFileRoute("/skills/$id")({
  component: SkillDetail,
  notFoundComponent: () => (
    <p className="text-muted">没有这个技能。回到列表看看六份说明书。</p>
  ),
});

function SkillDetail() {
  const { id } = Route.useParams();
  const skill = SKILLS.find((s) => s.id === id);
  const body = BODIES[id];
  if (!skill || !body) throw notFound();

  return (
    <article className="max-w-2xl">
      <Link
        to="/skills"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
      >
        <ArrowLeft className="size-4" />
        全部技能
      </Link>
      <p className="mt-6 font-mono text-xs text-muted">{skill.name}</p>
      <h2 className="font-display text-3xl tracking-tight">{skill.title}</h2>
      <p className="mt-3 leading-relaxed text-muted">{body.why}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge tone="pine">加载：{skill.loads}</Badge>
      </div>
      <h3 className="mt-8 font-display text-xl">做</h3>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed">
        {body.does.map((d) => (
          <li key={d} className="rounded-lg bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
            {d}
          </li>
        ))}
      </ul>
      <h3 className="mt-8 font-display text-xl">不做</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted">
        {body.not.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-muted">触发词：{skill.triggers}</p>
    </article>
  );
}
