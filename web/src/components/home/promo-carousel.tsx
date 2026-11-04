"use client";

import Link from "next/link";
import { useState } from "react";
import { PART_ICONS } from "@/lib/catalog";
import { ArrowRight } from "../icons";

const BigIcon = ({ d, className, color }: { d: string; className: string; color: string }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
    <path d={d} />
  </svg>
);

export function PromoCarousel() {
  const [slide, setSlide] = useState(0);
  const slides = [
    <article key="brake" className="paint relative flex h-full flex-col overflow-hidden bg-pri p-[18px] text-white md:p-[clamp(22px,3vw,40px)]">
      <BigIcon d={PART_ICONS.disc} color="rgba(255,255,255,.2)" className="-top-7 -right-6 size-[150px] md:-top-16 md:-right-20 md:size-[360px]" />
      <span className="text-[11px] font-extrabold tracking-[1.5px] opacity-90 md:text-xs">OFFRE DU MOIS</span>
      <h2 className="disp mt-1.5 max-w-[200px] text-[32px] leading-[.95] md:max-w-[420px] md:text-[clamp(44px,5vw,70px)]">Saison freinage</h2>
      <p className="mt-1.5 max-w-[190px] text-[13px] leading-snug md:max-w-[340px] md:text-base">Plaquettes &amp; disques Brembo, EBC, Galfer</p>
      <Link href="/catalogue?cat=freinage" className="tap mt-auto flex h-10 items-center gap-1.5 self-start rounded-[11px] bg-white px-4 text-sm font-bold text-pri-ink md:h-[52px] md:px-[22px] md:text-[15px]">
        J&apos;en profite <ArrowRight size={16} />
      </Link>
      <span className="disp absolute right-4 bottom-2 text-[84px] tracking-[-2px] md:right-[clamp(16px,3vw,36px)] md:bottom-7 md:text-[clamp(110px,13vw,190px)]" aria-hidden="true">
        -20%
      </span>
    </article>,
    <article key="service" className="paint relative flex h-full flex-col overflow-hidden bg-[#2F5BEA] p-[18px] text-white md:p-[clamp(22px,3vw,40px)]">
      <BigIcon d={PART_ICONS.filter} color="rgba(255,255,255,.25)" className="top-3 -right-1 size-[120px] md:top-auto md:right-0 md:bottom-4 md:size-[240px]" />
      <span className="text-[11px] font-extrabold tracking-[1.5px] opacity-90 md:text-xs">PACK RÉVISION</span>
      <h2 className="disp mt-1.5 text-[32px] leading-[.95] md:text-[clamp(44px,5vw,70px)]">Vidange complète</h2>
      <p className="mt-1.5 max-w-[210px] text-[13px] leading-snug md:max-w-[340px] md:text-base">Huile 10W-40 + filtre + bougies, calibrés pour votre moto</p>
      <div className="mt-auto flex items-center gap-3.5">
        <Link href="/catalogue?cat=filtration" className="tap flex h-10 items-center rounded-[11px] bg-white px-4 text-sm font-bold text-[#1E40AF] md:h-[52px] md:px-[22px] md:text-[15px]">
          Voir le pack
        </Link>
        <span className="text-[13px] md:text-[15px]">
          dès <strong className="disp text-[26px] md:text-[38px]">189 DT</strong>
        </span>
      </div>
    </article>,
    <article key="delivery" className="paint relative flex h-full flex-col overflow-hidden bg-[#FFE7A3] p-[18px] text-ink md:p-[clamp(22px,3vw,40px)]">
      <span className="text-[11px] font-extrabold tracking-[1.5px] text-[#7A5200] md:text-xs">GRAND TUNIS</span>
      <h2 className="disp mt-1.5 text-[32px] leading-[.95] md:text-[clamp(44px,5vw,70px)]">Livraison offerte</h2>
      <p className="mt-1.5 max-w-[220px] text-[13px] leading-snug text-[#4A3B12] md:max-w-[340px] md:text-base">Dès 150 DT d&apos;achat · livré en 24 h, payé à la réception</p>
      <Link href="/catalogue" className="tap mt-auto flex h-10 items-center self-start rounded-[11px] bg-ink px-4 text-sm font-bold text-white md:h-[52px] md:px-[22px] md:text-[15px]">
        Commander
      </Link>
      <svg viewBox="0 0 24 24" fill="none" stroke="#E9C35A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="pointer-events-none absolute right-3 bottom-1.5 size-24 md:size-56">
        <path d="M2 7h11v9H2zM13 10h4.5l3.5 3.5V16h-8z" />
        <circle cx="6" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
      </svg>
    </article>,
  ];
  return (
    <section aria-roledescription="carrousel" aria-label="Promotions" className="relative min-w-0 md:flex md:flex-col">
      <div className="overflow-hidden rounded-[20px] md:min-h-[420px] md:flex-1 md:rounded-[24px]">
        <div className="flex h-[176px] transition-transform duration-[450ms] ease-[cubic-bezier(.2,.8,.2,1)] md:h-full" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {slides.map((s, i) => (
            <div key={i} className="h-full w-full shrink-0" aria-hidden={i !== slide} inert={i !== slide}>
              {s}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-1 flex justify-center md:absolute md:bottom-2.5 md:left-[clamp(22px,3vw,40px)] md:mt-0">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} aria-label={`Promotion ${i + 1} sur ${slides.length}`} aria-current={i === slide} className="flex h-[30px] w-9 items-center justify-center">
            <span className={`block h-1.5 rounded-full transition-all duration-250 ${i === slide ? "w-6 bg-ink" : "w-2 bg-line2 md:bg-ink/25"}`} />
          </button>
        ))}
      </div>
    </section>
  );
}
