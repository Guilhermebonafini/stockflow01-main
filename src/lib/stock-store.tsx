import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";
import { initialProducts, type Movement, type Product } from "@/data/products";
import { friendlyDbError } from "@/lib/stock-errors";
import {
  parseImportCounts,
  type ImportCounts,
  type ImportMovement,
  type ImportProduct,
} from "@/lib/local-import";

// Camada de dados compartilhada por todas as páginas.
// A fonte da verdade é o Supabase (tabelas products e movements, protegidas por RLS).
// Esta camada NÃO grava nada no navegador. Uma ação só aparece como concluída depois
// que o servidor confirma. Os dados antigos do localStorage só entram pela importação
// explícita (src/lib/local-import.ts + painel em Configurações).

// O banco devolve no máximo as 1000 movimentações mais recentes (limite padrão do Supabase).
const MOVEMENTS_LIMIT = 1000;

export type MovementInput = {
  productId: string;
  type: Movement["type"];
  quantity: number;
  note: string;
};
export type ActionResult = { ok: true } | { ok: false; error: string };
export type ImportResult = { ok: true; counts: ImportCounts } | { ok: false; error: string };

const toProduct = (r: Tables<"products">): Product => ({
  id: r.id,
  name: r.name,
  category: r.category,
  price: Number(r.price),
  quantity: r.quantity,
});

// product_id vazio = o produto foi excluído; o histórico continua com o nome gravado na hora.
const toMovement = (r: Tables<"movements">): Movement => ({
  id: r.id,
  productId: r.product_id ?? "",
  productName: r.product_name,
  type: r.type === "saida" ? "saida" : "entrada",
  quantity: r.quantity,
  note: r.note,
  createdAt: r.created_at,
});

type Failure = { ok: false; error: string };
const fail = (error: unknown): Failure => ({ ok: false, error: friendlyDbError(error) });
const NO_SESSION: Failure = {
  ok: false,
  error: "Sua sessão expirou. Entre novamente para continuar.",
};

type StockContextValue = {
  products: Product[];
  movements: Movement[];
  ready: boolean;
  loadError: string;
  saving: boolean;
  notice: string;
  notify: (message: string) => void;
  dismissNotice: () => void;
  reload: () => Promise<void>;
  saveProduct: (editingId: string | null, data: Omit<Product, "id">) => Promise<ActionResult>;
  deleteProduct: (product: Product) => Promise<ActionResult>;
  registerMovement: (input: MovementInput) => Promise<ActionResult>;
  addDemoProducts: () => Promise<ActionResult>;
  importLocalData: (payload: {
    products: ImportProduct[];
    movements: ImportMovement[];
  }) => Promise<ImportResult>;
};

const StockContext = createContext<StockContextValue | null>(null);

