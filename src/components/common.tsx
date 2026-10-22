import { useEffect, type ReactNode } from "react";
import { Package } from "lucide-react";
import { LOW_STOCK_LIMIT } from "@/data/products";

// Peças visuais reutilizadas em várias páginas.

export const btnPrimary =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50";
export const btnSecondary =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50";
export const btnDanger =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition hover:bg-destructive/90 active:scale-[.98]";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between lg:mb-6">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-[1.75rem]">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`min-w-0 rounded-xl border bg-card p-4 sm:p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h2 className="text-base font-bold">{title}</h2>}
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

// No celular os indicadores viram blocos coloridos, como no layout de referência.
const TONES = {
  blue: { icon: "bg-primary/10 text-primary", tile: "max-sm:bg-[#1f66e5]" },
  amber: { icon: "bg-amber-500/15 text-amber-700", tile: "max-sm:bg-[#c2610c]" },
  green: { icon: "bg-success/10 text-success", tile: "max-sm:bg-[#138a4b]" },
  violet: { icon: "bg-violet-500/10 text-violet-700", tile: "max-sm:bg-[#6a3fd0]" },
} as const;

export function KpiCard({
  label,
  value,
  detail,
  icon,
  tone = "blue",
}: {
  label: string;
  value: string;
  detail?: string;
  icon: ReactNode;
  tone?: keyof typeof TONES;
}) {
  const t = TONES[tone];
  return (
    <div
      className={`min-w-0 rounded-xl border bg-card p-4 max-sm:border-transparent max-sm:text-white ${t.tile}`}
    >
      <div className="flex flex-col items-start gap-2.5 sm:flex-row sm:gap-3">
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-lg max-sm:bg-white/20 max-sm:text-white ${t.icon}`}
        >
          {icon}
        </span>
        <div className="min-w-0 max-w-full">
          <p className="text-xs font-medium text-muted-foreground max-sm:text-white/85">{label}</p>
          <p className="mt-0.5 truncate text-xl font-extrabold sm:text-2xl">{value}</p>
          {detail && (
            <p className="text-[11px] text-muted-foreground max-sm:text-white/80">{detail}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function StockPill({ quantity }: { quantity: number }) {
  const tone =
    quantity <= 0
      ? "bg-destructive/10 text-destructive"
      : quantity <= LOW_STOCK_LIMIT
        ? "bg-amber-500/15 text-amber-800"
        : "bg-success/10 text-success";
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}
    >
      {quantity} un.
    </span>
  );
}

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-10 text-center">
      <Package size={28} className="mb-2 text-muted-foreground" aria-hidden="true" />
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// No celular abre de baixo para cima; em telas maiores, no centro.
export function Modal({
  children,
  onClose,
  label,
}: {
  children: ReactNode;
  onClose: () => void;
  label: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/50 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-card pb-[env(safe-area-inset-bottom)] sm:max-w-lg sm:rounded-2xl sm:pb-0"
      >
        {children}
      </div>
    </div>
  );
}
