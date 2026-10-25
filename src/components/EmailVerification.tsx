import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { classifyAuthError, parseCallbackUrl, type CallbackInfo } from "@/lib/auth";

type Phase = "checking" | "success" | "expired" | "invalid" | "network" | "none";

const linkPrimary =
  "mt-6 block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700";
const linkSecondary =
  "mt-3 block w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

function Card({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div
          aria-hidden="true"
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
        >
          {icon}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {children}
      </section>
    </main>
  );
}

const svgProps = {
  viewBox: "0 0 24 24",
  className: "h-8 w-8",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
} as const;
const IconCheck = (
  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
    <svg {...svgProps}>
      <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);
const IconWarn = (
  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
    <svg {...svgProps}>
      <path
        d="M12 8v5m0 3.5h.01M10.3 4.2 2.7 17.5A2 2 0 0 0 4.4 20.5h15.2a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);
const IconSpin = (
  <span className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
);

// Mostra o resultado da confirmação de e-mail. "E-mail verificado!" só aparece depois
// que o SERVIDOR confirma (getUser com email_confirmed_at). Abrir a rota não basta.
export function EmailVerification() {
  const [phase, setPhase] = useState<Phase>("checking");

  // A URL é lida na primeira renderização, antes de o cliente do Supabase processar
  // e limpar o "#" do endereço.
  const [info] = useState<CallbackInfo | null>(() =>
    typeof window === "undefined"
      ? null
      : parseCallbackUrl(window.location.hash, window.location.search),
  );

  useEffect(() => {
    if (!info) return;
    if (info.kind === "error") return setPhase(info.reason);
    if (info.kind === "none") return setPhase("none");

    let active = true;
    (async () => {
      try {
        await supabase.auth.getSession(); // espera o cliente terminar de ler o link
        const { data, error } = await supabase.auth.getUser(); // pergunta ao servidor
        if (!active) return;
        if (error) {
          setPhase(classifyAuthError(error) === "network" ? "network" : "invalid");
        } else {
          setPhase(data.user?.email_confirmed_at ? "success" : "invalid");
        }
      } catch (error) {
        if (active) setPhase(classifyAuthError(error) === "network" ? "network" : "invalid");
      }
    })();
    return () => {
      active = false;
    };
  }, [info]);

  if (phase === "checking") {
    return (
      <Card icon={IconSpin} title="Confirmando seu e-mail...">
        <p role="status" className="mt-3 text-sm text-slate-500">
          Isso leva só um instante.
        </p>
      </Card>
    );
  }

  if (phase === "success") {
    return (
      <Card icon={IconCheck} title="E-mail verificado!">
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Sua conta foi confirmada com sucesso. Agora você pode acessar o StockFlow.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Bem-vindo! Cadastre seus produtos e comece a acompanhar o seu estoque.
        </p>
        <Link to="/" className={linkPrimary}>
          Acessar minha conta
        </Link>
      </Card>
    );
  }

  if (phase === "expired") {
    return (
      <Card icon={IconWarn} title="Link expirado">
        <p role="alert" className="mt-3 text-sm leading-relaxed text-slate-600">
          Este link de confirmação expirou ou já foi usado. Se a sua conta já foi confirmada, é só
          entrar. Se não, faça o cadastro de novo para receber outro e-mail.
        </p>
        <Link to="/login" className={linkPrimary}>
          Ir para o login
        </Link>
        <Link to="/cadastro" className={linkSecondary}>
          Voltar ao cadastro
        </Link>
      </Card>
    );
  }

  if (phase === "network") {
    return (
      <Card icon={IconWarn} title="Sem conexão">
        <p role="alert" className="mt-3 text-sm leading-relaxed text-slate-600">
          Não foi possível confirmar agora, porque a conexão falhou. Verifique sua internet e tente
          de novo. O link continua válido.
        </p>
        <button type="button" onClick={() => window.location.reload()} className={linkPrimary}>
          Tentar novamente
        </button>
      </Card>
    );
  }

  if (phase === "none") {
    return (
      <Card icon={IconWarn} title="Nada para confirmar aqui">
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Esta página abre pelo link do e-mail de confirmação. Se você ainda não confirmou, abra a
          mensagem que enviamos e clique em <strong>Confirmar meu e-mail</strong>.
        </p>
        <Link to="/login" className={linkPrimary}>
          Ir para o login
        </Link>
        <Link to="/cadastro" className={linkSecondary}>
          Criar conta
        </Link>
      </Card>
    );
  }

  return (
    <Card icon={IconWarn} title="Não foi possível confirmar">
      <p role="alert" className="mt-3 text-sm leading-relaxed text-slate-600">
        Este link não é válido. Ele pode ter sido copiado incompleto. Tente abrir o e-mail de novo e
        clicar no botão, ou faça o cadastro novamente.
      </p>
      <Link to="/login" className={linkPrimary}>
        Ir para o login
      </Link>
      <Link to="/cadastro" className={linkSecondary}>
        Voltar ao cadastro
      </Link>
    </Card>
  );
}
