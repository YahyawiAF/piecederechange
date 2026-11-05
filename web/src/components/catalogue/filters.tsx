"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, useTransition } from "react";
import { ALL_TYPE, BRANDS, CC_RANGES, TYPES, brandsForType, modelById, tileStyle, typeById, type MotoTypeId } from "@/lib/moto";
import { CATEGORIES, CONDITIONS, plural } from "@/lib/catalog";
import { scopeTitle, toQuery } from "@/lib/filters";
import type { CatalogFilters, Condition } from "@/lib/types";
import { CheckIcon, ChevronRight, CloseIcon, FilterIcon, GridIcon, MotoIcon, PartIcon, SortIcon, TagIcon } from "../icons";

type Ctx = {
  f: CatalogFilters;
  update: (patch: Partial<CatalogFilters>) => void;
  pending: boolean;
  makerCounts: Record<string, number>;
  condCounts: Record<string, number>;
  catCounts: Record<string, number>;
  promoCount: number;
  total: number;
};

const FilterCtx = createContext<Ctx | null>(null);
const useFilters = () => useContext(FilterCtx)!;

/** Holds the filters locally so clicks feel instant, and pushes them to the URL (the server re-renders results). */
export function FilterProvider({ filters, makerCounts, condCounts, catCounts, promoCount, total, children }: { filters: CatalogFilters; makerCounts: Record<string, number>; condCounts: Record<string, number>; catCounts: Record<string, number>; promoCount: number; total: number; children: React.ReactNode }) {
  const router = useRouter();
  const [f, setF] = useState(filters);
  const [pending, start] = useTransition();
  // When the URL changes from elsewhere (header search, back button), take the new filters.
  const key = toQuery(filters);
  const [seenKey, setSeenKey] = useState(key);
  if (key !== seenKey) {
    setSeenKey(key);
    setF(filters);
  }
  const update = (patch: Partial<CatalogFilters>) => {
    const next = { ...f, ...patch };
    setF(next);
    start(() => router.replace(`/catalogue${toQuery(next)}`, { scroll: false }));
  };
  return <FilterCtx.Provider value={{ f, update, pending, makerCounts, condCounts, catCounts, promoCount, total }}>{children}</FilterCtx.Provider>;
}

/** Fades results while new ones load. */
export function ResultsArea({ children }: { children: React.ReactNode }) {
  const { pending } = useFilters();
  return (
    <div aria-busy={pending} className={`transition-opacity duration-200 ${pending ? "opacity-50" : "opacity-100"}`}>
      {children}
    </div>
  );
}

/** Change the motorcycle type, dropping brands/models that don't make that type. */
function usePickType() {
  const { f, update } = useFilters();
  return (id: string) => {
    const brandsOk = f.brands.filter((bid) => BRANDS.find((b) => b.id === bid)?.models.some((m) => id === "all" || m.type === id));
    const modelsOk = f.models.filter((mid) => id === "all" || modelById(mid)?.type === id);
    update({ type: id === "all" ? undefined : id, brands: brandsOk, models: modelsOk, makers: [] });
  };
}

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

const chip = (on: boolean) => `tap h-9 rounded-full border-[1.5px] px-3 text-[13px] font-semibold ${on ? "border-ink bg-ink text-white" : "border-line bg-card hover:border-line2"}`;

function Legend({ children, extra }: { children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <legend className="mb-2.5 flex w-full justify-between text-[11.5px] font-bold tracking-[1.2px] text-mut uppercase">
      <span>{children}</span>
      {extra && <span className="font-semibold tracking-normal normal-case">{extra}</span>}
    </legend>
  );
}