export function StockProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  // Cada carregamento recebe um número. Respostas atrasadas (de outro usuário ou de uma
  // carga anterior) são descartadas, para nunca mostrar dados desatualizados.
  const loadSeq = useRef(0);
  const pending = useRef(0);

  // Acompanha o login. Só guarda o id: o carregamento acontece em outro efeito
  // (chamar o banco dentro do callback de autenticação pode travar o supabase-js).
  useEffect(() => {
    let active = true;
    let eventSeen = false;
    const apply = (id: string | null) => active && setUserId((prev) => (prev === id ? prev : id));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      eventSeen = true;
      apply(session?.user.id ?? null);
    });
    // A leitura inicial nunca pode sobrescrever um evento de login/logout mais novo.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!eventSeen) apply(data.session?.user.id ?? null);
      })
      .catch(() => {
        if (!eventSeen) apply(null);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const reload = useCallback(async () => {
    const seq = ++loadSeq.current;
    try {
      const [p, m] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: true }),
        supabase
          .from("movements")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(MOVEMENTS_LIMIT),
      ]);
      if (seq !== loadSeq.current) return;
      if (p.error || m.error) {
        setLoadError(friendlyDbError(p.error ?? m.error));
      } else {
        setProducts(p.data.map(toProduct));
        setMovements(m.data.map(toMovement));
        setLoadError("");
      }
    } catch (error) {
      if (seq !== loadSeq.current) return;
      setLoadError(friendlyDbError(error));
    }
    setReady(true);
  }, []);

  // Troca de usuário (ou logout): limpa tudo ANTES de carregar, sem sobras da conta anterior.
  useEffect(() => {
    loadSeq.current += 1;
    setProducts([]);
    setMovements([]);
    setLoadError("");
    setNotice("");
    setReady(false);
    if (userId) void reload();
  }, [userId, reload]);

  // O aviso some sozinho depois de alguns segundos.
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  // Marca "salvando" enquanto houver qualquer operação em andamento.
  const run = useCallback(async <T,>(task: () => Promise<T>): Promise<T> => {
    pending.current += 1;
    setSaving(true);
    try {
      return await task();
    } finally {
      pending.current -= 1;
      if (pending.current === 0) setSaving(false);
    }
  }, []);

  const saveProduct = useCallback(
    (editingId: string | null, data: Omit<Product, "id">) =>
      run(async (): Promise<ActionResult> => {
        if (!userId) return NO_SESSION;
        try {
          const fields = {
            name: data.name,
            category: data.category,
            price: data.price,
            quantity: data.quantity,
          };
          if (editingId) {
            const { data: row, error } = await supabase
              .from("products")
              .update(fields)
              .eq("id", editingId)
              .select()
              .single();
            if (error) return fail(error);
            setProducts((cur) => cur.map((p) => (p.id === row.id ? toProduct(row) : p)));
            setNotice("Produto atualizado com sucesso.");
          } else {
            const { data: row, error } = await supabase
              .from("products")
              .insert(fields)
              .select()
              .single();
            if (error) return fail(error);
            setProducts((cur) => [...cur, toProduct(row)]);
            setNotice("Produto cadastrado com sucesso.");
          }
          return { ok: true };
        } catch (error) {
          return fail(error);
        }
      }),
    [run, userId],
  );

  const deleteProduct = useCallback(
    (product: Product) =>
      run(async (): Promise<ActionResult> => {
        if (!userId) return NO_SESSION;
        try {
          const { error } = await supabase.from("products").delete().eq("id", product.id);
          if (error) return fail(error);
          await reload(); // as movimentações do produto ficam sem vínculo; recarrega as duas listas
          setNotice("Produto excluído. O histórico de movimentações foi mantido.");
          return { ok: true };
        } catch (error) {
          return fail(error);
        }
      }),
    [run, userId, reload],
  );

  const registerMovement = useCallback(
    (input: MovementInput) =>
      run(async (): Promise<ActionResult> => {
        if (!userId) return NO_SESSION;
        if (!products.some((p) => p.id === input.productId)) {
          return { ok: false, error: "Selecione um produto." };
        }
        if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
          return { ok: false, error: "Informe uma quantidade inteira maior que zero." };
        }
        try {
          // O servidor confere sessão, dono do produto, tipo, quantidade e estoque, tudo em uma transação.
          const { error } = await supabase.rpc("register_movement", {
            p_product_id: input.productId,
            p_type: input.type,
            p_quantity: input.quantity,
            p_note: input.note.trim().slice(0, 120),
          });
          if (error) {
            if (error.message === "insufficient_stock") await reload(); // mostra o estoque real
            return fail(error);
          }
          await reload();
          setNotice(`${input.type === "entrada" ? "Entrada" : "Saída"} registrada com sucesso.`);
          return { ok: true };
        } catch (error) {
          return fail(error);
        }
      }),
    [run, userId, products, reload],
  );

  // Só ADICIONA produtos de exemplo. Nunca apaga nada.
  const addDemoProducts = useCallback(
    () =>
      run(async (): Promise<ActionResult> => {
        if (!userId) return NO_SESSION;
        try {
          const rows = initialProducts.map(({ name, category, price, quantity }) => ({
            name,
            category,
            price,
            quantity,
          }));
          const { error } = await supabase.from("products").insert(rows);
          if (error) return fail(error);
          await reload();
          setNotice("Produtos de exemplo adicionados.");
          return { ok: true };
        } catch (error) {
          return fail(error);
        }
      }),
    [run, userId, reload],
  );

  const importLocalData = useCallback(
    (payload: { products: ImportProduct[]; movements: ImportMovement[] }) =>
      run(async (): Promise<ImportResult> => {
        if (!userId) return NO_SESSION;
        try {
          const { data, error } = await supabase.rpc("import_local_data", {
            p_products: payload.products as Json,
            p_movements: payload.movements as Json,
          });
          if (error) return fail(error);
          const counts = parseImportCounts(data);
          if (!counts)
            return { ok: false, error: "Resposta inesperada do servidor. Nada foi confirmado." };
          await reload();
          return { ok: true, counts };
        } catch (error) {
          return fail(error);
        }
      }),
    [run, userId, reload],
  );

  const value = useMemo<StockContextValue>(
    () => ({
      products,
      movements,
      ready,
      loadError,
      saving,
      notice,
      notify: setNotice,
      dismissNotice: () => setNotice(""),
      reload,
      saveProduct,
      deleteProduct,
      registerMovement,
      addDemoProducts,
      importLocalData,
    }),
    [
      products,
      movements,
      ready,
      loadError,
      saving,
      notice,
      reload,
      saveProduct,
      deleteProduct,
      registerMovement,
      addDemoProducts,
      importLocalData,
    ],
  );

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>;
}

export function useStock() {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error("useStock precisa estar dentro de <StockProvider>.");
  return ctx;
}
