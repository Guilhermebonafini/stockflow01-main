import { describe, expect, it } from "vitest";
import type { Movement, Product } from "@/data/products";
import {
  ALL_CATEGORIES,
  REPORT_BY_ID,
  filterMovements,
  movementsByDay,
  reportToCsv,
  summarize,
  valueByCategory,
  type ReportFilters,
} from "@/lib/reports";

const products: Product[] = [
  { id: "a", name: "Arroz", category: "Alimentos", price: 10, quantity: 3 },
  { id: "b", name: "Suco", category: "Bebidas", price: 5, quantity: 0 },
  { id: "c", name: "Feijão", category: "Alimentos", price: 8, quantity: 20 },
];

const mv = (
  id: string,
  productId: string,
  type: Movement["type"],
  quantity: number,
  at: string,
): Movement => ({
  id,
  productId,
  productName: productId,
  type,
  quantity,
  note: "",
  createdAt: new Date(at).toISOString(),
});

const movements: Movement[] = [
  mv("1", "a", "entrada", 10, "2026-10-19T10:00:00"),
  mv("2", "a", "saida", 4, "2026-10-20T23:59:00"),
  mv("3", "b", "saida", 2, "2026-10-21T00:00:00"),
  mv("4", "c", "entrada", 5, "2026-09-01T12:00:00"),
];

const all: ReportFilters = { from: "", to: "", category: ALL_CATEGORIES, productId: "" };

describe("relatórios", () => {
  it("estoque baixo inclui o limite e o zero, ordenado do menor para o maior", () => {
    const rows = REPORT_BY_ID["estoque-baixo"].build({ products, movements }, all);
    expect(rows.map((r) => r["produto"])).toEqual(["Suco", "Arroz"]);
  });

  it("filtra movimentações por período, incluindo o primeiro e o último dia", () => {
    const f = { ...all, from: "2026-10-20", to: "2026-10-21" };
    expect(
      filterMovements({ products, movements }, f)
        .map((m) => m.id)
        .sort(),
    ).toEqual(["2", "3"]);
  });

  it("filtra por categoria usando o produto atual", () => {
    const f = { ...all, category: "Bebidas" };
    expect(filterMovements({ products, movements }, f).map((m) => m.id)).toEqual(["3"]);
    expect(summarize({ products, movements }, f).productCount).toBe(1);
  });

  it("calcula os indicadores", () => {
    const s = summarize({ products, movements }, all);
    expect(s).toEqual({
      productCount: 3,
      lowStockCount: 2,
      movementCount: 4,
      stockValue: 30 + 0 + 160,
    });
  });

  it("agrupa o gráfico por dia, com dias sem movimento zerados", () => {
    const f = { ...all, from: "2026-10-19", to: "2026-10-21" };
    const { points, truncated } = movementsByDay(filterMovements({ products, movements }, f), f);
    expect(truncated).toBe(false);
    expect(points.map((p) => [p.label, p.entradas, p.saidas])).toEqual([
      ["19/10", 10, 0],
      ["20/10", 0, 4],
      ["21/10", 0, 2],
    ]);
  });

  it("limita o gráfico a 31 dias", () => {
    const f = { ...all, from: "2026-01-01", to: "2026-10-21" };
    const { points, truncated } = movementsByDay([], f);
    expect(points).toHaveLength(31);
    expect(truncated).toBe(true);
  });

  it("valor por categoria soma 100%", () => {
    const parts = valueByCategory(products);
    expect(parts.reduce((s, p) => s + p.percent, 0)).toBeCloseTo(100);
    expect(parts[0]?.name).toBe("Alimentos");
  });

  it("CSV usa ; e vírgula decimal, escapa aspas e neutraliza fórmulas", () => {
    const def = REPORT_BY_ID.posicao;
    const csv = reportToCsv(def.columns, [
      {
        produto: '=CMD("x")',
        categoria: 'Say "hi"',
        quantidade: 2,
        preco: 1.5,
        valor: 3,
        situacao: "Normal",
      },
    ]);
    const lines = csv.replace("\uFEFF", "").split("\r\n");
    expect(lines[0]).toBe('"Produto";"Categoria";"Estoque";"Preço";"Valor em estoque";"Situação"');
    expect(lines[1]).toBe('"\'=CMD(""x"")";"Say ""hi""";"2";"1,50";"3,00";"Normal"');
  });
});