/** Bike section: type, brand (multi), model (multi), engine size. */
export function MotoFilters() {
  const { f, update } = useFilters();
  const type = f.type ?? "all";
  const range = CC_RANGES.find((r) => r.id === (f.cc ?? "all"))!;
  const inType = (t: string) => type === "all" || t === type;
  const inCc = (cc: number) => cc >= range.min && cc <= range.max;
  const brands = brandsForType(type).filter((b) => b.models.some((m) => inType(m.type) && inCc(m.cc)));
  const selBrands = BRANDS.filter((b) => f.brands.includes(b.id));
  const models = selBrands.flatMap((b) => b.models.filter((m) => inType(m.type) && inCc(m.cc)));

  const pickType = usePickType();

  return (
    <>
      <fieldset className="border-t border-line px-[18px] py-3.5">
        <Legend>Type de moto</Legend>
        <div className="grid grid-cols-4 gap-1.5">
          {[ALL_TYPE, ...TYPES].map((t) => {
            const on = t.id === type;
            return (
              <button key={t.id} onClick={() => pickType(t.id)} aria-pressed={on} className="flex h-[62px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl border-2 transition-[background-color,border-color,transform] duration-200 hover:border-[var(--tone)] active:scale-95" style={{ ...tileStyle(t, on), "--tone": t.fg } as React.CSSProperties}>
                <MotoIcon type={t.id} color={t.fg} width={40} strokeWidth={3} />
                <span className="text-[11px] font-bold whitespace-nowrap">{t.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="border-t border-line px-[18px] py-3.5">
        <Legend extra={plural(brands.length, "marque", "marques")}>Marque de la moto</Legend>
        {brands.map((b) => (
          <label key={b.id} className="-mx-2 flex min-h-10 cursor-pointer items-center gap-2.5 rounded-[10px] px-2 text-sm transition-colors hover:bg-page">
            <input type="checkbox" className="size-[18px] accent-pri" checked={f.brands.includes(b.id)} onChange={() => update({ brands: toggle(f.brands, b.id), models: f.brands.includes(b.id) ? f.models.filter((mid) => !b.models.some((m) => m.id === mid)) : f.models, makers: [] })} />
            <span className="disp flex size-7 shrink-0 items-center justify-center rounded-full bg-sunk text-[12.5px]">{b.ini}</span>
            <span className="flex-1 font-semibold">{b.name}</span>
            <span className="text-[12.5px] text-mut">{b.models.filter((m) => inType(m.type) && inCc(m.cc)).length}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="border-t border-line px-[18px] py-3.5">
        <Legend>Modèle</Legend>
        {selBrands.length ? (
          <div className="enter flex flex-wrap gap-1.5">
            {models.map((m) => (
              <button key={m.id} onClick={() => update({ models: toggle(f.models, m.id), makers: [] })} aria-pressed={f.models.includes(m.id)} className={`${chip(f.models.includes(m.id))} flex items-center gap-1.5 font-bold`}>
                {m.name}
                <span className="text-[11.5px] font-medium opacity-60">{m.cc}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[13px] leading-snug text-mut">Cochez une marque pour choisir le modèle.</p>
        )}
      </fieldset>

      <fieldset className="border-t border-line px-[18px] pt-3.5 pb-[18px]">
        <Legend>Cylindrée (cm³)</Legend>
        <div className="flex flex-wrap gap-1.5">
          {CC_RANGES.map((r) => {
            const on = r.id === (f.cc ?? "all");
            return (
              <button key={r.id} onClick={() => update({ cc: r.id === "all" ? undefined : r.id, models: [], makers: [] })} aria-pressed={on} className={chip(on)}>
                {r.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    </>
  );
}

/** Part section: position, part brand, condition. */
export function PartFilters() {
  const { f, update, makerCounts, condCounts } = useFilters();
  return (
    <>
      <fieldset className="border-t border-line px-[18px] py-3.5">
        <Legend>Position</Legend>
        <div className="grid grid-cols-3 gap-1.5">
          {([undefined, "Avant", "Arrière"] as const).map((p) => (
            <button key={p ?? "all"} onClick={() => update({ pos: p })} aria-pressed={f.pos === p} className={`${chip(f.pos === p)} rounded-[10px]`}>
              {p ?? "Tous"}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="border-t border-line px-[18px] py-3.5">
        <Legend>Marque de la pièce</Legend>
        {Object.keys(makerCounts).length === 0 && <p className="text-[13px] text-mut">—</p>}
        {Object.entries(makerCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([k, n]) => (
            <label key={k} className="-mx-2 flex min-h-[38px] cursor-pointer items-center gap-2.5 rounded-[10px] px-2 transition-colors hover:bg-page">
              <input type="checkbox" className="size-[18px] accent-pri" checked={f.makers.includes(k)} onChange={() => update({ makers: toggle(f.makers, k) })} />
              <span className="disp flex-1 text-[17px]">{k}</span>
              <span className="text-[12.5px] text-mut">{n}</span>
            </label>
          ))}
      </fieldset>
      <fieldset className="border-t border-line px-[18px] pt-3.5 pb-[18px]">
        <Legend>État</Legend>
        {(Object.keys(CONDITIONS) as Condition[])
          .filter((c) => condCounts[c])
          .map((c) => (
            <label key={c} className="-mx-2 flex min-h-[38px] cursor-pointer items-center gap-2.5 rounded-[10px] px-2 transition-colors hover:bg-page">
              <input type="checkbox" className="size-[18px] accent-pri" checked={f.conds.includes(c)} onChange={() => update({ conds: toggle(f.conds, c) })} />
              <span className={`rounded-[5px] border px-1.5 py-0.5 text-[10.5px] font-bold uppercase ${CONDITIONS[c].className}`}>{CONDITIONS[c].label}</span>
              <span className="flex-1" />
              <span className="text-[12.5px] text-mut">{condCounts[c]}</span>
            </label>
          ))}
      </fieldset>
    </>
  );
}

function ScopeHeader({ onMine }: { onMine?: () => void }) {
  const { f } = useFilters();
  const model = f.models.length === 1 ? modelById(f.models[0]) : null;
  const tone = (model ? typeById(model.type) : f.type ? typeById(f.type) : null) ?? ALL_TYPE;
  return (
    <div className="flex items-center justify-between gap-2 px-[18px] pt-3.5 pb-3 transition-colors duration-200" style={{ background: tone.soft }}>
      <span className="flex min-w-0 items-center gap-2.5">
        <MotoIcon type={(model?.type ?? f.type ?? "all") as MotoTypeId | "all"} color={tone.fg} width={42} strokeWidth={3} />
        <span className="min-w-0">
          <span className="kick block" style={{ color: tone.ink }}>
            Ma moto
          </span>
          <span className="block text-[15px] leading-tight font-bold">{scopeTitle(f)}</span>
        </span>
      </span>
      {onMine && (
        <button onClick={onMine} className="h-8 shrink-0 text-[13px] font-semibold text-pri-ink">
          Tout effacer
        </button>
      )}
    </div>
  );
}

/** Desktop sidebar. */
export function FilterSidebar() {
  const { update } = useFilters();
  const clearMoto = () => update({ type: undefined, brands: [], models: [], cc: undefined, makers: [] });
  const clearPart = () => update({ pos: undefined, makers: [], conds: [] });
  return (
    <aside aria-label="Filtres" className="noscroll sticky top-[118px] hidden max-h-[calc(100dvh-134px)] w-[300px] shrink-0 flex-col gap-3.5 overflow-y-auto pb-4 md:flex [&>*]:shrink-0">
      <div className="overflow-hidden rounded-[18px] border border-line bg-card">
        <ScopeHeader onMine={clearMoto} />
        <MotoFilters />
      </div>
      <div className="rounded-[18px] border border-line bg-card pt-1">
        <div className="flex items-center justify-between px-[18px] pt-3 pb-2.5">
          <span className="text-[15px] font-bold">La pièce</span>
          <button onClick={clearPart} className="h-8 text-[13px] font-semibold text-pri-ink">
            Réinitialiser
          </button>
        </div>
        <PartFilters />
      </div>
    </aside>
  );
}

/** Phone: bike card + "Filtres" button + condition chips, and the bottom sheet. */
export function MobileFilterBar() {
  const { f, update, total } = useFilters();
  const pickType = usePickType();
  const [open, setOpen] = useState(false);
  const active = (f.promo ? 1 : 0) + (f.type ? 1 : 0) + f.brands.length + f.models.length + (f.cc ? 1 : 0) + (f.pos ? 1 : 0) + f.makers.length + f.conds.length;
  const model = f.models.length === 1 ? modelById(f.models[0]) : null;
  const tone = (model ? typeById(model.type) : f.type ? typeById(f.type) : null) ?? ALL_TYPE;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <section aria-label="Ma moto" className="rounded-2xl border border-line bg-card p-3 shadow-card">
        <div className="flex items-center justify-between gap-2">
          <span>
            <span className="kick block" style={{ color: tone.ink }}>
              Type de moto
            </span>
            <span className="block text-[12px] text-mut">Touchez pour changer</span>
          </span>
          <button onClick={() => setOpen(true)} className="tap flex h-9 shrink-0 items-center gap-1 rounded-full border-[1.5px] border-ink px-3 text-[12.5px] font-bold">
            Marque &amp; modèle
            <ChevronRight size={15} />
          </button>
        </div>
        <div className="mt-2.5 grid grid-cols-4 gap-1.5">
          {[ALL_TYPE, ...TYPES].map((t) => {
            const on = (f.type ?? "all") === t.id;
            return (
              <button key={t.id} onClick={() => pickType(t.id)} aria-pressed={on} className="flex h-[66px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border-[1.5px] transition-[background,border-color,box-shadow,transform] duration-200 active:scale-95" style={tileStyle(t, on)}>
                <MotoIcon type={t.id} color={t.fg} width={42} strokeWidth={3} />
                <span className="w-full truncate text-center text-[11.5px] font-bold">{t.label}</span>
              </button>
            );
          })}
        </div>
        <button onClick={() => setOpen(true)} className="mt-2.5 flex w-full items-center gap-2 rounded-xl bg-page px-3 py-2 text-left">
          <MotoIcon type={(model?.type ?? f.type ?? "all") as MotoTypeId | "all"} color={tone.fg} width={30} strokeWidth={3} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-bold">{scopeTitle(f)}</span>
            <span className="block truncate text-[11.5px] text-mut">{model ? `${model.type} · ${model.cc} cm³` : "Ajoutez marque et modèle pour affiner"}</span>
          </span>
          <ChevronRight size={16} className="text-mut" />
        </button>
      </section>

      <div className="mt-2 flex flex-wrap gap-2">
        <button onClick={() => setOpen(true)} className="tap flex h-10 shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-ink bg-card px-3 text-[13px] font-bold">
          <FilterIcon size={16} />
          Filtres
          {active > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-pri px-1.5 text-[11.5px] text-white">{active}</span>}
        </button>
        <MobileSort />
        <PromoToggle />
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {([[undefined, "Tous états"], ["original", "Origine"], ["aftermarket", "Adaptable"], ["used", "Occasion"]] as const).map(([c, label]) => {
          const on = c ? f.conds.length === 1 && f.conds[0] === c : f.conds.length === 0;
          return (
            <button key={label} onClick={() => update({ conds: c ? [c] : [] })} aria-pressed={on} className={`${chip(on)} h-9 min-w-0 truncate px-1 text-[12.5px] whitespace-nowrap`}>
              {label}
            </button>
          );
        })}
      </div>

      <div onClick={() => setOpen(false)} className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <section role="dialog" aria-modal="true" aria-label="Filtres" inert={!open} className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col rounded-t-3xl bg-card shadow-[0_-8px_30px_rgb(27_28_32/0.18)] transition-transform duration-[340ms] ease-[cubic-bezier(.2,.8,.2,1)] ${open ? "translate-y-0" : "translate-y-[105%]"}`}>
        <div className="relative flex h-16 shrink-0 items-center justify-between border-b border-line pr-2 pl-[18px]">
          <span className="absolute top-[7px] left-1/2 h-[5px] w-10 -translate-x-1/2 rounded-full bg-line2" />
          <h2 className="disp text-[26px]">Filtres</h2>
          <div className="flex items-center">
            <button onClick={() => update({ promo: false, type: undefined, brands: [], models: [], cc: undefined, pos: undefined, makers: [], conds: [] })} className="h-11 px-2.5 text-sm font-semibold text-pri-ink">
              Tout effacer
            </button>
            <button onClick={() => setOpen(false)} aria-label="Fermer" className="flex size-11 items-center justify-center">
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="noscroll flex-1 overflow-y-auto">
          <fieldset className="px-[18px] pt-3.5 pb-4">
            <Legend>Catégorie de pièce</Legend>
            <CategoryTiles dense />
          </fieldset>
          <ScopeHeader />
          <MotoFilters />
          <PartFilters />
        </div>
        <div className="shrink-0 border-t border-line px-4 pt-3 pb-6">
          <button onClick={() => setOpen(false)} className="tap h-14 w-full rounded-[14px] bg-pri text-[15px] font-bold text-white hover:bg-pri-h">
            Voir {plural(total, "résultat", "résultats")}
          </button>
        </div>
      </section>
    </div>
  );
}

/** Removable chips for every active filter. */
export function ActivePills() {
  const { f, update } = useFilters();
  const pills: { key: string; label: string; remove: () => void; tone?: { fg: string; soft: string; ink: string } }[] = [];
  const t = f.type ? typeById(f.type) : null;
  if (t) pills.push({ key: "type", label: t.label, tone: t, remove: () => update({ type: undefined }) });
  f.brands.forEach((id) => {
    const b = BRANDS.find((x) => x.id === id);
    if (b) pills.push({ key: `b-${id}`, label: b.name, remove: () => update({ brands: f.brands.filter((x) => x !== id), models: f.models.filter((mid) => !b.models.some((m) => m.id === mid)) }) });
  });
  f.models.forEach((id) => pills.push({ key: `m-${id}`, label: modelById(id)?.name ?? id, remove: () => update({ models: f.models.filter((x) => x !== id) }) }));
  if (f.cc) pills.push({ key: "cc", label: `${CC_RANGES.find((r) => r.id === f.cc)?.label} cm³`, remove: () => update({ cc: undefined }) });
  if (f.pos) pills.push({ key: "pos", label: f.pos, remove: () => update({ pos: undefined }) });
  f.makers.forEach((k) => pills.push({ key: `k-${k}`, label: k, remove: () => update({ makers: f.makers.filter((x) => x !== k) }) }));
  f.conds.forEach((c) => pills.push({ key: `c-${c}`, label: CONDITIONS[c].label, remove: () => update({ conds: f.conds.filter((x) => x !== c) }) }));
  if (f.promo) pills.push({ key: "promo", label: "En promotion", tone: { fg: "#E11D48", soft: "#FDE9EE", ink: "#9F1239" }, remove: () => update({ promo: false }) });
  if (f.q) pills.push({ key: "q", label: `« ${f.q} »`, remove: () => update({ q: undefined }) });
  if (!pills.length) return null;
  return (
    <div className="mb-3 hidden min-h-[38px] flex-wrap items-center gap-2 md:flex">
      {pills.map((p) => (
        <button key={p.key} onClick={p.remove} aria-label={`Retirer le filtre ${p.label}`} className="tap enter flex h-9 items-center gap-1.5 rounded-full border-[1.5px] pr-2.5 pl-3 text-[13px] font-semibold" style={p.tone ? { borderColor: p.tone.fg, background: p.tone.soft, color: p.tone.ink } : { borderColor: "var(--color-line2)", background: "var(--color-card)" }}>
          {p.label}
          <CloseIcon size={14} strokeWidth={2.6} />
        </button>
      ))}
      <button onClick={() => update({ q: undefined, promo: false, type: undefined, brands: [], models: [], cc: undefined, pos: undefined, makers: [], conds: [] })} className="h-9 px-2 text-[13px] font-semibold text-pri-ink">
        Tout effacer
      </button>
    </div>
  );
}

const SORTS: { id: NonNullable<CatalogFilters["sort"]>; label: string; short: string }[] = [
  { id: "relevance", label: "Pertinence", short: "Pertinence" },
  { id: "price", label: "Prix croissant", short: "Prix ↑" },
  { id: "price_desc", label: "Prix décroissant", short: "Prix ↓" },
  { id: "distance", label: "Magasins les plus proches", short: "Distance" },
];

/** Red "Promos" toggle with the number of discounted parts. */
export function PromoToggle({ className = "" }: { className?: string }) {
  const { f, update, promoCount } = useFilters();
  const on = !!f.promo;
  return (
    <button onClick={() => update({ promo: !on })} aria-pressed={on} disabled={!on && promoCount === 0} className={`tap flex h-10 shrink-0 items-center gap-1.5 rounded-full border-[1.5px] px-3 text-[13px] font-bold disabled:opacity-40 ${on ? "border-sale bg-sale text-white shadow-[0_8px_18px_-10px_rgb(225_29_72/0.8)]" : "border-[#F5B8C6] bg-[#FDE9EE] text-[#9F1239] hover:border-sale"} ${className}`}>
      <TagIcon size={16} />
      Promos
      <span className={`rounded-full px-1.5 text-[11.5px] ${on ? "bg-white/25" : "bg-white text-sale"}`}>{promoCount}</span>
    </button>
  );
}

/** Desktop: segmented sort control. */
export function SortControl() {
  const { f, update } = useFilters();
  const cur = f.sort ?? "relevance";
  return (
    <div className="hidden items-center gap-2.5 md:flex">
      <span className="text-sm text-mut">Trier par</span>
      <div role="radiogroup" aria-label="Trier par" className="flex rounded-xl border border-line bg-sunk p-1">
        {SORTS.map((o) => (
          <button key={o.id} role="radio" aria-checked={cur === o.id} onClick={() => update({ sort: o.id })} title={o.label} className={`h-8 rounded-[9px] px-3 text-[13px] font-semibold whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 ${cur === o.id ? "bg-card text-ink shadow-[0_1px_3px_rgb(27_28_32/0.16)]" : "text-mut hover:text-ink"}`}>
            {o.short}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Phone: "Trier" button and a small sheet with the options. */
export function MobileSort() {
  const { f, update } = useFilters();
  const [open, setOpen] = useState(false);
  const cur = SORTS.find((o) => o.id === (f.sort ?? "relevance"))!;
  return (
    <>
      <button onClick={() => setOpen(true)} aria-haspopup="dialog" className="tap flex h-10 shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-line bg-card px-3 text-[13px] font-bold">
        <SortIcon size={16} />
        {cur.id === "relevance" ? "Trier" : cur.short}
      </button>
      <div onClick={() => setOpen(false)} className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <section role="dialog" aria-modal="true" aria-label="Trier par" inert={!open} className={`fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-card px-4 pt-3 pb-8 shadow-[0_-8px_30px_rgb(27_28_32/0.18)] transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${open ? "translate-y-0" : "translate-y-[105%]"}`}>
        <span className="mx-auto mb-3 block h-[5px] w-10 rounded-full bg-line2" />
        <h2 className="disp mb-2 text-[24px]">Trier par</h2>
        <div role="radiogroup" className="flex flex-col">
          {SORTS.map((o) => {
            const on = o.id === cur.id;
            return (
              <button key={o.id} role="radio" aria-checked={on} onClick={() => { update({ sort: o.id }); setOpen(false); }} className="flex h-14 items-center justify-between border-b border-line text-left text-[15px] font-semibold last:border-0">
                {o.label}
                <span className={`flex size-6 items-center justify-center rounded-full border-2 transition-colors ${on ? "border-pri bg-pri text-white" : "border-line2"}`}>{on && <CheckIcon size={14} strokeWidth={3.2} />}</span>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

/** Category tiles: a grid, never a horizontal scroll. Switching keeps the bike filters. */
function CategoryTiles({ dense = false }: { dense?: boolean }) {
  const { f, update, catCounts } = useFilters();
  const all = Object.values(catCounts).reduce((a, b) => a + b, 0);
  const items = [{ id: undefined, name: "Tout", icon: null, n: all }, ...CATEGORIES.map((c) => ({ id: c.id, name: c.name, icon: c.icon, n: catCounts[c.id] ?? 0 }))];
  return (
    <div className={`grid grid-cols-4 gap-2 ${dense ? "" : "sm:grid-cols-6 xl:grid-cols-12"}`}>
      {items.map((c) => {
        const on = f.cat === c.id;
        return (
          <button
            key={c.id ?? "all"}
            onClick={() => update({ cat: on && c.id ? undefined : c.id, makers: [] })}
            aria-pressed={on}
            className={`tap relative flex h-[78px] min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border-[1.5px] px-1 ${on ? "border-ink bg-ink text-white" : "border-line bg-card hover:border-pri"} ${c.n === 0 && !on ? "opacity-45" : ""}`}
          >
            <span className={`flex size-9 items-center justify-center rounded-full transition-colors ${on ? "bg-pri text-white" : "bg-pri-soft text-pri-ink"}`}>
              {c.icon ? <PartIcon icon={c.icon} size={22} strokeWidth={2.4} color={on ? "#fff" : "var(--color-pri-ink)"} /> : <GridIcon size={18} />}
            </span>
            <span className="w-full truncate text-center text-[11px] leading-tight font-semibold tracking-[-0.2px] sm:text-[12px] sm:font-bold sm:tracking-normal">{c.name}</span>
            <span className={`absolute top-1.5 right-2 text-[10.5px] font-semibold ${on ? "text-white/70" : "text-mut"}`}>{c.n}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Part categories come first in the catalogue. Sticky on wide screens, where they fit on one row. */
export function CategoryBar() {
  return (
    <nav aria-label="Catégories de pièces" className="mb-4 xl:sticky xl:top-0 xl:z-20 xl:-mx-10 xl:border-b xl:border-line xl:bg-page/90 xl:px-10 xl:py-2.5 xl:backdrop-blur-md">
      <CategoryTiles />
    </nav>
  );
}
