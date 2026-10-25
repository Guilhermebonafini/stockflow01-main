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
