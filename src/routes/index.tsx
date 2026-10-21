import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Boxes,
  LayoutDashboard, Package, Plus, Search, Trash2, Pencil, X, Download,
} from "lucide-react";
import { initialProducts, formatBRL, LOW_STOCK_LIMIT, type Product } from "@/data/products";
import { ProductForm } from "@/components/ProductForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StockFlow — Controle de estoque" },
      { name: "description", content: "Controle o estoque do seu pequeno negócio de forma simples." },
    ],
  }),
  component: Dashboard,
});

type Movement = {
  id: string;
  productId: string;
  productName: string;
  type: "entrada" | "saida";
  quantity: number;
  note: string;
  createdAt: string;
};

type Tab = "dashboard" | "products" | "movements";
const PRODUCTS_KEY = "stockflow.products.v1";
const MOVEMENTS_KEY = "stockflow.movements.v1";

function Dashboard() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [editing, setEditing] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(PRODUCTS_KEY);
      const savedMovements = localStorage.getItem(MOVEMENTS_KEY);
      if (savedProducts) setProducts(JSON.parse(savedProducts) as Product[]);
      if (savedMovements) setMovements(JSON.parse(savedMovements) as Movement[]);
    } catch {
      setNotice("Não foi possível carregar os dados locais. Os dados de demonstração estão disponíveis.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));
  }, [products, movements, ready]);

  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
  const totalValue = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  const lowStockProducts = products.filter((product) => product.quantity <= LOW_STOCK_LIMIT);
  const categories = useMemo(() => ["Todas", ...Array.from(new Set(products.map((p) => p.category))).sort()], [products]);
  const filteredProducts = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "Todas" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  function closeProductForm() {
    setShowProductForm(false);
    setEditing(null);
  }

  function saveProduct(data: Omit<Product, "id">) {
    if (editing) {
      setProducts((current) => current.map((product) => product.id === editing.id ? { ...product, ...data } : product));
      setNotice("Produto atualizado com sucesso.");
    } else {
      setProducts((current) => [...current, { id: crypto.randomUUID(), ...data }]);
      setNotice("Produto cadastrado com sucesso.");
    }
    closeProductForm();
  }

  function deleteProduct(product: Product) {
    if (!confirm(`Excluir o produto “${product.name}”? O histórico de movimentações será mantido.`)) return;
    setProducts((current) => current.filter((item) => item.id !== product.id));
    setNotice("Produto excluído.");
  }

  function saveMovement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const productId = String(form.get("productId") ?? "");
    const type = String(form.get("type") ?? "entrada") as Movement["type"];
    const quantity = Number(form.get("quantity"));
    const note = String(form.get("note") ?? "").trim();
    const product = products.find((item) => item.id === productId);
    if (!product || !Number.isInteger(quantity) || quantity <= 0) {
      setNotice("Selecione um produto e informe uma quantidade inteira maior que zero.");
      return;
    }
    if (type === "saida" && quantity > product.quantity) {
      setNotice(`Estoque insuficiente. Disponível: ${product.quantity} unidade(s).`);
      return;
    }
    const movement: Movement = {
      id: crypto.randomUUID(), productId, productName: product.name, type, quantity, note,
      createdAt: new Date().toISOString(),
    };
    setProducts((current) => current.map((item) => item.id === productId
      ? { ...item, quantity: item.quantity + (type === "entrada" ? quantity : -quantity) }
      : item));
    setMovements((current) => [movement, ...current]);
    setShowMovementForm(false);
    setNotice(`${type === "entrada" ? "Entrada" : "Saída"} registrada com sucesso.`);
  }

  function exportCsv() {
    const rows = [["Nome", "Categoria", "Preço", "Quantidade", "Valor em estoque"], ...products.map((p) => [p.name, p.category, p.price.toFixed(2), String(p.quantity), (p.price * p.quantity).toFixed(2)])];
    const csv = "\uFEFF" + rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "stockflow-produtos.csv";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Arquivo CSV exportado.");
  }

  return (
    <div className="min-h-screen bg-background md:flex">
      <aside className="flex w-full flex-col border-b bg-card p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:p-5">
        <div className="mb-5 flex items-center gap-3 md:mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Boxes size={22} /></div>
          <div><p className="font-display text-xl font-bold">StockFlow</p><p className="text-xs text-muted-foreground">Gestão de estoque</p></div>
        </div>
        <nav className="flex gap-2 overflow-x-auto md:flex-col" aria-label="Navegação principal">
          <NavButton active={tab === "dashboard"} onClick={() => setTab("dashboard")} icon={<LayoutDashboard size={18} />}>Visão geral</NavButton>
          <NavButton active={tab === "products"} onClick={() => setTab("products")} icon={<Package size={18} />}>Produtos</NavButton>
          <NavButton active={tab === "movements"} onClick={() => setTab("movements")} icon={<Activity size={18} />}>Movimentações</NavButton>
        </nav>
        <div className="mt-auto hidden rounded-xl bg-secondary p-4 md:mt-10 md:block">
          <p className="text-sm font-semibold">MVP StockFlow</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Seus dados ficam salvos neste navegador. A sincronização em nuvem será uma próxima etapa.</p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-9">
        <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-muted-foreground">Olá! Bem-vindo ao seu estoque.</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{tab === "dashboard" ? "Visão geral" : tab === "products" ? "Produtos" : "Movimentações"}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"><Download size={16} /> Exportar CSV</button>
            <button onClick={() => { setEditing(null); setShowProductForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"><Plus size={17} /> Novo produto</button>
          </div>
        </header>

        {notice && <div role="status" className="mb-5 flex items-start justify-between gap-3 rounded-lg border bg-card px-4 py-3 text-sm"><span>{notice}</span><button aria-label="Fechar aviso" onClick={() => setNotice("")}><X size={16} /></button></div>}

        {tab === "dashboard" && <>
          <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Produtos cadastrados" value={String(products.length)} detail="Tipos de produtos" icon={<Package size={19} />} />
            <MetricCard label="Unidades em estoque" value={String(totalItems)} detail="Quantidade total" icon={<Boxes size={19} />} />
            <MetricCard label="Valor do estoque" value={formatBRL(totalValue)} detail="Preço × quantidade" icon={<Activity size={19} />} />
            <MetricCard label="Estoque baixo" value={String(lowStockProducts.length)} detail={`Limite: ${LOW_STOCK_LIMIT} unidades`} icon={<AlertTriangle size={19} />} warning={lowStockProducts.length > 0} />
          </section>
          <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-xl border bg-card p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="font-display text-lg font-bold">Produtos recentes</h2><p className="text-sm text-muted-foreground">Resumo dos itens cadastrados</p></div><button onClick={() => setTab("products")} className="text-sm font-semibold text-primary hover:underline">Ver todos</button></div>
              <ProductTable products={products.slice(0, 5)} onEdit={(product) => { setEditing(product); setShowProductForm(true); }} onDelete={deleteProduct} />
            </div>
            <div className="rounded-xl border bg-card p-4 sm:p-5">
              <div className="mb-4"><h2 className="font-display text-lg font-bold">Precisa de atenção</h2><p className="text-sm text-muted-foreground">Produtos com 5 unidades ou menos</p></div>
              {lowStockProducts.length === 0 ? <EmptyState message="Nenhum produto com estoque baixo." /> : <div className="space-y-3">{lowStockProducts.map((product) => <div key={product.id} className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 p-3"><div className="min-w-0"><p className="truncate text-sm font-semibold">{product.name}</p><p className="text-xs text-muted-foreground">{product.category}</p></div><span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">{product.quantity} un.</span></div>)}</div>}
              <button onClick={() => { setTab("movements"); setShowMovementForm(true); }} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"><ArrowDownToLine size={16} /> Registrar movimentação</button>
            </div>
          </section>
        </>}

        {tab === "products" && <section className="rounded-xl border bg-card p-4 sm:p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} /><input className="field pl-9" placeholder="Buscar por produto ou categoria..." value={search} onChange={(event) => setSearch(event.target.value)} /></label><select className="field sm:max-w-52" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filtrar por categoria">{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
          <ProductTable products={filteredProducts} onEdit={(product) => { setEditing(product); setShowProductForm(true); }} onDelete={deleteProduct} />
          <p className="mt-4 text-xs text-muted-foreground">Exibindo {filteredProducts.length} de {products.length} produto(s).</p>
        </section>}

        {tab === "movements" && <section className="rounded-xl border bg-card p-4 sm:p-5">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="font-display text-lg font-bold">Histórico de movimentações</h2><p className="text-sm text-muted-foreground">Entradas e saídas registradas no sistema.</p></div><button onClick={() => setShowMovementForm(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"><Plus size={16} /> Nova movimentação</button></div>
          {movements.length === 0 ? <EmptyState message="Nenhuma movimentação registrada ainda." /> : <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead><tr className="border-b text-xs uppercase tracking-wide text-muted-foreground"><th className="pb-3 pr-3 font-medium">Tipo</th><th className="pb-3 pr-3 font-medium">Produto</th><th className="pb-3 pr-3 font-medium">Quantidade</th><th className="pb-3 pr-3 font-medium">Observação</th><th className="pb-3 font-medium">Data</th></tr></thead><tbody>{movements.map((movement) => <tr key={movement.id} className="border-b last:border-0"><td className="py-3 pr-3"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${movement.type === "entrada" ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"}`}>{movement.type === "entrada" ? <ArrowDownToLine size={13} /> : <ArrowUpFromLine size={13} />}{movement.type === "entrada" ? "Entrada" : "Saída"}</span></td><td className="py-3 pr-3 font-medium">{movement.productName}</td><td className="py-3 pr-3">{movement.quantity} un.</td><td className="py-3 pr-3 text-muted-foreground">{movement.note || "—"}</td><td className="py-3 text-muted-foreground">{new Date(movement.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</td></tr>)}</tbody></table></div>}
        </section>}

        <footer className="mt-8 flex flex-col justify-between gap-1 text-xs text-muted-foreground sm:flex-row"><span>StockFlow · MVP de controle de estoque</span><span>{ready ? "Dados locais atualizados" : "Carregando dados..."}</span></footer>
      </main>

      {showProductForm && <Modal onClose={closeProductForm}><ProductForm key={editing?.id ?? "new"} initial={editing ?? undefined} onSave={saveProduct} onCancel={closeProductForm} /></Modal>}
      {showMovementForm && <Modal onClose={() => setShowMovementForm(false)}><form onSubmit={saveMovement} className="space-y-4 rounded-xl border bg-card p-5"><div className="flex items-start justify-between"><div><h2 className="text-lg font-bold">Nova movimentação</h2><p className="text-sm text-muted-foreground">Atualize a quantidade em estoque.</p></div><button type="button" onClick={() => setShowMovementForm(false)} aria-label="Fechar"><X size={18} /></button></div><label className="block space-y-1 text-sm font-medium">Produto<select required name="productId" className="field mt-1"><option value="">Selecione um produto</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name} — {product.quantity} disponível(is)</option>)}</select></label><label className="block space-y-1 text-sm font-medium">Tipo<select required name="type" className="field mt-1"><option value="entrada">Entrada de estoque</option><option value="saida">Saída de estoque</option></select></label><label className="block space-y-1 text-sm font-medium">Quantidade<input required name="quantity" type="number" min="1" step="1" className="field mt-1" placeholder="Ex.: 10" /></label><label className="block space-y-1 text-sm font-medium">Observação (opcional)<input name="note" maxLength={120} className="field mt-1" placeholder="Ex.: compra de fornecedor" /></label><div className="flex gap-2"><button type="submit" className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">Registrar</button><button type="button" onClick={() => setShowMovementForm(false)} className="rounded-lg bg-muted px-4 py-2">Cancelar</button></div></form></Modal>}
    </div>
  );
}

function NavButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: ReactNode; children: ReactNode }) {
  return <button onClick={onClick} className={`inline-flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors md:w-full ${active ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{icon}{children}</button>;
}

function MetricCard({ label, value, detail, icon, warning = false }: { label: string; value: string; detail: string; icon: ReactNode; warning?: boolean }) {
  return <div className="rounded-xl border bg-card p-4 sm:p-5"><div className="mb-4 flex items-center justify-between"><p className="text-sm text-muted-foreground">{label}</p><span className={`rounded-lg p-2 ${warning ? "bg-amber-100 text-amber-800" : "bg-secondary text-primary"}`}>{icon}</span></div><p className="font-display text-2xl font-bold sm:text-3xl">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>;
}

function ProductTable({ products, onEdit, onDelete }: { products: Product[]; onEdit: (product: Product) => void; onDelete: (product: Product) => void }) {
  if (!products.length) return <EmptyState message="Nenhum produto encontrado. Tente mudar a busca ou cadastre um produto." />;
  return <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead><tr className="border-b text-xs uppercase tracking-wide text-muted-foreground"><th className="pb-3 pr-3 font-medium">Produto</th><th className="pb-3 pr-3 font-medium">Categoria</th><th className="pb-3 pr-3 font-medium">Preço</th><th className="pb-3 pr-3 font-medium">Estoque</th><th className="pb-3 pr-3 font-medium">Valor total</th><th className="pb-3 font-medium">Ações</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-b last:border-0"><td className="py-3 pr-3 font-semibold">{product.name}</td><td className="py-3 pr-3 text-muted-foreground">{product.category}</td><td className="py-3 pr-3">{formatBRL(product.price)}</td><td className="py-3 pr-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.quantity <= LOW_STOCK_LIMIT ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{product.quantity} un.</span></td><td className="py-3 pr-3">{formatBRL(product.price * product.quantity)}</td><td className="py-3"><div className="flex gap-1"><button onClick={() => onEdit(product)} className="rounded-md p-2 hover:bg-muted" aria-label={`Editar ${product.name}`} title="Editar"><Pencil size={15} /></button><button onClick={() => onDelete(product)} className="rounded-md p-2 text-destructive hover:bg-destructive/10" aria-label={`Excluir ${product.name}`} title="Excluir"><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div>;
}

function EmptyState({ message }: { message: string }) {
  return <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-10 text-center"><Package size={28} className="mb-2 text-muted-foreground" /><p className="max-w-sm text-sm text-muted-foreground">{message}</p></div>;
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="w-full max-w-lg">{children}</div></div>;
}
