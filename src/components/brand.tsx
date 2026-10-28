import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className={`brand${compact ? " brand-compact" : ""}`} aria-label="Overfox News, inicio">
    <span className="brand-symbol" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M5 5.5 16 10 27 5.5l-2.7 16L16 28l-8.3-6.5L5 5.5Z" fill="currentColor"/><path d="m9.5 14 6.5 4 6.5-4-3 8H12.5l-3-8Z" fill="#f3df50"/><path d="m12 15 2 1.2M20 15l-2 1.2" stroke="#f3df50" strokeWidth="1.6" strokeLinecap="round"/></svg></span>
    <span className="brand-type">overfox<span className="brand-news">news<span className="brand-dot">.</span></span></span>
  </Link>;
}
