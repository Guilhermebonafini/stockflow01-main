import { i as __toESM } from "../_runtime.mjs";
import { n as useStock, t as StockProvider } from "./stock-store-C3DkJqhK.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { S as ArrowLeftRight, _ as ChartColumn, a as Store, c as Search, h as Ellipsis, l as ScanBarcode, m as House, p as Package, s as Settings, t as X } from "../_libs/lucide-react.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useNavigate, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$6 } from "./produtos-TNNzlN14.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BNB5aOsp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-C6NpRw1o.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
function Logo({ className = "", tone = "light" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-2 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 40 40",
			className: "size-8 shrink-0",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "4",
					y: "24",
					width: "7",
					height: "12",
					rx: "1.5",
					fill: "#2F7BFF"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "15",
					y: "17",
					width: "7",
					height: "19",
					rx: "1.5",
					fill: "#2F7BFF"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "26",
					y: "11",
					width: "7",
					height: "25",
					rx: "1.5",
					fill: "#2F7BFF"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M29.5 0.5 L37.5 9 H21.5 Z",
					fill: "#2F7BFF"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: `text-xl font-extrabold tracking-tight ${tone === "light" ? "text-white" : "text-[#0b2250]"}`,
			children: ["Stock", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[#3b8bff]",
				children: "Flow"
			})]
		})]
	});
}
var NAV = [
	{
		to: "/",
		label: "Início",
		icon: House
	},
	{
		to: "/produtos",
		label: "Produtos",
		icon: Package
	},
	{
		to: "/movimentacoes",
		label: "Movimentações",
		icon: ArrowLeftRight
	},
	{
		to: "/relatorios",
		label: "Relatórios",
		icon: ChartColumn
	},
	{
		to: "/pdv",
		label: "PDV",
		icon: ScanBarcode
	},
	{
		to: "/configuracoes",
		label: "Configurações",
		icon: Settings
	}
];
var MORE_PATHS = [
	"/movimentacoes",
	"/pdv",
	"/configuracoes"
];
function AppShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:pl-56 lg:pl-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "mx-auto w-full max-w-7xl px-4 pb-28 pt-5 sm:px-6 md:pb-10 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoticeBar, {}), children]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})
		]
	});
}
function Sidebar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "fixed inset-y-0 left-0 z-40 hidden w-56 flex-col bg-sidebar p-4 md:flex lg:w-60",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mb-8 mt-1 px-1",
				"aria-label": "StockFlow — ir para o início",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex flex-col gap-1",
				"aria-label": "Navegação principal",
				children: NAV.map(({ to, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to,
					activeOptions: { exact: true },
					className: "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-sidebar-foreground transition-colors hover:bg-sidebar-hover hover:text-white",
					activeProps: { className: "bg-primary text-white hover:bg-primary" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						size: 18,
						"aria-hidden": "true"
					}), label]
				}, to))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-auto rounded-lg bg-sidebar-hover/70 p-3 text-xs leading-relaxed text-sidebar-foreground",
				children: "Seus dados ficam salvos neste navegador."
			})
		]
	});
}
function TopBar() {
	const navigate = useNavigate();
	const [query, setQuery] = (0, import_react.useState)("");
	function handleSearch(e) {
		e.preventDefault();
		const q = query.trim();
		navigate({
			to: "/produtos",
			search: q ? { q } : {}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-30 border-b bg-card/90 pt-[env(safe-area-inset-top)] backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:h-16 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "md:hidden",
					"aria-label": "StockFlow — ir para o início",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { tone: "dark" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSearch,
					role: "search",
					className: "relative hidden max-w-md flex-1 md:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						size: 16,
						className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field bg-background pl-9",
						placeholder: "Buscar produtos, categorias...",
						"aria-label": "Buscar produtos e categorias",
						value: query,
						onChange: (e) => setQuery(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden text-right sm:block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold leading-tight",
							children: "Meu estabelecimento"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Dados salvos neste navegador"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-9 place-items-center rounded-full bg-secondary text-primary",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { size: 18 })
					})]
				})
			]
		})
	});
}
function NoticeBar() {
	const { notice, dismissNotice } = useStock();
	if (!notice) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "status",
		className: "mb-5 flex items-start justify-between gap-3 rounded-lg border border-primary/20 bg-secondary px-4 py-3 text-sm text-secondary-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: notice }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: dismissNotice,
			"aria-label": "Fechar aviso",
			className: "grid size-6 shrink-0 place-items-center rounded hover:bg-primary/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 })
		})]
	});
}
var bottomItem = "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted-foreground transition-colors";
function BottomNav() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [moreOpen, setMoreOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMoreOpen(false), [pathname]);
	const moreActive = MORE_PATHS.includes(pathname);
	const items = [
		NAV[0],
		NAV[1],
		NAV[3]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		"aria-label": "Navegação principal",
		className: "fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden",
		children: [items.map(({ to, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to,
			activeOptions: { exact: true },
			className: bottomItem,
			activeProps: { className: "text-primary" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				size: 21,
				"aria-hidden": "true"
			}), label]
		}, to)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setMoreOpen(true),
			"aria-haspopup": "dialog",
			className: `${bottomItem} ${moreActive ? "text-primary" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, {
				size: 21,
				"aria-hidden": "true"
			}), "Mais"]
		})]
	}), moreOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end bg-slate-950/50 md:hidden",
		onMouseDown: (e) => {
			if (e.target === e.currentTarget) setMoreOpen(false);
		},
		onKeyDown: (e) => {
			if (e.key === "Escape") setMoreOpen(false);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Mais opções",
			className: "w-full rounded-t-2xl bg-card p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold",
					children: "Mais opções"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					autoFocus: true,
					onClick: () => setMoreOpen(false),
					"aria-label": "Fechar",
					className: "grid size-10 place-items-center rounded-lg hover:bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col",
				children: [
					NAV[2],
					NAV[4],
					NAV[5]
				].map(({ to, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to,
					className: "flex min-h-12 items-center gap-3 rounded-lg px-2 text-sm font-semibold hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-9 place-items-center rounded-lg bg-secondary text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							size: 18,
							"aria-hidden": "true"
						})
					}), label]
				}, to))
			})]
		})
	})] });
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Página não encontrada"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "A página que você procura não existe ou foi movida."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Ir para o início"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Esta página não carregou"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Algo deu errado. Tente atualizar a página ou volte para o início."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Tentar novamente"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Ir para o início"
					})]
				})
			]
		})
	});
}
var Route$5 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: "StockFlow" },
			{
				name: "description",
				content: "Controle de estoque para pequenos negócios."
			},
			{
				property: "og:title",
				content: "StockFlow"
			},
			{
				property: "og:description",
				content: "Controle de estoque para pequenos negócios."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$5.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StockProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) })
	});
}
var $$splitComponentImporter$4 = () => import("./routes-CbU3HCQu.mjs");
var Route$4 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Início — StockFlow" }, {
		name: "description",
		content: "Controle o estoque do seu pequeno negócio de forma simples."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./configuracoes-CUl5NuBD.mjs");
var Route$3 = createFileRoute("/configuracoes")({
	head: () => ({ meta: [{ title: "Configurações — StockFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./movimentacoes-DQgLrekk.mjs");
var Route$2 = createFileRoute("/movimentacoes")({
	head: () => ({ meta: [{ title: "Movimentações — StockFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./pdv-B_3AFwHK.mjs");
var Route$1 = createFileRoute("/pdv")({
	head: () => ({ meta: [{ title: "PDV — StockFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./relatorios-QhLIZSQT.mjs");
var Route = createFileRoute("/relatorios")({
	head: () => ({ meta: [{ title: "Relatórios — StockFlow" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$4.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$5
	}),
	ConfiguracoesRoute: Route$3.update({
		id: "/configuracoes",
		path: "/configuracoes",
		getParentRoute: () => Route$5
	}),
	MovimentacoesRoute: Route$2.update({
		id: "/movimentacoes",
		path: "/movimentacoes",
		getParentRoute: () => Route$5
	}),
	PdvRoute: Route$1.update({
		id: "/pdv",
		path: "/pdv",
		getParentRoute: () => Route$5
	}),
	ProdutosRoute: Route$6.update({
		id: "/produtos",
		path: "/produtos",
		getParentRoute: () => Route$5
	}),
	RelatoriosRoute: Route.update({
		id: "/relatorios",
		path: "/relatorios",
		getParentRoute: () => Route$5
	})
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
