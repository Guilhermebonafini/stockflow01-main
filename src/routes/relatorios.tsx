import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, ArrowLeftRight, Download, Package, Wallet } from "lucide-react";
import { LOW_STOCK_LIMIT, formatBRL } from "@/data/products";
import { EmptyState, KpiCard, PageHeader, Panel, btnPrimary } from "@/components/common";
import { ReportTable } from "@/components/ReportTable";
import { useStock } from "@/lib/stock-store";
import {
  ALL_CATEGORIES,
  REPORTS,
  REPORT_BY_ID,
  defaultFilters,
  downloadCsv,
  filterMovements,
  filterProducts,
  movementsByDay,
  reportToCsv,
  summarize,
  toInputDate,
  valueByCategory,
  type ReportFilters,
  type ReportId,
} from "@/lib/reports";

export const Route = createFileRoute("/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — StockFlow" }] }),
  component: ReportsPage,
});

const PIE_COLORS = ["#1f66e5", "#22a559", "#f59e0b", "#8b5cf6", "#ef4444", "#14b8a6", "#64748b"];

// Gráficos só aparecem depois que a página carrega no navegador.
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function ReportsPage() {
  const { products, movements, ready, notify } = useStock();
  const mounted = useMounted();
  const [filters, setFilters] = useState<ReportFilters>(() => defaultFilters());
  const [reportId, setReportId] = useState<ReportId>("posicao");

  const data = useMemo(() => ({ products, movements }), [products, movements]);
  const categories = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.category))).sort((a, b) =>
        a.localeCompare(b, "pt-BR"),
      ),
    [products],
  );
  const productOptions = useMemo(
    () =>
      products
        .filter((p) => filters.category === ALL_CATEGORIES || p.category === filters.category)
        .sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    [products, filters.category],
  );

  const summary = useMemo(() => summarize(data, filters), [data, filters]);
  const chart = useMemo(
    () => movementsByDay(filterMovements(data, filters), filters),
    [data, filters],
  );
  const hasChartData = chart.points.some((p) => p.entradas > 0 || p.saidas > 0);
  const donut = useMemo(
    () => valueByCategory(filterProducts(products, filters)),
    [products, filters],
  );
  const report = REPORT_BY_ID[reportId];
  const rows = useMemo(() => report.build(data, filters), [report, data, filters]);

  function update(patch: Partial<ReportFilters>) {
    setFilters((cur) => ({ ...cur, ...patch }));
  }
  function changeCategory(category: string) {
    // Se o produto escolhido não pertence à nova categoria, limpa o produto.
    const keep = products.find((p) => p.id === filters.productId);
    const stillValid = !keep || category === ALL_CATEGORIES || keep.category === category;
    update({ category, productId: stillValid ? filters.productId : "" });
  }
  function setLastDays(days: number | null) {
    if (days === null) return update({ from: "", to: "" });
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - (days - 1));
    update({ from: toInputDate(start), to: toInputDate(today) });
  }
  function exportCsv() {
    downloadCsv(report.filename, reportToCsv(report.columns, rows));
    notify(`Relatório “${report.label}” exportado em CSV.`);
  }

  if (!ready)
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">Carregando seus dados...</p>
    );

  return (
    <>
      <PageHeader
        title="Relatórios"
        subtitle="Acompanhe o desempenho do seu estoque."
        actions={
          <button onClick={exportCsv} className={btnPrimary} disabled={rows.length === 0}>
            <Download size={16} /> Exportar CSV
          </button>
        }
      />

      {/* Filtros */}
      <Panel className="mb-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr]">
          <fieldset className="grid grid-cols-2 gap-2 sm:col-span-2 xl:col-span-1">
            <legend className="mb-1 text-xs font-semibold text-muted-foreground">Período</legend>
            <label className="sr-only" htmlFor="f-from">
              De
            </label>
            <input
              id="f-from"
              type="date"
              className="field"
              value={filters.from}
              max={filters.to || undefined}
              onChange={(e) => update({ from: e.target.value })}
            />
            <label className="sr-only" htmlFor="f-to">
              Até
            </label>
            <input
              id="f-to"
              type="date"
              className="field"
              value={filters.to}
              min={filters.from || undefined}
              onChange={(e) => update({ to: e.target.value })}
            />
          </fieldset>
          <label className="block text-xs font-semibold text-muted-foreground">
            Categoria
            <select
              className="field mt-1 text-sm font-normal text-foreground"
              value={filters.category}
              onChange={(e) => changeCategory(e.target.value)}
            >
              <option value={ALL_CATEGORIES}>Todas as categorias</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-muted-foreground">
            Produto
            <select
              className="field mt-1 text-sm font-normal text-foreground"
              value={filters.productId}
              onChange={(e) => update({ productId: e.target.value })}
            >
              <option value="">Todos os produtos</option>
              {productOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Períodos rápidos">
          {[
            { l: "Últimos 7 dias", d: 7 },
            { l: "Últimos 30 dias", d: 30 },
            { l: "Todo o período", d: null },
          ].map(({ l, d }) => (
            <button
              key={l}
              onClick={() => setLastDays(d)}
              className="min-h-9 rounded-full bg-muted px-4 text-xs font-semibold hover:bg-border"
            >
              {l}
            </button>
          ))}
        </div>
      </Panel>

      {/* Indicadores */}
      <section aria-label="Indicadores" className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Produtos cadastrados"
          value={String(summary.productCount)}
          icon={<Package size={20} />}
          tone="blue"
        />
        <KpiCard
          label="Estoque baixo"
          value={String(summary.lowStockCount)}
          detail={`${LOW_STOCK_LIMIT} un. ou menos`}
          icon={<AlertTriangle size={20} />}
          tone="amber"
        />
        <KpiCard
          label="Movimentações"
          value={String(summary.movementCount)}
          detail="No período"
          icon={<ArrowLeftRight size={20} />}
          tone="green"
        />
        <KpiCard
          label="Valor em estoque"
          value={formatBRL(summary.stockValue)}
          detail="Preço × quantidade"
          icon={<Wallet size={20} />}
          tone="violet"
        />
      </section>

      {/* Gráficos */}
      <div className="mb-5 grid gap-5 lg:grid-cols-5">
        <Panel
          className="lg:col-span-3"
          title="Movimentações por dia"
          subtitle={
            chart.truncated
              ? "Mostrando os últimos 31 dias do período."
              : "Entradas e saídas, em unidades."
          }
        >
          {!hasChartData ? (
            <EmptyState message="Nenhuma movimentação no período selecionado." />
          ) : (
            <div
              role="img"
              aria-label="Gráfico de barras com entradas e saídas de estoque por dia"
              className="h-64 w-full"
            >
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chart.points} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1e7f0" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      interval="preserveStartEnd"
                      minTickGap={12}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip cursor={{ fill: "#eef2f8" }} />
                    <Legend iconType="square" wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="entradas" name="Entradas" fill="#22a559" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="saidas" name="Saídas" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </Panel>

        <Panel
          className="lg:col-span-2"
          title="Valor em estoque por categoria"
          subtitle="Preço × quantidade de cada categoria."
        >
          {donut.length === 0 ? (
            <EmptyState message="Sem valor em estoque para mostrar." />
          ) : (
            <div className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col xl:flex-row">
              <div
                role="img"
                aria-label="Gráfico de rosca do valor em estoque por categoria"
                className="h-44 w-44 shrink-0"
              >
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donut}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="58%"
                        outerRadius="100%"
                        paddingAngle={2}
                        stroke="none"
                      >
                        {donut.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length] ?? "#64748b"} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => formatBRL(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <ul className="w-full min-w-0 space-y-1.5 text-sm">
                {donut.map((d, i) => (
                  <li key={d.name} className="flex items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-sm"
                      style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1 truncate">{d.name}</span>
                    <span className="font-semibold tabular-nums">{d.percent.toFixed(0)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>
      </div>

      {/* Relatórios detalhados */}
      <Panel>
        <div
          role="tablist"
          aria-label="Tipo de relatório"
          className="-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1"
        >
          {REPORTS.map((r) => (
            <button
              key={r.id}
              role="tab"
              id={`tab-${r.id}`}
              aria-selected={r.id === reportId}
              aria-controls="report-panel"
              onClick={() => setReportId(r.id)}
              className={`min-h-10 shrink-0 rounded-lg px-4 text-sm font-semibold transition-colors ${r.id === reportId ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-border"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" id="report-panel" aria-labelledby={`tab-${reportId}`}>
          <p className="mb-4 text-sm text-muted-foreground">{report.description}</p>
          <ReportTable columns={report.columns} rows={rows} emptyMessage={report.emptyMessage} />
        </div>
      </Panel>
    </>
  );
}
