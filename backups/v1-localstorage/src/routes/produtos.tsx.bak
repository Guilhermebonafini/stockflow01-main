import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, Plus, Search } from "lucide-react";
import type { Product } from "@/data/products";
import { Modal, PageHeader, Panel, btnPrimary, btnSecondary } from "@/components/common";
import { ProductForm } from "@/components/ProductForm";
import { ProductsTable } from "@/components/ProductsTable";
import { useStock } from "@/lib/stock-store";
import {
  ALL_CATEGORIES,
  REPORT_BY_ID,
  downloadCsv,
  reportToCsv,
  defaultFilters,
} from "@/lib/reports";

export const Route = createFileRoute("/produtos")({
  // "q" vem da busca do topo da página (opcional).
  validateSearch: (search: { q?: unknown }): { q?: string } =>
    typeof search.q === "string" && search.q ? { q: search.q } : {},
  head: () => ({ meta: [{ title: "Produtos — StockFlow" }] }),
  component: ProductsPage,
});

function ProductsPage() {
  const { q } = Route.useSearch();
  const { products, ready, saveProduct, deleteProduct, notify } = useStock();
  const [search, setSearch] = useState(q ?? "");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => setSearch(q ?? ""), [q]);

  const categories = useMemo(
    () => [
      ALL_CATEGORIES,
      ...Array.from(new Set(products.map((p) => p.category))).sort((a, b) =>
        a.localeCompare(b, "pt-BR"),
      ),
    ],
    [products],
  );
  // Se a categoria escolhida deixou de existir (ex.: produto excluído), volta para "Todas".
  const activeCategory = categories.includes(category) ? category : ALL_CATEGORIES;

  const filtered = products
    .filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((p) => activeCategory === ALL_CATEGORIES || p.category === activeCategory)
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  function exportCsv() {
    const def = REPORT_BY_ID.posicao;
    const rows = def.build({ products, movements: [] }, { ...defaultFilters(), from: "", to: "" });
    downloadCsv(def.filename, reportToCsv(def.columns, rows));
    notify("Arquivo CSV exportado.");
  }

  return (
    <>
      <PageHeader
        title="Produtos"
        subtitle="Gerencie seu estoque de forma simples."
        actions={
          <>
            <button onClick={exportCsv} className={btnSecondary} disabled={products.length === 0}>
              <Download size={16} /> Exportar CSV
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className={btnPrimary}
            >
              <Plus size={16} /> Novo produto
            </button>
          </>
        }
      />

      <Panel>
        <label className="relative mb-4 block">
          <span className="sr-only">Buscar por produto ou categoria</span>
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            className="field pl-9"
            placeholder="Buscar por nome ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <div
          className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1"
          role="group"
          aria-label="Filtrar por categoria"
        >
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={c === activeCategory}
              className={`min-h-9 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors ${c === activeCategory ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-border"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {!ready ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Carregando seus dados...
          </p>
        ) : (
          <>
            <ProductsTable
              products={filtered}
              onEdit={(p) => {
                setEditing(p);
                setShowForm(true);
              }}
              onDelete={(p) => {
                if (
                  confirm(
                    `Excluir o produto “${p.name}”? O histórico de movimentações será mantido.`,
                  )
                )
                  deleteProduct(p);
              }}
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Exibindo {filtered.length} de {products.length} produto(s).
            </p>
          </>
        )}
      </Panel>

      {showForm && (
        <Modal onClose={closeForm} label={editing ? "Editar produto" : "Novo produto"}>
          <ProductForm
            key={editing?.id ?? "new"}
            initial={editing ?? undefined}
            onSave={(data) => {
              saveProduct(editing?.id ?? null, data);
              closeForm();
            }}
            onCancel={closeForm}
          />
        </Modal>
      )}
    </>
  );
}
