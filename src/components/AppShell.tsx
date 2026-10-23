import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeftRight,
  BarChart3,
  Home,
  MoreHorizontal,
  Package,
  ScanBarcode,
  Search,
  Settings,
  Store,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useStock } from "@/lib/stock-store";

// Estrutura fixa do sistema: menu lateral (notebook/tablet), barra superior
// e menu inferior (celular). Todas as páginas aparecem dentro dela.

const NAV = [
  { to: "/", label: "Início", icon: Home },
  { to: "/produtos", label: "Produtos", icon: Package },
  { to: "/movimentacoes", label: "Movimentações", icon: ArrowLeftRight },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/pdv", label: "PDV", icon: ScanBarcode },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

const MORE_PATHS: string[] = ["/movimentacoes", "/pdv", "/configuracoes"];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <Sidebar />
      <div className="md:pl-56 lg:pl-60">
        <TopBar />
        <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-5 sm:px-6 md:pb-10 lg:px-8">
          <NoticeBar />
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col bg-sidebar p-4 md:flex lg:w-60">
      <Link to="/" className="mb-8 mt-1 px-1" aria-label="StockFlow — ir para o início">
        <Logo />
      </Link>
      <nav className="flex flex-col gap-1" aria-label="Navegação principal">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-sidebar-foreground transition-colors hover:bg-sidebar-hover hover:text-white"
            activeProps={{ className: "bg-primary text-white hover:bg-primary" }}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>
      <p className="mt-auto rounded-lg bg-sidebar-hover/70 p-3 text-xs leading-relaxed text-sidebar-foreground">
        Seus dados ficam salvos na sua conta.
      </p>
    </aside>
  );
}

function TopBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    void navigate({ to: "/produtos", search: q ? { q } : {} });
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-card/90 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:h-16 lg:px-8">
        <Link to="/" className="md:hidden" aria-label="StockFlow — ir para o início">
          <Logo tone="dark" />
        </Link>
        <form
          onSubmit={handleSearch}
          role="search"
          className="relative hidden max-w-md flex-1 md:block"
        >
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            className="field bg-background pl-9"
            placeholder="Buscar produtos, categorias..."
            aria-label="Buscar produtos e categorias"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold leading-tight">Meu estabelecimento</p>
            <p className="text-xs text-muted-foreground">Dados salvos na sua conta</p>
          </div>
          <span
            className="grid size-9 place-items-center rounded-full bg-secondary text-primary"
            aria-hidden="true"
          >
            <Store size={18} />
          </span>
        </div>
      </div>
    </header>
  );
}

function NoticeBar() {
  const { notice, dismissNotice, loadError, reload } = useStock();
  if (loadError)
    return (
      <div
        role="alert"
        className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
      >
        <span>{loadError} Seus dados não foram apagados.</span>
        <button
          onClick={() => void reload()}
          className="rounded-lg border border-destructive/40 px-3 py-1 font-semibold hover:bg-destructive/10"
        >
          Tentar novamente
        </button>
      </div>
    );
  if (!notice) return null;
  return (
    <div
      role="status"
      className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-primary/20 bg-secondary px-4 py-3 text-sm text-secondary-foreground"
    >
      <span>{notice}</span>
      <button
        onClick={dismissNotice}
        aria-label="Fechar aviso"
        className="grid size-6 shrink-0 place-items-center rounded hover:bg-primary/10"
      >
        <X size={16} />
      </button>
    </div>
  );
}

const bottomItem =
  "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted-foreground transition-colors";

function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [moreOpen, setMoreOpen] = useState(false);

  // Fecha o menu "Mais" ao trocar de página.
  useEffect(() => setMoreOpen(false), [pathname]);

  const moreActive = MORE_PATHS.includes(pathname);
  const items = [NAV[0], NAV[1], NAV[3]] as const;

  return (
    <>
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            className={bottomItem}
            activeProps={{ className: "text-primary" }}
          >
            <Icon size={21} aria-hidden="true" />
            {label}
          </Link>
        ))}
        <button
          onClick={() => setMoreOpen(true)}
          aria-haspopup="dialog"
          className={`${bottomItem} ${moreActive ? "text-primary" : ""}`}
        >
          <MoreHorizontal size={21} aria-hidden="true" />
          Mais
        </button>
      </nav>

      {moreOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-slate-950/50 md:hidden"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setMoreOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setMoreOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mais opções"
            className="w-full rounded-t-2xl bg-card p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-bold">Mais opções</p>
              <button
                autoFocus
                onClick={() => setMoreOpen(false)}
                aria-label="Fechar"
                className="grid size-10 place-items-center rounded-lg hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col">
              {[NAV[2], NAV[4], NAV[5]].map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex min-h-12 items-center gap-3 rounded-lg px-2 text-sm font-semibold hover:bg-muted"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-secondary text-primary">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
