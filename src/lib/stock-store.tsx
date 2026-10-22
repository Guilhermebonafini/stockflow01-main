import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { initialProducts, type Movement, type Product } from "@/data/products";

// Camada de dados compartilhada por todas as páginas.
// Hoje os dados ficam no navegador (localStorage). Quando o banco de dados online
// entrar, é aqui (e só aqui) que a troca precisa acontecer.

const PRODUCTS_KEY = "stockflow.products.v1";
const MOVEMENTS_KEY = "stockflow.movements.v1";

export type MovementInput = {
  productId: string;
  type: Movement["type"];
  quantity: number;
  note: string;
};
export type ActionResult = { ok: true } | { ok: false; error: string };

function isProduct(v: unknown): v is Product {
  if (typeof v !== "object" || v === null) return false;
  const p = v as Partial<Record<keyof Product, unknown>>;
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.category === "string" &&
    typeof p.price === "number" &&
    typeof p.quantity === "number"
  );
}

function isMovement(v: unknown): v is Movement {
  if (typeof v !== "object" || v === null) return false;
  const m = v as Partial<Record<keyof Movement, unknown>>;
  return (
    typeof m.id === "string" &&
    typeof m.productId === "string" &&
    typeof m.productName === "string" &&
    (m.type === "entrada" || m.type === "saida") &&
    typeof m.quantity === "number" &&
    typeof m.note === "string" &&
    typeof m.createdAt === "string"
  );
}

// Lê uma lista salva. Devolve null se não existe; ignora itens corrompidos.
function readList<T>(key: string, guard: (v: unknown) => v is T): T[] | null {
  const raw = localStorage.getItem(key);
  if (raw === null) return null;
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("formato inválido");
  return parsed.filter(guard);
}

type StockContextValue = {
  products: Product[];
  movements: Movement[];
  ready: boolean;
  notice: string;
  notify: (message: string) => void;
  dismissNotice: () => void;
  saveProduct: (editingId: string | null, data: Omit<Product, "id">) => void;
  deleteProduct: (product: Product) => void;
  registerMovement: (input: MovementInput) => ActionResult;
  clearAllData: () => void;
  loadDemoData: () => void;
};

const StockContext = createContext<StockContextValue | null>(null);

export function StockProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");

  // Carrega os dados salvos assim que a página abre no navegador.
  useEffect(() => {
    try {
      const savedProducts = readList(PRODUCTS_KEY, isProduct);
      const savedMovements = readList(MOVEMENTS_KEY, isMovement);
      if (savedProducts) setProducts(savedProducts);
      if (savedMovements) setMovements(savedMovements);
    } catch {
      setNotice(
        "Não foi possível carregar os dados salvos. Os dados de demonstração foram mantidos.",
      );
    } finally {
      setReady(true);
    }
  }, []);

  // Salva a cada alteração (só depois do carregamento inicial, para não sobrescrever).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));
    } catch {
      setNotice("Não foi possível salvar neste navegador. Verifique o espaço disponível.");
    }
  }, [products, movements, ready]);

  // O aviso some sozinho depois de alguns segundos.
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  const saveProduct = useCallback((editingId: string | null, data: Omit<Product, "id">) => {
    if (editingId) {
      setProducts((cur) => cur.map((p) => (p.id === editingId ? { ...p, ...data } : p)));
      setNotice("Produto atualizado com sucesso.");
    } else {
      setProducts((cur) => [...cur, { id: crypto.randomUUID(), ...data }]);
      setNotice("Produto cadastrado com sucesso.");
    }
  }, []);

  const deleteProduct = useCallback((product: Product) => {
    setProducts((cur) => cur.filter((p) => p.id !== product.id));
    setNotice("Produto excluído. O histórico de movimentações foi mantido.");
  }, []);

  const registerMovement = useCallback(
    (input: MovementInput): ActionResult => {
      const product = products.find((p) => p.id === input.productId);
      if (!product) return { ok: false, error: "Selecione um produto." };
      if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
        return { ok: false, error: "Informe uma quantidade inteira maior que zero." };
      }
      if (input.type === "saida" && input.quantity > product.quantity) {
        return {
          ok: false,
          error: `Estoque insuficiente. Disponível: ${product.quantity} unidade(s).`,
        };
      }
      const movement: Movement = {
        id: crypto.randomUUID(),
        productId: product.id,
        productName: product.name,
        type: input.type,
        quantity: input.quantity,
        note: input.note.trim().slice(0, 120),
        createdAt: new Date().toISOString(),
      };
      const delta = input.type === "entrada" ? input.quantity : -input.quantity;
      setProducts((cur) =>
        cur.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + delta } : p)),
      );
      setMovements((cur) => [movement, ...cur]);
      setNotice(`${input.type === "entrada" ? "Entrada" : "Saída"} registrada com sucesso.`);
      return { ok: true };
    },
    [products],
  );

  const clearAllData = useCallback(() => {
    setProducts([]);
    setMovements([]);
    setNotice("Todos os dados deste navegador foram apagados.");
  }, []);

  const loadDemoData = useCallback(() => {
    setProducts(initialProducts);
    setMovements([]);
    setNotice("Dados de demonstração carregados.");
  }, []);

  const value = useMemo<StockContextValue>(
    () => ({
      products,
      movements,
      ready,
      notice,
      notify: setNotice,
      dismissNotice: () => setNotice(""),
      saveProduct,
      deleteProduct,
      registerMovement,
      clearAllData,
      loadDemoData,
    }),
    [
      products,
      movements,
      ready,
      notice,
      saveProduct,
      deleteProduct,
      registerMovement,
      clearAllData,
      loadDemoData,
    ],
  );

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
}

export function useStock() {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error("useStock precisa estar dentro de <StockProvider>.");
  return ctx;
}
