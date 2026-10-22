import { i as __toESM } from "../_runtime.mjs";
import { n as useStock, r as formatBRL } from "./stock-store-C3DkJqhK.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { C as ArrowDownToLine, S as ArrowLeftRight, d as Plus, n as Wallet, p as Package, r as TriangleAlert, v as Boxes, x as ArrowUpFromLine } from "../_libs/lucide-react.mjs";
import { a as Panel, c as btnPrimary, i as PageHeader, n as KpiCard, o as StockPill, t as EmptyState } from "./common-CgnrJkHb.mjs";
import { t as MovementModal } from "./MovementModal-yQp0U3Eq.mjs";
import { l as formatDateTime } from "./reports-DKuCUNUe.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CbU3HCQu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HomePage() {
	const { products, movements, ready } = useStock();
	const [showMovement, setShowMovement] = (0, import_react.useState)(false);
	const lowStock = (0, import_react.useMemo)(() => products.filter((p) => p.quantity <= 5).sort((a, b) => a.quantity - b.quantity), [products]);
	const stockValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
	const last7Days = (0, import_react.useMemo)(() => {
		const since = Date.now() - 6048e5;
		return movements.filter((m) => new Date(m.createdAt).getTime() >= since).length;
	}, [movements]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-16 text-center text-sm text-muted-foreground",
		children: "Carregando seus dados..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Olá! Bem-vindo ao seu estoque.",
			subtitle: "Veja como está o seu estoque hoje.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setShowMovement(true),
				className: btnPrimary,
				disabled: products.length === 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 }), " Nova movimentação"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"aria-label": "Indicadores",
			className: "mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Produtos cadastrados",
					value: String(products.length),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { size: 20 }),
					tone: "blue"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Estoque baixo",
					value: String(lowStock.length),
					detail: `5 un. ou menos`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 20 }),
					tone: "amber"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Movimentações",
					value: String(last7Days),
					detail: "Últimos 7 dias",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { size: 20 }),
					tone: "green"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Valor em estoque",
					value: formatBRL(stockValue),
					detail: "Preço × quantidade",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { size: 20 }),
					tone: "violet"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-5 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Produtos com estoque baixo",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/relatorios",
					className: "text-sm font-semibold text-primary hover:underline",
					children: "Ver relatório"
				}),
				children: lowStock.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: products.length ? "Nenhum produto com estoque baixo." : "Nenhum produto cadastrado ainda." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: lowStock.slice(0, 5).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: p.category
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockPill, { quantity: p.quantity })]
					}, p.id))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Movimentações recentes",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/movimentacoes",
					className: "text-sm font-semibold text-primary hover:underline",
					children: "Ver todas"
				}),
				children: movements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Nenhuma movimentação registrada ainda." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: movements.slice(0, 5).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 py-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid size-9 shrink-0 place-items-center rounded-lg ${m.type === "entrada" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`,
								children: m.type === "entrada" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownToLine, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpFromLine, { size: 16 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-sm font-semibold",
									children: [
										m.type === "entrada" ? "Entrada" : "Saída",
										" · ",
										m.productName
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: formatDateTime(m.createdAt)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `text-sm font-bold tabular-nums ${m.type === "entrada" ? "text-success" : "text-destructive"}`,
								children: [m.type === "entrada" ? "+" : "−", m.quantity]
							})
						]
					}, m.id))
				})
			})]
		}),
		products.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-5 flex items-center gap-2 text-sm text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { size: 16 }),
				" Comece cadastrando seus produtos em",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/produtos",
					className: "font-semibold text-primary hover:underline",
					children: "Produtos"
				}),
				"."
			]
		}),
		showMovement && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MovementModal, { onClose: () => setShowMovement(false) })
	] });
}
//#endregion
export { HomePage as component };
