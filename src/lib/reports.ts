import { LOW_STOCK_LIMIT, formatBRL, type Movement, type Product } from "@/data/products";

// Lógica dos relatórios, sem nada de tela. Usa somente os dados realmente salvos.
// Para criar um relatório novo (vendas, faturamento...), basta adicionar uma
// definição na lista REPORTS no final deste arquivo.

export const ALL_CATEGORIES = "Todas";

export type ReportFilters = {
  from: string; // "AAAA-MM-DD" ou "" (sem limite)
  to: string; // "AAAA-MM-DD" ou "" (sem limite)
  category: string; // ALL_CATEGORIES = todas
  productId: string; // "" = todos
};

export type ReportData = { products: Product[]; movements: Movement[] };
export type ColumnType = "text" | "integer" | "money" | "datetime";
export type Tone = "good" | "warn" | "bad" | "info";
export type ReportCell = string | number;
export type ReportRow = Record<string, ReportCell>;

export type ReportColumn = {
  key: string;
  label: string;
  type: ColumnType;
  tone?: (value: ReportCell) => Tone | undefined;
};

export type ReportId = "posicao" | "movimentacoes" | "estoque-baixo";

export type ReportDefinition = {
  id: ReportId;
  label: string;
  description: string;
  usesPeriod: boolean;
  filename: string;
  emptyMessage: string;
  columns: ReportColumn[];
  build: (data: ReportData, filters: ReportFilters) => ReportRow[];
};

// ---------- datas ----------

export function toInputDate(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function parseDay(iso: string, endOfDay: boolean): Date | null {
  if (!iso) return null;
  const d = new Date(`${iso}T${endOfDay ? "23:59:59.999" : "00:00:00"}`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function defaultFilters(today = new Date()): ReportFilters {
  const start = new Date(today);
  start.setDate(start.getDate() - 6);
  return {
    from: toInputDate(start),
    to: toInputDate(today),
    category: ALL_CATEGORIES,
    productId: "",
  };
}

// ---------- filtros ----------

export function filterProducts(products: Product[], f: ReportFilters): Product[] {
  return products.filter(
    (p) =>
      (f.category === ALL_CATEGORIES || p.category === f.category) &&
      (!f.productId || p.id === f.productId),
  );
}

export function filterMovements(data: ReportData, f: ReportFilters): Movement[] {
  const from = parseDay(f.from, false)?.getTime();
  const to = parseDay(f.to, true)?.getTime();
  const categoryById = new Map(data.products.map((p) => [p.id, p.category]));
  return data.movements.filter((m) => {
    const t = new Date(m.createdAt).getTime();
    if (Number.isNaN(t)) return false;
    if (from !== undefined && t < from) return false;
    if (to !== undefined && t > to) return false;
    if (f.productId && m.productId !== f.productId) return false;
    // O histórico não guarda a categoria; ela vem do produto atual.
    if (f.category !== ALL_CATEGORIES && categoryById.get(m.productId) !== f.category) return false;
    return true;
  });
}

export function stockStatus(quantity: number): "Sem estoque" | "Estoque baixo" | "Normal" {
  if (quantity <= 0) return "Sem estoque";
  return quantity <= LOW_STOCK_LIMIT ? "Estoque baixo" : "Normal";
}

// ---------- indicadores e gráficos ----------

export function summarize(data: ReportData, f: ReportFilters) {
  const products = filterProducts(data.products, f);
  return {
    productCount: products.length,
    lowStockCount: products.filter((p) => p.quantity <= LOW_STOCK_LIMIT).length,
    movementCount: filterMovements(data, f).length,
    stockValue: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
  };
}

export const MAX_CHART_DAYS = 31;

export function movementsByDay(movements: Movement[], f: ReportFilters, today = new Date()) {
  const end = parseDay(f.to, true) ?? today;
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  let start = parseDay(f.from, false);
  if (!start) {
    const times = movements
      .map((m) => new Date(m.createdAt).getTime())
      .filter((t) => !Number.isNaN(t));
    start = times.length
      ? new Date(Math.min(...times))
      : new Date(endDay.getTime() - 6 * 86_400_000);
  }
  let cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  if (cursor > endDay) return { points: [], truncated: false };

  const totalDays = Math.round((endDay.getTime() - cursor.getTime()) / 86_400_000) + 1;
  const truncated = totalDays > MAX_CHART_DAYS;
  if (truncated)
    cursor = new Date(
      endDay.getFullYear(),
      endDay.getMonth(),
      endDay.getDate() - (MAX_CHART_DAYS - 1),
    );

  const byKey = new Map<string, { entradas: number; saidas: number }>();
  for (const m of movements) {
    const key = toInputDate(new Date(m.createdAt));
    const acc = byKey.get(key) ?? { entradas: 0, saidas: 0 };
    if (m.type === "entrada") acc.entradas += m.quantity;
    else acc.saidas += m.quantity;
    byKey.set(key, acc);
  }

  const points: { key: string; label: string; entradas: number; saidas: number }[] = [];
  while (cursor <= endDay) {
    const key = toInputDate(cursor);
    const v = byKey.get(key);
    points.push({
      key,
      label: `${String(cursor.getDate()).padStart(2, "0")}/${String(cursor.getMonth() + 1).padStart(2, "0")}`,
      entradas: v?.entradas ?? 0,
      saidas: v?.saidas ?? 0,
    });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
  }
  return { points, truncated };
}

export function valueByCategory(products: Product[]) {
  const totals = new Map<string, number>();
  for (const p of products)
    totals.set(p.category, (totals.get(p.category) ?? 0) + p.price * p.quantity);
  const total = [...totals.values()].reduce((a, b) => a + b, 0);
  if (total <= 0) return [];
  return [...totals.entries()]
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value, percent: (value / total) * 100 }));
}

