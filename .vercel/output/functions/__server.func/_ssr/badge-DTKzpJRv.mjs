import { z as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as cn } from "./router-6DmNXVfB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-DTKzpJRv.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "ink", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", tone === "ink" && "bg-ink/8 text-fg", tone === "pine" && "bg-accent/12 text-accent-2", tone === "paper" && "bg-surface-2 text-muted", tone === "warn" && "bg-warn/15 text-warn", tone === "ok" && "bg-ok/15 text-ok", className),
		...props
	});
}
//#endregion
export { Badge as t };
