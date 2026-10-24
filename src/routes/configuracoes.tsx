import { createFileRoute } from "@tanstack/react-router";
import { LocalImportPanel } from "@/components/LocalImportPanel";
import { PageHeader, Panel, btnSecondary } from "@/components/common";
import { useStock } from "@/lib/stock-store";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — StockFlow" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { products, movements, ready, saving, addDemoProducts, notify } = useStock();

  return (
    <>
      <PageHeader
        title="Configurações"
        subtitle="Dados da sua conta e importação de dados antigos."
      />
      <div className="space-y-5">
        <Panel title="Dados da sua conta">
          <p className="max-w-2xl text-sm text-muted-foreground">
            Seus produtos e movimentações ficam salvos na sua conta e aparecem em qualquer aparelho
            em que você entrar. Outras contas não têm acesso a eles.
          </p>
          <p className="mt-3 text-sm font-semibold">
            {ready
              ? `Salvos agora: ${products.length} produto(s) e ${movements.length} movimentação(ões).`
              : "Carregando seus dados..."}
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              className={btnSecondary}
              disabled={!ready || saving}
              onClick={() => {
                if (
                  confirm(
                    "Adicionar 5 produtos de exemplo à sua conta? Nenhum dado existente será apagado.",
                  )
                )
                  void addDemoProducts().then((r) => {
                    if (!r.ok) notify(r.error);
                  });
              }}
            >
              Adicionar produtos de exemplo
            </button>
          </div>
        </Panel>
        <LocalImportPanel />
      </div>
    </>
  );
}
