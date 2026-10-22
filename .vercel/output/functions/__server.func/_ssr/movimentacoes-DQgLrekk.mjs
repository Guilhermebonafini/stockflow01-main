import { i as __toESM } from "../_runtime.mjs";
import { n as useStock } from "./stock-store-C3DkJqhK.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { C as ArrowDownToLine, d as Plus, x as ArrowUpFromLine } from "../_libs/lucide-react.mjs";
import { a as Panel, c as btnPrimary, i as PageHeader, t as EmptyState } from "./common-CgnrJkHb.mjs";
import { t as MovementModal } from "./MovementModal-yQp0U3Eq.mjs";
import { l as formatDateTime } from "./reports-DKuCUNUe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/movimentacoes-DQgLrekk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	{
		id: "todas",
		label: "Todas"
	},
	{
		id: "entrada",
		label: "Entradas"
	},
	{
		id: "saida",
		label: "Saídas"
	}
];
function MovementsPage() {
	const { movements, products, ready } = useStock();
	const [show, setShow] = (0, import_react.useState)(false);
	const [filter, setFilter] = (0, import_react.useState)("todas");
	const list = movements.filter((m) => filter === "todas" || m.type === filter);
	const badge = (type) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${type === "entrada" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`,
		children: [type === "entrada" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownToLine, { size: 13 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpFromLine, { size: 13 }), type === "entrada" ? "Entrada" : "Saída"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Movimentações",
			subtitle: "Entradas e saídas registradas no sistema.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setShow(true),
				className: btnPrimary,
				disabled: products.length === 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 }), " Nova movimentação"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex gap-2",
			role: "group",
			"aria-label": "Filtrar por tipo",
			children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setFilter(f.id),
				"aria-pressed": filter === f.id,
				className: `min-h-9 rounded-full px-4 text-sm font-semibold transition-colors ${filter === f.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-border"}`,
				children: f.label
			}, f.id))
		}), !ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-10 text-center text-sm text-muted-foreground",
			children: "Carregando seus dados..."
		}) : list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Nenhuma movimentação registrada ainda." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y md:hidden",
			children: list.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [badge(m.type), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: formatDateTime(m.createdAt)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm font-bold",
						children: m.productName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							m.quantity,
							" un.",
							m.note ? ` · ${m.note}` : ""
						]
					})
				]
			}, m.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden overflow-x-auto md:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-3 pr-3 font-semibold",
							children: "Tipo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-3 pr-3 font-semibold",
							children: "Produto"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-3 pr-3 text-right font-semibold",
							children: "Quantidade"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-3 pr-3 font-semibold",
							children: "Observação"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "pb-3 font-semibold",
							children: "Data"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: list.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b last:border-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-3",
							children: badge(m.type)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-3 font-semibold",
							children: m.productName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "py-3 pr-3 text-right tabular-nums",
							children: [m.quantity, " un."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-3 text-muted-foreground",
							children: m.note || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 text-muted-foreground",
							children: formatDateTime(m.createdAt)
						})
					]
				}, m.id)) })]
			})
		})] })] }),
		show && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MovementModal, { onClose: () => setShow(false) })
	] });
}
//#endregion
export { MovementsPage as component };
