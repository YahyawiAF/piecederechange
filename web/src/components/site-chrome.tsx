import Link from "next/link";
import Form from "next/form";
import { getAllParts } from "@/lib/data";
import { MegaMenu } from "./mega-menu";
import { BellIcon, PinIcon, ScanIcon, SearchIcon } from "./icons";
import { MyBikeLink } from "./my-bike-link";

function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 text-ink" aria-label="PiècesExpress Moto — accueil">
      <span className="flex size-[34px] -skew-x-[8deg] items-center justify-center rounded-[9px] bg-pri md:size-[38px]">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3.2" />
          <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" />
        </svg>
      </span>
      <span className={`disp ${small ? "text-[25px]" : "text-[25px] md:text-[28px]"}`}>PiècesExpress</span>
      <span className="disp rounded bg-ink px-1.5 py-0.5 text-[13px] text-white md:text-sm">MOTO</span>
    </Link>
  );
}

function SearchBox() {
  return (
    <Form action="/catalogue" className="flex h-[50px] min-w-0 flex-1 overflow-hidden rounded-[14px] border-[1.5px] border-line bg-card transition-[border-color,box-shadow] focus-within:border-pri focus-within:shadow-[0_0_0_3px_rgb(214_63_11/0.18)] md:bg-page">
      <label htmlFor="q" className="sr-only">
        Rechercher une pièce
      </label>
      <input id="q" name="q" type="search" placeholder="Pièce, réf. OEM, marque, modèle…" className="min-w-0 flex-1 bg-transparent px-4 text-[15px] outline-none placeholder:text-mut" />
      <button type="submit" aria-label="Rechercher" className="tap flex w-14 items-center justify-center bg-pri text-white hover:bg-pri-h md:w-16">
        <SearchIcon />
      </button>
    </Form>
  );
}

export async function SiteHeader() {
  const counts = (await getAllParts()).reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
  return (
    <>
      <div className="hidden bg-ink text-[13px] font-medium text-white md:block">
        <div className="mx-auto flex max-w-[1920px] flex-wrap justify-between gap-x-5 gap-y-1 px-4 md:px-6 xl:px-10 py-2">
          <span>Livraison offerte dès 150 DT · Retrait en 1 h · Paiement à la réception</span>
          <Link href="/magasin" className="font-semibold text-[#FFB088] hover:text-white">
            Vous êtes un magasin ? Vendez ici →
          </Link>
        </div>
      </div>
      <header className="relative z-40 border-b border-line bg-card">
        <div className="mx-auto flex max-w-[1920px] flex-wrap items-center gap-x-7 gap-y-3 px-4 pt-3.5 pb-3 md:px-6 xl:px-10 md:pt-4">
          <div className="flex w-full items-center justify-between md:w-auto">
            <Logo />
            <div className="flex items-center md:hidden">
              <button className="tap flex h-11 items-center gap-1 px-1.5 text-[13px] font-semibold">
                <PinIcon size={16} className="text-pri" />
                Ariana
              </button>
              <button className="tap relative flex size-11 items-center justify-center" aria-label="Notifications">
                <BellIcon />
                <span className="absolute top-2.5 right-[11px] size-2 rounded-full bg-pri ring-2 ring-card" />
              </button>
            </div>
          </div>
          <div className="flex w-full gap-2 md:w-auto md:flex-[1_1_380px]">
            <SearchBox />
            <button className="tap flex size-[50px] shrink-0 items-center justify-center rounded-[14px] bg-pri text-white hover:bg-pri-h md:hidden" aria-label="Scanner une pièce avec IA Mécano">
              <ScanIcon />
            </button>
          </div>
          <nav aria-label="Compte" className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <MyBikeLink />
            <Link href="/commandes" className="text-ink2 transition-colors hover:text-pri-ink">
              Commandes
            </Link>
            <Link href="/magasin" className="tap flex h-10 items-center rounded-xl border-[1.5px] border-line px-4 hover:border-line2">
              Espace magasin
            </Link>
          </nav>
        </div>
        <nav aria-label="Navigation du catalogue" className="relative z-40 mx-auto hidden max-w-[1920px] items-center gap-6 px-6 pb-3 text-sm font-semibold md:flex xl:px-10">
          <MegaMenu counts={counts} />
          <Link href="/#ventes-flash" className="flex items-center gap-1.5 text-ink2 transition-colors hover:text-pri-ink">
            <span className="size-2 rounded-full bg-sale" />
            Ventes flash
          </Link>
          <Link href="/garage" className="text-ink2 transition-colors hover:text-pri-ink">
            Choisir ma moto
          </Link>
          <Link href="/commandes" className="text-ink2 transition-colors hover:text-pri-ink">
            Suivre une commande
          </Link>
          <span className="ml-auto hidden text-[13px] font-medium text-mut lg:inline">Pièces neuves, d&apos;origine et d&apos;occasion · magasins vérifiés en Tunisie</span>
        </nav>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 hidden bg-ink text-[#C8CAD0] md:block">
      <div className="mx-auto grid max-w-[1920px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-7 px-4 md:px-6 xl:px-10 py-11 text-sm">
        <div className="flex flex-col gap-2.5">
          <span className="disp text-[26px] text-white">
            PiècesExpress <span className="text-[#FF8A55]">Moto</span>
          </span>
          <span className="leading-normal">Pièces de rechange moto, du 50 cm³ à la grosse cylindrée, partout en Tunisie.</span>
        </div>
        {[
          ["Acheter", [["Catalogue", "/catalogue"], ["Choisir ma moto", "/garage"], ["Mes commandes", "/commandes"]]],
          ["Magasins", [["Espace magasin", "/magasin"], ["Devenir vendeur", "/magasin"]]],
          ["Aide", [["Retours & garantie", "/"], ["Nous contacter", "/"]]],
        ].map(([title, links]) => (
          <div key={title as string} className="flex flex-col gap-2.5">
            <span className="font-bold text-white">{title as string}</span>
            {(links as string[][]).map(([label, href]) => (
              <Link key={label} href={href} className="transition-colors hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}
