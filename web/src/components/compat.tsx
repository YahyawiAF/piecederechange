import Link from "next/link";
import { brandsLabel, compatSummary, type FitInfo } from "@/lib/compat";
import { MotoIcon } from "./icons";

/** One line on product cards: the motorcycle types (colored silhouettes) and brands a part is related to. */
export function CompatStrip({ fit, maxBrands = 2 }: { fit: FitInfo; maxBrands?: number }) {
  const s = compatSummary(fit);
  if (s.universal) {
    return (
      <span className="flex items-center gap-1.5 text-[12px] font-semibold text-ink2">
        <span className="rounded bg-sunk px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase">Universel</span>
        Toutes marques · tous types
      </span>
    );
  }
  if (!s.brands.length) return null;
  const label = `Compatible : ${s.brands.map((g) => g.brand.name).join(", ")} — ${s.types.map((t) => t.label).join(", ")}`;
  return (
    <span className="flex min-w-0 items-center gap-2" title={label} aria-label={label}>
      <span className="flex shrink-0 -space-x-1.5">
        {s.types.slice(0, 3).map((t) => (
          <span key={t.id} className="flex h-5 w-7 items-center justify-center rounded-md ring-2 ring-card" style={{ background: t.soft }}>
            <MotoIcon type={t.id} color={t.fg} width={22} strokeWidth={3.4} />
          </span>
        ))}
        {s.types.length > 3 && <span className="flex h-5 items-center rounded-md bg-sunk px-1 text-[10px] font-bold ring-2 ring-card">+{s.types.length - 3}</span>}
      </span>
      <span className="truncate text-[12px] font-semibold text-ink2">{brandsLabel(s, maxBrands)}</span>
    </span>
  );
}

/** Product page: every related brand and motorcycle type, each linking to the catalogue. */
export function CompatOverview({ fit, category }: { fit: FitInfo; category: string }) {
  const s = compatSummary(fit);
  return (
    <section aria-label="Marques et types compatibles" className="rounded-2xl border border-line bg-card p-3.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="kick">Compatible avec</span>
        <span className="text-xs text-mut">{s.universal ? "toutes les motos" : `${s.brands.length} marque${s.brands.length > 1 ? "s" : ""} · ${s.modelCount} modèle${s.modelCount > 1 ? "s" : ""}`}</span>
      </div>
      {s.universal ? (
        <p className="mt-2 text-sm text-ink2">Produit universel : toutes marques et tous types de moto et scooter.</p>
      ) : (
        <>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {s.types.map((t) => (
              <Link key={t.id} href={`/catalogue?cat=${category}&type=${encodeURIComponent(t.id)}`} className="tap flex h-9 items-center gap-1.5 rounded-full border-[1.5px] pr-3 pl-1.5 text-[13px] font-semibold" style={{ borderColor: t.fg, background: t.soft, color: t.ink }}>
                <MotoIcon type={t.id} color={t.fg} width={28} strokeWidth={3.2} />
                {t.allBikes ? `Tous les ${t.label}` : t.label}
              </Link>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {s.brands.map((g) => (
              <Link key={g.brand.id} href={`/catalogue?cat=${category}&brand=${g.brand.id}`} className="tap flex h-9 items-center gap-1.5 rounded-full border-[1.5px] border-line bg-card pr-3 pl-1 text-[13px] font-semibold hover:border-line2">
                <span className="disp flex size-7 items-center justify-center rounded-full bg-sunk text-[11.5px]">{g.brand.ini}</span>
                {g.brand.name}
                <span className="text-xs font-medium text-mut">{g.allModels ? "tous" : g.models.length}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
