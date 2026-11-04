"use client";

import { useActionState, useState } from "react";
import { reserve, type ReserveState } from "@/app/reservation/actions";
import { dt } from "@/lib/catalog";
import type { PartIconId } from "@/lib/types";
import { useGarage } from "./garage-provider";
import { ArrowRight, InfoIcon, PartIcon, WrenchIcon } from "./icons";

type Props = { partId: string; name: string; price: number; icon: PartIconId; shopName: string; shopAddress: string | null; stock: number };

const input = "h-12 w-full rounded-xl border-[1.5px] border-line bg-card px-3.5 text-[15px] outline-none transition-[border-color,box-shadow] placeholder:text-[#9A9EA6] focus:border-pri focus:shadow-[0_0_0_3px_rgb(214_63_11/0.18)] aria-[invalid=true]:border-sale";

export function ReserveForm(p: Props) {
  const { active } = useGarage();
  const [state, action, pending] = useActionState<ReserveState, FormData>(reserve.bind(null, p.partId), {});
  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState<"pickup" | "express">("pickup");
  const [fitting, setFitting] = useState(false);
  const max = Math.max(1, Math.min(9, p.stock));

  return (
    <form action={action} className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-40 md:pb-10">
      <input type="hidden" name="quantity" value={qty} />
      <input type="hidden" name="bikeLabel" value={`${active.label} ${active.year}`} />

      <section className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3">
        <span className="bp flex size-16 shrink-0 items-center justify-center rounded-xl">
          <PartIcon icon={p.icon} size={42} strokeWidth={1.7} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm leading-snug font-semibold">{p.name}</div>
          <div className="mt-0.5 text-xs text-mut">
            {active.label} · {p.shopName}
          </div>
          <div className="disp mt-0.5 text-xl">
            {dt(p.price)} <span className="font-sans text-[13px] font-medium text-mut not-italic normal-case">/ unité</span>
          </div>
        </div>
        <div className="flex items-center rounded-xl border-[1.5px] border-line">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Diminuer la quantité" className="tap h-11 w-9 text-lg font-semibold">
            −
          </button>
          <span className="w-6 text-center text-[15px] font-bold" aria-live="polite">
            {qty}
          </span>
          <button type="button" onClick={() => setQty(Math.min(max, qty + 1))} aria-label="Augmenter la quantité" className="tap h-11 w-9 text-lg font-semibold">
            +
          </button>
        </div>
      </section>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="kick mb-2.5">Récupération</legend>
        {(
          [
            ["pickup", "Retrait en magasin", `Prête en 1 h · ${p.shopAddress ?? p.shopName}`, "Gratuit"],
            ["express", "Livraison express", "Sous 24 h dans le Grand Tunis", "Selon zone"],
          ] as const
        ).map(([id, title, detail, fee]) => {
          const on = mode === id;
          return (
            <label key={id} className={`flex cursor-pointer items-start gap-3 rounded-[14px] border-2 p-3.5 transition-colors duration-200 ${on ? "border-pri bg-pri-soft" : "border-line bg-card hover:border-line2"}`}>
              <input type="radio" name="mode" value={id} checked={on} onChange={() => setMode(id)} className="sr-only" />
              <span className={`mt-px size-5 shrink-0 rounded-full bg-white transition-[border-width,border-color] duration-200 ${on ? "border-[6px] border-pri" : "border-2 border-line2"}`} />
              <span className="flex flex-1 flex-col gap-[3px]">
                <span className="text-[15px] font-bold">{title}</span>
                <span className="text-[13px] leading-snug text-mut">{detail}</span>
              </span>
              <span className="text-[13px] font-bold whitespace-nowrap">{fee}</span>
            </label>
          );
        })}
        {mode === "express" && (
          <div className="enter flex flex-col gap-1.5">
            <label htmlFor="address" className="text-[13px] font-semibold">
              Adresse de livraison
            </label>
            <input id="address" name="address" placeholder="Rue, quartier, ville" className={input} aria-invalid={!!state.fieldErrors?.address} />
            {state.fieldErrors?.address && <span className="text-[12.5px] font-semibold text-sale">{state.fieldErrors.address}</span>}
          </div>
        )}
      </fieldset>

      <label className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-line bg-card p-3.5">
        <WrenchIcon className="text-pri" />
        <span className="flex-1">
          <span className="block text-[14.5px] font-bold">Montage en atelier</span>
          <span className="mt-0.5 block text-[12.5px] leading-snug text-mut">Le mécanicien du magasin pose la pièce. Tarif confirmé sur WhatsApp.</span>
        </span>
        <input type="checkbox" name="fitting" checked={fitting} onChange={(e) => setFitting(e.target.checked)} className="peer sr-only" role="switch" />
        <span className={`flex h-[26px] w-[46px] shrink-0 rounded-full p-[3px] transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-pri ${fitting ? "bg-pri" : "bg-line2"}`}>
          <span className={`block size-5 rounded-full bg-white shadow transition-transform duration-[220ms] ${fitting ? "translate-x-5" : ""}`} />
        </span>
      </label>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="kick mb-2.5">Vos coordonnées</legend>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="customerName" className="text-[13px] font-semibold">
            Nom complet
          </label>
          <input id="customerName" name="customerName" autoComplete="name" placeholder="Votre nom" className={input} aria-invalid={!!state.fieldErrors?.customerName} />
          {state.fieldErrors?.customerName && <span className="text-[12.5px] font-semibold text-sale">{state.fieldErrors.customerName}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-[13px] font-semibold">
            Téléphone (WhatsApp)
          </label>
          <div className="flex gap-2">
            <span className="flex h-12 items-center rounded-xl border-[1.5px] border-line bg-sunk px-3 text-[15px] font-semibold">+216</span>
            <input id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="XX XXX XXX" className={input} aria-invalid={!!state.fieldErrors?.phone} />
          </div>
          {state.fieldErrors?.phone && <span className="text-[12.5px] font-semibold text-sale">{state.fieldErrors.phone}</span>}
        </div>
      </fieldset>

      <section className="flex flex-col gap-2.5 rounded-[14px] border border-line bg-card p-3.5 text-sm">
        <div className="flex justify-between">
          <span className="text-mut">Pièce × {qty}</span>
          <span className="font-semibold">{dt(qty * p.price)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-mut">{mode === "express" ? "Livraison" : "Retrait en magasin"}</span>
          <span className="font-semibold">{mode === "express" ? "Confirmée par le magasin" : "Gratuit"}</span>
        </div>
        {fitting && (
          <div className="enter flex justify-between">
            <span className="text-mut">Montage atelier</span>
            <span className="font-semibold">Sur devis</span>
          </div>
        )}
        <div className="h-px bg-line" />
        <div className="flex items-baseline justify-between">
          <span className="font-bold">Total pièces</span>
          <span className="disp text-3xl text-pri-ink">{dt(qty * p.price)}</span>
        </div>
        <p className="flex gap-2 text-[12.5px] leading-normal text-mut">
          <InfoIcon size={16} className="mt-px shrink-0" />
          Rien à payer maintenant. Vous payez {mode === "express" ? "à la livraison" : "au retrait"}. La pièce est gardée 48 h.
        </p>
      </section>

      {state.error && (
        <p role="alert" className="enter rounded-xl border border-sale/30 bg-[#FDE9EE] px-3.5 py-3 text-sm font-semibold text-[#9F1239]">
          {state.error}
        </p>
      )}

      <div className="fixed inset-x-0 bottom-[84px] z-20 border-t border-line bg-card px-4 py-3 md:static md:border-0 md:bg-transparent md:p-0">
        <button type="submit" disabled={pending} className="tap flex h-14 w-full items-center justify-center gap-2.5 rounded-[14px] bg-pri text-base font-bold text-white hover:bg-pri-h disabled:opacity-70">
          {pending ? "Envoi en cours…" : "Confirmer la réservation"}
          {!pending && <ArrowRight size={20} />}
        </button>
        <p className="mt-2 text-center text-xs text-mut">Le magasin confirme sur WhatsApp en quelques minutes</p>
      </div>
    </form>
  );
}
