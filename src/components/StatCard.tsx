// Cartão de indicador do painel.
type Props = { label: string; value: string; tone?: "default" | "warning" };

export function StatCard({ label, value, tone = "default" }: Props) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={`mt-1 font-display text-2xl font-bold ${tone === "warning" ? "text-warning" : "text-foreground"}`}
      >
        {value}
      </p>
    </div>
  );
}
