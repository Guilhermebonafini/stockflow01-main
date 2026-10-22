import { n as useStock } from "./stock-store-C3DkJqhK.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as Panel, i as PageHeader, l as btnSecondary, s as btnDanger } from "./common-CgnrJkHb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/configuracoes-CUl5NuBD.js
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { products, movements, clearAllData, loadDemoData } = useStock();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Configurações",
		subtitle: "Gerencie os dados salvos neste navegador."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: "Dados deste navegador",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-2xl text-sm text-muted-foreground",
				children: "O StockFlow guarda os produtos e as movimentações neste aparelho. Eles não são enviados a nenhum servidor e não aparecem em outros aparelhos nem para outras pessoas."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm font-semibold",
				children: [
					"Salvos agora: ",
					products.length,
					" produto(s) e ",
					movements.length,
					" movimentação(ões)."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: btnSecondary,
					onClick: () => {
						if (confirm("Substituir todos os dados pelos produtos de demonstração? O histórico será apagado.")) loadDemoData();
					},
					children: "Carregar dados de demonstração"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: btnDanger,
					onClick: () => {
						if (confirm("Apagar TODOS os produtos e movimentações deste navegador? Esta ação não pode ser desfeita.")) clearAllData();
					},
					children: "Apagar todos os dados"
				})]
			})
		]
	})] });
}
//#endregion
export { SettingsPage as component };
