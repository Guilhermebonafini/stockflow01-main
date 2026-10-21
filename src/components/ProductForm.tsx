import { useState, type FormEvent } from "react";
import type { Product } from "@/data/products";

// Formulário usado tanto para cadastrar quanto para editar.
type Props = {
  initial?: Product | undefined;
  onSave: (data: Omit<Product, "id">) => void;
  onCancel: () => void;
};

export function ProductForm({ initial, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [quantity, setQuantity] = useState(String(initial?.quantity ?? ""));
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const p = Number(price);
    const q = Number(quantity);
    if (!name.trim() || !category.trim()) return setError("Preencha nome e categoria.");
    if (isNaN(p) || p < 0) return setError("Preço inválido.");
    if (!Number.isInteger(q) || q < 0) return setError("Quantidade deve ser inteira e ≥ 0.");
    onSave({ name: name.trim(), category: category.trim(), price: p, quantity: q });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border bg-card p-4">
      <h2 className="text-lg font-semibold">{initial ? "Editar produto" : "Novo produto"}</h2>
      <input className="field" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="field" placeholder="Categoria" value={category} onChange={(e) => setCategory(e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <input className="field" type="number" step="0.01" placeholder="Preço (R$)" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input className="field" type="number" placeholder="Quantidade" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground">
          Salvar
        </button>
        <button type="button" onClick={onCancel} className="rounded-md bg-muted px-4 py-2">
          Cancelar
        </button>
      </div>
    </form>
  );
}
