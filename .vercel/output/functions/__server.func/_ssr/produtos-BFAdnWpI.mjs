import { i as __toESM } from "../_runtime.mjs";
import { n as useStock, r as formatBRL } from "./stock-store-C3DkJqhK.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { c as Search, d as Plus, f as Pencil, g as Download, i as Trash2 } from "../_libs/lucide-react.mjs";
import { a as Panel, c as btnPrimary, i as PageHeader, l as btnSecondary, o as StockPill, r as Modal, t as EmptyState } from "./common-CgnrJkHb.mjs";
import { a as downloadCsv, d as reportToCsv, i as defaultFilters, r as REPORT_BY_ID, t as ALL_CATEGORIES } from "./reports-DKuCUNUe.mjs";
import { t as Route } from "./produtos-TNNzlN14.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/produtos-BFAdnWpI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductForm({ initial, onSave, onCancel }) {
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "");
	const [category, setCategory] = (0, import_react.useState)(initial?.category ?? "");
	const [price, setPrice] = (0, import_react.useState)(String(initial?.price ?? ""));
	const [quantity, setQuantity] = (0, import_react.useState)(String(initial?.quantity ?? ""));
	const [error, setError] = (0, import_react.useState)("");
	function handleSubmit(e) {
		e.preventDefault();
		const p = Number(price);
		const q = Number(quantity);
		if (!name.trim() || !category.trim()) return setError("Preencha nome e categoria.");
		if (isNaN(p) || p < 0) return setError("Preço inválido.");
		if (!Number.isInteger(q) || q < 0) return setError("Quantidade deve ser inteira e ≥ 0.");
		onSave({
			name: name.trim(),
			category: category.trim(),
			price: p,
			quantity: q
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "space-y-3 p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: initial ? "Editar produto" : "Novo produto"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				"aria-label": "Nome do produto",
				autoFocus: true,
				placeholder: "Nome",
				value: name,
				onChange: (e) => setName(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				"aria-label": "Categoria",
				placeholder: "Categoria",
				value: category,
				onChange: (e) => setCategory(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					type: "number",
					step: "0.01",
					"aria-label": "Preço em reais",
					placeholder: "Preço (R$)",
					value: price,
					onChange: (e) => setPrice(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					type: "number",
					"aria-label": "Quantidade",
					placeholder: "Quantidade",
					value: quantity,
					onChange: (e) => setQuantity(e.target.value)
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "min-h-10 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90",
					children: "Salvar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onCancel,
					className: "min-h-10 rounded-lg bg-muted px-4 py-2 text-sm font-medium hover:bg-border",
					children: "Cancelar"
				})]
			})
		]
	});
}
function ProductsTable({ products, onEdit, onDelete }) {
	if (!products.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: "Nenhum produto encontrado. Tente mudar a busca ou cadastre um produto." });
	const actions = (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-end gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => onEdit(p),
			className: "grid size-10 place-items-center rounded-lg hover:bg-muted md:size-9",
			"aria-label": `Editar ${p.name}`,
			title: "Editar",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { size: 16 })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => onDelete(p),
			className: "grid size-10 place-items-center rounded-lg text-destructive hover:bg-destructive/10 md:size-9",
			"aria-label": `Excluir ${p.name}`,
			title: "Excluir",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 16 })
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y md:hidden",
		children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex items-center gap-3 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-bold",
						children: p.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							p.category,
							" · ",
							formatBRL(p.price)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockPill, { quantity: p.quantity })
					})
				]
			}), actions(p)]
		}, p.id))
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hidden overflow-x-auto md:block",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "pb-3 pr-3 font-semibold",
						children: "Produto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "pb-3 pr-3 font-semibold",
						children: "Categoria"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "pb-3 pr-3 font-semibold",
						children: "Estoque"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "pb-3 pr-3 text-right font-semibold",
						children: "Preço"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "hidden pb-3 pr-3 text-right font-semibold lg:table-cell",
						children: "Valor total"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "pb-3 text-right font-semibold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Ações"
						})
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b last:border-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pr-3 font-semibold",
						children: p.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pr-3 text-muted-foreground",
						children: p.category
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pr-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockPill, { quantity: p.quantity })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3 pr-3 text-right tabular-nums",
						children: formatBRL(p.price)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "hidden py-3 pr-3 text-right tabular-nums lg:table-cell",
						children: formatBRL(p.price * p.quantity)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-3",
						children: actions(p)
					})
				]
			}, p.id)) })]
		})
	})] });
}
function ProductsPage() {
	const { q } = Route.useSearch();
	const { products, ready, saveProduct, deleteProduct, notify } = useStock();
	const [search, setSearch] = (0, import_react.useState)(q ?? "");
	const [category, setCategory] = (0, import_react.useState)(ALL_CATEGORIES);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setSearch(q ?? ""), [q]);
	const categories = (0, import_react.useMemo)(() => [ALL_CATEGORIES, ...Array.from(new Set(products.map((p) => p.category))).sort((a, b) => a.localeCompare(b, "pt-BR"))], [products]);
	const activeCategory = categories.includes(category) ? category : ALL_CATEGORIES;
	const filtered = products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(search.trim().toLowerCase())).filter((p) => activeCategory === "Todas" || p.category === activeCategory).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
	function closeForm() {
		setShowForm(false);
		setEditing(null);
	}
	function exportCsv() {
		const def = REPORT_BY_ID.posicao;
		const rows = def.build({
			products,
			movements: []
		}, {
			...defaultFilters(),
			from: "",
			to: ""
		});
		downloadCsv(def.filename, reportToCsv(def.columns, rows));
		notify("Arquivo CSV exportado.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Produtos",
			subtitle: "Gerencie seu estoque de forma simples.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: exportCsv,
				className: btnSecondary,
				disabled: products.length === 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 16 }), " Exportar CSV"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					setEditing(null);
					setShowForm(true);
				},
				className: btnPrimary,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 }), " Novo produto"]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "relative mb-4 block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: "Buscar por produto ou categoria"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						size: 16,
						className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field pl-9",
						placeholder: "Buscar por nome ou categoria...",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1",
				role: "group",
				"aria-label": "Filtrar por categoria",
				children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setCategory(c),
					"aria-pressed": c === activeCategory,
					className: `min-h-9 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors ${c === activeCategory ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-border"}`,
					children: c
				}, c))
			}),
			!ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-10 text-center text-sm text-muted-foreground",
				children: "Carregando seus dados..."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductsTable, {
				products: filtered,
				onEdit: (p) => {
					setEditing(p);
					setShowForm(true);
				},
				onDelete: (p) => {
					if (confirm(`Excluir o produto “${p.name}”? O histórico de movimentações será mantido.`)) deleteProduct(p);
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: [
					"Exibindo ",
					filtered.length,
					" de ",
					products.length,
					" produto(s)."
				]
			})] })
		] }),
		showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
			onClose: closeForm,
			label: editing ? "Editar produto" : "Novo produto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
				initial: editing ?? void 0,
				onSave: (data) => {
					saveProduct(editing?.id ?? null, data);
					closeForm();
				},
				onCancel: closeForm
			}, editing?.id ?? "new")
		})
	] });
}
//#endregion
export { ProductsPage as component };
