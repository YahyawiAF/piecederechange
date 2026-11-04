import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { categoryById, dt } from "@/lib/catalog";
import { getAllParts, getPart } from "@/lib/data";
import { fitsModel, fittingModels } from "@/lib/compat";
import { WRAP } from "@/lib/ui";
import { ChatIcon, ChevronLeft, PartIcon, PhoneIcon, PlusIcon, RouteIcon } from "@/components/icons";
import { CondBadge, PromoTag, StockLabel } from "@/components/parts";
import { CompatBanner, FavButton, ProductTabs } from "@/components/product/product-client";
import { CompatOverview } from "@/components/compat";

export default function PartPage({ params }: PageProps<"/pieces/[id]">) {
  return (
    <main className="md:pt-6">
      <Suspense fallback={<div className={`${WRAP} h-[600px] animate-pulse rounded-2xl bg-sunk`} />}>
        <Part params={params} />
      </Suspense>
    </main>
  );
}

async function Part({ params }: { params: PageProps<"/pieces/[id]">["params"] }) {
  const { id } = await params;
  const part = await getPart(id);
  if (!part) notFound();
  const all = await getAllParts();
  const together = part.universal
    ? all.filter((p) => p.universal && p.id !== part.id && p.category !== part.category).slice(0, 3)
    : all.filter((p) => p.id !== part.id && p.category !== part.category && !p.universal && fittingModels(part).some((m) => fitsModel(p, m))).slice(0, 3);
  const cat = categoryById(part.category);
  const fit = { fits: part.fits, fitBrands: part.fitBrands, fitTypes: part.fitTypes, universal: part.universal };
  const specs = part.specs.length
    ? part.specs
    : [
        ...(part.position ? [{ label: "Position", value: part.position }] : []),
        { label: "Marque", value: part.maker },
        { label: "Référence", value: part.ref },
        { label: "État", value: { original: "Origine constructeur", oem: "Équipementier d'origine", aftermarket: "Neuf · adaptable", used: "Occasion contrôlée" }[part.cond] },
        { label: "Garantie", value: part.cond === "used" ? "3 mois" : "1 an" },
      ];

  return (
    <>
      <div className={`${WRAP} max-md:px-0 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-8`}>
        <div className="bp relative flex h-[300px] items-center justify-center md:h-[480px] md:rounded-3xl">
          <PartIcon icon={part.icon} size={200} strokeWidth={0.9} className="md:size-[300px]" />
          <span aria-hidden="true" className="absolute top-[72px] left-4 font-mono text-[10.5px] text-[#8A9099]">
            {part.ref}
          </span>
          <div className="absolute inset-x-3 top-3 flex justify-between">
            <Link href="/catalogue" aria-label="Retour au catalogue" className="tap flex size-11 items-center justify-center rounded-full border border-line bg-white/90 shadow-[0_2px_8px_rgb(27_28_32/0.08)] md:invisible">
              <ChevronLeft />
            </Link>
            <FavButton />
          </div>
          <CondBadge cond={part.cond} className="absolute bottom-3.5 left-4" />
          <PromoTag part={part} className="absolute right-4 bottom-3.5 !text-lg" />
        </div>

        <section className="flex flex-col gap-2.5 px-4 pt-[18px] pb-4 md:px-0 md:pt-2">
          <nav aria-label="Fil d'Ariane" className="hidden gap-1.5 text-[13px] text-mut md:flex">
            <Link href="/">Accueil</Link>/<Link href={`/catalogue?cat=${part.category}`}>{cat?.name}</Link>
          </nav>
          <div className="disp text-base tracking-[1px] text-pri-ink">
            {part.maker} · {cat?.name}
          </div>
          <h1 className="text-[21px] leading-tight font-bold md:text-[30px]">{part.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-mut">Réf.</span>
            <span className="rounded-md border border-line bg-card px-2 py-[3px] font-mono text-[13px]">{part.ref}</span>
            {part.oem && (
              <>
                <span className="text-xs text-mut">équiv. OEM</span>
                <span className="font-mono text-[13px] text-ink2">{part.oem}</span>
              </>
            )}
          </div>
          <div className="mt-1 flex items-end justify-between">
            <div>
              <div className="disp flex items-baseline gap-2 text-[44px] leading-[.9]">
                <span className={part.oldPrice ? "text-sale" : ""}>{part.price.toLocaleString("fr-FR")}</span>
                <span className="text-[22px]">DT</span>
                {part.oldPrice ? <span className="font-sans text-base font-medium text-mut not-italic line-through">{dt(part.oldPrice)}</span> : null}
              </div>
              <div className="mt-1 text-xs text-mut">TTC · {part.shop.name}</div>
            </div>
            <div className="text-right">
              <StockLabel stock={part.stock} />
              <div className="mt-0.5 text-xs text-mut">{part.shop.delivery}</div>
            </div>
          </div>
          {part.description && <p className="text-sm leading-relaxed text-ink2">{part.description}</p>}
          <CompatOverview fit={fit} category={part.category} />
          <div>
            <CompatBanner fit={fit} />
          </div>
          <div className="mt-2 hidden gap-2.5 md:flex">
            <a href={part.shop.whatsapp ? `https://wa.me/${part.shop.whatsapp.replace(/\D/g, "")}` : "#"} aria-label="Contacter le magasin sur WhatsApp" className="tap flex size-14 shrink-0 items-center justify-center rounded-[14px] border-[1.5px] border-[#BFE6CD] bg-ok-soft text-ok">
              <ChatIcon size={24} />
            </a>
            <Link href={`/reservation/${part.id}`} className="tap flex h-14 flex-1 items-center justify-between rounded-[14px] bg-pri px-[18px] text-base font-bold text-white hover:bg-pri-h">
              <span>Réserver</span>
              <span className="disp text-2xl">{dt(part.price)}</span>
            </Link>
          </div>
          <div className="mt-2 hidden grid-cols-2 gap-2 md:grid">
            <a href={part.shop.phone ? `tel:${part.shop.phone.replace(/\s/g, "")}` : "#"} className="tap flex h-11 items-center justify-center gap-2 rounded-xl border-[1.5px] border-line bg-card text-sm font-semibold hover:border-line2">
              <PhoneIcon size={18} /> Appeler
            </a>
            <a href="#" className="tap flex h-11 items-center justify-center gap-2 rounded-xl border-[1.5px] border-line bg-card text-sm font-semibold hover:border-line2">
              <RouteIcon size={18} /> Itinéraire
            </a>
          </div>
        </section>
      </div>

      <div className={`${WRAP} max-md:px-0 md:mt-8 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-8`}>
        <ProductTabs specs={specs} fit={fit} shop={{ name: part.shop.name, ini: part.shop.ini, rating: part.shop.rating, km: part.shop.km, delivery: part.shop.delivery, address: part.shop.address }} />
        {together.length > 0 && (
          <section className="pt-5 md:pt-0">
            <h2 className="disp mb-2.5 px-4 text-xl md:px-0 md:text-[28px]">Souvent achetés ensemble</h2>
            <div className="noscroll flex gap-2.5 overflow-x-auto px-4 md:flex-col md:px-0">
              {together.map((x) => (
                <Link key={x.id} href={`/pieces/${x.id}`} className="tap lift flex w-[230px] shrink-0 items-center gap-2.5 rounded-[14px] border border-line bg-card p-2 md:w-auto">
                  <span className="bp flex size-14 shrink-0 items-center justify-center rounded-[10px]">
                    <PartIcon icon={x.icon} size={34} strokeWidth={1.7} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] leading-snug font-semibold">{x.name}</span>
                    <span className="disp mt-0.5 block text-lg">{dt(x.price)}</span>
                  </span>
                  <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pri-soft text-pri-ink">
                    <PlusIcon size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-[84px] z-20 flex gap-2.5 border-t border-line bg-card px-4 py-3 md:hidden">
        <a href={part.shop.whatsapp ? `https://wa.me/${part.shop.whatsapp.replace(/\D/g, "")}` : "#"} aria-label="Contacter le magasin sur WhatsApp" className="tap flex size-14 shrink-0 items-center justify-center rounded-[14px] border-[1.5px] border-[#BFE6CD] bg-ok-soft text-ok">
          <ChatIcon size={24} />
        </a>
        <Link href={`/reservation/${part.id}`} className="tap flex h-14 flex-1 items-center justify-between rounded-[14px] bg-pri px-[18px] text-base font-bold text-white">
          <span>Réserver</span>
          <span className="disp text-2xl">{dt(part.price)}</span>
        </Link>
      </div>
      <div className="h-20 md:hidden" />
    </>
  );
}
