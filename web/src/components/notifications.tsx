"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { AppNotification, NotificationKind } from "@/lib/types";
import { BellIcon, BoxIcon, CheckIcon, ChevronLeft, CloseIcon, StarIcon, TagIcon } from "./icons";

// Read/unread state, shared by every bell on the page and kept in the browser.
const KEY = "pe-notif-read-v1";
const DEFAULT_READ = ["n3", "n6"];
let read: string[] | null = null;
const listeners = new Set<() => void>();
const load = () => {
  if (read) return read;
  try {
    read = JSON.parse(localStorage.getItem(KEY) ?? "null") ?? DEFAULT_READ;
  } catch {
    read = DEFAULT_READ;
  }
  return read!;
};
const store = {
  subscribe: (fn: () => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  get: () => load(),
  server: () => DEFAULT_READ,
  set: (ids: string[]) => {
    read = ids;
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
    listeners.forEach((fn) => fn());
  },
};

const KIND: Record<NotificationKind, { label: string; cls: string; Icon: typeof BellIcon }> = {
  order: { label: "Commande", cls: "bg-[#E9EFFE] text-[#1E40AF]", Icon: BoxIcon },
  promo: { label: "Offre", cls: "bg-[#FDE9EE] text-sale", Icon: TagIcon },
  stock: { label: "Stock", cls: "bg-ok-soft text-ok", Icon: CheckIcon },
  loyalty: { label: "Fidélité", cls: "bg-[#FBF1D6] text-[#8A6514]", Icon: StarIcon },
};

type Tab = "all" | "order" | "offers" | "loyalty";
const TABS: { id: Tab; label: string; match: (n: AppNotification) => boolean }[] = [
  { id: "all", label: "Toutes", match: () => true },
  { id: "order", label: "Commandes", match: (n) => n.kind === "order" },
  { id: "offers", label: "Offres", match: (n) => n.kind === "promo" || n.kind === "stock" },
  { id: "loyalty", label: "Fidélité", match: (n) => n.kind === "loyalty" },
];

const when = new Intl.DateTimeFormat("fr-FR", { timeZone: "Africa/Tunis", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export function NotificationBell({ items }: { items: AppNotification[] }) {
  const readIds = useSyncExternalStore(store.subscribe, store.get, store.server);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("all");
  const root = useRef<HTMLDivElement>(null);
  const unread = items.filter((n) => !readIds.includes(n.id)).length;
  const list = items.filter(TABS.find((t) => t.id === tab)!.match);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    const phone = window.matchMedia("(max-width: 767px)").matches;
    if (phone) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      document.body.style.overflow = "";
    };
  }, [open]);

  const markRead = (id: string) => !readIds.includes(id) && store.set([...readIds, id]);

  return (
    <div ref={root} className="relative">
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label={unread ? `Notifications, ${unread} non lues` : "Notifications"} className="tap relative flex size-11 items-center justify-center rounded-full hover:bg-sunk">
        <BellIcon />
        {unread > 0 && <span className="pop absolute top-1.5 right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-sale px-1 text-[10.5px] font-bold text-white ring-2 ring-card">{unread}</span>}
      </button>

      <section
        role="dialog"
        aria-label="Notifications"
        inert={!open}
        className={`fixed inset-0 z-50 flex flex-col bg-page transition-[transform,opacity] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] md:absolute md:inset-auto md:top-full md:right-0 md:mt-2 md:max-h-[min(600px,calc(100dvh-120px))] md:w-[420px] md:rounded-3xl md:border md:border-line md:bg-card md:shadow-[0_30px_60px_-20px_rgb(27_28_32/0.35)] ${open ? "translate-x-0 opacity-100 md:translate-y-0" : "pointer-events-none max-md:translate-x-full md:-translate-y-2 md:opacity-0"}`}
      >
        <header className="flex items-center gap-2 border-b border-line bg-card px-2 py-2 md:rounded-t-3xl md:px-4 md:pt-4">
          <button onClick={() => setOpen(false)} aria-label="Fermer" className="flex size-11 items-center justify-center md:hidden">
            <ChevronLeft />
          </button>
          <h2 className="disp flex-1 text-[24px]">Notifications</h2>
          <button onClick={() => store.set(items.map((n) => n.id))} disabled={!unread} className="h-9 px-2 text-[13px] font-semibold text-pri-ink disabled:text-mut">
            <span className="md:hidden">Tout lire</span>
            <span className="hidden md:inline">Tout marquer comme lu</span>
          </button>
          <button onClick={() => setOpen(false)} aria-label="Fermer" className="hidden size-9 items-center justify-center rounded-full hover:bg-sunk md:flex">
            <CloseIcon size={18} />
          </button>
        </header>
        <div role="tablist" className="grid grid-cols-4 gap-1 border-b border-line bg-card px-3 py-2.5 md:flex md:gap-1.5 md:px-4">
          {TABS.map((t) => {
            const on = tab === t.id;
            const n = items.filter((x) => t.match(x) && !readIds.includes(x.id)).length;
            return (
              <button key={t.id} role="tab" aria-selected={on} onClick={() => setTab(t.id)} className={`flex h-8 min-w-0 items-center justify-center gap-1 rounded-full px-1.5 text-[12px] font-bold transition-colors md:px-3 md:text-[12.5px] ${on ? "bg-ink text-white" : "bg-sunk text-ink2 hover:bg-line"}`}>
                {t.label}
                {n > 0 && <span className={`rounded-full px-1.5 text-[10.5px] ${on ? "bg-white/20" : "bg-sale text-white"}`}>{n}</span>}
              </button>
            );
          })}
        </div>
        <ul key={tab} className="noscroll flex-1 overflow-y-auto p-2 md:p-2.5">
          {list.map((n, i) => {
            const k = KIND[n.kind];
            const isUnread = !readIds.includes(n.id);
            return (
              <li key={n.id} className="enter" style={{ animationDelay: `${i * 35}ms` }}>
                <Link href={n.href} onClick={() => { markRead(n.id); setOpen(false); }} className={`flex gap-3 rounded-2xl p-3 transition-colors hover:bg-page ${isUnread ? "bg-pri-soft/50" : ""}`}>
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${k.cls}`}>
                    <k.Icon size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span className={`text-[14px] leading-snug ${isUnread ? "font-bold" : "font-semibold text-ink2"}`}>{n.title}</span>
                      {isUnread && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-pri" aria-label="Non lue" />}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-mut">{n.body}</span>
                    <span className="mt-1 block text-[11.5px] font-semibold text-mut">
                      {k.label} · {when.format(new Date(n.at))}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
          {!list.length && <li className="px-4 py-12 text-center text-sm text-mut">Rien de nouveau ici.</li>}
        </ul>
        <footer className="border-t border-line bg-card px-4 py-3 md:rounded-b-3xl">
          <Link href="/compte#notifications" onClick={() => setOpen(false)} className="text-[13px] font-semibold text-pri-ink">
            Gérer mes notifications →
          </Link>
        </footer>
      </section>
    </div>
  );
}
