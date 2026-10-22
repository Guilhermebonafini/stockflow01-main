import { r as formatBRL } from "./stock-store-C3DkJqhK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-DKuCUNUe.js
var ALL_CATEGORIES = "Todas";
function toInputDate(d) {
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const dd = String(d.getDate()).padStart(2, "0");
	return `${d.getFullYear()}-${mm}-${dd}`;
}
function parseDay(iso, endOfDay) {
	if (!iso) return null;
	const d = /* @__PURE__ */ new Date(`${iso}T${endOfDay ? "23:59:59.999" : "00:00:00"}`);
	return Number.isNaN(d.getTime()) ? null : d;
}
function defaultFilters(today = /* @__PURE__ */ new Date()) {
	const start = new Date(today);
	start.setDate(start.getDate() - 6);
	return {
		from: toInputDate(start),
		to: toInputDate(today),
		category: ALL_CATEGORIES,
		productId: ""
	};
}
function filterProducts(products, f) {
	return products.filter((p) => (f.category === "Todas" || p.category === f.category) && (!f.productId || p.id === f.productId));
}
function filterMovements(data, f) {
	const from = parseDay(f.from, false)?.getTime();
	const to = parseDay(f.to, true)?.getTime();
	const categoryById = new Map(data.products.map((p) => [p.id, p.category]));
	return data.movements.filter((m) => {
		const t = new Date(m.createdAt).getTime();
		if (Number.isNaN(t)) return false;
		if (from !== void 0 && t < from) return false;
		if (to !== void 0 && t > to) return false;
		if (f.productId && m.productId !== f.productId) return false;
		if (f.category !== "Todas" && categoryById.get(m.productId) !== f.category) return false;
		return true;
	});
}
function stockStatus(quantity) {
	if (quantity <= 0) return "Sem estoque";
	return quantity <= 5 ? "Estoque baixo" : "Normal";
}
function summarize(data, f) {
	const products = filterProducts(data.products, f);
	return {
		productCount: products.length,
		lowStockCount: products.filter((p) => p.quantity <= 5).length,
		movementCount: filterMovements(data, f).length,
		stockValue: products.reduce((sum, p) => sum + p.price * p.quantity, 0)
	};
}
function movementsByDay(movements, f, today = /* @__PURE__ */ new Date()) {
	const end = parseDay(f.to, true) ?? today;
	const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
	let start = parseDay(f.from, false);
	if (!start) {
		const times = movements.map((m) => new Date(m.createdAt).getTime()).filter((t) => !Number.isNaN(t));
		start = times.length ? new Date(Math.min(...times)) : /* @__PURE__ */ new Date(endDay.getTime() - 5184e5);
	}
	let cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
	if (cursor > endDay) return {
		points: [],
		truncated: false
	};
	const truncated = Math.round((endDay.getTime() - cursor.getTime()) / 864e5) + 1 > 31;
	if (truncated) cursor = new Date(endDay.getFullYear(), endDay.getMonth(), endDay.getDate() - 30);
	const byKey = /* @__PURE__ */ new Map();
	for (const m of movements) {
		const key = toInputDate(new Date(m.createdAt));
		const acc = byKey.get(key) ?? {
			entradas: 0,
			saidas: 0
		};
		if (m.type === "entrada") acc.entradas += m.quantity;
		else acc.saidas += m.quantity;
		byKey.set(key, acc);
	}
	const points = [];
	while (cursor <= endDay) {
		const key = toInputDate(cursor);
		const v = byKey.get(key);
		points.push({
			key,
			label: `${String(cursor.getDate()).padStart(2, "0")}/${String(cursor.getMonth() + 1).padStart(2, "0")}`,
			entradas: v?.entradas ?? 0,
			saidas: v?.saidas ?? 0
		});
		cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
	}
	return {
		points,
		truncated
	};
}
function valueByCategory(products) {
	const totals = /* @__PURE__ */ new Map();
	for (const p of products) totals.set(p.category, (totals.get(p.category) ?? 0) + p.price * p.quantity);
	const total = [...totals.values()].reduce((a, b) => a + b, 0);
	if (total <= 0) return [];
	return [...totals.entries()].filter(([, value]) => value > 0).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({
		name,
		value,
		percent: value / total * 100
	}));
}
var byName = (a, b) => a.name.localeCompare(b.name, "pt-BR");
var statusTone = (v) => v === "Normal" ? "good" : v === "Estoque baixo" ? "warn" : v === "Sem estoque" ? "bad" : void 0;
var REPORTS = [
	{
		id: "posicao",
		label: "Posição do estoque",
		description: "Situação atual de cada produto. O período não se aplica a este relatório.",
		usesPeriod: false,
		filename: "stockflow-posicao-estoque.csv",
		emptyMessage: "Nenhum produto encontrado com estes filtros.",
		columns: [
			{
				key: "produto",
				label: "Produto",
				type: "text"
			},
			{
				key: "categoria",
				label: "Categoria",
				type: "text"
			},
			{
				key: "quantidade",
				label: "Estoque",
				type: "integer"
			},
			{
				key: "preco",
				label: "Preço",
				type: "money"
			},
			{
				key: "valor",
				label: "Valor em estoque",
				type: "money"
			},
			{
				key: "situacao",
				label: "Situação",
				type: "text",
				tone: statusTone
			}
		],
		build: (data, f) => filterProducts(data.products, f).sort(byName).map((p) => ({
			produto: p.name,
			categoria: p.category,
			quantidade: p.quantity,
			preco: p.price,
			valor: p.price * p.quantity,
			situacao: stockStatus(p.quantity)
		}))
	},
	{
		id: "movimentacoes",
		label: "Movimentações",
		description: "Entradas e saídas registradas no período selecionado.",
		usesPeriod: true,
		filename: "stockflow-movimentacoes.csv",
		emptyMessage: "Nenhuma movimentação registrada neste período.",
		columns: [
			{
				key: "data",
				label: "Data",
				type: "datetime"
			},
			{
				key: "tipo",
				label: "Tipo",
				type: "text",
				tone: (v) => v === "Entrada" ? "good" : v === "Saída" ? "info" : void 0
			},
			{
				key: "produto",
				label: "Produto",
				type: "text"
			},
			{
				key: "categoria",
				label: "Categoria",
				type: "text"
			},
			{
				key: "quantidade",
				label: "Quantidade",
				type: "integer"
			},
			{
				key: "observacao",
				label: "Observação",
				type: "text"
			}
		],
		build: (data, f) => {
			const categoryById = new Map(data.products.map((p) => [p.id, p.category]));
			return filterMovements(data, f).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((m) => ({
				data: m.createdAt,
				tipo: m.type === "entrada" ? "Entrada" : "Saída",
				produto: m.productName,
				categoria: categoryById.get(m.productId) ?? "—",
				quantidade: m.quantity,
				observacao: m.note || "—"
			}));
		}
	},
	{
		id: "estoque-baixo",
		label: "Estoque baixo",
		description: `Produtos com 5 unidades ou menos. O período não se aplica a este relatório.`,
		usesPeriod: false,
		filename: "stockflow-estoque-baixo.csv",
		emptyMessage: "Nenhum produto com estoque baixo. Tudo certo por aqui.",
		columns: [
			{
				key: "produto",
				label: "Produto",
				type: "text"
			},
			{
				key: "categoria",
				label: "Categoria",
				type: "text"
			},
			{
				key: "atual",
				label: "Estoque atual",
				type: "integer",
				tone: (v) => v === 0 ? "bad" : "warn"
			},
			{
				key: "limite",
				label: "Limite de alerta",
				type: "integer"
			}
		],
		build: (data, f) => filterProducts(data.products, f).filter((p) => p.quantity <= 5).sort((a, b) => a.quantity - b.quantity || byName(a, b)).map((p) => ({
			produto: p.name,
			categoria: p.category,
			atual: p.quantity,
			limite: 5
		}))
	}
];
var REPORT_BY_ID = {
	posicao: REPORTS[0],
	movimentacoes: REPORTS[1],
	"estoque-baixo": REPORTS[2]
};
function formatDateTime(iso) {
	const d = new Date(iso);
	return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("pt-BR", {
		dateStyle: "short",
		timeStyle: "short"
	});
}
function formatCell(col, value) {
	if (value === void 0) return "—";
	if (col.type === "money") return formatBRL(Number(value));
	if (col.type === "integer") return String(value);
	if (col.type === "datetime") return formatDateTime(String(value));
	return String(value);
}
function csvCell(col, value) {
	let text;
	if (value === void 0) text = "";
	else if (col.type === "money") text = Number(value).toFixed(2).replace(".", ",");
	else if (col.type === "datetime") text = formatDateTime(String(value));
	else text = String(value);
	if (col.type === "text" && /^[=+\-@\t\r]/.test(text)) text = `'${text}`;
	return `"${text.replaceAll("\"", "\"\"")}"`;
}
function reportToCsv(columns, rows) {
	return "﻿" + [columns.map((c) => `"${c.label.replaceAll("\"", "\"\"")}"`).join(";"), ...rows.map((row) => columns.map((c) => csvCell(c, row[c.key])).join(";"))].join("\r\n");
}
function downloadCsv(filename, csv) {
	const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}
//#endregion
export { downloadCsv as a, formatCell as c, reportToCsv as d, summarize as f, defaultFilters as i, formatDateTime as l, valueByCategory as m, REPORTS as n, filterMovements as o, toInputDate as p, REPORT_BY_ID as r, filterProducts as s, ALL_CATEGORIES as t, movementsByDay as u };
