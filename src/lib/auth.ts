// Encerra a sessão no Supabase. Se não houver conexão, a sessão continua ativa:
// por isso devolvemos um erro claro em vez de fingir que saiu.

export type SignOutResult = { ok: true } | { ok: false; error: string };

export async function signOutUser(auth: {
  signOut: () => Promise<{ error: unknown }>;
}): Promise<SignOutResult> {
  try {
    const { error } = await auth.signOut();
    if (error) {
      return {
        ok: false,
        error: "Não foi possível sair agora. Verifique sua conexão e tente de novo.",
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Não foi possível sair agora. Verifique sua conexão e tente de novo.",
    };
  }
}

// ---------------------------------------------------------------------------
// Cadastro, reenvio de confirmação e retorno do link do e-mail
// ---------------------------------------------------------------------------

export type AuthErrorKind =
  | "rate_limit"
  | "weak_password"
  | "invalid_email"
  | "network"
  | "service"
  | "signup_disabled"
  | "email_not_allowed"
  | "already_registered"
  | "unknown";

export type AuthFailure = { ok: false; kind: AuthErrorKind; error: string };

const asRecord = (v: unknown): Record<string, unknown> =>
  typeof v === "object" && v !== null ? (v as Record<string, unknown>) : {};

// Descobre o TIPO do erro olhando só o código e o status que o Supabase devolve.
// Nunca usamos o texto original na tela, porque ele pode trazer detalhes internos.
export function classifyAuthError(error: unknown): AuthErrorKind {
  if (error instanceof TypeError) return "network";
  const e = asRecord(error);
  const code = typeof e["code"] === "string" ? e["code"] : "";
  const name = typeof e["name"] === "string" ? e["name"] : "";
  const status = typeof e["status"] === "number" ? e["status"] : 0;
  const message = typeof e["message"] === "string" ? e["message"] : "";

  if (name === "AuthRetryableFetchError" || /failed to fetch|network|load failed/i.test(message)) {
    return "network";
  }
  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    status === 429
  ) {
    return "rate_limit";
  }
  if (code === "weak_password" || name === "AuthWeakPasswordError") return "weak_password";
  if (code === "email_address_invalid" || code === "validation_failed") return "invalid_email";
  if (code === "signup_disabled" || code === "email_provider_disabled") return "signup_disabled";
  if (code === "email_address_not_authorized") return "email_not_allowed";
  if (code === "user_already_exists" || code === "email_exists") return "already_registered";
  if (
    status >= 500 ||
    code === "unexpected_failure" ||
    code === "request_timeout" ||
    code === "hook_timeout"
  ) {
    return "service";
  }
  return "unknown";
}

const MESSAGES: Record<AuthErrorKind, string> = {
  rate_limit: "Muitas solicitações em pouco tempo. Aguarde cerca de um minuto e tente de novo.",
  weak_password:
    "Essa senha é fraca demais. Use pelo menos 8 caracteres, misturando letras e números.",
  invalid_email: "Esse endereço de e-mail não parece válido. Confira e tente de novo.",
  network: "Não foi possível conectar. Verifique sua internet e tente novamente.",
  service: "O serviço está com instabilidade no momento. Tente novamente em alguns minutos.",
  signup_disabled: "Novos cadastros estão temporariamente indisponíveis. Tente mais tarde.",
  email_not_allowed:
    "Não conseguimos enviar o e-mail de confirmação para esse endereço agora. Tente outro endereço ou fale com o suporte.",
  already_registered: "Esse e-mail já possui cadastro. Entre na sua conta ou recupere o acesso.",
  unknown: "Não foi possível concluir a operação. Confira os dados e tente novamente.",
};

export function authFailure(error: unknown): AuthFailure {
  const kind = classifyAuthError(error);
  return { ok: false, kind, error: MESSAGES[kind] };
}

