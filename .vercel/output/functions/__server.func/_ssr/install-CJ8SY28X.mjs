import { i as __toESM } from "../_runtime.mjs";
import { r as INSTALL_STEPS } from "./pack-Cm0S4oXD.mjs";
import { z as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as cn } from "./router-6DmNXVfB.mjs";
import { t as Button } from "./button-CFL4G0Nt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/install-CJ8SY28X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CodeBlock({ code, className }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden rounded-xl bg-ink text-paper shadow-[var(--shadow-border)]", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute right-2 top-2 h-9 rounded-md px-3 text-xs text-paper/70 hover:text-paper",
			onClick: async () => {
				await navigator.clipboard.writeText(code);
				setCopied(true);
				window.setTimeout(() => setCopied(false), 1200);
			},
			children: copied ? "已复制" : "复制"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "overflow-x-auto p-4 pr-16 font-mono text-[13px] leading-relaxed text-paper/90",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code })
		})]
	});
}
function InstallPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex max-w-3xl flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-tight sm:text-4xl",
					children: "安装"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted",
					children: "拷到 OpenClaw 工作区即可，不要放进腾讯 weixin 插件目录。主会话需要带视觉的模型才能分录小票。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/life-os-skills.zip",
							download: true,
							children: "下载 life-os-skills.zip"
						})
					})
				})
			] }),
			INSTALL_STEPS.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-display text-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-sm text-accent",
						children: String(i + 1).padStart(2, "0")
					}),
					" ",
					step.title
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
				className: "mt-3",
				code: step.code
			})] }, step.title)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "备份"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
					className: "mt-3",
					code: `python3 ~/.openclaw/workspace/life-os-skills/scripts/life.py backup ~/backup/life-$(date +%Y%m%d).db`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "用 CLI 的 backup，不要直接拷正在写入的 db（WAL）。这一个文件就可以带到 OpenClaw 外面。"
				})
			] })
		]
	});
}
//#endregion
export { InstallPage as component };
