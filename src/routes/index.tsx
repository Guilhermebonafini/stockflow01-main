import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  Package,
  Plus,
  Wallet,
  ArrowLeftRight,
} from "lucide-react";
import { LOW_STOCK_LIMIT, formatBRL } from "@/data/products";
import { EmptyState, KpiCard, PageHeader, Panel, StockPill, btnPrimary } from "@/components/common";
import { MovementModal } from "@/components/MovementModal";
import { useStock } from "@/lib/stock-store";
import { formatDateTime } from "@/lib/reports";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início — StockFlow" },
      {
        name: "description",
        content: "Controle o estoque do seu pequeno negócio de forma simples.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { products, movements, ready } = useStock();
  const [showMovement, setShowMovement] = useState(false);

  const lowStock = useMemo(
    () =>
      products.filter((p) => p.quantity <= LOW_STOCK_LIMIT).sort((a, b) => a.quantity - b.quantity),
    [products],
  );
  const stockValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const last7Days = useMemo(() => {
    const since = Date.now() - 7 * 86_400_000;
    return movements.filter((m) => new Date(m.createdAt).getTime() >= since).length;
  }, [movements]);

  if (!ready)
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">Carregando seus dados...</p>
    );

  return (
    <>
      <PageHeader
        title="Olá! Bem-vindo ao seu estoque."
        subtitle="Veja como está o seu estoque hoje."
        actions={
          <button
            onClick={() => setShowMovement(true)}
            className={btnPrimary}
            disabled={products.length === 0}
          >
            <Plus size={16} /> Nova movimentação
          </button>
        }
      />

      <section aria-label="Indicadores" className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Produtos cadastrados"
          value={String(products.length)}
          icon={<Package size={20} />}
          tone="blue"
        />
        <KpiCard
          label="Estoque baixo"
          value={String(lowStock.length)}
          detail={`${LOW_STOCK_LIMIT} un. ou menos`}
          icon={<AlertTriangle size={20} />}
          tone="amber"
        />
        <KpiCard
          label="Movimentações"
          value={String(last7Days)}
          detail="Últimos 7 dias"
          icon={<ArrowLeftRight size={20} />}
          tone="green"
        />
        <KpiCard
          label="Valor em estoque"
          value={formatBRL(stockValue)}
          detail="Preço × quantidade"
          icon={<Wallet size={20} />}
          tone="violet"
        />
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel
          title="Produtos com estoque baixo"
          action={
            <Link to="/relatorios" className="text-sm font-semibold text-primary hover:underline">
              Ver relatório
            </Link>
          }
        >
          {lowStock.length === 0 ? (
            <EmptyState
              message={
                products.length
                  ? "Nenhum produto com estoque baixo."
                  : "Nenhum produto cadastrado ainda."
              }
            />
          ) : (
            <ul className="divide-y">
              {lowStock.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                  <StockPill quantity={p.quantity} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Movimentações recentes"
          action={
            <Link
              to="/movimentacoes"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Ver todas
            </Link>
          }
        >
          {movements.length === 0 ? (
            <EmptyState message="Nenhuma movimentação registrada ainda." />
          ) : (
            <ul className="divide-y">
              {movements.slice(0, 5).map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-2.5">
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-lg ${m.type === "entrada" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}
                  >
                    {m.type === "entrada" ? (
                      <ArrowDownToLine size={16} />
                    ) : (
                      <ArrowUpFromLine size={16} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {m.type === "entrada" ? "Entrada" : "Saída"} · {m.productName}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(m.createdAt)}</p>
                  </div>
                  <span
                    className={`text-sm font-bold tabular-nums ${m.type === "entrada" ? "text-success" : "text-destructive"}`}
                  >
                    {m.type === "entrada" ? "+" : "−"}
                    {m.quantity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {products.length === 0 && (
        <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
          <Boxes size={16} /> Comece cadastrando seus produtos em{" "}
          <Link to="/produtos" className="font-semibold text-primary hover:underline">
            Produtos
          </Link>
          .
        </p>
      )}

      {showMovement && <MovementModal onClose={() => setShowMovement(false)} />}
    </>
  );
}