// Formato mínimo do cliente de autenticação. O supabase.auth real se encaixa aqui.
export type AuthLike = {
  signUp(credentials: {
    email: string;
    password: string;
    options?: { emailRedirectTo?: string };
  }): Promise<{ data: { session: unknown }; error: unknown }>;
  resend(params: {
    type: "signup";
    email: string;
    options?: { emailRedirectTo?: string };
  }): Promise<{ error: unknown }>;
};

export type SignUpResult = { ok: true; needsConfirmation: boolean } | AuthFailure;

// Quando o Supabase pede confirmação, NÃO existe sessão: needsConfirmation = true.
// Não distinguimos e-mail novo de e-mail já existente: o Supabase esconde isso de propósito.
export async function signUpUser(
  auth: AuthLike,
  input: { email: string; password: string; redirectTo: string },
): Promise<SignUpResult> {
  try {
    const { data, error } = await auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: { emailRedirectTo: input.redirectTo },
    });
    if (error) return authFailure(error);
    return { ok: true, needsConfirmation: !data.session };
  } catch (error) {
    return authFailure(error);
  }
}

// "ok" significa só que o pedido de envio foi ACEITO. Não prova que o e-mail chegou.
export async function resendConfirmation(
  auth: AuthLike,
  input: { email: string; redirectTo: string },
): Promise<{ ok: true } | AuthFailure> {
  try {
    const { error } = await auth.resend({
      type: "signup",
      email: input.email.trim(),
      options: { emailRedirectTo: input.redirectTo },
    });
    if (error) return authFailure(error);
    return { ok: true };
  } catch (error) {
    return authFailure(error);
  }
}

// "joao.silva@gmail.com" -> "jo***@gmail.com"
export function maskEmail(email: string): string {
  const [local = "", domain = ""] = email.trim().split("@");
  if (!domain) return "***";
  const visible = local.length > 2 ? local.slice(0, 2) : local.slice(0, 1);
  return `${visible}***@${domain}`;
}

// Site publicado do StockFlow. É o destino dos links de e-mail quando o cadastro é feito
// de um endereço local (localhost). Pode ser trocado pela variável pública VITE_SITE_URL.
export const DEFAULT_SITE_URL = "https://stockflow01-main.vercel.app";

function isLocalHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".local") ||
    /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname)
  );
}

// Só aceita endereço https válido. Qualquer outra coisa volta para o site padrão.
export function publicSiteUrl(configured?: string): string {
  try {
    const url = new URL(configured ?? "");
    if (url.protocol === "https:") return url.origin;
  } catch {
    // valor ausente ou inválido: usa o padrão
  }
  return DEFAULT_SITE_URL;
}

// Endereço para onde o link do e-mail volta. Caminho fixo (/auth/callback) e origem sempre
// do próprio site ou do site publicado: nenhum valor vindo da URL ou do usuário entra aqui.
// Cadastros feitos em localhost ou na rede local apontam para o site publicado, porque um
// link com "localhost" só abriria no computador de quem está desenvolvendo.
export function callbackUrl(origin: string, configuredSite?: string): string {
  let base: string;
  try {
    base = isLocalHost(new URL(origin).hostname) ? publicSiteUrl(configuredSite) : origin;
  } catch {
    base = publicSiteUrl(configuredSite);
  }
  return `${base}/auth/callback`;
}

export type CallbackInfo =
  { kind: "error"; reason: "expired" | "invalid" } | { kind: "callback" } | { kind: "none" };

// Lê o que o Supabase deixou na URL ao voltar do e-mail. Só olha a FORMA da URL:
// quem decide se a conta foi mesmo confirmada é o servidor (getUser), nunca esta função.
export function parseCallbackUrl(hash: string, search: string): CallbackInfo {
  const params = new URLSearchParams(`${hash.replace(/^#/, "")}&${search.replace(/^\?/, "")}`);
  const errorCode = params.get("error_code");
  if (errorCode || params.get("error") || params.get("error_description")) {
    return { kind: "error", reason: errorCode === "otp_expired" ? "expired" : "invalid" };
  }
  if (params.get("access_token") && params.get("type") === "signup") return { kind: "callback" };
  return { kind: "none" };
}
