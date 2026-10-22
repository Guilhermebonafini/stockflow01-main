import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { p as Package } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/common-CgnrJkHb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var btnPrimary = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50";
var btnSecondary = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50";
var btnDanger = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition hover:bg-destructive/90 active:scale-[.98]";
function PageHeader({ title, subtitle, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between lg:mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-extrabold tracking-tight lg:text-[1.75rem]",
				children: title
			}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-sm text-muted-foreground",
				children: subtitle
			})]
		}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: actions
		})]
	});
}
function Panel({ title, subtitle, action, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `min-w-0 rounded-xl border bg-card p-4 sm:p-5 ${className}`,
		children: [(title || action) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold",
					children: title
				}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: subtitle
				})]
			}), action]
		}), children]
	});
}
var TONES = {
	blue: {
		icon: "bg-primary/10 text-primary",
		tile: "max-sm:bg-[#1f66e5]"
	},
	amber: {
		icon: "bg-amber-500/15 text-amber-700",
		tile: "max-sm:bg-[#c2610c]"
	},
	green: {
		icon: "bg-success/10 text-success",
		tile: "max-sm:bg-[#138a4b]"
	},
	violet: {
		icon: "bg-violet-500/10 text-violet-700",
		tile: "max-sm:bg-[#6a3fd0]"
	}
};
function KpiCard({ label, value, detail, icon, tone = "blue" }) {
	const t = TONES[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `min-w-0 rounded-xl border bg-card p-4 max-sm:border-transparent max-sm:text-white ${t.tile}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-start gap-2.5 sm:flex-row sm:gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `grid size-10 shrink-0 place-items-center rounded-lg max-sm:bg-white/20 max-sm:text-white ${t.icon}`,
				children: icon
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 max-w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted-foreground max-sm:text-white/85",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 truncate text-xl font-extrabold sm:text-2xl",
						children: value
					}),
					detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground max-sm:text-white/80",
						children: detail
					})
				]
			})]
		})
	});
}
function StockPill({ quantity }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${quantity <= 0 ? "bg-destructive/10 text-destructive" : quantity <= 5 ? "bg-amber-500/15 text-amber-800" : "bg-success/10 text-success"}`,
		children: [quantity, " un."]
	});
}
function EmptyState({ message, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, {
				size: 28,
				className: "mb-2 text-muted-foreground",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-sm text-muted-foreground",
				children: message
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: action
			})
		]
	});
}
function Modal({ children, onClose, label }) {
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKey);
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = previous;
		};
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/50 sm:items-center sm:p-4",
		onMouseDown: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": label,
			className: "max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-card pb-[env(safe-area-inset-bottom)] sm:max-w-lg sm:rounded-2xl sm:pb-0",
			children
		})
	});
}
//#endregion
export { Panel as a, btnPrimary as c, PageHeader as i, btnSecondary as l, KpiCard as n, StockPill as o, Modal as r, btnDanger as s, EmptyState as t };
