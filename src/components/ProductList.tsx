import { formatBRL, LOW_STOCK_LIMIT, type Product } from "@/data/products";

// Lista de produtos com botões de editar e excluir.
type Props = {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
};

export function ProductList({ products, onEdit, onDelete }: Props) {
  if (products.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">Nenhum produto encontrado.</p>;
  }
  return (
    <ul className="space-y-2">
      {products.map((p) => (
        <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4">
          <div className="min-w-0">
            <p className="truncate font-medium">{p.name}</p>
            <p className="text-sm text-muted-foreground">
              {p.category} · {formatBRL(p.price)}
            </p>
            <p className={`text-sm font-semibold ${p.quantity <= LOW_STOCK_LIMIT ? "text-warning" : "text-primary"}`}>
              {p.quantity} em estoque
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button onClick={() => onEdit(p)} className="rounded-md bg-secondary px-3 py-1.5 text-sm text-secondary-foreground">
              Editar
            </button>
            <button onClick={() => onDelete(p)} className="rounded-md bg-destructive px-3 py-1.5 text-sm text-destructive-foreground">
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
