import { i as __toESM } from "../_runtime.mjs";
import { n as useStock, r as formatBRL } from "./stock-store-C3DkJqhK.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { S as ArrowLeftRight, g as Download, n as Wallet, p as Package, r as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as Panel, c as btnPrimary, i as PageHeader, n as KpiCard, t as EmptyState } from "./common-CgnrJkHb.mjs";
import { a as downloadCsv, c as formatCell, d as reportToCsv, f as summarize, i as defaultFilters, m as valueByCategory, n as REPORTS, o as filterMovements, p as toInputDate, r as REPORT_BY_ID, s as filterProducts, t as ALL_CATEGORIES, u as movementsByDay } from "./reports-DKuCUNUe.mjs";
import { a as CartesianGrid, c as Cell, d as Legend, i as XAxis, l as ResponsiveContainer, n as BarChart, o as Bar, r as YAxis, s as Pie, t as PieChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/relatorios-QhLIZSQT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TONE_CLASS = {
	good: "bg-success/10 text-success",
	warn: "bg-amber-500/15 text-amber-800",
	bad: "bg-destructive/10 text-destructive",
	info: "bg-primary/10 text-primary"
};
function ReportTable({ columns, rows, emptyMessage }) {
	if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: emptyMessage });
	const shown = rows.slice(0, 200);
	const cell = (col, row) => {
		const value = row[col.key];
		const text = formatCell(col, value);
		const tone = value !== void 0 ? col.tone?.(value) : void 0;
		return tone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${TONE_CLASS[tone]}`,
			children: text
		}) : text;
	};
	const numeric = (col) => col.type === "integer" || col.type === "money";
	const [first, ...rest] = columns;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y md:hidden",
			children: shown.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "py-3",
				children: [first && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold",
					children: cell(first, row)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-1.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs",
					children: rest.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "contents",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted-foreground",
							children: col.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-right font-medium",
							children: cell(col, row)
						})]
					}, col.key))
				})]
			}, i))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden overflow-x-auto md:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "border-b text-xs text-muted-foreground",
					children: columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: `pb-3 pr-3 font-semibold ${numeric(col) ? "text-right" : ""}`,
						children: col.label
					}, col.key))
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: shown.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "border-b last:border-0",
					children: columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `py-3 pr-3 ${numeric(col) ? "text-right tabular-nums" : ""} ${col.key === "produto" ? "font-semibold" : ""}`,
						children: cell(col, row)
					}, col.key))
				}, i)) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-xs text-muted-foreground",
			children: rows.length > 200 ? `Mostrando 200 de ${rows.length} registros. O CSV exporta todos.` : `${rows.length} registro(s).`
		})
	] });
}
var PIE_COLORS = [
	"#1f66e5",
	"#22a559",
	"#f59e0b",
	"#8b5cf6",
	"#ef4444",
	"#14b8a6",
	"#64748b"
];
function useMounted() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	return mounted;
}
function ReportsPage() {
	const { products, movements, ready, notify } = useStock();
	const mounted = useMounted();
	const [filters, setFilters] = (0, import_react.useState)(() => defaultFilters());
	const [reportId, setReportId] = (0, import_react.useState)("posicao");
	const data = (0, import_react.useMemo)(() => ({
		products,
		movements
	}), [products, movements]);
	const categories = (0, import_react.useMemo)(() => Array.from(new Set(products.map((p) => p.category))).sort((a, b) => a.localeCompare(b, "pt-BR")), [products]);
	const productOptions = (0, import_react.useMemo)(() => products.filter((p) => filters.category === "Todas" || p.category === filters.category).sort((a, b) => a.name.localeCompare(b.name, "pt-BR")), [products, filters.category]);
	const summary = (0, import_react.useMemo)(() => summarize(data, filters), [data, filters]);
	const chart = (0, import_react.useMemo)(() => movementsByDay(filterMovements(data, filters), filters), [data, filters]);
	const hasChartData = chart.points.some((p) => p.entradas > 0 || p.saidas > 0);
	const donut = (0, import_react.useMemo)(() => valueByCategory(filterProducts(products, filters)), [products, filters]);
	const report = REPORT_BY_ID[reportId];
	const rows = (0, import_react.useMemo)(() => report.build(data, filters), [
		report,
		data,
		filters
	]);
	function update(patch) {
		setFilters((cur) => ({
			...cur,
			...patch
		}));
	}
	function changeCategory(category) {
		const keep = products.find((p) => p.id === filters.productId);
		update({
			category,
			productId: !keep || category === "Todas" || keep.category === category ? filters.productId : ""
		});
	}
	function setLastDays(days) {
		if (days === null) return update({
			from: "",
			to: ""
		});
		const today = /* @__PURE__ */ new Date();
		const start = new Date(today);
		start.setDate(start.getDate() - (days - 1));
		update({
			from: toInputDate(start),
			to: toInputDate(today)
		});
	}
	function exportCsv() {
		downloadCsv(report.filename, reportToCsv(report.columns, rows));
		notify(`Relatório “${report.label}” exportado em CSV.`);
	}
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-16 text-center text-sm text-muted-foreground",
		children: "Carregando seus dados..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Relatórios",
			subtitle: "Acompanhe o desempenho do seu estoque.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: exportCsv,
				className: btnPrimary,
				disabled: rows.length === 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 16 }), " Exportar CSV"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "grid grid-cols-2 gap-2 sm:col-span-2 xl:col-span-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "mb-1 text-xs font-semibold text-muted-foreground",
								children: "Período"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "sr-only",
								htmlFor: "f-from",
								children: "De"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "f-from",
								type: "date",
								className: "field",
								value: filters.from,
								max: filters.to || void 0,
								onChange: (e) => update({ from: e.target.value })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "sr-only",
								htmlFor: "f-to",
								children: "Até"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "f-to",
								type: "date",
								className: "field",
								value: filters.to,
								min: filters.from || void 0,
								onChange: (e) => update({ to: e.target.value })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs font-semibold text-muted-foreground",
						children: ["Categoria", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "field mt-1 text-sm font-normal text-foreground",
							value: filters.category,
							onChange: (e) => changeCategory(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: ALL_CATEGORIES,
								children: "Todas as categorias"
							}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs font-semibold text-muted-foreground",
						children: ["Produto", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "field mt-1 text-sm font-normal text-foreground",
							value: filters.productId,
							onChange: (e) => update({ productId: e.target.value }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Todos os produtos"
							}), productOptions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p.id,
								children: p.name
							}, p.id))]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				role: "group",
				"aria-label": "Períodos rápidos",
				children: [
					{
						l: "Últimos 7 dias",
						d: 7
					},
					{
						l: "Últimos 30 dias",
						d: 30
					},
					{
						l: "Todo o período",
						d: null
					}
				].map(({ l, d }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setLastDays(d),
					className: "min-h-9 rounded-full bg-muted px-4 text-xs font-semibold hover:bg-border",
					children: l
				}, l))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			"aria-label": "Indicadores",
			className: "mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Produtos cadastrados",
					value: String(summary.productCount),
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { size: 20 }),
					tone: "blue"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Estoque baixo",
					value: String(summary.lowStockCount),
					detail: `5 un. ou menos`,
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 20 }),
					tone: "amber"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Movimentações",
					value: String(summary.movementCount),
					detail: "No período",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { size: 20 }),
					tone: "green"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Valor em estoque",
					value: formatBRL(summary.stockValue),
					detail: "Preço × quantidade",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { size: 20 }),
					tone: "violet"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 grid gap-5 lg:grid-cols-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "lg:col-span-3",
				title: "Movimentações por dia",
				subtitle: chart.truncated ? "Mostrando os últimos 31 dias do período." : "Entradas e saídas, em unidades.",
				children: !hasChartData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Nenhuma movimentação no período selecionado." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "img",
					"aria-label": "Gráfico de barras com entradas e saídas de estoque por dia",
					className: "h-64 w-full",
					children: mounted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: chart.points,
							margin: {
								top: 4,
								right: 4,
								left: -16,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									vertical: false,
									stroke: "#e1e7f0"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									tick: { fontSize: 11 },
									tickLine: false,
									interval: "preserveStartEnd",
									minTickGap: 12
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									allowDecimals: false,
									tick: { fontSize: 11 },
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { cursor: { fill: "#eef2f8" } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
									iconType: "square",
									wrapperStyle: { fontSize: 12 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "entradas",
									name: "Entradas",
									fill: "#22a559",
									radius: [
										3,
										3,
										0,
										0
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "saidas",
									name: "Saídas",
									fill: "#3b82f6",
									radius: [
										3,
										3,
										0,
										0
									]
								})
							]
						})
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "lg:col-span-2",
				title: "Valor em estoque por categoria",
				subtitle: "Preço × quantidade de cada categoria.",
				children: donut.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Sem valor em estoque para mostrar." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-4 sm:flex-row lg:flex-col xl:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "img",
						"aria-label": "Gráfico de rosca do valor em estoque por categoria",
						className: "h-44 w-44 shrink-0",
						children: mounted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: donut,
								dataKey: "value",
								nameKey: "name",
								innerRadius: "58%",
								outerRadius: "100%",
								paddingAngle: 2,
								stroke: "none",
								children: donut.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PIE_COLORS[i % PIE_COLORS.length] ?? "#64748b" }, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => formatBRL(Number(v)) })] })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "w-full min-w-0 space-y-1.5 text-sm",
						children: donut.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-2.5 shrink-0 rounded-sm",
									style: { background: PIE_COLORS[i % PIE_COLORS.length] },
									"aria-hidden": "true"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 flex-1 truncate",
									children: d.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold tabular-nums",
									children: [d.percent.toFixed(0), "%"]
								})
							]
						}, d.name))
					})]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "tablist",
			"aria-label": "Tipo de relatório",
			className: "-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1",
			children: REPORTS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				role: "tab",
				id: `tab-${r.id}`,
				"aria-selected": r.id === reportId,
				"aria-controls": "report-panel",
				onClick: () => setReportId(r.id),
				className: `min-h-10 shrink-0 rounded-lg px-4 text-sm font-semibold transition-colors ${r.id === reportId ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-border"}`,
				children: r.label
			}, r.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "tabpanel",
			id: "report-panel",
			"aria-labelledby": `tab-${reportId}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-sm text-muted-foreground",
				children: report.description
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportTable, {
				columns: report.columns,
				rows,
				emptyMessage: report.emptyMessage
			})]
		})] })
	] });
}
//#endregion
export { ReportsPage as component };
