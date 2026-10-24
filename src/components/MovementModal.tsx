import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Modal, btnPrimary, btnSecondary } from "@/components/common";
import { useStock } from "@/lib/stock-store";

// Formulário de entrada/saída de estoque, usado em Início e em Movimentações.
export function MovementModal({ onClose }: { onClose: () => void }) {
  const { products, registerMovement } = useStock();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError("");
    setBusy(true);
    const result = await registerMovement({
      productId: String(form.get("productId") ?? ""),
      type: form.get("type") === "saida" ? "saida" : "entrada",
      quantity: Number(form.get("quantity")),
      note: String(form.get("note") ?? ""),
    });
    setBusy(false);
    if (result.ok) onClose();
    else setError(result.error);
  }

  return (
    <Modal onClose={onClose} label="Nova movimentação">
      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">Nova movimentação</h2>
            <p className="text-sm text-muted-foreground">Atualize a quantidade em estoque.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid size-9 place-items-center rounded-lg hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>
        <label className="block text-sm font-semibold">
          Produto
          <select required name="productId" className="field mt-1 font-normal" autoFocus>
            <option value="">Selecione um produto</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.quantity} disponível(is)
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold">
            Tipo
            <select required name="type" className="field mt-1 font-normal">
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Quantidade
            <input
              required
              name="quantity"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              className="field mt-1 font-normal"
              placeholder="Ex.: 10"
            />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Observação (opcional)
          <input
            name="note"
            maxLength={120}
            className="field mt-1 font-normal"
            placeholder="Ex.: compra de fornecedor"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button type="submit" disabled={busy} className={btnPrimary}>
            {busy ? "Salvando..." : "Registrar"}
          </button>
          <button type="button" onClick={onClose} className={btnSecondary}>
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}
