import { a as SKILLS } from "./pack-Cm0S4oXD.mjs";
import { R as notFound, v as Link, z as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-6DmNXVfB.mjs";
import { t as Badge } from "./badge-DTKzpJRv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/skills._id-DyXZksse.js
var import_jsx_runtime = require_jsx_runtime();
var BODIES = {
	"life-db": {
		why: "所有领域共用约定：路径、CLI、金额用分、UTC、认人用 handle。",
		does: [
			"幂等 init / migrate",
			"JSON 输出的 query / exec / due / backup",
			"把微信 peer id upsert 成 people.handle"
		],
		not: [
			"不解释小票",
			"不创建 cron",
			"不跟用户闲聊"
		]
	},
	"life-finance": {
		why: "看图分录是最容易编造金额的地方，必须对总价、去重、先确认再入账。",
		does: [
			"视觉抽取行项目与底部总价",
			"±2 分对账，对不上禁止 confirmed",
			"fingerprint 去重 + receipt_claims 归属",
			"熟店写入 merchants，食品行交给 fridge"
		],
		not: ["看不见图时不准编金额", "不把拍照人当成付款人"]
	},
	"life-fridge": {
		why: "食品有保质期。常识写进 food_knowledge，过期必须变成 memo 才会找你。",
		does: [
			"从记账食品行或手动（冰茶）入库",
			"过期前 2 天 + 当天两条 expiry memo",
			"吃完/丢掉后记 preference 与 repurchase"
		],
		not: ["矿泉水不建过期提醒", "不在没确认时标 eaten"]
	},
	"life-memos": {
		why: "主动对话的总线。精确时刻用 OpenClaw automation，时区写在 cron_tz。",
		does: [
			"一次性 due_at 或循环 cron_expr",
			"创建/改/停 automation，渠道 openclaw-weixin",
			"完成、推迟、取消与 job 同步"
		],
		not: ["不在 finance 里私建 cron", "不发长报告"]
	},
	"life-stocks": {
		why: "试用。登记持仓与事件，把「周五 8:25 ET」落成循环 memo。",
		does: [
			"upsert holdings",
			"options_expiry 事件挂 memo",
			"到点用中文问你怎么处理，不装投资顾问"
		],
		not: ["不编造现价", "不接下单"]
	},
	"life-proactive": {
		why: "被叫醒之后才准开口。没事回 HEARTBEAT_OK。",
		does: [
			"life.py due 巡检",
			"最多两条短讯，6 小时去重",
			"夜间非紧急不发"
		],
		not: ["心跳里不做 OCR", "不准点的时刻不要用 30 分钟心跳硬撞"]
	}
};
function SkillDetail() {
	const { id } = Route.useParams();
	const skill = SKILLS.find((s) => s.id === id);
	const body = BODIES[id];
	if (!skill || !body) throw notFound();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/skills",
				className: "inline-flex items-center gap-2 text-sm text-muted hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "全部技能"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 font-mono text-xs text-muted",
				children: skill.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl tracking-tight",
				children: skill.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 leading-relaxed text-muted",
				children: body.why
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					tone: "pine",
					children: ["加载：", skill.loads]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-8 font-display text-xl",
				children: "做"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2 text-sm leading-relaxed",
				children: body.does.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-lg bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: d
				}, d))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-8 font-display text-xl",
				children: "不做"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2 text-sm text-muted",
				children: body.not.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: d }, d))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm text-muted",
				children: ["触发词：", skill.triggers]
			})
		]
	});
}
//#endregion
export { SkillDetail as component };
