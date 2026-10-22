// Logo do StockFlow: três barras crescentes e uma seta, como na identidade visual.
export function Logo({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className="size-8 shrink-0" aria-hidden="true">
        <rect x="4" y="24" width="7" height="12" rx="1.5" fill="#2F7BFF" />
        <rect x="15" y="17" width="7" height="19" rx="1.5" fill="#2F7BFF" />
        <rect x="26" y="11" width="7" height="25" rx="1.5" fill="#2F7BFF" />
        <path d="M29.5 0.5 L37.5 9 H21.5 Z" fill="#2F7BFF" />
      </svg>
      <span
        className={`text-xl font-extrabold tracking-tight ${tone === "light" ? "text-white" : "text-[#0b2250]"}`}
      >
        Stock<span className="text-[#3b8bff]">Flow</span>
      </span>
    </span>
  );
}
