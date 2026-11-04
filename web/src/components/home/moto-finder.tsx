"use client";

import Link from "next/link";
import { useState } from "react";
import { brandById, brandsForType, modelsFor, tileStyle, TYPES, type MotoTypeId } from "@/lib/moto";
import { plural } from "@/lib/catalog";
import { toQuery, scopeModels } from "@/lib/filters";
import { fitsModel, type FitInfo } from "@/lib/compat";
import { ArrowRight, CheckIcon, MotoIcon } from "../icons";
import { useGarage } from "../garage-provider";

/** Type → brand → model picker. `partFits` = each part's compatibility, to show a live count. */
export function MotoFinder({ partFits }: { partFits: FitInfo[] }) {
  const { active } = useGarage();
  const [pick, setPick] = useState<{ type: MotoTypeId; brand: string | null; model: string | null } | null>(null);
  // Until the visitor touches it, the finder mirrors their saved bike.
  const cur = pick ?? { type: active.model.type, brand: active.model.brand, model: active.model.id };

  const brand = cur.brand ? brandById(cur.brand) : null;
  const model = brand?.models.find((m) => m.id === cur.model) ?? null;
  const brands = brandsForType(cur.type);
  const t = TYPES.find((x) => x.id === cur.type)!;

  const filters = { type: cur.type, brands: brand ? [brand.id] : [], models: model ? [model.id] : [], makers: [], conds: [] };
  const scope = scopeModels(filters) ?? [];
  const count = partFits.filter((p) => scope.some((m) => fitsModel(p, m))).length;

  const pickType = (id: MotoTypeId) => {
    const keepBrand = brand && brand.models.some((m) => m.type === id);
    const keepModel = keepBrand && model?.type === id;
    setPick({ type: id, brand: keepBrand ? brand.id : null, model: keepModel ? model.id : null });
  };

  return (
    <section aria-labelledby="finder-title" className="flex min-w-0 flex-col rounded-[22px] border border-line bg-card p-4 shadow-card md:rounded-[24px] md:p-[clamp(20px,2.5vw,30px)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="hidden text-xs font-extrabold tracking-[2px] text-pri-ink md:block">100 % COMPATIBLE</div>
          <h2 id="finder-title" className="disp text-[27px] md:mt-1.5 md:text-4xl">
            Trouver par moto
          </h2>
          <p className="mt-1 text-[13px] leading-snug text-mut md:hidden">On n&apos;affiche que les pièces qui vont sur votre moto.</p>
        </div>
        <button onClick={() => setPick(null)} className="tap h-8 shrink-0 rounded-full border border-line px-2.5 text-xs font-semibold whitespace-nowrap text-ink2 hover:border-line2">
          Ma {active.model.name}
        </button>
      </div>

      <div className="kick mt-4">1 · Type de moto</div>
      <div className="mt-2 grid grid-cols-3 gap-2 xl:grid-cols-6">
        {TYPES.map((x) => {
          const on = x.id === cur.type;
          return (
            <button
              key={x.id}
              onClick={() => pickType(x.id)}
              aria-pressed={on}
              className="relative flex h-24 flex-col items-center justify-center gap-[3px] rounded-2xl border-2 border-line bg-card px-1 transition-[background-color,border-color,transform] duration-200 hover:border-[var(--tone)] active:scale-[.97]"
              style={{ ...tileStyle(x, on), "--tone": x.fg } as React.CSSProperties}
            >
              {on && (
                <span className="pop absolute top-1.5 right-1.5 flex size-[18px] items-center justify-center rounded-full text-white" style={{ background: x.fg }}>
                  <CheckIcon size={12} strokeWidth={3.4} />
                </span>
              )}
              <MotoIcon type={x.id} color={x.fg} width={62} />
              <span className="text-[13.5px] font-bold">{x.label}</span>
              <span className="text-[11px] whitespace-nowrap text-mut md:hidden">{x.cc}</span>
            </button>
          );
        })}
      </div>

      {/* key: remount on type change so the brand row animates in */}
      <div key={cur.type} className="enter">
        <div className="mt-[18px] flex items-baseline justify-between">
          <span className="kick">2 · Marque</span>
          <span className="text-xs font-semibold" style={{ color: t.ink }}>
            {plural(brands.length, "marque", "marques")} en {t.label}
          </span>
        </div>
        <div className="noscroll -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-0.5 md:mx-0 md:flex-wrap md:px-0">
          {brands.map((b) => {
            const on = b.id === cur.brand;
            const n = modelsFor(b, cur.type).length;
            return (
              <button key={b.id} onClick={() => setPick({ ...cur, brand: b.id, model: null })} aria-pressed={on} className={`tap flex h-11 shrink-0 items-center gap-2 rounded-full border-[1.5px] pr-3.5 pl-1.5 text-[13.5px] font-semibold ${on ? "border-ink bg-ink text-white" : "border-line bg-card hover:border-line2"}`}>
                <span className={`disp flex size-8 items-center justify-center rounded-full text-sm transition-colors ${on ? "bg-pri text-white" : "bg-sunk text-ink"}`}>{b.ini}</span>
                {b.short}
                <span className="text-xs font-medium opacity-60">{n}</span>
              </button>
            );
          })}
        </div>

        <div className="kick mt-4">3 · Modèle</div>
        {brand ? (
          <div key={brand.id} className="enter noscroll -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-0.5 md:mx-0 md:flex-wrap md:px-0">
            {modelsFor(brand, cur.type).map((m) => {
              const on = m.id === cur.model;
              return (
                <button key={m.id} onClick={() => setPick({ ...cur, model: on ? null : m.id })} aria-pressed={on} className={`tap flex h-11 shrink-0 items-center gap-1.5 rounded-full border-[1.5px] px-3.5 text-[13.5px] font-bold whitespace-nowrap ${on ? "border-ink bg-ink text-white" : "border-line bg-card hover:border-line2"}`}>
                  {m.name}
                  <span className="text-xs font-medium opacity-70">{m.cc} cm³</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-2 flex h-11 items-center justify-center rounded-xl border-[1.5px] border-dashed border-line2 text-[13px] text-mut">Choisissez une marque ci-dessus</div>
        )}
      </div>

      <Link href={`/catalogue${toQuery(filters)}`} className="tap mt-[18px] flex min-h-14 items-center justify-between gap-2.5 rounded-[14px] bg-pri py-2 pr-4 pl-[18px] text-white hover:bg-pri-h">
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[15px] font-bold md:text-base">{model ? `Pièces pour ${brand!.name} ${model.name}` : brand ? `Pièces ${brand.name} · ${t.label}` : `Toutes les pièces ${t.label}`}</span>
          <span className="text-xs opacity-90">{plural(count, "pièce compatible", "pièces compatibles")}</span>
        </span>
        <ArrowRight size={22} className="shrink-0" />
      </Link>
      <div className="mt-3.5 hidden flex-wrap gap-x-[18px] gap-y-2 border-t border-line pt-3.5 text-[13.5px] font-semibold md:flex">
        <Link href="/garage" className="text-pri-ink hover:underline">
          Choisir l&apos;année · n° de châssis (VIN)
        </Link>
        <span className="text-pri-ink">Photo de la pièce · IA Mécano</span>
      </div>
    </section>
  );
}
