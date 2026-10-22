import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as Banknote, o as ShoppingCart, u as Printer, y as Barcode } from "../_libs/lucide-react.mjs";
import { a as Panel, i as PageHeader } from "./common-CgnrJkHb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pdv-B_3AFwHK.js
var import_jsx_runtime = require_jsx_runtime();
var PLANNED = [
	{
		icon: Barcode,
		title: "Leitor de código de barras",
		text: "Passe o produto no leitor e ele entra no carrinho."
	},
	{
		icon: ShoppingCart,
		title: "Carrinho e total",
		text: "O valor da venda é calculado automaticamente."
	},
	{
		icon: Banknote,
		title: "Dinheiro, Pix e cartão",
		text: "Registro da forma de pagamento de cada venda."
	},
	{
		icon: Printer,
		title: "Comprovante",
		text: "Impressão em impressora térmica."
	}
];
function PdvPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "PDV",
		subtitle: "O caixa integrado ao estoque ainda não está disponível."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "Em desenvolvimento",
		subtitle: "Estas funções serão liberadas depois que o estoque e os relatórios estiverem validados.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3 sm:grid-cols-2",
			children: PLANNED.map(({ icon: Icon, title, text }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-3 rounded-lg bg-muted/60 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						size: 20,
						"aria-hidden": "true"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: text
				})] })]
			}, title))
		})
	})] });
}
//#endregion
export { PdvPage as component };
