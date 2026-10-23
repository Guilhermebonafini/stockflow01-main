// Traduz erros do banco em mensagens simples. Nunca repassa detalhes internos ao usuário.

export type DbError =
  { message?: string | null; details?: string | null; code?: string | null } | null | undefined;

const SESSION_MESSAGE = "Sua sessão expirou. Entre novamente para continuar.";
const NETWORK_MESSAGE = "Sem conexão com o servidor. Verifique sua internet e tente de novo.";

export function friendlyDbError(error: unknown): string {
  if (error instanceof TypeError) return NETWORK_MESSAGE;
  const e = (typeof error === "object" && error !== null ? error : {}) as NonNullable<DbError>;
  const message = e.message ?? "";
  const details = e.details ?? "";

  if (message === "insufficient_stock") {
    const available = /available=(\d+)/.exec(details)?.[1];
    return available === undefined
      ? "Estoque insuficiente para esta saída."
      : `Estoque insuficiente. Disponível: ${available} unidade(s).`;
  }
  if (message === "invalid_quantity") return "Informe uma quantidade inteira maior que zero.";
  if (message === "invalid_type") return "Tipo de movimentação inválido.";
  if (message === "product_not_found")
    return "Produto não encontrado. Atualize a página e tente de novo.";
  if (message === "not_authenticated" || /jwt/i.test(message) || e.code === "PGRST301") {
    return SESSION_MESSAGE;
  }
  if (/failed to fetch|network|load failed/i.test(message)) return NETWORK_MESSAGE;
  if (e.code === "PGRST116") return "Registro não encontrado. Atualize a página e tente de novo.";
  if (e.code === "23514") return "Algum valor está fora do permitido. Confira os campos.";
  return "Não foi possível concluir a operação. Tente novamente.";
}