// ---------- definição dos relatórios ----------

const byName = (a: Product, b: Product) => a.name.localeCompare(b.name, "pt-BR");

const statusTone = (v: ReportCell): Tone | undefined =>
  v === "Normal"
    ? "good"
    : v === "Estoque baixo"
      ? "warn"
      : v === "Sem estoque"
        ? "bad"
        : undefined;

export const REPORTS: ReportDefinition[] = [
  {
    id: "posicao",
    label: "Posição do estoque",
    description: "Situação atual de cada produto. O período não se aplica a este relatório.",
    usesPeriod: false,
    filename: "stockflow-posicao-estoque.csv",
    emptyMessage: "Nenhum produto encontrado com estes filtros.",
    columns: [
      { key: "produto", label: "Produto", type: "text" },
      { key: "categoria", label: "Categoria", type: "text" },
      { key: "quantidade", label: "Estoque", type: "integer" },
      { key: "preco", label: "Preço", type: "money" },
      { key: "valor", label: "Valor em estoque", type: "money" },
      { key: "situacao", label: "Situação", type: "text", tone: statusTone },
    ],
    build: (data, f) =>
      filterProducts(data.products, f)
        .sort(byName)
        .map((p) => ({
          produto: p.name,
          categoria: p.category,
          quantidade: p.quantity,
          preco: p.price,
          valor: p.price * p.quantity,
          situacao: stockStatus(p.quantity),
        })),
  },
  {
    id: "movimentacoes",
    label: "Movimentações",
    description: "Entradas e saídas registradas no período selecionado.",
    usesPeriod: true,
    filename: "stockflow-movimentacoes.csv",
    emptyMessage: "Nenhuma movimentação registrada neste período.",
    columns: [
      { key: "data", label: "Data", type: "datetime" },
      {
        key: "tipo",
        label: "Tipo",
        type: "text",
        tone: (v) => (v === "Entrada" ? "good" : v === "Saída" ? "info" : undefined),
      },
      { key: "produto", label: "Produto", type: "text" },
      { key: "categoria", label: "Categoria", type: "text" },
      { key: "quantidade", label: "Quantidade", type: "integer" },
      { key: "observacao", label: "Observação", type: "text" },
    ],
    build: (data, f) => {
      const categoryById = new Map(data.products.map((p) => [p.id, p.category]));
      return filterMovements(data, f)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((m) => ({
          data: m.createdAt,
          tipo: m.type === "entrada" ? "Entrada" : "Saída",
          produto: m.productName,
          categoria: categoryById.get(m.productId) ?? "—",
          quantidade: m.quantity,
          observacao: m.note || "—",
        }));
    },
  },
  {
    id: "estoque-baixo",
    label: "Estoque baixo",
    description: `Produtos com ${LOW_STOCK_LIMIT} unidades ou menos. O período não se aplica a este relatório.`,
    usesPeriod: false,
    filename: "stockflow-estoque-baixo.csv",
    emptyMessage: "Nenhum produto com estoque baixo. Tudo certo por aqui.",
    columns: [
      { key: "produto", label: "Produto", type: "text" },
      { key: "categoria", label: "Categoria", type: "text" },
      {
        key: "atual",
        label: "Estoque atual",
        type: "integer",
        tone: (v) => (v === 0 ? "bad" : "warn"),
      },
      { key: "limite", label: "Limite de alerta", type: "integer" },
    ],
    build: (data, f) =>
      filterProducts(data.products, f)
        .filter((p) => p.quantity <= LOW_STOCK_LIMIT)
        .sort((a, b) => a.quantity - b.quantity || byName(a, b))
        .map((p) => ({
          produto: p.name,
          categoria: p.category,
          atual: p.quantity,
          limite: LOW_STOCK_LIMIT,
        })),
  },
];

export const REPORT_BY_ID: Record<ReportId, ReportDefinition> = {
  posicao: REPORTS[0] as ReportDefinition,
  movimentacoes: REPORTS[1] as ReportDefinition,
  "estoque-baixo": REPORTS[2] as ReportDefinition,
};

// ---------- formatação e CSV ----------

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function formatCell(col: ReportColumn, value: ReportCell | undefined): string {
  if (value === undefined) return "—";
  if (col.type === "money") return formatBRL(Number(value));
  if (col.type === "integer") return String(value);
  if (col.type === "datetime") return formatDateTime(String(value));
  return String(value);
}

function csvCell(col: ReportColumn, value: ReportCell | undefined): string {
  let text: string;
  if (value === undefined) text = "";
  else if (col.type === "money") text = Number(value).toFixed(2).replace(".", ",");
  else if (col.type === "datetime") text = formatDateTime(String(value));
  else text = String(value);
  // Proteção: textos que começam com = + - @ podem virar fórmulas ao abrir no Excel.
  if (col.type === "text" && /^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function reportToCsv(columns: ReportColumn[], rows: ReportRow[]): string {
  const header = columns.map((c) => `"${c.label.replaceAll('"', '""')}"`).join(";");
  const lines = rows.map((row) => columns.map((c) => csvCell(c, row[c.key])).join(";"));
  // \uFEFF faz o Excel abrir os acentos corretamente.
  return "\uFEFF" + [header, ...lines].join("\r\n");
}

export function downloadCsv(filename: string, csv: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
