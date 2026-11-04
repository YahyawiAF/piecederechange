"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, plural } from "@/lib/catalog";
import { TYPES } from "@/lib/moto";
import { bikeQuery, useGarage } from "./garage-provider";
import { ArrowRight, ChevronRight, GridIcon, MotoIcon, PartIcon } from "./icons";

/**
 * Desktop "Toutes les catégories" mega menu: every category with its picture, sub-categories and part count,
 * plus motorcycle types, the current promo and a shortcut to parts for the saved bike.
 */
export function MegaMenu({ counts }: { counts: Record<string, number> }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const { active } = useGarage();

  const later = (fn: () => void, ms: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const close = () => setOpen(false);

  return (
    <div ref={root} onMouseEnter={() => later(() => setOpen(true), 120)} onMouseLeave={() => later(() => setOpen(false), 220)}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mega-menu"
        className={`tap flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold text-white ${open ? "bg-pri" : "bg-ink"}`}
      >
        <GridIcon size={18} />
        Toutes les catégories
        <ChevronRight size={16} className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </button>

      <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-30 bg-ink/25 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />

      <div
        id="mega-menu"
        role="region"
        aria-label="Toutes les catégories"
        inert={!open}
        className={`absolute inset-x-6 top-full z-40 mt-2 grid grid-cols-[minmax(0,1fr)_300px] gap-6 rounded-3xl border border-line bg-card p-6 shadow-[0_30px_60px_-20px_rgb(27_28_32/0.35)] transition-[opacity,transform] duration-[260ms] ease-[cubic-bezier(.2,.8,.2,1)] xl:inset-x-10 ${open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
      >
        <div>
          <div className="mb-4 flex items-baseline justify-between">
            <span className="disp text-[28px]">Pièces &amp; équipement</span>
            <Link href="/catalogue" onClick={close} className="text-sm font-semibold text-pri-ink">
              Tout le catalogue →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 2xl:grid-cols-4">
            {CATEGORIES.map((c) => (
              <div key={c.id} className="group lift relative flex cursor-pointer gap-3 rounded-2xl border border-line p-2.5 hover:border-pri">
                <span className="bp flex size-[84px] shrink-0 items-center justify-center overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element -- optional ERP photo, any host */}
                  {c.image ? <img src={c.image} alt="" className="size-full object-cover" /> : <PartIcon icon={c.icon} size={58} strokeWidth={1.5} />}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link href={`/catalogue?cat=${c.id}`} onClick={close} className="flex items-baseline justify-between gap-2 after:absolute after:inset-0 after:rounded-2xl after:content-['']">
                    <span className="truncate text-[15px] font-bold transition-colors group-hover:text-pri-ink">{c.name}</span>
                    <span className="shrink-0 text-[11.5px] text-mut">{plural(counts[c.id] ?? 0, "pièce", "pièces")}</span>
                  </Link>
                  <span className="truncate text-[12px] text-mut">{c.blurb}</span>
                  <span className="mt-1.5 flex flex-wrap gap-x-2.5 gap-y-0.5">
                    {c.subs.map((s) => (
                      <Link key={s.label} href={`/catalogue?cat=${c.id}&q=${encodeURIComponent(s.q)}`} onClick={close} className="relative z-10 text-[12.5px] font-medium text-ink2 transition-colors hover:text-pri-ink hover:underline">
                        {s.label}
                      </Link>
                    ))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-4 border-l border-line pl-6">
          <div>
            <div className="kick mb-2">Par type de moto</div>
            <div className="grid grid-cols-2 gap-1.5">
              {TYPES.map((t) => (
                <Link key={t.id} href={`/catalogue?type=${encodeURIComponent(t.id)}`} onClick={close} className="tap flex items-center gap-2 rounded-xl border-[1.5px] border-transparent px-2 py-1.5 text-[13px] font-semibold hover:border-[var(--tone)] hover:bg-[var(--tint)]" style={{ "--tint": t.soft, "--tone": t.fg } as React.CSSProperties}>
                  <MotoIcon type={t.id} color={t.fg} width={32} strokeWidth={3} />
                  {t.label}
                </Link>
              ))}
            </div>
          </div>
          <Link href={`/catalogue?${bikeQuery(active)}`} onClick={close} className="tap flex items-center gap-3 rounded-2xl border-[1.5px] p-3" style={{ borderColor: active.type.fg, background: active.type.soft }}>
            <MotoIcon type={active.model.type} color={active.type.fg} width={44} />
            <span className="min-w-0 flex-1">
              <span className="kick block" style={{ color: active.type.ink }}>
                Ma moto
              </span>
              <span className="block truncate text-sm font-bold">Pièces pour votre {active.model.name}</span>
            </span>
            <ArrowRight size={18} />
          </Link>
          <Link href="/catalogue?cat=freinage" onClick={close} className="paint relative mt-auto flex min-h-[150px] flex-col justify-end overflow-hidden rounded-2xl bg-pri p-4 text-white">
            <span className="text-[11px] font-extrabold tracking-[1.5px] opacity-90">OFFRE DU MOIS</span>
            <span className="disp mt-1 text-[28px] leading-[.95]">Saison freinage</span>
            <span className="mt-1 text-[13px]">Jusqu&apos;à -20 % · Brembo, EBC, Galfer</span>
            <span className="disp absolute top-2 right-3 text-[56px] opacity-90" aria-hidden="true">
              -20%
            </span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
