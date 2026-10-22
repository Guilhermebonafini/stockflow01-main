import { i as __toESM } from "../_runtime.mjs";
import { n as useStock } from "./stock-store-C3DkJqhK.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { c as btnPrimary, l as btnSecondary, r as Modal } from "./common-CgnrJkHb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MovementModal-yQp0U3Eq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MovementModal({ onClose }) {
	const { products, registerMovement } = useStock();
	const [error, setError] = (0, import_react.useState)("");
	function handleSubmit(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const result = registerMovement({
			productId: String(form.get("productId") ?? ""),
			type: form.get("type") === "saida" ? "saida" : "entrada",
			quantity: Number(form.get("quantity")),
			note: String(form.get("note") ?? "")
		});
		if (result.ok) onClose();
		else setError(result.error);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		onClose,
		label: "Nova movimentação",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "space-y-4 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold",
						children: "Nova movimentação"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Atualize a quantidade em estoque."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"aria-label": "Fechar",
						className: "grid size-9 place-items-center rounded-lg hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm font-semibold",
					children: ["Produto", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						required: true,
						name: "productId",
						className: "field mt-1 font-normal",
						autoFocus: true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Selecione um produto"
						}), products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: p.id,
							children: [
								p.name,
								" — ",
								p.quantity,
								" disponível(is)"
							]
						}, p.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-semibold",
						children: ["Tipo", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							required: true,
							name: "type",
							className: "field mt-1 font-normal",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "entrada",
								children: "Entrada"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "saida",
								children: "Saída"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-semibold",
						children: ["Quantidade", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							name: "quantity",
							type: "number",
							inputMode: "numeric",
							min: "1",
							step: "1",
							className: "field mt-1 font-normal",
							placeholder: "Ex.: 10"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm font-semibold",
					children: ["Observação (opcional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "note",
						maxLength: 120,
						className: "field mt-1 font-normal",
						placeholder: "Ex.: compra de fornecedor"
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					role: "alert",
					className: "text-sm font-medium text-destructive",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: btnPrimary,
						children: "Registrar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: btnSecondary,
						children: "Cancelar"
					})]
				})
			]
		})
	});
}
//#endregion
export { MovementModal as t };
