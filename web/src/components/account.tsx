"use client";

import Link from "next/link";
import { useState } from "react";
import { EARN_RULES, REWARDS, TIERS, nextTier, pointsValueDt, tierFor, type Reward, type Tier } from "@/lib/loyalty";
import type { Customer } from "@/lib/types";
import { useGarage } from "./garage-provider";
import { BagIcon, CheckIcon, ChevronRight, InfoIcon, MotoIcon, PinIcon, PlusIcon, StarIcon, TagIcon, UserIcon, WrenchIcon } from "./icons";

const nf = (n: number) => n.toLocaleString("fr-FR");
const date = new Intl.DateTimeFormat("fr-FR", { timeZone: "Africa/Tunis", day: "numeric", month: "short", year: "numeric" });

/** Barcode drawn from the card number, for scanning at the shop counter. */
function Barcode({ value, className = "" }: { value: string; className?: string }) {
  const digits = value.replace(/\D/g, "");
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (const d of `${digits}${digits.split("").reverse().join("")}`) {
    const n = Number(d);
    bars.push({ x, w: 1 + (n % 3) });
    x += 2 + (n % 3) + ((n + 1) % 2);
  }
  return (
    <svg viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" className={className} role="img" aria-label={`Code-barres carte ${value}`}>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="40" fill="#1B1C20" />
      ))}
    </svg>
  );
}

