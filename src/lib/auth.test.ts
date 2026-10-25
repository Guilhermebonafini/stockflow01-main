import { describe, expect, it, vi } from "vitest";
import {
  authFailure,
  callbackUrl,
  classifyAuthError,
  maskEmail,
  parseCallbackUrl,
  resendConfirmation,
  signOutUser,
  signUpUser,
  type AuthLike,
} from "@/lib/auth";

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

describe("classifyAuthError", () => {
  it.each([
    [{ code: "over_email_send_rate_limit", status: 429 }, "rate_limit"],
    [{ status: 429 }, "rate_limit"],
    [{ code: "weak_password", status: 422 }, "weak_password"],
    [{ code: "email_address_invalid" }, "invalid_email"],
    [{ code: "signup_disabled" }, "signup_disabled"],
    [{ code: "email_address_not_authorized" }, "email_not_allowed"],
    [{ code: "user_already_exists" }, "already_registered"],
    [{ status: 503 }, "service"],
    [{ name: "AuthRetryableFetchError", message: "x", status: 0 }, "network"],
    [new TypeError("Failed to fetch"), "network"],
    [{ code: "algo_novo" }, "unknown"],
    [null, "unknown"],
  ])("%j -> %s", (error, kind) => {
    expect(classifyAuthError(error)).toBe(kind);
  });

  it("mostra mensagens amigáveis e nunca o texto interno do erro", () => {
    const f = authFailure({
      code: "unexpected_failure",
      status: 500,
      message: "stack: db password=abc123",
    });
    expect(f.kind).toBe("service");
    expect(f.error).not.toMatch(/stack|password|abc123/);
  });
});

const okAuth = (over: Partial<AuthLike> = {}): AuthLike => ({
  signUp: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
  resend: vi.fn().mockResolvedValue({ error: null }),
  ...over,
});

describe("signUpUser", () => {
  it("envia o e-mail sem espaços e o endereço de retorno fixo", async () => {
    const auth = okAuth();
    await signUpUser(auth, {
      email: "  a@b.com ",
      password: "12345678",
      redirectTo: "https://x.app/auth/callback",
    });
    expect(auth.signUp).toHaveBeenCalledWith({
      email: "a@b.com",
      password: "12345678",
      options: { emailRedirectTo: "https://x.app/auth/callback" },
    });
  });

  it("sem sessão = precisa confirmar o e-mail (não diz que a conta está ativa)", async () => {
    const r = await signUpUser(okAuth(), {
      email: "a@b.com",
      password: "12345678",
      redirectTo: "u",
    });
    expect(r).toEqual({ ok: true, needsConfirmation: true });
  });

  it("com sessão (confirmação desligada no Supabase) = entra direto", async () => {
    const auth = okAuth({
      signUp: vi.fn().mockResolvedValue({ data: { session: { x: 1 } }, error: null }),
    });
    expect(
      await signUpUser(auth, { email: "a@b.com", password: "12345678", redirectTo: "u" }),
    ).toEqual({
      ok: true,
      needsConfirmation: false,
    });
  });

  it("traduz erro do Supabase e falha de rede", async () => {
    const weak = okAuth({
      signUp: vi
        .fn()
        .mockResolvedValue({ data: { session: null }, error: { code: "weak_password" } }),
    });
    const r1 = await signUpUser(weak, { email: "a@b.com", password: "12345678", redirectTo: "u" });
    expect(r1).toMatchObject({ ok: false, kind: "weak_password" });

    const down = okAuth({ signUp: vi.fn().mockRejectedValue(new TypeError("Failed to fetch")) });
    const r2 = await signUpUser(down, { email: "a@b.com", password: "12345678", redirectTo: "u" });
    expect(r2).toMatchObject({ ok: false, kind: "network" });
  });
});

describe("resendConfirmation", () => {
  it("pede o reenvio do tipo signup com o endereço de retorno", async () => {
    const auth = okAuth();
    const r = await resendConfirmation(auth, {
      email: " a@b.com",
      redirectTo: "https://x.app/auth/callback",
    });
    expect(r).toEqual({ ok: true });
    expect(auth.resend).toHaveBeenCalledWith({
      type: "signup",
      email: "a@b.com",
      options: { emailRedirectTo: "https://x.app/auth/callback" },
    });
  });

  it("devolve limite de envios e falha de rede com tipos distintos", async () => {
    const limited = okAuth({
      resend: vi
        .fn()
        .mockResolvedValue({ error: { code: "over_email_send_rate_limit", status: 429 } }),
    });
    expect(await resendConfirmation(limited, { email: "a@b.com", redirectTo: "u" })).toMatchObject({
      kind: "rate_limit",
    });
    const down = okAuth({ resend: vi.fn().mockRejectedValue(new TypeError("x")) });
    expect(await resendConfirmation(down, { email: "a@b.com", redirectTo: "u" })).toMatchObject({
      kind: "network",
    });
  });
});

describe("maskEmail e callbackUrl", () => {
  it("esconde o começo do e-mail e mantém o domínio", () => {
    expect(maskEmail("joao.silva@gmail.com")).toBe("jo***@gmail.com");
    expect(maskEmail("ab@x.com")).toBe("a***@x.com");
    expect(maskEmail("sem-arroba")).toBe("***");
  });
  it("monta o retorno só com o endereço do próprio site e caminho fixo", () => {
    expect(callbackUrl("https://stockflow01-main.vercel.app")).toBe(
      "https://stockflow01-main.vercel.app/auth/callback",
    );
  });
});

describe("parseCallbackUrl", () => {
  it("link expirado", () => {
    expect(
      parseCallbackUrl("#error=access_denied&error_code=otp_expired&error_description=x", ""),
    ).toEqual({
      kind: "error",
      reason: "expired",
    });
  });
  it("outro erro = inválido", () => {
    expect(parseCallbackUrl("#error=access_denied&error_description=x", "")).toEqual({
      kind: "error",
      reason: "invalid",
    });
    expect(parseCallbackUrl("", "?error=server_error")).toEqual({
      kind: "error",
      reason: "invalid",
    });
  });
  it("retorno de confirmação de cadastro", () => {
    expect(
      parseCallbackUrl(
        "#access_token=a&refresh_token=b&expires_in=3600&token_type=bearer&type=signup",
        "",
      ),
    ).toEqual({ kind: "callback" });
  });
  it("página aberta sem link, ou com outro tipo de link, não conta como confirmação", () => {
    expect(parseCallbackUrl("", "")).toEqual({ kind: "none" });
    expect(parseCallbackUrl("#access_token=a&type=recovery", "")).toEqual({ kind: "none" });
  });
});
