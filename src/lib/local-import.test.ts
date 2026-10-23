import { describe, expect, it } from "vitest";
import { initialProducts } from "@/data/products";
import {
  LOCAL_PRODUCTS_KEY,
  buildImportPreview,
  parseImportCounts,
  readLocalData,
} from "@/lib/local-import";

const product = (over: Record<string, unknown> = {}) => ({
  id: "abc-1",
  name: "Arroz 5kg",
  category: "Alimentos",
  price: 25.9,
  quantity: 12,
  ...over,
});
const movement = (over: Record<string, unknown> = {}) => ({
  id: "m-1",
  productId: "abc-1",
  productName: "Arroz 5kg",
  type: "entrada",
  quantity: 4,
  note: "compra",
  createdAt: "2026-10-01T10:00:00.000Z",
  ...over,
});
const demo = initialProducts.map((p) => ({ ...p }));

describe("buildImportPreview", () => {
  it("aceita registros válidos", () => {
    const p = buildImportPreview(
      { products: [product()], movements: [movement()] },
      { includeDemo: false },
    );
    expect(p.products).toHaveLength(1);
    expect(p.movements).toHaveLength(1);
    expect(p.rejectedProducts).toHaveLength(0);
  });

  it("rejeita registros inválidos e diz o motivo", () => {
    const p = buildImportPreview(
      {
        products: [
          product({ id: "a", name: "" }),
          product({ id: "b", price: -1 }),
          product({ id: "c", quantity: 1.5 }),
          product({ id: "d", quantity: -2 }),
          product({ id: "e", name: "x".repeat(121) }),
          "lixo",
        ],
        movements: [
          movement({ id: "1", quantity: 0 }),
          movement({ id: "2", type: "venda" }),
          movement({ id: "3", createdAt: "ontem" }),
          movement({ id: "4", note: "n".repeat(121) }),
        ],
      },
      { includeDemo: false },
    );
    expect(p.products).toHaveLength(0);
    expect(p.rejectedProducts).toHaveLength(6);
    expect(p.movements).toHaveLength(0);
    expect(p.rejectedMovements).toHaveLength(4);
    expect(p.rejectedProducts[0]?.reason).toMatch(/nome/);
  });

  it("não importa produtos de demonstração por padrão, nem as movimentações deles", () => {
    const real = product();
    const p = buildImportPreview(
      {
        products: [...demo, real],
        movements: [
          movement({ id: "d1", productId: "2", productName: "Caneca de cerâmica" }),
          movement(),
        ],
      },
      { includeDemo: false },
    );
    expect(p.products.map((x) => x.id)).toEqual(["abc-1"]);
    expect(p.demoProducts).toHaveLength(5);
    expect(p.movements.map((m) => m.id)).toEqual(["m-1"]);
    expect(p.demoMovementsExcluded).toBe(1);
  });

  it("inclui a demonstração só quando o usuário pede", () => {
    const p = buildImportPreview({ products: demo, movements: [] }, { includeDemo: true });
    expect(p.products).toHaveLength(5);
  });

  it("produto com o mesmo id mas dados diferentes não é tratado como demonstração", () => {
    const p = buildImportPreview(
      { products: [{ ...demo[0], name: "Meu café" }], movements: [] },
      { includeDemo: false },
    );
    expect(p.products).toHaveLength(1);
    expect(p.demoProducts).toHaveLength(0);
  });

  it("ids repetidos viram rejeitados (a repetição é tratada pelo banco, mas o aviso vem antes)", () => {
    const p = buildImportPreview(
      { products: [product(), product({ name: "Outro" })], movements: [movement(), movement()] },
      { includeDemo: false },
    );
    expect(p.products).toHaveLength(1);
    expect(p.rejectedProducts[0]?.reason).toBe("id repetido");
    expect(p.rejectedMovements[0]?.reason).toBe("id repetido");
  });

  it("movimentação de produto já excluído continua importável", () => {
    const p = buildImportPreview(
      { products: [], movements: [movement({ productId: "sumiu" })] },
      { includeDemo: false },
    );
    expect(p.movements).toHaveLength(1);
  });

  it("repetir a prévia com os mesmos dados gera exatamente o mesmo envio (base da idempotência)", () => {
    const raw = { products: [product()], movements: [movement()] };
    expect(buildImportPreview(raw, { includeDemo: false })).toEqual(
      buildImportPreview(raw, { includeDemo: false }),
    );
  });
});

describe("readLocalData", () => {
  const storage = (data: Record<string, string>) => ({ getItem: (k: string) => data[k] ?? null });

  it("lê listas vazias quando não há nada salvo", () => {
    expect(readLocalData(storage({}))).toEqual({ ok: true, products: [], movements: [] });
  });
  it("lê dados salvos", () => {
    const r = readLocalData(storage({ [LOCAL_PRODUCTS_KEY]: JSON.stringify([product()]) }));
    expect(r.ok && r.products).toHaveLength(1);
  });
  it("avisa quando o JSON está corrompido, sem lançar erro", () => {
    expect(readLocalData(storage({ [LOCAL_PRODUCTS_KEY]: "{quebrado" })).ok).toBe(false);
  });
  it("avisa quando o formato não é uma lista", () => {
    expect(readLocalData(storage({ [LOCAL_PRODUCTS_KEY]: '{"a":1}' })).ok).toBe(false);
  });
});

describe("parseImportCounts", () => {
  it("aceita a resposta correta e recusa o resto", () => {
    const ok = {
      products_imported: 1,
      products_skipped: 0,
      movements_imported: 2,
      movements_skipped: 3,
    };
    expect(parseImportCounts(ok)).toEqual(ok);
    expect(parseImportCounts({ products_imported: 1 })).toBeNull();
    expect(parseImportCounts(null)).toBeNull();
  });
});
