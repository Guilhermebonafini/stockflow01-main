import type { ReactNode } from "react";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => ({ getSession: vi.fn(), getUser: vi.fn(), navigate: vi.fn() }));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: { getSession: mock.getSession, getUser: mock.getUser } },
}));
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mock.navigate,
  Link: ({ to, children, className }: { to: string; children: ReactNode; className?: string }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

import { EmailVerification } from "@/components/EmailVerification";

const OK_HASH = "#access_token=a&refresh_token=b&expires_in=3600&token_type=bearer&type=signup";
const open = (hash: string) => window.history.replaceState(null, "", `/auth/callback${hash}`);

beforeEach(() => {
  mock.getSession.mockReset().mockResolvedValue({ data: { session: null } });
  mock.getUser.mockReset();
  mock.navigate.mockReset();
});
afterEach(() => {
  cleanup();
  open("");
});

describe("EmailVerification", () => {
  it("só mostra 'E-mail verificado!' depois que o servidor confirma", async () => {
    let answer: (v: unknown) => void = () => undefined;
    mock.getUser.mockReturnValue(new Promise((resolve) => (answer = resolve)));
    open(OK_HASH);
    render(<EmailVerification />);

    expect(screen.getByRole("heading", { name: /Confirmando/ })).toBeTruthy();
    expect(screen.queryByText("E-mail verificado!")).toBeNull();

    answer({ data: { user: { email_confirmed_at: "2026-10-24T12:00:00Z" } }, error: null });
    expect(await screen.findByRole("heading", { name: "E-mail verificado!" })).toBeTruthy();
    expect(screen.getByText(/Sua conta foi confirmada com sucesso/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Acessar minha conta" }).getAttribute("href")).toBe(
      "/",
    );
  });

  it("usuário sem confirmação no servidor NÃO vê o sucesso", async () => {
    mock.getUser.mockResolvedValue({ data: { user: { email_confirmed_at: null } }, error: null });
    open(OK_HASH);
    render(<EmailVerification />);
    expect(await screen.findByRole("heading", { name: "Não foi possível confirmar" })).toBeTruthy();
    expect(screen.queryByText("E-mail verificado!")).toBeNull();
  });

  it("abrir a rota sem o link do e-mail (mesmo logado) não mostra sucesso nem consulta o servidor", async () => {
    open("");
    render(<EmailVerification />);
    expect(await screen.findByRole("heading", { name: "Nada para confirmar aqui" })).toBeTruthy();
    expect(screen.queryByText("E-mail verificado!")).toBeNull();
    expect(mock.getUser).not.toHaveBeenCalled();
  });

  it("link expirado", async () => {
    open(
      "#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired",
    );
    render(<EmailVerification />);
    expect(await screen.findByRole("heading", { name: "Link expirado" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ir para o login" }).getAttribute("href")).toBe(
      "/login",
    );
    expect(mock.getUser).not.toHaveBeenCalled();
  });

  it("link inválido (erro sem código de expiração)", async () => {
    open("#error=access_denied&error_description=algo");
    render(<EmailVerification />);
    expect(await screen.findByRole("heading", { name: "Não foi possível confirmar" })).toBeTruthy();
  });

  it("falha de rede ao validar", async () => {
    mock.getUser.mockResolvedValue({
      data: { user: null },
      error: { name: "AuthRetryableFetchError", message: "x", status: 0 },
    });
    open(OK_HASH);
    render(<EmailVerification />);
    expect(await screen.findByRole("heading", { name: "Sem conexão" })).toBeTruthy();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Tentar novamente" })).toBeTruthy(),
    );
    expect(screen.queryByText("E-mail verificado!")).toBeNull();
  });

  it("depois do sucesso, leva ao início do StockFlow em 5 segundos (e não antes)", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      mock.getUser.mockResolvedValue({
        data: { user: { email_confirmed_at: "2026-10-24T12:00:00Z" } },
        error: null,
      });
      open(OK_HASH);
      render(<EmailVerification />);
      expect(await screen.findByRole("heading", { name: "E-mail verificado!" })).toBeTruthy();
      expect(screen.getByText(/Entrando no StockFlow em 5 s/)).toBeTruthy();

      for (let i = 0; i < 4; i++) act(() => void vi.advanceTimersByTime(1000));
      expect(mock.navigate).not.toHaveBeenCalled();
      for (let i = 0; i < 2; i++) act(() => void vi.advanceTimersByTime(1000));
      expect(mock.navigate).toHaveBeenCalledWith({ to: "/", replace: true });
    } finally {
      vi.useRealTimers();
    }
  });

  it("nos erros (expirado, inválido, sem link) nunca redireciona sozinho", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      open("#error=access_denied&error_code=otp_expired");
      render(<EmailVerification />);
      expect(await screen.findByRole("heading", { name: "Link expirado" })).toBeTruthy();
      for (let i = 0; i < 10; i++) act(() => void vi.advanceTimersByTime(1000));
      expect(mock.navigate).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
});
