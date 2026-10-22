import { formatCell, type ReportColumn, type ReportRow, type Tone } from "@/lib/reports";
import { EmptyState } from "@/components/common";

const TONE_CLASS: Record<Tone, string> = {
  good: "bg-success/10 text-success",
  warn: "bg-amber-500/15 text-amber-800",
  bad: "bg-destructive/10 text-destructive",
  info: "bg-primary/10 text-primary",
};

export const ROW_LIMIT = 200;

type Props = { columns: ReportColumn[]; rows: ReportRow[]; emptyMessage: string };

// Tabela genérica: serve para qualquer relatório definido em reports.ts.
export function ReportTable({ columns, rows, emptyMessage }: Props) {
  if (!rows.length) return <EmptyState message={emptyMessage} />;
  const shown = rows.slice(0, ROW_LIMIT);

  const cell = (col: ReportColumn, row: ReportRow) => {
    const value = row[col.key];
    const text = formatCell(col, value);
    const tone = value !== undefined ? col.tone?.(value) : undefined;
    return tone ? (
      <span
        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${TONE_CLASS[tone]}`}
      >
        {text}
      </span>
    ) : (
      text
    );
  };
  const numeric = (col: ReportColumn) => col.type === "integer" || col.type === "money";
  const [first, ...rest] = columns;

  return (
    <>
      {/* Celular: um cartão por linha */}
      <ul className="divide-y md:hidden">
        {shown.map((row, i) => (
          <li key={i} className="py-3">
            {first && <p className="text-sm font-bold">{cell(first, row)}</p>}
            <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
              {rest.map((col) => (
                <div key={col.key} className="contents">
                  <dt className="text-muted-foreground">{col.label}</dt>
                  <dd className="text-right font-medium">{cell(col, row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {/* Tablet e computador: tabela */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`pb-3 pr-3 font-semibold ${numeric(col) ? "text-right" : ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((row, i) => (
              <tr key={i} className="border-b last:border-0">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-3 pr-3 ${numeric(col) ? "text-right tabular-nums" : ""} ${col.key === "produto" ? "font-semibold" : ""}`}
                  >
                    {cell(col, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {rows.length > ROW_LIMIT
          ? `Mostrando ${ROW_LIMIT} de ${rows.length} registros. O CSV exporta todos.`
          : `${rows.length} registro(s).`}
      </p>
    </>
  );
}
