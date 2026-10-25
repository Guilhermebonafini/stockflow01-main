import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { maskEmail, resendConfirmation } from "@/lib/auth";
import { currentCallbackUrl } from "@/lib/site-url";

// O Supabase aceita um novo e-mail por usuário a cada 60 segundos.
const COOLDOWN_SECONDS = 60;

type Feedback = { tone: "success" | "error"; text: string } | null;

// Tela de boas-vindas depois do cadastro. Ela NUNCA diz que a conta foi confirmada:
// só o retorno do link do e-mail (rota /auth/callback) prova isso.
export function CheckEmailPanel({ email }: { email: string }) {
  const [secondsLeft, setSecondsLeft] = useState(COOLDOWN_SECONDS);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  async function handleResend() {
    if (sending || secondsLeft > 0) return;
    setSending(true);
    setFeedback(null);
    const result = await resendConfirmation(supabase.auth, {
      email,
      redirectTo: currentCallbackUrl(),
    });
    setSending(false);

    if (result.ok) {
      setSecondsLeft(COOLDOWN_SECONDS);
      setFeedback({
        tone: "success",
        text: "Pedido de reenvio feito. O e-mail pode levar alguns minutos para chegar. Olhe também a caixa de spam.",
      });
      return;
    }
    if (result.kind === "rate_limit") setSecondsLeft(COOLDOWN_SECONDS);
    setFeedback({ tone: "error", text: result.error });
  }

  const blocked = sending || secondsLeft > 0;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div
          aria-hidden="true"
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect x="3" y="5" width="18" height="14" rx="2.5" />
            <path d="m4 7.5 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Bem-vindo ao StockFlow!
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Para concluir o cadastro, confirme o seu e-mail. Enviamos um link para{" "}
          <strong className="font-semibold text-slate-900">{maskEmail(email)}</strong>. Abra a
          mensagem e clique em <strong className="font-semibold">Confirmar meu e-mail</strong>.
        </p>

        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Sua conta só fica ativa depois dessa confirmação. Se o e-mail não chegar em alguns
          minutos, olhe a caixa de spam ou peça um novo envio.
        </p>

        <div aria-live="polite" className="mt-5 min-h-5">
          {feedback && (
            <p
              role={feedback.tone === "error" ? "alert" : "status"}
              className={`rounded-lg p-3 text-sm ${
                feedback.tone === "error" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-800"
              }`}
            >
              {feedback.text}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleResend}
          disabled={blocked}
          aria-busy={sending}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {sending
            ? "Enviando..."
            : secondsLeft > 0
              ? `Reenviar e-mail em ${secondsLeft} s`
              : "Reenviar e-mail de confirmação"}
        </button>

        <p className="mt-6 text-sm text-slate-500">
          Já confirmou?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Voltar para o login
          </Link>
        </p>
      </section>
    </main>
  );
}
