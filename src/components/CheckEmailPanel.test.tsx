import type { ReactNode } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mock = vi.hoisted(() => ({ resend: vi.fn() }));

vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: { resend: mock.resend } } }));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, className }: { to: string; children: ReactNode; className?: string }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

import { CheckEmailPanel } from "@/components/CheckEmailPanel";

const tick = (seconds: number) => {
  for (let i = 0; i < seconds; i++) act(() => void vi.advanceTimersByTime(1000));
};
const button = () => screen.getByRole("button");

beforeEach(() => {
  vi.useFakeTimers();
  mock.resend.mockReset();
});
afterEach(() => vi.useRealTimers());

describe("CheckEmailPanel", () => {
  it("dá boas-vindas, mostra o e-mail mascarado e NÃO diz que a conta está confirmada", () => {
    render(<CheckEmailPanel email="joao.silva@gmail.com" />);
    expect(screen.getByRole("heading", { name: "Bem-vindo ao StockFlow!" })).toBeTruthy();
    expect(screen.getByText("jo***@gmail.com")).toBeTruthy();
    expect(screen.queryByText(/joao\.silva/)).toBeNull();
    expect(screen.queryByText(/verificado/i)).toBeNull();
    expect(screen.getByRole("link", { name: /voltar para o login/i }).getAttribute("href")).toBe(
      "/login",
    );
  });

  it("segura o reenvio durante os primeiros 60 segundos", () => {
    render(<CheckEmailPanel email="a@b.com" />);
    expect((button() as HTMLButtonElement).disabled).toBe(true);
    expect(button().textContent).toMatch(/em 60 s/);
    tick(60);
    expect((button() as HTMLButtonElement).disabled).toBe(false);
  });

  it("reenvia uma vez, mostra carregamento e não afirma que o e-mail foi entregue", async () => {
    let finish: (v: { error: null }) => void = () => undefined;
    mock.resend.mockReturnValue(new Promise((resolve) => (finish = resolve)));
    render(<CheckEmailPanel email="a@b.com" />);
    tick(60);

    fireEvent.click(button());
    fireEvent.click(button()); // segundo clique enquanto envia
    expect(button().textContent).toMatch(/Enviando/);
    expect((button() as HTMLButtonElement).disabled).toBe(true);
    expect(mock.resend).toHaveBeenCalledTimes(1);
    expect(mock.resend.mock.calls[0]?.[0]).toMatchObject({ type: "signup", email: "a@b.com" });

    await act(async () => finish({ error: null }));
    const msg = screen.getByRole("status").textContent ?? "";
    expect(msg).toMatch(/Pedido de reenvio/);
    expect(msg).not.toMatch(/entregue|chegou|confirmad/i);
    expect(button().textContent).toMatch(/em 60 s/); // novo intervalo de espera
  });

  it("limite de solicitações: avisa e volta a esperar", async () => {
    mock.resend.mockResolvedValue({ error: { code: "over_email_send_rate_limit", status: 429 } });
    render(<CheckEmailPanel email="a@b.com" />);
    tick(60);
    await act(async () => fireEvent.click(button()));
    expect(screen.getByRole("alert").textContent).toMatch(/Muitas solicitações/);
    expect((button() as HTMLButtonElement).disabled).toBe(true);
  });

  it("falha de conexão: avisa e deixa tentar de novo na hora", async () => {
    mock.resend.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<CheckEmailPanel email="a@b.com" />);
    tick(60);
    await act(async () => fireEvent.click(button()));
    expect(screen.getByRole("alert").textContent).toMatch(/Não foi possível conectar/);
    expect((button() as HTMLButtonElement).disabled).toBe(false);
  });
});