/** The loyalty card, in the finish of the member's tier. */
export function LoyaltyCard({ customer, tier }: { customer: Customer; tier: Tier }) {
  return (
    <div className="group relative aspect-[1.586] w-full max-w-[480px] overflow-hidden rounded-[22px] p-5 shadow-[0_30px_50px_-24px_rgb(27_28_32/0.6),inset_0_1px_0_rgb(255_255_255/0.45)] md:p-6" style={{ background: tier.card, color: tier.text }}>
      {/* brushed metal + clear coat */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgb(255 255 255 / .6) 0 1px, transparent 1px 3px)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgb(255_255_255/0.35)_45%,transparent_58%)] transition-transform duration-700 group-hover:translate-x-1/4" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between">
          <span className="disp text-[20px] md:text-[24px]">
            PiècesExpress <span className="text-[13px] md:text-[15px]">Moto</span>
          </span>
          <span className="flex items-center gap-1 rounded-full border border-current/30 px-2.5 py-1 text-[11px] font-extrabold tracking-[1.5px] uppercase">
            <StarIcon size={12} /> {tier.name}
          </span>
        </div>
        <div className="mt-auto">
          <div className="text-[11px] font-bold tracking-[1.5px] uppercase opacity-75">Solde de points</div>
          <div className="disp text-[44px] leading-[.9] md:text-[54px]">
            {nf(customer.points)} <span className="text-[20px]">pts</span>
          </div>
          <div className="mt-3 flex items-end justify-between gap-3">
            <span>
              <span className="block text-[13px] font-bold tracking-[1px] uppercase">
                {customer.firstName} {customer.lastName}
              </span>
              <span className="block font-mono text-[12.5px] tracking-[2px] opacity-80">{customer.cardNumber}</span>
            </span>
            <span className="text-right text-[11px] leading-tight opacity-75">
              Membre depuis
              <br />
              {date.format(new Date(customer.memberSince))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Balance, value, tier progress and the barcode to show in store. */
export function LoyaltySummary({ customer, tier }: { customer: Customer; tier: Tier }) {
  const next = nextTier(tier);
  const pct = next ? Math.min(100, Math.round(((customer.earned12m - tier.min) / (next.min - tier.min)) * 100)) : 100;
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-line bg-card p-4 md:p-5">
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          [nf(customer.points), "points"],
          [`${pointsValueDt(customer.points)} DT`, "en bons d'achat"],
          [`×${tier.multiplier}`, "points par DT"],
        ].map(([v, l]) => (
          <div key={l} className="rounded-2xl bg-page px-2 py-3">
            <div className="disp text-[24px]">{v}</div>
            <div className="text-[11.5px] text-mut">{l}</div>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-baseline justify-between text-[13px]">
          <span className="font-bold" style={{ color: tier.ink }}>
            Membre {tier.name}
          </span>
          <span className="text-mut">{next ? `${nf(next.min - customer.earned12m)} pts pour ${next.name}` : "Niveau maximum"}</span>
        </div>
        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-sunk">
          <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${pct}%`, background: next?.card ?? tier.card }} />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] text-mut">
          {TIERS.map((t) => (
            <span key={t.id} className={t.id === tier.id ? "font-bold text-ink" : ""}>
              {t.name}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tier.perks.map((p) => (
          <span key={p} className="flex items-center gap-1 rounded-full bg-page px-2.5 py-1 text-[12px] font-semibold">
            <CheckIcon size={12} className="text-ok" />
            {p}
          </span>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-line2 p-3 text-center">
        <Barcode value={customer.cardNumber} className="mx-auto h-12 w-full max-w-[320px]" />
        <div className="mt-1.5 font-mono text-[12px] tracking-[3px]">{customer.cardNumber}</div>
        <div className="mt-0.5 text-[11.5px] text-mut">Montrez ce code en magasin pour cumuler vos points</div>
      </div>
    </div>
  );
}

const REWARD_ICON = { voucher: TagIcon, truck: BagIcon, wrench: WrenchIcon, tag: TagIcon } as const;

export function Rewards({ points: initial }: { points: number }) {
  const [points, setPoints] = useState(initial);
  const [codes, setCodes] = useState<Record<string, string>>({});
  const redeem = (r: Reward) => {
    if (points < r.cost) return;
    setPoints(points - r.cost);
    setCodes({ ...codes, [r.id]: `FID-${r.id.toUpperCase()}-${(points % 9000) + 1000}` });
  };
  return (
    <section>
      <div className="mb-2.5 flex items-baseline justify-between">
        <h2 className="disp text-[24px] md:text-[30px]">Mes récompenses</h2>
        <span className="text-[13px] text-mut">{nf(points)} pts disponibles</span>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {REWARDS.map((r) => {
          const Icon = REWARD_ICON[r.icon];
          const ok = points >= r.cost;
          const code = codes[r.id];
          return (
            <div key={r.id} className={`flex flex-col gap-2.5 rounded-2xl border bg-card p-3.5 transition-colors ${code ? "border-ok" : "border-line"}`}>
              <div className="flex items-start gap-3">
                <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${ok || code ? "bg-pri text-white" : "bg-sunk text-mut"}`}>
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14.5px] font-bold">{r.title}</span>
                  <span className="block text-[12.5px] text-mut">{r.detail}</span>
                </span>
                <span className="disp shrink-0 text-[18px]">{nf(r.cost)}</span>
              </div>
              {code ? (
                <div className="enter flex items-center justify-between rounded-xl bg-ok-soft px-3 py-2 text-[13px] text-[#14532D]">
                  <span>
                    Votre code : <strong className="font-mono">{code}</strong>
                  </span>
                  <CheckIcon size={16} className="text-ok" />
                </div>
              ) : ok ? (
                <button onClick={() => redeem(r)} className="tap h-10 rounded-xl bg-pri text-[13.5px] font-bold text-white hover:bg-pri-h">
                  Utiliser {nf(r.cost)} points
                </button>
              ) : (
                <div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-sunk">
                    <div className="h-full rounded-full bg-pri/60" style={{ width: `${Math.round((points / r.cost) * 100)}%` }} />
                  </div>
                  <div className="mt-1 text-[11.5px] text-mut">Encore {nf(r.cost - points)} points</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {EARN_RULES.map((e) => (
          <div key={e.title} className="rounded-2xl bg-pri-soft/60 p-3">
            <div className="text-[13.5px] font-bold text-pri-ink">{e.title}</div>
            <div className="mt-0.5 text-[12px] leading-snug text-ink2">{e.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PointsHistory({ history }: { history: Customer["history"] }) {
  return (
    <section>
      <h2 className="disp mb-2.5 text-[24px] md:text-[30px]">Historique des points</h2>
      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        {history.map((h) => (
          <div key={h.id} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0">
            <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${h.points > 0 ? "bg-ok-soft text-ok" : h.points < 0 ? "bg-pri-soft text-pri-ink" : "bg-sunk text-mut"}`}>
              {h.points >= 0 ? <PlusIcon size={16} /> : <TagIcon size={16} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{h.label}</span>
              <span className="text-[12px] text-mut">{date.format(new Date(h.at))}</span>
            </span>
            <span className={`disp text-[19px] ${h.points > 0 ? "text-ok" : h.points < 0 ? "text-pri-ink" : "text-mut"}`}>{h.points === 0 ? "en attente" : `${h.points > 0 ? "+" : ""}${nf(h.points)}`}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProfileCard({ customer, tier }: { customer: Customer; tier: Tier }) {
  return (
    <section className="rounded-3xl border border-line bg-card p-4 md:p-5">
      <div className="flex items-center gap-3">
        <span className="disp flex size-14 shrink-0 items-center justify-center rounded-2xl text-[22px] shadow-[inset_0_1px_0_rgb(255_255_255/0.4)]" style={{ background: tier.card, color: tier.text }}>
          {customer.firstName[0]}
          {customer.lastName[0]}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-bold">
            {customer.firstName} {customer.lastName}
          </span>
          <span className="flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: tier.ink }}>
            <StarIcon size={12} /> Membre {tier.name}
          </span>
        </span>
        <button className="tap h-9 rounded-full border-[1.5px] border-line px-3 text-[12.5px] font-bold hover:border-line2">Modifier</button>
      </div>
      <dl className="mt-4 grid gap-2.5 text-sm">
        {[
          ["Téléphone", customer.phone],
          ["E-mail", customer.email],
          ["Adresse de livraison", customer.address],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3 border-b border-line pb-2.5 last:border-0 last:pb-0">
            <dt className="text-mut">{k}</dt>
            <dd className="text-right font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function GarageList() {
  const { bikes, active, setActive } = useGarage();
  return (
    <section className="rounded-3xl border border-line bg-card p-4 md:p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="disp text-[22px]">Mon garage</h2>
        <span className="text-[12.5px] text-mut">{bikes.length} moto{bikes.length > 1 ? "s" : ""}</span>
      </div>
      <div className="flex flex-col gap-2">
        {bikes.map((b) => {
          const on = b.modelId === active.modelId;
          return (
            <button key={b.modelId} onClick={() => setActive(b.modelId)} aria-pressed={on} className={`tap flex items-center gap-3 rounded-2xl border-[1.5px] p-2.5 text-left ${on ? "" : "border-line hover:border-line2"}`} style={on ? { borderColor: b.type.fg, background: b.type.soft } : undefined}>
              <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-card">
                <MotoIcon type={b.model.type} color={b.type.fg} width={46} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{b.label}</span>
                <span className="text-[12px] text-mut">
                  {b.year} · {b.model.cc} cm³ · {b.model.type}
                </span>
              </span>
              {on ? <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold text-white">Active</span> : <span className="text-[12px] font-semibold text-pri-ink">Choisir</span>}
            </button>
          );
        })}
        <Link href="/garage" className="tap flex h-11 items-center justify-center gap-1.5 rounded-2xl border-[1.5px] border-dashed border-line2 text-[13.5px] font-bold">
          <PlusIcon size={16} /> Ajouter une moto
        </Link>
      </div>
    </section>
  );
}

const PREFS = [
  { id: "orders", label: "Suivi de commande", detail: "Confirmée, prête, en livraison", def: true },
  { id: "promos", label: "Promos pour ma moto", detail: "Seulement les pièces compatibles", def: true },
  { id: "stock", label: "Retour en stock", detail: "Pièces que vous avez suivies", def: true },
  { id: "loyalty", label: "Points et récompenses", detail: "Points crédités, changement de niveau", def: false },
];

export function NotificationPrefs() {
  const [on, setOn] = useState<Record<string, boolean>>(Object.fromEntries(PREFS.map((p) => [p.id, p.def])));
  const [channel, setChannel] = useState<"whatsapp" | "sms" | "email">("whatsapp");
  return (
    <section id="notifications" className="scroll-mt-6 rounded-3xl border border-line bg-card p-4 md:p-5">
      <h2 className="disp mb-1 text-[22px]">Notifications</h2>
      <p className="mb-3 text-[12.5px] text-mut">Choisissez ce que vous recevez, et où.</p>
      <div role="radiogroup" aria-label="Canal" className="mb-2 grid grid-cols-3 rounded-xl border border-line bg-sunk p-1">
        {(["whatsapp", "sms", "email"] as const).map((c) => (
          <button key={c} role="radio" aria-checked={channel === c} onClick={() => setChannel(c)} className={`h-8 rounded-[9px] text-[12.5px] font-bold transition-[background-color,box-shadow] duration-200 ${channel === c ? "bg-card shadow-[0_1px_3px_rgb(27_28_32/0.16)]" : "text-mut"}`}>
            {c === "whatsapp" ? "WhatsApp" : c === "sms" ? "SMS" : "E-mail"}
          </button>
        ))}
      </div>
      {PREFS.map((p) => (
        <label key={p.id} className="flex cursor-pointer items-center gap-3 border-b border-line py-3 last:border-0">
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">{p.label}</span>
            <span className="text-[12px] text-mut">{p.detail}</span>
          </span>
          <input type="checkbox" role="switch" className="peer sr-only" checked={on[p.id]} onChange={() => setOn({ ...on, [p.id]: !on[p.id] })} />
          <span className={`flex h-[26px] w-[46px] shrink-0 rounded-full p-[3px] transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-pri ${on[p.id] ? "bg-pri" : "bg-line2"}`}>
            <span className={`block size-5 rounded-full bg-white shadow transition-transform duration-[220ms] ${on[p.id] ? "translate-x-5" : ""}`} />
          </span>
        </label>
      ))}
    </section>
  );
}

export function AccountLinks() {
  const links = [
    { href: "/commandes", label: "Mes commandes", Icon: BagIcon },
    { href: "/compte", label: "Mes adresses", Icon: PinIcon },
    { href: "/compte", label: "Aide et contact", Icon: InfoIcon },
  ];
  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-card">
      {links.map((l) => (
        <Link key={l.label} href={l.href} className="flex items-center gap-3 border-b border-line px-4 py-3.5 transition-colors hover:bg-page">
          <l.Icon size={19} className="text-pri" />
          <span className="flex-1 text-sm font-semibold">{l.label}</span>
          <ChevronRight size={16} className="text-mut" />
        </Link>
      ))}
      <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-semibold text-sale transition-colors hover:bg-page">
        <UserIcon size={19} /> Se déconnecter
      </button>
    </section>
  );
}

export { tierFor };
