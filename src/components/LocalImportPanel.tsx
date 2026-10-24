import { useEffect, useMemo, useState } from "react";
import { Panel, btnDanger, btnPrimary } from "@/components/common";
import {
  LOCAL_MOVEMENTS_KEY,
  LOCAL_PRODUCTS_KEY,
  buildImportPreview,
  readLocalData,
  type ImportCounts,
  type RawLocalData,
  type Rejected,
} from "@/lib/local-import";
import { useStock } from "@/lib/stock-store";

// Importa os produtos e movimentações que a versão antiga guardava neste navegador.
// Nada é gravado sem o clique do usuário, e a cópia local só pode ser apagada depois do sucesso.

function RejectedList({ title, items }: { title: string; items: Rejected[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
      <p className="font-semibold text-destructive">
        {title}: {items.length} registro(s) não serão importados
      </p>
      <ul className="mt-1 list-disc pl-5 text-muted-foreground">
        {items.slice(0, 8).map((r, i) => (
          <li key={`${r.label}-${i}`}>
            {r.label}: {r.reason}
          </li>
        ))}
      </ul>
      {items.length > 8 && (
        <p className="mt-1 text-xs text-muted-foreground">e mais {items.length - 8}.</p>
      )}
    </div>
  );
}

export function LocalImportPanel() {
  const { importLocalData, saving, ready } = useStock();
  const [raw, setRaw] = useState<RawLocalData | null>(null);
  const [includeDemo, setIncludeDemo] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [counts, setCounts] = useState<ImportCounts | null>(null);
  const [error, setError] = useState("");
  const [localCleared, setLocalCleared] = useState(false);

  // O localStorage só existe no navegador, por isso a leitura acontece depois da montagem.
  useEffect(() => setRaw(readLocalData(localStorage)), []);

  const preview = useMemo(
    () => (raw && raw.ok ? buildImportPreview(raw, { includeDemo }) : null),
    [raw, includeDemo],
  );

  async function handleImport() {
    if (!preview) return;
    setError("");
    const result = await importLocalData({
      products: preview.products,
      movements: preview.movements,
    });
    if (result.ok) setCounts(result.counts);
    else setError(result.error);
  }

  function clearLocalCopy() {
    if (
      !confirm(
        "Apagar a cópia antiga deste navegador? Seus dados já estão na conta e continuarão lá.",
      )
    )
      return;
    localStorage.removeItem(LOCAL_PRODUCTS_KEY);
    localStorage.removeItem(LOCAL_MOVEMENTS_KEY);
    setRaw(readLocalData(localStorage));
    setLocalCleared(true);
  }

  const title = "Importar dados antigos deste navegador";

  if (!raw) return <Panel title={title}>{null}</Panel>;

  if (!raw.ok) {
    return (
      <Panel title={title}>
        <p role="alert" className="text-sm font-medium text-destructive">
          {raw.error}
        </p>
      </Panel>
    );
  }

  const hasLocal = raw.products.length + raw.movements.length > 0;

  if (!hasLocal) {
    return (
      <Panel title={title}>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {localCleared
            ? "A cópia antiga foi apagada deste navegador."
            : "Não há dados antigos neste navegador."}
        </p>
      </Panel>
    );
  }

  return (
    <Panel
      title={title}
      subtitle="Versões anteriores guardavam produtos e movimentações só neste aparelho."
    >
      <div className="max-w-2xl space-y-4">
        {preview && (
          <p className="text-sm">
            Prontos para importar: <strong>{preview.products.length} produto(s)</strong> e{" "}
            <strong>{preview.movements.length} movimentação(ões)</strong>.
          </p>
        )}

        {preview && preview.demoProducts.length > 0 && (
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={includeDemo}
              onChange={(e) => setIncludeDemo(e.target.checked)}
              disabled={counts !== null}
            />
            <span>
              Incluir os {preview.demoProducts.length} produtos de demonstração. Eles foram criados
              automaticamente pelo app, por isso ficam de fora por padrão
              {!includeDemo && preview.demoMovementsExcluded > 0
                ? ` (${preview.demoMovementsExcluded} movimentação(ões) deles também)`
                : ""}
              .
            </span>
          </label>
        )}

        {preview && <RejectedList title="Produtos" items={preview.rejectedProducts} />}
        {preview && <RejectedList title="Movimentações" items={preview.rejectedMovements} />}

        {counts === null && (
          <>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              <span>
                Estes dados são da conta com a qual entrei agora. Se outra pessoa usou este
                navegador, o que está aqui pode ser dela.
              </span>
            </label>
            <button
              className={btnPrimary}
              onClick={handleImport}
              disabled={
                !confirmed ||
                saving ||
                !ready ||
                !preview ||
                preview.products.length + preview.movements.length === 0
              }
            >
              {saving ? "Importando..." : "Importar para minha conta"}
            </button>
          </>
        )}

        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error} Nada foi importado.
          </p>
        )}

        {counts && (
          <div role="status" className="rounded-lg border bg-secondary p-3 text-sm">
            <p className="font-semibold">Importação concluída.</p>
            <p className="mt-1">
              Produtos: {counts.products_imported} importado(s), {counts.products_skipped} já
              existia(m). Movimentações: {counts.movements_imported} importada(s),{" "}
              {counts.movements_skipped} já existia(m).
            </p>
            <button className={`${btnDanger} mt-3`} onClick={clearLocalCopy}>
              Apagar a cópia antiga deste navegador
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
}
