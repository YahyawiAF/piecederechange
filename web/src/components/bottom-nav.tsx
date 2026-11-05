"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BagIcon, GridIcon, HomeIcon, ScanIcon, UserIcon } from "./icons";

const ITEMS = [
  { href: "/", label: "Accueil", Icon: HomeIcon, match: (p: string) => p === "/" },
  { href: "/catalogue", label: "Catalogue", Icon: GridIcon, match: (p: string) => p.startsWith("/catalogue") || p.startsWith("/pieces") },
  null,
  { href: "/commandes", label: "Commandes", Icon: BagIcon, match: (p: string) => p.startsWith("/commandes") || p.startsWith("/reservation") },
  { href: "/compte", label: "Profil", Icon: UserIcon, match: (p: string) => p.startsWith("/compte") || p.startsWith("/garage") },
];

export function BottomNavView({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label="Navigation principale" className="fixed inset-x-0 bottom-0 z-30 flex h-[84px] items-start justify-around border-t border-line bg-card px-1.5 pt-2 md:hidden">
      {ITEMS.map((item) => {
        if (!item) {
          return (
            <button key="scan" aria-label="Scanner une pièce" className="tap -mt-6 flex size-[58px] -skew-x-6 items-center justify-center rounded-[18px] border-4 border-page bg-pri text-white shadow-[0_6px_16px_rgb(214_63_11/0.35)]">
              <ScanIcon size={24} />
            </button>
          );
        }
        const on = pathname ? item.match(pathname) : false;
        return (
          <Link key={item.href} href={item.href} aria-current={on ? "page" : undefined} className={`flex h-12 w-16 flex-col items-center justify-center gap-[3px] text-[11px] transition-colors ${on ? "font-bold text-pri-ink" : "font-semibold text-mut"}`}>
            <item.Icon size={23} strokeWidth={on ? 2.1 : 1.9} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  return <BottomNavView pathname={usePathname()} />;
}
