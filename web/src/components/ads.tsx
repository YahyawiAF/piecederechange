"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dt } from "@/lib/catalog";
import { brandsLabel, compatSummary } from "@/lib/compat";
import type { Part } from "@/lib/types";
import { ArrowRight, ChevronLeft, ChevronRight, PartIcon } from "./icons";
import { PromoTag } from "./parts";

function AdLabel({ kind, dark = false }: { kind: "new" | "sponsored"; dark?: boolean }) {
  return kind === "new" ? (
    <span className="rounded-md bg-[#2F5BEA] px-2 py-1 text-[11px] font-extrabold tracking-[1.2px] text-white">NOUVEAUTÉ</span>
  ) : (
    <span className={`rounded-md border px-2 py-[3px] text-[11px] font-extrabold tracking-[1.2px] ${dark ? "border-white/35 text-white/85" : "border-line2 text-mut"}`}>SPONSORISÉ</span>
  );
}

const fitText = (p: Part) => {
  const s = compatSummary(p);
  return s.universal ? "Universel · toutes motos" : `Pour ${brandsLabel(s, 3)}`;
};

/** "À la une" ad spotlight on the Accueil: new and sponsored parts, auto-rotating. */
export function AdSpotlight({ ads }: { ads: Part[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || ads.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % ads.length), 6000);
    return () => clearInterval(t);
  }, [paused, ads.length]);

  if (!ads.length) return null;
  const p = ads[i % ads.length];
  const go = (d: number) => setI((n) => (n + d + ads.length) % ads.length);

  return (
    <section
      aria-roledescription="carrousel"
      aria-label="À la une"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="paint relative overflow-hidden rounded-[24px] bg-ink text-white"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-[12%] size-[420px] rounded-full bg-pri/25 blur-[90px]" />
      <div key={p.id} className="enter relative grid items-center gap-4 p-5 pb-16 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-8 md:p-10 md:pb-16">
        <div className="order-2 md:order-1">
          <div className="flex items-center gap-2">
            <span className="kick text-white/60">À la une</span>
            <AdLabel kind={p.ad!.kind} dark />
          </div>
          <h2 className="disp mt-2.5 text-[30px] leading-[.95] md:text-[clamp(40px,4vw,60px)]">{p.ad!.headline}</h2>
          {p.ad!.sub && <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-[#C8CAD0] md:text-[15px]">{p.ad!.sub}</p>}
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="disp text-lg text-[#FF8A55]">{p.maker}</span>
            <span className="text-sm font-semibold">{p.name}</span>
          </div>
          <div className="mt-1 text-[12.5px] text-white/60">{fitText(p)}</div>
          <div className="mt-4 flex items-baseline gap-2.5">
            <span className={`disp text-[40px] md:text-[48px] ${p.oldPrice ? "text-[#FF6B86]" : ""}`}>{dt(p.price)}</span>
            {p.oldPrice ? <span className="text-base text-white/50 line-through">{dt(p.oldPrice)}</span> : null}
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link href={`/pieces/${p.id}`} className="tap flex h-12 items-center gap-2 rounded-[14px] bg-pri px-5 text-[15px] font-bold text-white hover:bg-pri-h">
              Découvrir <ArrowRight size={18} />
            </Link>
            <Link href={`/reservation/${p.id}`} className="tap flex h-12 items-center rounded-[14px] border-[1.5px] border-white/25 px-5 text-[15px] font-semibold hover:border-white/60">
              Réserver
            </Link>
          </div>
        </div>
        <Link href={`/pieces/${p.id}`} aria-label={p.name} className="group order-1 flex justify-center md:order-2">
          <span className="bp relative flex size-[200px] items-center justify-center overflow-hidden rounded-full shadow-[0_0_0_10px_rgb(255_255_255/0.05),0_0_0_22px_rgb(255_255_255/0.03),0_40px_70px_-25px_rgb(0_0_0/0.7)] md:size-[clamp(260px,24vw,360px)]">
            <PartIcon icon={p.icon} strokeWidth={1.2} className="size-[130px] md:size-[clamp(170px,15vw,230px)]" />
          </span>
          <PromoTag part={p} className="absolute top-5 right-5 md:top-10 md:right-10" />
        </Link>
      </div>

      <div className="absolute inset-x-5 bottom-4 flex items-center justify-between md:inset-x-10">
        <div className="flex items-center">
          {ads.map((a, k) => (
            <button key={a.id} onClick={() => setI(k)} aria-label={`Annonce ${k + 1} sur ${ads.length}`} aria-current={k === i} className="flex h-8 w-8 items-center justify-center">
              <span className={`block h-1.5 rounded-full transition-all duration-300 ${k === i ? "w-6 bg-white" : "w-1.5 bg-white/35"}`} />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => go(-1)} aria-label="Annonce précédente" className="tap flex size-10 items-center justify-center rounded-full border border-white/25 hover:border-white/60">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => go(1)} aria-label="Annonce suivante" className="tap flex size-10 items-center justify-center rounded-full border border-white/25 hover:border-white/60">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

/** Wide sponsored card at the top of catalogue results. */
export function SponsoredCard({ part, fitsLabel }: { part: Part; fitsLabel?: string }) {
  return (
    <Link href={`/pieces/${part.id}`} className="group lift enter relative flex flex-col overflow-hidden rounded-[18px] border-[1.5px] border-[#F3C7B3] bg-[linear-gradient(120deg,#FFF6F1_0%,#FFFFFF_55%)] sm:flex-row md:col-span-2">
      <span className="bp relative flex h-44 shrink-0 items-center justify-center sm:h-auto sm:w-[44%]">
        <PartIcon icon={part.icon} size={110} strokeWidth={1.3} />
        <PromoTag part={part} className="absolute top-2.5 right-2.5" />
      </span>
      <span className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="flex items-center gap-2">
          <AdLabel kind={part.ad!.kind} />
        </span>
        <span className="disp text-[24px] leading-[1.02]">{part.ad!.headline}</span>
        <span className="text-[13.5px] font-semibold">
          <span className="disp mr-1.5 text-[15px] text-pri-ink">{part.maker}</span>
          {part.name}
        </span>
        {fitsLabel && <span className="text-[12.5px] font-semibold text-ok">✓ {fitsLabel}</span>}
        <span className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="flex items-baseline gap-2">
            <span className={`disp text-[28px] ${part.oldPrice ? "text-sale" : ""}`}>{dt(part.price)}</span>
            {part.oldPrice ? <span className="text-[13px] text-mut line-through">{dt(part.oldPrice)}</span> : null}
          </span>
          <span className="flex h-10 items-center gap-1.5 rounded-xl bg-pri px-3.5 text-[13.5px] font-bold text-white">
            Voir <ArrowRight size={16} />
          </span>
        </span>
      </span>
    </Link>
  );
}
