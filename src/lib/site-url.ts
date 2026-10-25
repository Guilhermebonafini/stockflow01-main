import { callbackUrl } from "@/lib/auth";

// Endereço de retorno do link do e-mail para o navegador atual.
// VITE_SITE_URL é opcional e público: só serve para trocar o endereço do site publicado.
export function currentCallbackUrl(): string {
  const configured = import.meta.env["VITE_SITE_URL"] as string | undefined;
  return callbackUrl(window.location.origin, configured);
}
