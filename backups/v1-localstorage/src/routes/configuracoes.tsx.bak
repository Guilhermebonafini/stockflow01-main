import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, btnDanger, btnSecondary } from "@/components/common";
import { useStock } from "@/lib/stock-store";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — StockFlow" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { products, movements, clearAllData, loadDemoData } = useStock();

  return (
    <>
      <PageHeader title="Configurações" subtitle="Gerencie os dados salvos neste navegador." />
      <Panel title="Dados deste navegador">
        <p className="max-w-2xl text-sm text-muted-foreground">
          O StockFlow guarda os produtos e as movimentações neste aparelho. Eles não são enviados a
          nenhum servidor e não aparecem em outros aparelhos nem para outras pessoas.
        </p>
        <p className="mt-3 text-sm font-semibold">
          Salvos agora: {products.length} produto(s) e {movements.length} movimentação(ões).
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            className={btnSecondary}
            onClick={() => {
              if (
                confirm(
                  "Substituir todos os dados pelos produtos de demonstração? O histórico será apagado.",
                )
              )
                loadDemoData();
            }}
          >
            Carregar dados de demonstração
          </button>
          <button
            className={btnDanger}
            onClick={() => {
              if (
                confirm(
                  "Apagar TODOS os produtos e movimentações deste navegador? Esta ação não pode ser desfeita.",
                )
              )
                clearAllData();
            }}
          >
            Apagar todos os dados
          </button>
        </div>
      </Panel>
    </>
  );
}
