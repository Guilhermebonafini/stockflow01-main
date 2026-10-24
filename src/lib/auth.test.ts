import { describe, expect, it, vi } from "vitest";
import { signOutUser } from "@/lib/auth";

describe("signOutUser", () => {
  it("devolve ok quando o Supabase encerra a sessão", async () => {
    const signOut = vi.fn().mockResolvedValue({ error: null });
    expect(await signOutUser({ signOut })).toEqual({ ok: true });
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it("não finge que saiu quando o Supabase devolve erro", async () => {
    const r = await signOutUser({ signOut: async () => ({ error: { message: "x" } }) });
    expect(r.ok).toBe(false);
  });

  it("trata falha de rede sem lançar erro e sem vazar detalhes", async () => {
    const r = await signOutUser({
      signOut: async () => {
        throw new TypeError("Failed to fetch https://segredo.supabase.co");
      },
    });
    expect(r).toEqual({
      ok: false,
      error: "Não foi possível sair agora. Verifique sua conexão e tente de novo.",
    });
  });
});
