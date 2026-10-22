import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-D0ihSdFk.js
var initialProducts = [
	{
		id: "1",
		name: "Café em grãos 1kg",
		category: "Alimentos",
		price: 59.9,
		quantity: 24
	},
	{
		id: "2",
		name: "Caneca de cerâmica",
		category: "Utensílios",
		price: 34.5,
		quantity: 3
	},
	{
		id: "3",
		name: "Filtro de papel 103",
		category: "Acessórios",
		price: 8.9,
		quantity: 60
	},
	{
		id: "4",
		name: "Chá verde 50g",
		category: "Alimentos",
		price: 19,
		quantity: 0
	},
	{
		id: "5",
		name: "Moedor manual",
		category: "Utensílios",
		price: 149,
		quantity: 7
	}
];
var formatBRL = (v) => v.toLocaleString("pt-BR", {
	style: "currency",
	currency: "BRL"
});
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/stock-store-C3DkJqhK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRODUCTS_KEY = "stockflow.products.v1";
var MOVEMENTS_KEY = "stockflow.movements.v1";
function isProduct(v) {
	if (typeof v !== "object" || v === null) return false;
	const p = v;
	return typeof p.id === "string" && typeof p.name === "string" && typeof p.category === "string" && typeof p.price === "number" && typeof p.quantity === "number";
}
function isMovement(v) {
	if (typeof v !== "object" || v === null) return false;
	const m = v;
	return typeof m.id === "string" && typeof m.productId === "string" && typeof m.productName === "string" && (m.type === "entrada" || m.type === "saida") && typeof m.quantity === "number" && typeof m.note === "string" && typeof m.createdAt === "string";
}
function readList(key, guard) {
	const raw = localStorage.getItem(key);
	if (raw === null) return null;
	const parsed = JSON.parse(raw);
	if (!Array.isArray(parsed)) throw new Error("formato inválido");
	return parsed.filter(guard);
}
var StockContext = (0, import_react.createContext)(null);
function StockProvider({ children }) {
	const [products, setProducts] = (0, import_react.useState)(initialProducts);
	const [movements, setMovements] = (0, import_react.useState)([]);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		try {
			const savedProducts = readList(PRODUCTS_KEY, isProduct);
			const savedMovements = readList(MOVEMENTS_KEY, isMovement);
			if (savedProducts) setProducts(savedProducts);
			if (savedMovements) setMovements(savedMovements);
		} catch {
			setNotice("Não foi possível carregar os dados salvos. Os dados de demonstração foram mantidos.");
		} finally {
			setReady(true);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		try {
			localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
			localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));
		} catch {
			setNotice("Não foi possível salvar neste navegador. Verifique o espaço disponível.");
		}
	}, [
		products,
		movements,
		ready
	]);
	(0, import_react.useEffect)(() => {
		if (!notice) return;
		const timer = setTimeout(() => setNotice(""), 6e3);
		return () => clearTimeout(timer);
	}, [notice]);
	const saveProduct = (0, import_react.useCallback)((editingId, data) => {
		if (editingId) {
			setProducts((cur) => cur.map((p) => p.id === editingId ? {
				...p,
				...data
			} : p));
			setNotice("Produto atualizado com sucesso.");
		} else {
			setProducts((cur) => [...cur, {
				id: crypto.randomUUID(),
				...data
			}]);
			setNotice("Produto cadastrado com sucesso.");
		}
	}, []);
	const deleteProduct = (0, import_react.useCallback)((product) => {
		setProducts((cur) => cur.filter((p) => p.id !== product.id));
		setNotice("Produto excluído. O histórico de movimentações foi mantido.");
	}, []);
	const registerMovement = (0, import_react.useCallback)((input) => {
		const product = products.find((p) => p.id === input.productId);
		if (!product) return {
			ok: false,
			error: "Selecione um produto."
		};
		if (!Number.isInteger(input.quantity) || input.quantity <= 0) return {
			ok: false,
			error: "Informe uma quantidade inteira maior que zero."
		};
		if (input.type === "saida" && input.quantity > product.quantity) return {
			ok: false,
			error: `Estoque insuficiente. Disponível: ${product.quantity} unidade(s).`
		};
		const movement = {
			id: crypto.randomUUID(),
			productId: product.id,
			productName: product.name,
			type: input.type,
			quantity: input.quantity,
			note: input.note.trim().slice(0, 120),
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		const delta = input.type === "entrada" ? input.quantity : -input.quantity;
		setProducts((cur) => cur.map((p) => p.id === product.id ? {
			...p,
			quantity: p.quantity + delta
		} : p));
		setMovements((cur) => [movement, ...cur]);
		setNotice(`${input.type === "entrada" ? "Entrada" : "Saída"} registrada com sucesso.`);
		return { ok: true };
	}, [products]);
	const clearAllData = (0, import_react.useCallback)(() => {
		setProducts([]);
		setMovements([]);
		setNotice("Todos os dados deste navegador foram apagados.");
	}, []);
	const loadDemoData = (0, import_react.useCallback)(() => {
		setProducts(initialProducts);
		setMovements([]);
		setNotice("Dados de demonstração carregados.");
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		products,
		movements,
		ready,
		notice,
		notify: setNotice,
		dismissNotice: () => setNotice(""),
		saveProduct,
		deleteProduct,
		registerMovement,
		clearAllData,
		loadDemoData
	}), [
		products,
		movements,
		ready,
		notice,
		saveProduct,
		deleteProduct,
		registerMovement,
		clearAllData,
		loadDemoData
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockContext.Provider, {
		value,
		children
	});
}
function useStock() {
	const ctx = (0, import_react.useContext)(StockContext);
	if (!ctx) throw new Error("useStock precisa estar dentro de <StockProvider>.");
	return ctx;
}
//#endregion
export { useStock as n, formatBRL as r, StockProvider as t };
