import { i as __toESM } from "../_runtime.mjs";
import { i as RECEIPT_DEMO } from "./pack-Cm0S4oXD.mjs";
import { z as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as cn } from "./router-6DmNXVfB.mjs";
import { t as Button } from "./button-CFL4G0Nt.mjs";
import { t as Badge } from "./badge-DTKzpJRv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/playground-o4EBr05U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	"小票",
	"对账",
	"入账",
	"冰箱",
	"备忘"
];
function yuan(cents) {
	return `¥${(cents / 100).toFixed(2)}`;
}
function Playground() {
	const [step, setStep] = (0, import_react.useState)(0);
	const sum = (0, import_react.useMemo)(() => RECEIPT_DEMO.lines.reduce((a, l) => a + l.cents, 0), []);
	const match = sum === RECEIPT_DEMO.footer;
	const foods = RECEIPT_DEMO.lines.filter((l) => l.food && l.days != null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-tight sm:text-4xl",
					children: "演练"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted",
					children: "一张盒马小票从看图到过期提醒。真实环境里由微信图片触发；这里用固定样本，让你看清表怎么连。"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex flex-wrap gap-2",
				children: STEPS.map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setStep(i),
					className: cn("rounded-full px-3 py-2 text-sm transition-colors duration-[var(--motion-quick)]", i === step ? "bg-accent text-accent-fg" : "bg-surface text-muted hover:text-fg"),
					children: [
						String(i + 1).padStart(2, "0"),
						" ",
						label
					]
				}) }, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[1.1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6",
					children: [
						step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "pine",
								children: "life-finance · 视觉"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-2xl",
								children: RECEIPT_DEMO.merchant
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [
									RECEIPT_DEMO.when,
									" · 付款人 ",
									RECEIPT_DEMO.payer
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-5 divide-y divide-border",
								children: RECEIPT_DEMO.lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between py-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [l.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-2 text-muted",
										children: ["× ", l.qty]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums",
										children: yuan(l.cents)
									})]
								}, l.name))
							})
						] }),
						step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: match ? "ok" : "warn",
								children: match ? "总价一致" : "不一致"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-2xl",
								children: "对账"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-5 space-y-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: "行项目合计"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "tabular-nums",
											children: yuan(sum)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: "小票底部"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "tabular-nums",
											children: yuan(RECEIPT_DEMO.footer)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: "容差"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "±2 分" })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-sm leading-relaxed text-muted",
								children: "对不上就停在 pending_confirm，不准 confirmed。另一人再传同一张票只加 receipt_claims，不建第二张。"
							})
						] }),
						step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "pine",
								children: "status = confirmed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-2xl",
								children: "入账"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-muted",
								children: "写入 receipts + receipt_items。商家 upsert 到 merchants（家附近超市可标 home_nearby）。食品行 is_food=1，下一步才进冰箱。"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "mt-5 overflow-x-auto rounded-lg bg-ink p-4 font-mono text-[12px] text-paper/90",
								children: `INSERT receipts (payer_id, total_cents, status…)
INSERT receipt_items × ${RECEIPT_DEMO.lines.length}
fingerprint 未命中 → 新票`
							})
						] }),
						step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "pine",
								children: "life-fridge"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-2xl",
								children: "提议进冰箱"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-5 space-y-3",
								children: RECEIPT_DEMO.lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between rounded-lg bg-bg px-3 py-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: l.days == null ? "不提醒过期" : `${l.loc} · ${l.days} 天`
									})]
								}, l.name))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm text-muted",
								children: "矿泉水按常识不建过期备忘。叶菜与鸡胸会。"
							})
						] }),
						step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "pine",
								children: "life-memos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-2xl",
								children: "到期会来问你"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-5 space-y-3 text-sm",
								children: foods.flatMap((l) => [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-lg bg-bg px-3 py-3",
									children: [l.name, " · 过期前 2 天 18:00 ·「快要坏了」"]
								}, `${l.name}-soon`), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-lg bg-bg px-3 py-3",
									children: [l.name, " · 过期当天 18:00 ·「吃完了还是扔了？」"]
								}, `${l.name}-day`)])
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm text-muted",
								children: "每条 memo 挂一条 OpenClaw automation。心跳只负责扫 due，不对准整点。"
							})
						] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "rounded-xl bg-ink p-5 text-paper shadow-[var(--shadow-border)] sm:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-[0.18em] text-paper/50",
							children: "微信会怎么说"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 font-display text-xl leading-snug",
							children: [
								step === 0 && "这张盒马小票我看到 4 行。先对一下总价，再问你要不要进冰箱。",
								step === 1 && `行项目 ${yuan(sum)}，底部 ${yuan(RECEIPT_DEMO.footer)}，一致。回「对」我就入账。`,
								step === 2 && "已入账，记在你名下。生菜、西红柿、鸡胸要不要一并进冰箱？",
								step === 3 && "生菜按 2 天、鸡胸 2 天、西红柿 5 天。矿泉水不提醒过期。",
								step === 4 && "鸡胸今天该处理了。吃完了、扔了，还是我再记一天？"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-sm leading-relaxed text-paper/60",
							children: "一句事实，一句问句。不发长报告。"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					disabled: step === 0,
					onClick: () => setStep((s) => Math.max(0, s - 1)),
					children: "上一步"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: step === STEPS.length - 1,
					onClick: () => setStep((s) => Math.min(STEPS.length - 1, s + 1)),
					children: "下一步"
				})]
			})
		]
	});
}
//#endregion
export { Playground as component };
