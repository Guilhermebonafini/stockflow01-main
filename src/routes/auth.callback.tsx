import { createFileRoute } from "@tanstack/react-router";
import { EmailVerification } from "@/components/EmailVerification";

// Para onde o link do e-mail de confirmação volta (/auth/callback).
export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Confirmação de e-mail — StockFlow" }] }),
  component: EmailVerification,
});
