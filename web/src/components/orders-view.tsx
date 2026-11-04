"use client";

import Link from "next/link";
import { useState } from "react";
import { dt, plural } from "@/lib/catalog";
import type { Order, OrderStatus } from "@/lib/types";
import { BagIcon, BoxIcon, ChatIcon, CheckIcon, ChevronRight, CloseIcon, InfoIcon, PartIcon, PhoneIcon, PinIcon, RouteIcon, SearchIcon, WrenchIcon } from "./icons";

const fmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "Africa/Tunis", day: "numeric", month: "short" });
const fmtTime = new Intl.DateTimeFormat("fr-FR", { timeZone: "Africa/Tunis", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const STATUS: Record<OrderStatus, { label: string; cls: string }> = {
  reserved: { label: "En attente", cls: "bg-pri-soft text-pri-ink" },
  confirmed: { label: "Confirmée", cls: "bg-[#E9EFFE] text-[#1E40AF]" },
  preparing: { label: "En préparation", cls: "bg-warn-soft text-[#8A4B00]" },
  ready: { label: "Prête", cls: "bg-ok-soft text-[#0E7A3D]" },
  done: { label: "Terminée", cls: "bg-sunk text-ink2" },
  cancelled: { label: "Annulée", cls: "bg-[#FDE9EE] text-[#9F1239]" },
};

const FLOW: OrderStatus[] = ["reserved", "confirmed", "preparing", "ready", "done"];
const stepLabel = (s: OrderStatus, mode: Order["mode"]) =>
  ({ reserved: "Réservée", confirmed: "Confirmée", preparing: "Préparation", ready: mode === "pickup" ? "Prête au retrait" : "En livraison", done: mode === "pickup" ? "Récupérée" : "Livrée", cancelled: "Annulée" })[s];

const subtotal = (o: Order) => o.lines.reduce((a, l) => a + l.qty * l.unitPrice, 0);
const total = (o: Order) => subtotal(o) + o.deliveryFee;
const itemCount = (o: Order) => o.lines.reduce((a, l) => a + l.qty, 0);

type Tab = "all" | "active" | "ready" | "done" | "cancelled";
const TABS: { id: Tab; label: string; match: (o: Order) => boolean }[] = [
  { id: "all", label: "Toutes", match: () => true },
  { id: "active", label: "En cours", match: (o) => ["reserved", "confirmed", "preparing"].includes(o.status) },
  { id: "ready", label: "Prêtes", match: (o) => o.status === "ready" },
  { id: "done", label: "Terminées", match: (o) => o.status === "done" },
  { id: "cancelled", label: "Annulées", match: (o) => o.status === "cancelled" },
];

function Pill({ status }: { status: OrderStatus }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap ${STATUS[status].cls}`}>{STATUS[status].label}</span>;
}

function Progress({ o, detailed = false }: { o: Order; detailed?: boolean }) {
  if (o.status === "cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-[#FDE9EE] px-3 py-2 text-[13px] font-semibold text-[#9F1239]">
        <CloseIcon size={16} /> Commande annulée {fmtTime.format(new Date(o.events.at(-1)!.at))}
      </div>
    );
  }
  const reached = FLOW.indexOf(o.status);
  return (
    <div>
      {detailed && (
        <ol className="flex flex-col sm:hidden">
          {FLOW.map((s, k) => {
            const ev = o.events.find((e) => e.status === s);
            const done = k < reached || o.status === "done";
            const now = k === reached && o.status !== "done";
            return (
              <li key={s} className="relative flex gap-3 pb-3.5 last:pb-0">
                {k < FLOW.length - 1 && <span className={`absolute top-6 left-[11px] h-[calc(100%-20px)] w-[3px] rounded-full ${k < reached ? "bg-ok" : "bg-line"}`} />}
                <span className={`relative flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${done ? "border-ok bg-ok text-white" : now ? "border-pri bg-pri shadow-[0_0_0_4px_rgb(214_63_11/0.16)]" : "border-line2 bg-card"}`}>
                  {done && <CheckIcon size={13} strokeWidth={3.4} />}
                </span>
                <span className="flex flex-1 items-baseline justify-between gap-2 pt-0.5 text-[13px]">
                  <span className={`font-semibold ${k <= reached ? "text-ink" : "text-mut"}`}>{stepLabel(s, o.mode)}</span>
                  <span className="text-xs text-mut">{ev ? fmtTime.format(new Date(ev.at)) : "—"}</span>
                </span>
              </li>
            );
          })}
        </ol>
      )}
      <div className={`items-center ${detailed ? "hidden sm:flex" : "flex"}`}>
        {FLOW.map((s, k) => (
          <span key={s} className="contents">
            {k > 0 && <span className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${k <= reached ? "bg-ok" : "bg-line"}`} />}
            <span className={`flex shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${detailed ? "size-6" : "size-3.5"} ${k < reached || o.status === "done" ? "border-ok bg-ok text-white" : k === reached ? "border-pri bg-pri text-white shadow-[0_0_0_4px_rgb(214_63_11/0.16)]" : "border-line2 bg-card"}`}>
              {detailed && (k < reached || o.status === "done") && <CheckIcon size={13} strokeWidth={3.4} />}
            </span>
          </span>
        ))}
      </div>
      {detailed && (
        <div className="mt-2 hidden grid-cols-5 gap-1 text-[11.5px] sm:grid">
          {FLOW.map((s, k) => {
            const ev = o.events.find((e) => e.status === s);
            return (
              <span key={s} className={k === 0 ? "text-left" : k === FLOW.length - 1 ? "text-right" : "text-center"}>
                <span className={`block font-semibold ${k <= reached ? "text-ink" : "text-mut"}`}>{stepLabel(s, o.mode)}</span>
                <span className="block text-mut">{ev ? fmtTime.format(new Date(ev.at)) : "—"}</span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrderDetail({ o }: { o: Order }) {
  const canCancel = o.status === "reserved" || o.status === "confirmed";
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[13px] text-mut">{o.code}</div>
          <h2 className="disp mt-1 text-[28px]">{o.mode === "pickup" ? "Retrait en magasin" : "Livraison express"}</h2>
          <div className="mt-1 text-[13px] text-mut">
            Passée le {fmtTime.format(new Date(o.createdAt))} · {o.bike}
          </div>
        </div>
        <Pill status={o.status} />
      </div>

      <div className="rounded-2xl border border-line bg-page/60 p-4">
        <Progress o={o} detailed />
        <p className="mt-3.5 flex gap-2 border-t border-line pt-3 text-[13px] leading-snug text-ink2">
          <InfoIcon size={17} className="mt-px shrink-0 text-pri" />
          {o.note}
        </p>
      </div>

      <section>
        <h3 className="kick mb-2">Articles · {itemCount(o)}</h3>
        <div className="overflow-hidden rounded-2xl border border-line">
          {o.lines.map((l) => (
            <Link key={l.partId} href={`/pieces/${l.partId}`} className="flex items-center gap-3 border-b border-line bg-card px-3 py-2.5 transition-colors last:border-0 hover:bg-page">
              <span className="bp flex size-12 shrink-0 items-center justify-center rounded-lg">
                <PartIcon icon={l.icon} size={32} strokeWidth={1.7} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{l.name}</span>
                <span className="font-mono text-[11.5px] text-mut">{l.ref}</span>
              </span>
              <span className="text-right text-[13px]">
                <span className="block text-mut">
                  {l.qty} × {dt(l.unitPrice)}
                </span>
                <span className="block font-bold">{dt(l.qty * l.unitPrice)}</span>
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-1.5 px-1 text-sm">
          <div className="flex justify-between">
            <span className="text-mut">Sous-total</span>
            <span className="font-semibold">{dt(subtotal(o))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-mut">{o.mode === "pickup" ? "Retrait en magasin" : "Livraison express"}</span>
            <span className="font-semibold">{o.deliveryFee ? dt(o.deliveryFee) : "Gratuit"}</span>
          </div>
          {o.fitting && (
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5 text-mut">
                <WrenchIcon size={15} /> Montage en atelier
              </span>
              <span className="font-semibold">Payé au magasin</span>
            </div>
          )}
          <div className="mt-1 flex items-baseline justify-between border-t border-line pt-2.5">
            <span className="font-bold">Total</span>
            <span className="disp text-[30px] text-pri-ink">{dt(total(o))}</span>
          </div>
          <div className="text-right text-xs text-mut">{o.status === "done" ? "Payé à la réception" : o.status === "cancelled" ? "Rien n'a été facturé" : `À payer ${o.mode === "pickup" ? "au retrait" : "à la livraison"}`}</div>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-card p-4">
        <div className="flex items-center gap-3">
          <span className="disp flex size-12 shrink-0 items-center justify-center rounded-xl bg-pri-soft text-xl text-pri-ink">{o.shop.ini}</span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold">{o.shop.name}</span>
            <span className="text-[12.5px] text-mut">
              ★ {o.shop.rating} ({o.shop.reviews}) · ouvert {o.shop.hours}
            </span>
          </span>
        </div>
        <p className="mt-3 flex gap-2 text-[13px] text-ink2">
          <PinIcon size={16} className="mt-px shrink-0 text-pri" />
          {o.mode === "express" && o.address ? `Livraison : ${o.address}` : o.shop.address}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <a href={`https://wa.me/${(o.shop.whatsapp ?? "").replace(/\D/g, "")}`} className="tap flex h-11 items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-[#BFE6CD] bg-ok-soft text-[13px] font-semibold text-ok">
            <ChatIcon size={17} /> WhatsApp
          </a>
          <a href={`tel:${(o.shop.phone ?? "").replace(/\s/g, "")}`} className="tap flex h-11 items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-line text-[13px] font-semibold hover:border-line2">
            <PhoneIcon size={16} /> Appeler
          </a>
          <a href="#" className="tap flex h-11 items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-line text-[13px] font-semibold hover:border-line2">
            <RouteIcon size={16} /> Itinéraire
          </a>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {(o.status === "done" || o.status === "cancelled") && (
          <Link href={`/reservation/${o.lines[0].partId}`} className="tap flex h-12 flex-1 items-center justify-center rounded-xl bg-pri px-4 text-sm font-bold text-white hover:bg-pri-h">
            Commander à nouveau
          </Link>
        )}
        {o.status === "done" && <button className="tap h-12 flex-1 rounded-xl border-[1.5px] border-line bg-card px-4 text-sm font-semibold hover:border-line2">Facture &amp; garantie</button>}
        {o.status === "ready" && <a href="#" className="tap flex h-12 flex-1 items-center justify-center rounded-xl bg-pri px-4 text-sm font-bold text-white hover:bg-pri-h">Itinéraire vers le magasin</a>}
        {o.status === "preparing" && o.mode === "express" && <a href="#" className="tap flex h-12 flex-1 items-center justify-center rounded-xl bg-pri px-4 text-sm font-bold text-white hover:bg-pri-h">Suivre la livraison</a>}
        {canCancel && <button className="tap h-12 flex-1 rounded-xl border-[1.5px] border-line bg-card px-4 text-sm font-semibold text-sale hover:border-sale/40">Annuler la réservation</button>}
      </div>
    </div>
  );
}

function OrderRow({ o, on, onSelect }: { o: Order; on: boolean; onSelect: () => void }) {
  return (
    <button onClick={onSelect} aria-expanded={on} className={`flex w-full flex-col gap-3 rounded-2xl border-2 bg-card p-3.5 text-left transition-[border-color,box-shadow] duration-200 hover:shadow-card md:p-4 ${on ? "border-pri" : "border-line"}`}>
      <div className="flex w-full items-center gap-3">
        <span className="flex shrink-0 -space-x-3 max-sm:[&>*:nth-child(n+2)]:hidden">
          {o.lines.slice(0, 3).map((l) => (
            <span key={l.partId} className="bp flex size-12 items-center justify-center rounded-xl border-2 border-card sm:size-14">
              <PartIcon icon={l.icon} size={34} strokeWidth={1.7} />
            </span>
          ))}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-mono text-[12.5px] text-mut">{o.code}</span>
            <span className="text-[12.5px] text-mut">· {fmt.format(new Date(o.createdAt))}</span>
          </span>
          <span className="mt-0.5 block truncate text-[14.5px] font-semibold">
            {o.lines[0].name}
            {o.lines.length > 1 && <span className="font-medium text-mut"> + {plural(o.lines.length - 1, "article", "articles")}</span>}
          </span>
          <span className="mt-0.5 block truncate text-[12.5px] text-mut">
            {o.bike} · {o.shop.name} · {o.mode === "pickup" ? "Retrait" : "Livraison"}
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1.5">
          <Pill status={o.status} />
          <span className="disp text-[22px]">{dt(total(o))}</span>
        </span>
        <ChevronRight size={18} className={`hidden shrink-0 text-mut transition-transform duration-200 md:block ${on ? "translate-x-0.5 text-pri" : ""}`} />
      </div>
      <Progress o={o} />
    </button>
  );
}

export function OrdersView({ orders, newCode }: { orders: Order[]; newCode?: string }) {
  const [tab, setTab] = useState<Tab>("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(orders[0]?.code ?? null);

  const query = q.trim().toLowerCase();
  const list = orders.filter((o) => TABS.find((t) => t.id === tab)!.match(o) && (!query || `${o.code} ${o.lines.map((l) => l.name).join(" ")} ${o.shop.name}`.toLowerCase().includes(query)));
  const current = list.find((o) => o.code === selected) ?? list[0] ?? null;

  const year = new Date().getFullYear();
  const kpis = [
    { label: "En cours", value: orders.filter(TABS[1].match).length, sub: "en attente ou en préparation", icon: <BoxIcon size={20} />, cls: "bg-warn-soft text-[#8A4B00]" },
    { label: "Prêtes à récupérer", value: orders.filter(TABS[2].match).length, sub: "gardées 48 h en magasin", icon: <CheckIcon size={20} />, cls: "bg-ok-soft text-ok" },
    { label: "Commandes", value: orders.length, sub: `depuis le début de ${year}`, icon: <BagIcon size={20} />, cls: "bg-[#E9EFFE] text-[#1E40AF]" },
    { label: "Dépensé", value: dt(orders.filter((o) => o.status === "done").reduce((a, o) => a + total(o), 0)), sub: "commandes terminées", icon: <span className="disp text-base">DT</span>, cls: "bg-pri-soft text-pri-ink" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {newCode && (
        <div role="status" className="enter flex items-center gap-3 rounded-2xl border border-[#BFE6CD] bg-ok-soft p-3.5 text-[#14532D]">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ok text-white">
            <CheckIcon size={20} strokeWidth={3} />
          </span>
          <span className="text-sm leading-snug">
            Réservation <strong className="font-mono">{newCode}</strong> envoyée. Le magasin vous confirme sur WhatsApp, en général en moins de 15 minutes.
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3.5">
        {kpis.map((k) => (
          <div key={k.label} className="flex items-center gap-3 rounded-2xl border border-line bg-card p-3.5 md:p-4">
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${k.cls}`}>{k.icon}</span>
            <span className="min-w-0">
              <span className="disp block text-[26px] md:text-3xl">{k.value}</span>
              <span className="block text-[13px] font-semibold">{k.label}</span>
              <span className="hidden truncate text-xs text-mut sm:block">{k.sub}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div role="tablist" className="noscroll -mx-4 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:rounded-xl md:border md:border-line md:bg-sunk md:p-1 md:px-1">
          {TABS.map((t) => {
            const n = orders.filter(t.match).length;
            const on = tab === t.id;
            return (
              <button key={t.id} role="tab" aria-selected={on} onClick={() => setTab(t.id)} className={`flex h-10 shrink-0 items-center gap-1.5 rounded-[9px] px-3.5 text-sm font-bold whitespace-nowrap transition-[background-color,color,box-shadow] duration-200 max-md:border-[1.5px] ${on ? "bg-card text-ink shadow-[0_1px_3px_rgb(27_28_32/0.14)] max-md:border-ink" : "text-mut max-md:border-line max-md:bg-card"}`}>
                {t.label}
                <span className={`rounded-full px-1.5 text-[11.5px] ${on ? "bg-ink text-white" : "bg-line text-ink2"}`}>{n}</span>
              </button>
            );
          })}
        </div>
        <label className="flex h-11 items-center gap-2 rounded-xl border-[1.5px] border-line bg-card px-3 transition-[border-color,box-shadow] focus-within:border-pri focus-within:shadow-[0_0_0_3px_rgb(214_63_11/0.18)] md:w-80">
          <SearchIcon size={17} className="text-mut" />
          <span className="sr-only">Rechercher une commande</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="N° de commande, pièce, magasin…" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-mut" />
        </label>
      </div>

      {list.length === 0 ? (
        <div className="enter flex flex-col items-center gap-2.5 rounded-2xl border-[1.5px] border-dashed border-line2 bg-card px-6 py-12 text-center">
          <span className="flex size-[72px] items-center justify-center rounded-[20px] bg-pri-soft text-pri">
            <BagIcon size={32} strokeWidth={1.6} />
          </span>
          <div className="disp text-[24px]">Aucune commande ici</div>
          <p className="max-w-sm text-[13.5px] leading-normal text-mut">Vos réservations apparaîtront ici, avec le suivi, la facture et la garantie.</p>
          <Link href="/catalogue" className="tap mt-1.5 flex h-11 items-center rounded-xl bg-pri px-[18px] text-sm font-bold text-white hover:bg-pri-h">
            Parcourir le catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] xl:gap-6">
          <div key={tab} className="flex flex-col gap-2.5">
            {list.map((o, i) => (
              <div key={o.code} className="enter" style={{ animationDelay: `${i * 45}ms` }}>
                <OrderRow o={o} on={current?.code === o.code} onSelect={() => setSelected(current?.code === o.code && typeof window !== "undefined" && window.innerWidth < 1280 ? null : o.code)} />
                {current?.code === o.code && selected === o.code && (
                  <div className="enter mt-2 rounded-2xl border border-line bg-card p-4 xl:hidden">
                    <OrderDetail o={o} />
                  </div>
                )}
              </div>
            ))}
          </div>
          {current && (
            <aside key={current.code} aria-label="Détail de la commande" className="enter sticky top-4 hidden rounded-3xl border border-line bg-card p-6 shadow-card xl:block">
              <OrderDetail o={current} />
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
