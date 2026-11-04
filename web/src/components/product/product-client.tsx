"use client";

import { useState } from "react";
import { typeById, yearsLabel } from "@/lib/moto";
import { compatSummary, fitsModel, type FitInfo } from "@/lib/compat";
import { useGarage } from "../garage-provider";
import { CheckIcon, HeartIcon, InfoIcon, MotoIcon } from "../icons";

/** Says whether the part fits the visitor's saved bike. */
export function CompatBanner({ fit }: { fit: FitInfo }) {
  const { active } = useGarage();
  const universal = !!fit.universal;
  const ok = fitsModel(fit, active.model);
  return ok ? (
    <div className="flex items-center gap-2.5 rounded-[14px] border border-[#BFE6CD] bg-ok-soft px-3 py-2.5">
      <span className="flex h-8 w-[46px] shrink-0 items-center justify-center rounded-lg bg-white">
        <MotoIcon type={active.model.type} color={active.type.fg} width={38} strokeWidth={3} />
      </span>
      <span className="flex-1 text-[13px] leading-snug text-[#14532D]">
        {universal ? "Universel : va sur toutes les motos, dont votre " : "Compatible avec votre "}
        <strong>{active.label} · {active.year}</strong>
      </span>
      <CheckIcon className="text-ok" />
    </div>
  ) : (
    <div className="flex items-center gap-2.5 rounded-[14px] border border-[#F2D9AE] bg-warn-soft px-3 py-2.5 text-[13px] leading-snug text-[#6B3A00]">
      <InfoIcon size={20} className="shrink-0" />
      <span>
        Pas listée pour votre <strong>{active.label}</strong>. Vérifiez l&apos;onglet Compatibilité ou demandez au magasin.
      </span>
    </div>
  );
}

export function FavButton() {
  const [on, setOn] = useState(false);
  return (
    <button onClick={() => setOn(!on)} aria-pressed={on} aria-label="Ajouter aux favoris" className={`tap flex size-11 items-center justify-center rounded-full border border-line bg-white/90 shadow-[0_2px_8px_rgb(27_28_32/0.08)] ${on ? "text-sale [&_svg]:fill-current" : "text-ink"}`}>
      <HeartIcon size={20} />
    </button>
  );
}

type Spec = { label: string; value: string };
type ShopInfo = { name: string; ini: string; rating: string; km: string; delivery: string; address: string | null };

export function ProductTabs({ specs, fit, shop }: { specs: Spec[]; fit: FitInfo; shop: ShopInfo }) {
  const { active } = useGarage();
  const [tab, setTab] = useState<"details" | "compat" | "shop">("details");
  const summary = compatSummary(fit);
  const tabs = [
    { id: "details" as const, label: "Détails" },
    { id: "compat" as const, label: summary.universal ? "Compatibilité" : `Compatibilité · ${summary.modelCount}` },
    { id: "shop" as const, label: "Magasin" },
  ];
  return (
    <div>
      <div role="tablist" className="grid grid-cols-3 border-y border-line bg-card md:rounded-t-2xl md:border-x">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`h-12 border-b-[3px] text-[13.5px] font-bold transition-colors duration-200 ${tab === t.id ? "border-pri text-ink" : "border-transparent text-mut hover:text-ink2"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="min-h-[200px] px-4 pb-4 md:rounded-b-2xl md:border-x md:border-b md:border-line md:bg-card">
        {tab === "details" && (
          <div key="d" className="enter">
            {specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-3 border-b border-line py-3 text-[13.5px] last:border-0">
                <span className="text-mut">{s.label}</span>
                <span className="text-right font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        )}
        {tab === "compat" && (
          <div key="c" className="enter flex flex-col gap-3 pt-3.5">
            {summary.universal && <p className="py-4 text-sm text-mut">Produit universel : il convient à toutes les marques et tous les types de moto et scooter.</p>}
            {!summary.universal && !summary.brands.length && <p className="py-4 text-sm text-mut">Compatibilité non renseignée. Demandez au magasin.</p>}
            {summary.brands.map((g) => (
              <section key={g.brand.id} className="overflow-hidden rounded-xl border border-line">
                <header className="flex items-center gap-2.5 bg-page px-3 py-2">
                  <span className="disp flex size-8 items-center justify-center rounded-full bg-card text-[13px]">{g.brand.ini}</span>
                  <span className="flex-1 font-bold">{g.brand.name}</span>
                  <span className="text-xs text-mut">{g.allModels ? "Tous les modèles" : `${g.models.length} modèle${g.models.length > 1 ? "s" : ""}`}</span>
                </header>
                {g.models.map((m) => {
                  const t = typeById(m.type)!;
                  return (
                    <div key={m.id} className="flex items-center gap-3 border-t border-line px-3 py-2.5">
                      <span className="flex h-8 w-11 shrink-0 items-center justify-center rounded-lg" style={{ background: t.soft }}>
                        <MotoIcon type={m.type} color={t.fg} width={34} strokeWidth={3.2} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="disp block text-[17px]">{m.name}</span>
                        <span className="text-xs text-mut">
                          {yearsLabel(m)} · {m.cc} cm³
                        </span>
                      </span>
                      <span className="rounded-md px-2 py-0.5 text-[11px] font-bold" style={{ background: t.soft, color: t.ink }}>
                        {t.label}
                      </span>
                      {m.id === active.modelId && <span className="rounded-md bg-pri px-2 py-[3px] text-[11px] font-bold text-white">VOTRE MOTO</span>}
                    </div>
                  );
                })}
              </section>
            ))}
          </div>
        )}
        {tab === "shop" && (
          <div key="s" className="enter flex items-center gap-3 py-4">
            <span className="disp flex size-12 items-center justify-center rounded-xl bg-pri-soft text-xl text-pri-ink">{shop.ini}</span>
            <span>
              <span className="block text-[15px] font-bold">{shop.name}</span>
              <span className="text-[12.5px] text-mut">
                ★ {shop.rating} · {shop.km} · {shop.delivery}
              </span>
              {shop.address && <span className="block text-[12.5px] text-mut">{shop.address}</span>}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
