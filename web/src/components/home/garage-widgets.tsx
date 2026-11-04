"use client";

import Link from "next/link";
import { CONDITIONS, dt } from "@/lib/catalog";
import type { Condition, PartIconId } from "@/lib/types";
import { bikeQuery, useGarage } from "../garage-provider";
import { CheckIcon, ChevronRight, MotoIcon, PartIcon } from "../icons";
import { PromoTag } from "../parts";
import { fitsModel, type FitInfo } from "@/lib/compat";

/** "Ma moto" card at the top of the phone home page. */
export function MyBikeCard() {
  const { active } = useGarage();
  return (
    <Link href="/garage" className="tap lift flex items-center gap-3 rounded-2xl border border-line bg-card px-3 py-2.5">
      <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-xl transition-colors duration-200" style={{ background: active.type.soft }}>
        <MotoIcon type={active.model.type} color={active.type.fg} width={54} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="kick block">Ma moto</span>
        <span className="block text-[15px] font-bold">{active.label}</span>
        <span className="block text-[12.5px] text-mut">
          {active.year} · {active.model.cc} cm³ · {active.model.type}
        </span>
      </span>
      <span className="flex items-center gap-0.5 text-[13px] font-semibold text-pri-ink">
        Changer <ChevronRight size={16} />
      </span>
    </Link>
  );
}

export type CompactPart = { id: string; name: string; maker: string; ref: string; cond: Condition; price: number; oldPrice: number | null; tag: "new" | "best" | null; icon: PartIconId; shop: string } & FitInfo;

/** "Pour votre <moto>": parts for each bike in the garage. */
export function BikeParts({ parts }: { parts: CompactPart[] }) {
  const { bikes, active, setActive } = useGarage();
  const list = parts.filter((p) => fitsModel(p, active.model)).slice(0, 6);
  return (
    <section>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="disp text-2xl md:text-[40px]">
          Pour votre <span style={{ color: active.type.ink }}>{active.model.name}</span>
        </h2>
        <Link href={`/catalogue?${bikeQuery(active)}`} className="shrink-0 text-[13px] font-semibold text-pri-ink md:text-sm">
          Tout voir →
        </Link>
      </div>
      <div className="noscroll -mx-4 mt-2.5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {bikes.map((b) => {
          const on = b.modelId === active.modelId;
          return (
            <button key={b.modelId} onClick={() => setActive(b.modelId)} aria-pressed={on} className={`tap flex h-10 shrink-0 items-center gap-1.5 rounded-full border-[1.5px] pr-3.5 pl-2.5 text-[13px] font-semibold whitespace-nowrap ${on ? "border-ink bg-ink text-white" : "border-line bg-card hover:border-line2"}`}>
              <MotoIcon type={b.model.type} color="currentColor" width={30} strokeWidth={3} />
              {b.label}
            </button>
          );
        })}
        <Link href="/garage" className="tap flex h-10 shrink-0 items-center rounded-full border-[1.5px] border-dashed border-line2 px-3.5 text-[13px] font-semibold whitespace-nowrap">
          + Ajouter une moto
        </Link>
      </div>
      <div key={active.modelId} className="mt-3 grid gap-2 md:grid-cols-2 md:gap-3.5 xl:grid-cols-3">
        {list.map((p, i) => (
          <Link key={p.id} href={`/pieces/${p.id}`} className="lift enter flex gap-3 rounded-2xl border border-line bg-card p-2.5" style={{ animationDelay: `${i * 50}ms` }}>
            <span className="bp relative flex size-[66px] shrink-0 items-center justify-center rounded-xl">
              <PartIcon icon={p.icon} size={42} strokeWidth={1.7} />
              <PromoTag part={p} className="absolute -top-1.5 -right-1.5 !px-1.5 !py-0.5 !text-[10px]" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <span className="text-[13.5px] leading-snug font-semibold">{p.name}</span>
              <span className="flex items-center gap-1.5">
                <span className={`rounded-[5px] border px-1.5 py-0.5 text-[10.5px] font-bold uppercase ${CONDITIONS[p.cond].className}`}>{CONDITIONS[p.cond].label}</span>
                <span className="truncate font-mono text-[11px] text-mut">{p.ref}</span>
              </span>
              <span className="text-[11.5px] text-mut">{p.shop}</span>
            </span>
            <span className="flex flex-col items-end justify-between">
              <strong className="disp text-[21px] whitespace-nowrap">{dt(p.price)}</strong>
              <span className="flex items-center gap-1 rounded-[5px] bg-ok-soft px-1.5 py-0.5 text-[11px] font-bold text-ok">
                <CheckIcon size={11} strokeWidth={3.2} />
                Compatible
              </span>
            </span>
          </Link>
        ))}
        {list.length === 0 && <p className="rounded-2xl border-[1.5px] border-dashed border-line2 bg-card p-5 text-center text-sm text-mut">Pas encore de pièces pour cette moto. Demandez un devis aux magasins.</p>}
      </div>
    </section>
  );
}
