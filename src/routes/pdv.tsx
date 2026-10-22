import { createFileRoute } from "@tanstack/react-router";
import { Banknote, Barcode, Printer, ShoppingCart } from "lucide-react";
import { PageHeader, Panel } from "@/components/common";

export const Route = createFileRoute("/pdv")({
  head: () => ({ meta: [{ title: "PDV — StockFlow" }] }),
  component: PdvPage,
});

const PLANNED = [
  {
    icon: Barcode,
    title: "Leitor de código de barras",
    text: "Passe o produto no leitor e ele entra no carrinho.",
  },
  {
    icon: ShoppingCart,
    title: "Carrinho e total",
    text: "O valor da venda é calculado automaticamente.",
  },
  {
    icon: Banknote,
    title: "Dinheiro, Pix e cartão",
    text: "Registro da forma de pagamento de cada venda.",
  },
  { icon: Printer, title: "Comprovante", text: "Impressão em impressora térmica." },
];

function PdvPage() {
  return (
    <>
      <PageHeader title="PDV" subtitle="O caixa integrado ao estoque ainda não está disponível." />
      <Panel
        title="Em desenvolvimento"
        subtitle="Estas funções serão liberadas depois que o estoque e os relatórios estiverem validados."
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {PLANNED.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3 rounded-lg bg-muted/60 p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold">{title}</p>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
