import { Pencil, Trash2 } from "lucide-react";
import { formatBRL, type Product } from "@/data/products";
import { EmptyState, StockPill } from "@/components/common";

type Props = { products: Product[]; onEdit: (p: Product) => void; onDelete: (p: Product) => void };

// Tabela em telas médias e grandes; lista de cartões no celular.
export function ProductsTable({ products, onEdit, onDelete }: Props) {
  if (!products.length) {
    return (
      <EmptyState message="Nenhum produto encontrado. Tente mudar a busca ou cadastre um produto." />
    );
  }
  const actions = (p: Product) => (
    <div className="flex justify-end gap-1">
      <button
        onClick={() => onEdit(p)}
        className="grid size-10 place-items-center rounded-lg hover:bg-muted md:size-9"
        aria-label={`Editar ${p.name}`}
        title="Editar"
      >
        <Pencil size={16} />
      </button>
      <button
        onClick={() => onDelete(p)}
        className="grid size-10 place-items-center rounded-lg text-destructive hover:bg-destructive/10 md:size-9"
        aria-label={`Excluir ${p.name}`}
        title="Excluir"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <>
      <ul className="divide-y md:hidden">
        {products.map((p) => (
          <li key={p.id} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {p.category} · {formatBRL(p.price)}
              </p>
              <div className="mt-1.5">
                <StockPill quantity={p.quantity} />
              </div>
            </div>
            {actions(p)}
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th className="pb-3 pr-3 font-semibold">Produto</th>
              <th className="pb-3 pr-3 font-semibold">Categoria</th>
              <th className="pb-3 pr-3 font-semibold">Estoque</th>
              <th className="pb-3 pr-3 text-right font-semibold">Preço</th>
              <th className="hidden pb-3 pr-3 text-right font-semibold lg:table-cell">
                Valor total
              </th>
              <th className="pb-3 text-right font-semibold">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="py-3 pr-3 font-semibold">{p.name}</td>
                <td className="py-3 pr-3 text-muted-foreground">{p.category}</td>
                <td className="py-3 pr-3">
                  <StockPill quantity={p.quantity} />
                </td>
                <td className="py-3 pr-3 text-right tabular-nums">{formatBRL(p.price)}</td>
                <td className="hidden py-3 pr-3 text-right tabular-nums lg:table-cell">
                  {formatBRL(p.price * p.quantity)}
                </td>
                <td className="py-3">{actions(p)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
