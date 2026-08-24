import { a as SKILLS, t as ADVICE } from "./pack-Cm0S4oXD.mjs";
import { v as Link, z as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Bell, i as Database, n as SquareSplitVertical, o as ArrowRight, r as Eye } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-CFL4G0Nt.mjs";
import { t as Badge } from "./badge-DTKzpJRv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C5E4Nco5.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "pine",
						children: "给 OpenClaw + 微信"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-4xl leading-[1.15] tracking-[-0.03em] text-fg sm:text-5xl",
						children: "想法落成一张表，到期自己来找你。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-5 max-w-2xl text-lg leading-relaxed text-muted",
						children: [
							"不要做一个全能 skill。拆成六份说明书，共用一个",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: " life.db"
							}),
							"。微信负责传图和主动消息；技能放在工作区，数据库随时拷走。"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/playground",
									children: ["演练一张小票", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/install",
									children: "安装技能包"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/life-os-skills.zip",
									download: true,
									children: "下载 zip"
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid gap-4 sm:grid-cols-2",
				children: ADVICE.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl tracking-tight",
						children: item.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: item.body
					})]
				}, item.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "数据怎么流"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted",
					children: "微信通道进，领域表存事实，memos 出。心跳做便宜巡检，cron 对准整点。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-6 grid gap-3 md:grid-cols-4",
					children: [
						{
							icon: Eye,
							t: "微信",
							d: "文字、小票照片。渠道名 openclaw-weixin。"
						},
						{
							icon: SquareSplitVertical,
							t: "六份 skill",
							d: "按意图加载说明书，不把持仓灌进午饭。"
						},
						{
							icon: Database,
							t: "life.db",
							d: "一个文件。金额用分，时间用 UTC。"
						},
						{
							icon: Bell,
							t: "开口",
							d: "memo → automation / heartbeat → 微信短讯。"
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, {
								className: "size-5 text-accent",
								strokeWidth: 1.6
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-medium",
								children: s.t
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: s.d
							})
						]
					}, s.t))
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "六份说明书"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/skills",
					className: "text-sm text-accent hover:underline",
					children: "全部"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: SKILLS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/skills/$id",
					params: { id: s.id },
					className: "block h-full rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] transition-transform duration-[var(--motion-quick)] hover:-translate-y-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-muted",
							children: s.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-xl",
							children: s.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: s.blurb
						})
					]
				}) }, s.id))
			})] })
		]
	});
}
//#endregion
export { Home as component };
