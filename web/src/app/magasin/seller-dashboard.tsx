"use client";

import { useState } from "react";
import { BarcodeIcon, ChatIcon, CheckIcon, PlusIcon, TagIcon } from "@/components/icons";

// Demo shop-owner dashboard. In production this data belongs to the ERP back office.
const FLOW = [
  { label: "Nouvelle", cls: "bg-pri-soft text-pri-ink", action: "Confirmer la réservation" },
  { label: "Confirmée", cls: "bg-[#E9EFFE] text-[#1E40AF]", action: "Marquer prête" },
  { label: "Prête", cls: "bg-ok-soft text-[#0E7A3D]", action: "Client a récupéré" },
  { label: "Récupérée", cls: "bg-sunk text-mut", action: null },
];
const REQS = [
  { id: "q", code: "RES-2026-102", part: "Kit chaîne DID 525 ZVM-X 15/42", bike: "Kawasaki Z1000", customer: "Client Ariana", detail: "Retrait demain" },
  { id: "a", code: "RES-2026-081", part: "Plaquettes avant EBC FA252HH × 2", bike: "Kawasaki Z1000", customer: "Ahmed T.", detail: "Retrait 16 h" },
];
const PROMOS = [
  { id: "brake", off: "-20%", name: "Saison freinage", period: "jusqu'au 30 nov." },
  { id: "chain", off: "-15%", name: "Kits chaîne DID", period: "à programmer" },
];
const LOW = [
  { name: "Kit chaîne DID 525 ZVM-X · Z1000", shelf: "Rayon B-03-01", left: 2 },
  { name: "Filtre à huile Piaggio 82635R", shelf: "Rayon D-01-04", left: 3 },
];

export function SellerDashboard() {
  const [stage, setStage] = useState<Record<string, number>>({ q: 0, a: 2 });
  const [promoOn, setPromoOn] = useState<Record<string, boolean>>({ brake: true, chain: false });
  const toDo = Object.values(stage).filter((s) => s < 2).length;
  const ready = Object.values(stage).filter((s) => s === 2).length;

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-8">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-2">
          {[
            [toDo, "À traiter", "text-pri-ink"],
            [ready, "Prêtes", ""],
            [LOW.length, "Stock faible", "text-sale"],
          ].map(([n, label, cls]) => (
            <div key={label as string} className="rounded-xl border border-line bg-card p-3">
              <div className={`disp text-3xl ${cls}`}>{n}</div>
              <div className="mt-1 text-xs text-mut">{label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <a href="#" className="tap flex h-[88px] flex-col justify-between rounded-[14px] bg-pri p-3 text-[13px] leading-tight font-bold text-white hover:bg-pri-h">
            <PlusIcon /> Ajouter une pièce
          </a>
          <a href="#" className="tap flex h-[88px] flex-col justify-between rounded-[14px] border border-line bg-card p-3 text-[13px] leading-tight font-bold hover:border-line2">
            <BarcodeIcon /> Scanner code-barres
          </a>
          <a href="#" className="tap flex h-[88px] flex-col justify-between rounded-[14px] border border-line bg-card p-3 text-[13px] leading-tight font-bold hover:border-line2">
            <TagIcon /> Créer une promo
          </a>
        </div>
        <section>
          <h2 className="disp mb-3 text-[22px] md:text-3xl">Demandes du jour</h2>
          <div className="flex flex-col gap-2.5">
            {REQS.map((r) => {
              const s = stage[r.id];
              const f = FLOW[s];
              return (
                <article key={r.id} className="enter flex flex-col gap-2.5 rounded-[14px] border border-line bg-card p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-mut">{r.code}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors duration-200 ${f.cls}`}>{f.label}</span>
                  </div>
                  <div>
                    <div className="text-[14.5px] font-semibold">{r.part}</div>
                    <div className="mt-[3px] text-[12.5px] text-mut">
                      {r.bike} · {r.customer} · {r.detail}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href="#" aria-label="Écrire au client sur WhatsApp" className="tap flex size-11 shrink-0 items-center justify-center rounded-[10px] border-[1.5px] border-line hover:border-line2">
                      <ChatIcon size={18} />
                    </a>
                    {f.action ? (
                      <button onClick={() => setStage({ ...stage, [r.id]: Math.min(s + 1, 3) })} className="tap h-11 flex-1 rounded-[10px] bg-ink text-sm font-bold text-white">
                        {f.action}
                      </button>
                    ) : (
                      <span className="enter flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-[#BFE6CD] bg-ok-soft text-sm font-semibold text-ok">
                        <CheckIcon size={16} /> Terminée
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-6">
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="disp text-[22px] md:text-3xl">Mes promotions</h2>
            <span className="text-[12.5px] text-mut">Visibles sur l&apos;accueil</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {PROMOS.map((p) => {
              const on = !!promoOn[p.id];
              return (
                <div key={p.id} className="flex items-center gap-3 rounded-[14px] border border-line bg-card px-3.5 py-3">
                  <span className={`disp min-w-[52px] shrink-0 rounded-lg bg-pri px-2 py-1 text-center text-[22px] text-white transition-opacity duration-200 ${on ? "" : "opacity-50"}`}>{p.off}</span>
                  <span className={`min-w-0 flex-1 transition-opacity duration-200 ${on ? "" : "opacity-50"}`}>
                    <span className="block text-sm font-semibold">{p.name}</span>
                    <span className="mt-0.5 block text-xs text-mut">
                      {on ? "Active" : "En pause"} · {p.period}
                    </span>
                  </span>
                  <button role="switch" aria-checked={on} aria-label={`Activer la promotion ${p.name}`} onClick={() => setPromoOn({ ...promoOn, [p.id]: !on })} className="flex h-11 w-[52px] shrink-0 items-center justify-center">
                    <span className={`flex h-[26px] w-[46px] rounded-full p-[3px] transition-colors duration-200 ${on ? "bg-pri" : "bg-line2"}`}>
                      <span className={`block size-5 rounded-full bg-white shadow transition-transform duration-[220ms] ${on ? "translate-x-5" : ""}`} />
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
        <section>
          <h2 className="disp mb-3 text-[22px] md:text-3xl">Stock faible</h2>
          <div className="rounded-[14px] border border-line bg-card">
            {LOW.map((l) => (
              <div key={l.name} className="flex items-center gap-3 border-b border-line px-3.5 py-3 last:border-0">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{l.name}</div>
                  <div className="mt-0.5 font-mono text-[11.5px] text-mut">{l.shelf}</div>
                </div>
                <span className="text-[13px] font-bold text-sale">{l.left} restants</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
