import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/produtos-TNNzlN14.js
var $$splitComponentImporter = () => import("./produtos-BFAdnWpI.mjs");
var Route = createFileRoute("/produtos")({
	validateSearch: (search) => typeof search.q === "string" && search.q ? { q: search.q } : {},
	head: () => ({ meta: [{ title: "Produtos — StockFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
