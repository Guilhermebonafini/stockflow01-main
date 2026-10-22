import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Plus } from "lucide-react";
import { EmptyState, PageHeader, Panel, btnPrimary } from "@/components/common";
import { MovementModal } from "@/components/MovementModal";
import { useStock } from "@/lib/stock-store";
import { formatDateTime } from "@/lib/reports";

export const Route = createFileRoute("/movimentacoes")({
  head: () => ({ meta: [{ title: "Movimentações — StockFlow" }] }),
  component: MovementsPage,
});

const FILTERS = [
  { id: "todas", label: "Todas" },
  { id: "entrada", label: "Entradas" },
  { id: "saida", label: "Saídas" },
] as const;

function MovementsPage() {
  const { movements, products, ready } = useStock();
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("todas");
  const list = movements.filter((m) => filter === "todas" || m.type === filter);

  const badge = (type: "entrada" | "saida") => (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${type === "entrada" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}
    >
      {type === "entrada" ? <ArrowDownToLine size={13} /> : <ArrowUpFromLine size={13} />}
      {type === "entrada" ? "Entrada" : "Saída"}
    </span>
  );

  return (
    <>
      <PageHeader
        title="Movimentações"
        subtitle="Entradas e saídas registradas no sistema."
        actions={
          <button
            onClick={() => setShow(true)}
            className={btnPrimary}
            disabled={products.length === 0}
          >
            <Plus size={16} /> Nova movimentação
          </button>
        }
      />
      <Panel>
        <div className="mb-4 flex gap-2" role="group" aria-label="Filtrar por tipo">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`min-h-9 rounded-full px-4 text-sm font-semibold transition-colors ${filter === f.id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-border"}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {!ready ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Carregando seus dados...
          </p>
        ) : list.length === 0 ? (
          <EmptyState message="Nenhuma movimentação registrada ainda." />
        ) : (
          <>
            <ul className="divide-y md:hidden">
              {list.map((m) => (
                <li key={m.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    {badge(m.type)}
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(m.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-bold">{m.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.quantity} un.{m.note ? ` · ${m.note}` : ""}
                  </p>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="pb-3 pr-3 font-semibold">Tipo</th>
                    <th className="pb-3 pr-3 font-semibold">Produto</th>
                    <th className="pb-3 pr-3 text-right font-semibold">Quantidade</th>
                    <th className="pb-3 pr-3 font-semibold">Observação</th>
                    <th className="pb-3 font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((m) => (
                    <tr key={m.id} className="border-b last:border-0">
                      <td className="py-3 pr-3">{badge(m.type)}</td>
                      <td className="py-3 pr-3 font-semibold">{m.productName}</td>
                      <td className="py-3 pr-3 text-right tabular-nums">{m.quantity} un.</td>
                      <td className="py-3 pr-3 text-muted-foreground">{m.note || "—"}</td>
                      <td className="py-3 text-muted-foreground">{formatDateTime(m.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Panel>
      {show && <MovementModal onClose={() => setShow(false)} />}
    </>
  );
}
