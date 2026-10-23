import { initialProducts } from "@/data/products";

// Importação dos dados antigos do navegador (localStorage) para o banco.
// Este módulo só LÊ e VALIDA. Quem grava é a função SQL import_local_data, em uma transação.
// As regras abaixo espelham as dessa função para o usuário ver os problemas antes de enviar.

export const LOCAL_PRODUCTS_KEY = "stockflow.products.v1";
export const LOCAL_MOVEMENTS_KEY = "stockflow.movements.v1";

export type ImportProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

export type ImportMovement = {
  id: string;
  productId: string;
  productName: string;
  type: "entrada" | "saida";
  quantity: number;
  note: string;
  createdAt: string;
};

export type Rejected = { label: string; reason: string };

export type ImportPreview = {
  products: ImportProduct[];
  movements: ImportMovement[];
  demoProducts: ImportProduct[];
  demoMovementsExcluded: number;
  rejectedProducts: Rejected[];
  rejectedMovements: Rejected[];
};

export type ImportCounts = {
  products_imported: number;
  products_skipped: number;
  movements_imported: number;
  movements_skipped: number;
};

export type RawLocalData =
  { ok: true; products: unknown[]; movements: unknown[] } | { ok: false; error: string };

function readArray(storage: Pick<Storage, "getItem">, key: string): unknown[] {
  const raw = storage.getItem(key);
  if (raw === null) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("formato inválido");
  return parsed;
}

export function readLocalData(storage: Pick<Storage, "getItem">): RawLocalData {
  try {
    return {
      ok: true,
      products: readArray(storage, LOCAL_PRODUCTS_KEY),
      movements: readArray(storage, LOCAL_MOVEMENTS_KEY),
    };
  } catch {
    return {
      ok: false,
      error: "Os dados salvos neste navegador estão corrompidos e não podem ser lidos.",
    };
  }
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const len = (v: unknown) => (typeof v === "string" ? v.trim().length : 0);

function checkProduct(v: unknown): { product: ImportProduct } | { reason: string } {
  if (!isRecord(v)) return { reason: "registro inválido" };
  const id = v["id"];
  const name = v["name"];
  const category = v["category"];
  const price = v["price"];
  const quantity = v["quantity"];
  if (typeof id !== "string" || id.length < 1 || id.length > 64) return { reason: "id inválido" };
  if (typeof name !== "string" || len(name) < 1 || len(name) > 120)
    return { reason: "nome vazio ou maior que 120 caracteres" };
  if (typeof category !== "string" || len(category) < 1 || len(category) > 60)
    return { reason: "categoria vazia ou maior que 60 caracteres" };
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0 || price >= 1e10)
    return { reason: "preço inválido" };
  if (
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity < 0 ||
    quantity > 2_000_000_000
  )
    return { reason: "quantidade inválida" };
  return { product: { id, name: name.trim(), category: category.trim(), price, quantity } };
}

function checkMovement(v: unknown): { movement: ImportMovement } | { reason: string } {
  if (!isRecord(v)) return { reason: "registro inválido" };
  const id = v["id"];
  const productId = v["productId"];
  const productName = v["productName"];
  const type = v["type"];
  const quantity = v["quantity"];
  const note = v["note"];
  const createdAt = v["createdAt"];
  if (typeof id !== "string" || id.length < 1 || id.length > 64) return { reason: "id inválido" };
  if (typeof productId !== "string") return { reason: "produto inválido" };
  if (typeof productName !== "string" || len(productName) < 1 || len(productName) > 120)
    return { reason: "nome do produto inválido" };
  if (type !== "entrada" && type !== "saida") return { reason: "tipo inválido" };
  if (
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 1_000_000
  )
    return { reason: "quantidade inválida" };
  if (typeof note !== "string" || note.length > 120) return { reason: "observação inválida" };
  if (typeof createdAt !== "string" || Number.isNaN(Date.parse(createdAt)))
    return { reason: "data inválida" };
  return {
    movement: { id, productId, productName: productName.trim(), type, quantity, note, createdAt },
  };
}

// Produto de demonstração = idêntico a um dos 5 que o app criava sozinho no primeiro acesso.
export function isDemoProduct(p: ImportProduct): boolean {
  return initialProducts.some(
    (d) => d.id === p.id && d.name === p.name && d.category === p.category && d.price === p.price,
  );
}

export function buildImportPreview(
  raw: { products: unknown[]; movements: unknown[] },
  options: { includeDemo: boolean },
): ImportPreview {
  const products: ImportProduct[] = [];
  const demoProducts: ImportProduct[] = [];
  const rejectedProducts: Rejected[] = [];
  const seenProducts = new Set<string>();

  raw.products.forEach((item, i) => {
    const r = checkProduct(item);
    const label =
      isRecord(item) && typeof item["name"] === "string" ? item["name"] : `Produto ${i + 1}`;
    if ("reason" in r) return void rejectedProducts.push({ label, reason: r.reason });
    if (seenProducts.has(r.product.id)) {
      return void rejectedProducts.push({ label, reason: "id repetido" });
    }
    seenProducts.add(r.product.id);
    if (isDemoProduct(r.product)) {
      demoProducts.push(r.product);
      if (!options.includeDemo) return;
    }
    products.push(r.product);
  });

  const excludedDemoIds = options.includeDemo
    ? new Set<string>()
    : new Set(demoProducts.map((p) => p.id));
  const movements: ImportMovement[] = [];
  const rejectedMovements: Rejected[] = [];
  const seenMovements = new Set<string>();
  let demoMovementsExcluded = 0;

  raw.movements.forEach((item, i) => {
    const r = checkMovement(item);
    const label =
      isRecord(item) && typeof item["productName"] === "string"
        ? item["productName"]
        : `Movimentação ${i + 1}`;
    if ("reason" in r) return void rejectedMovements.push({ label, reason: r.reason });
    if (seenMovements.has(r.movement.id)) {
      return void rejectedMovements.push({ label, reason: "id repetido" });
    }
    seenMovements.add(r.movement.id);
    if (excludedDemoIds.has(r.movement.productId)) {
      demoMovementsExcluded += 1;
      return;
    }
    movements.push(r.movement);
  });

  return {
    products,
    movements,
    demoProducts,
    demoMovementsExcluded,
    rejectedProducts,
    rejectedMovements,
  };
}

export function parseImportCounts(v: unknown): ImportCounts | null {
  if (!isRecord(v)) return null;
  const keys = [
    "products_imported",
    "products_skipped",
    "movements_imported",
    "movements_skipped",
  ] as const;
  const out: Partial<ImportCounts> = {};
  for (const k of keys) {
    const n = v[k];
    if (typeof n !== "number") return null;
    out[k] = n;
  }
  return out as ImportCounts;
}
