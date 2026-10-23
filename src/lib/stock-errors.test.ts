import { describe, expect, it } from "vitest";
import { friendlyDbError } from "@/lib/stock-errors";

describe("friendlyDbError", () => {
  it("mostra o estoque disponível numa saída recusada", () => {
    expect(friendlyDbError({ message: "insufficient_stock", details: "available=7" })).toBe(
      "Estoque insuficiente. Disponível: 7 unidade(s).",
    );
  });
  it("traduz sessão expirada", () => {
    expect(friendlyDbError({ message: "JWT expired" })).toMatch(/sessão expirou/);
    expect(friendlyDbError({ message: "not_authenticated" })).toMatch(/sessão expirou/);
  });
  it("traduz falha de conexão", () => {
    expect(friendlyDbError(new TypeError("Failed to fetch"))).toMatch(/Sem conexão/);
    expect(friendlyDbError({ message: "Failed to fetch" })).toMatch(/Sem conexão/);
  });
  it("não vaza detalhes internos de erros desconhecidos", () => {
    const msg = friendlyDbError({ message: 'relation "products" does not exist', code: "42P01" });
    expect(msg).toBe("Não foi possível concluir a operação. Tente novamente.");
    expect(msg).not.toMatch(/products|42P01/);
  });
});
