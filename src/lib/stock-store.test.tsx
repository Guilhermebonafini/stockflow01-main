import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

type Listener = (event: string, session: { user: { id: string } } | null) => void;

const mock = vi.hoisted(() => ({
  session: null as { user: { id: string } } | null,
  listeners: [] as Listener[],
  tables: { products: [] as unknown[], movements: [] as unknown[] },
  failLoad: false,
  rpc: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => {
  const result = (t: "products" | "movements") =>
    mock.failLoad
      ? { data: null, error: { message: "Failed to fetch" } }
      : { data: mock.tables[t], error: null };
  return {
    supabase: {
      auth: {
        onAuthStateChange: (cb: Listener) => {
          mock.listeners.push(cb);
          return { data: { subscription: { unsubscribe: () => undefined } } };
        },
        getSession: async () => ({ data: { session: mock.session } }),
      },
      from: (t: "products" | "movements") => ({
        select: () => ({
          order: () =>
            Object.assign(Promise.resolve(result(t)), {
              limit: () => Promise.resolve(result(t)),
            }),
        }),
      }),
      rpc: (...args: unknown[]) => mock.rpc(...args),
    },
  };
});

import { StockProvider, useStock } from "@/lib/stock-store";

const row = (over: Record<string, unknown> = {}) => ({
  id: "p1",
  user_id: "u1",
  name: "Arroz",
  category: "Alimentos",
  price: 10,
  quantity: 3,
  min_quantity: 5,
  legacy_id: null,
  created_at: "2026-10-01T00:00:00Z",
  ...over,
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <StockProvider>{children}</StockProvider>
);

function signIn(id: string) {
  act(() => mock.listeners.forEach((l) => l("SIGNED_IN", { user: { id } })));
}
function signOut() {
  act(() => mock.listeners.forEach((l) => l("SIGNED_OUT", null)));
}

beforeEach(() => {
  mock.session = null;
  mock.listeners.length = 0;
  mock.tables.products = [row()];
  mock.tables.movements = [];
  mock.failLoad = false;
  mock.rpc.mockReset();
});

describe("StockProvider (Supabase)", () => {
  it("só carrega dados depois do login e limpa tudo ao sair", async () => {
    const { result } = renderHook(() => useStock(), { wrapper });
    expect(result.current.products).toHaveLength(0);
    expect(result.current.ready).toBe(false);

    signIn("u1");
    await waitFor(() => expect(result.current.products).toHaveLength(1));
    expect(result.current.ready).toBe(true);
    expect(result.current.products[0]?.name).toBe("Arroz");

    signOut();
    await waitFor(() => expect(result.current.products).toHaveLength(0));
    expect(result.current.ready).toBe(false);
  });

  it("não deixa dados da conta anterior aparecerem ao trocar de usuário", async () => {
    const { result } = renderHook(() => useStock(), { wrapper });
    signIn("u1");
    await waitFor(() => expect(result.current.products).toHaveLength(1));

    mock.tables.products = [];
    signIn("u2");
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.products).toHaveLength(0);
  });

  it("falha de conexão ao carregar: mostra erro, não apaga nada e libera a tela", async () => {
    mock.failLoad = true;
    const { result } = renderHook(() => useStock(), { wrapper });
    signIn("u1");
    await waitFor(() => expect(result.current.ready).toBe(true));
    expect(result.current.loadError).toMatch(/Sem conexão/);

    mock.failLoad = false;
    await act(() => result.current.reload());
    expect(result.current.loadError).toBe("");
    expect(result.current.products).toHaveLength(1);
  });

  it("saída maior que o estoque: o servidor recusa e o app não finge sucesso", async () => {
    mock.rpc.mockResolvedValue({
      data: null,
      error: { message: "insufficient_stock", details: "available=3" },
    });
    const { result } = renderHook(() => useStock(), { wrapper });
    signIn("u1");
    await waitFor(() => expect(result.current.products).toHaveLength(1));

    let r: Awaited<ReturnType<typeof result.current.registerMovement>> | undefined;
    await act(async () => {
      r = await result.current.registerMovement({
        productId: "p1",
        type: "saida",
        quantity: 99,
        note: "",
      });
    });
    expect(r).toEqual({ ok: false, error: "Estoque insuficiente. Disponível: 3 unidade(s)." });
    expect(result.current.notice).toBe("");
    expect(result.current.products[0]?.quantity).toBe(3);
  });

  it("entrada: só mostra sucesso depois do servidor confirmar e recarrega o estoque real", async () => {
    mock.rpc.mockImplementation(async () => {
      mock.tables.products = [row({ quantity: 8 })]; // o servidor atualizou
      return { data: { id: "m1" }, error: null };
    });
    const { result } = renderHook(() => useStock(), { wrapper });
    signIn("u1");
    await waitFor(() => expect(result.current.products).toHaveLength(1));

    await act(async () => {
      await result.current.registerMovement({
        productId: "p1",
        type: "entrada",
        quantity: 5,
        note: " x ",
      });
    });
    expect(mock.rpc).toHaveBeenCalledWith("register_movement", {
      p_product_id: "p1",
      p_type: "entrada",
      p_quantity: 5,
      p_note: "x",
    });
    expect(result.current.products[0]?.quantity).toBe(8);
    expect(result.current.notice).toBe("Entrada registrada com sucesso.");
  });

  it("recusa localmente quantidade inválida ou produto desconhecido, sem chamar o servidor", async () => {
    const { result } = renderHook(() => useStock(), { wrapper });
    signIn("u1");
    await waitFor(() => expect(result.current.products).toHaveLength(1));

    await act(async () => {
      expect(
        (
          await result.current.registerMovement({
            productId: "p1",
            type: "entrada",
            quantity: 0,
            note: "",
          })
        ).ok,
      ).toBe(false);
      expect(
        (
          await result.current.registerMovement({
            productId: "nao-existe",
            type: "entrada",
            quantity: 1,
            note: "",
          })
        ).ok,
      ).toBe(false);
    });
    expect(mock.rpc).not.toHaveBeenCalled();
  });

  it("sem sessão, nenhuma ação chega ao servidor", async () => {
    const { result } = renderHook(() => useStock(), { wrapper });
    let r: Awaited<ReturnType<typeof result.current.registerMovement>> | undefined;
    await act(async () => {
      r = await result.current.registerMovement({
        productId: "p1",
        type: "entrada",
        quantity: 1,
        note: "",
      });
    });
    expect(r?.ok).toBe(false);
    expect(mock.rpc).not.toHaveBeenCalled();
  });

  it("importação: envia os dados, devolve as contagens e trata erro do servidor", async () => {
    const counts = {
      products_imported: 1,
      products_skipped: 0,
      movements_imported: 0,
      movements_skipped: 0,
    };
    mock.rpc.mockResolvedValueOnce({ data: counts, error: null });
    const { result } = renderHook(() => useStock(), { wrapper });
    signIn("u1");
    await waitFor(() => expect(result.current.ready).toBe(true));

    let ok: Awaited<ReturnType<typeof result.current.importLocalData>> | undefined;
    await act(async () => {
      ok = await result.current.importLocalData({
        products: [{ id: "x", name: "A", category: "B", price: 1, quantity: 1 }],
        movements: [],
      });
    });
    expect(ok).toEqual({ ok: true, counts });

    mock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "invalid_product", details: "x" },
    });
    let bad: Awaited<ReturnType<typeof result.current.importLocalData>> | undefined;
    await act(async () => {
      bad = await result.current.importLocalData({ products: [], movements: [] });
    });
    expect(bad?.ok).toBe(false);
  });
});
