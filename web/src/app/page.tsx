import Link from "next/link";
import { BRANDS, TYPES } from "@/lib/moto";
import { CATEGORIES, PART_ICONS, dt, plural } from "@/lib/catalog";
import { getAllParts, getDeals, getShops } from "@/lib/data";
import { WRAP } from "@/lib/ui";
import { MotoIcon, PartIcon, ChevronRight, ScanIcon, StarIcon } from "@/components/icons";
import { PromoCarousel } from "@/components/home/promo-carousel";
import { MotoFinder } from "@/components/home/moto-finder";
import { BikeParts, MyBikeCard, type CompactPart } from "@/components/home/garage-widgets";
import { PartCard, PromoTag } from "@/components/parts";

function SectionTitle({ title, href, link = "Tout voir" }: { title: string; href?: string; link?: string }) {
  return (
    <div className="mb-2.5 flex items-baseline justify-between gap-3 md:mb-[18px]">
      <h2 className="disp text-2xl md:text-[40px]">{title}</h2>
      {href && (
        <Link href={href} className="shrink-0 text-[13px] font-semibold text-pri-ink md:text-sm">
          {link} →
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const [parts, deals, shops] = await Promise.all([getAllParts(), getDeals(), getShops()]);
  const compact: CompactPart[] = parts.filter((p) => !p.universal).map((p) => ({ id: p.id, name: p.name, maker: p.maker, ref: p.ref, cond: p.cond, price: p.price, oldPrice: p.oldPrice ?? null, tag: p.tag ?? null, icon: p.icon, shop: `${p.shop.name} · ${p.shop.km}`, fits: p.fits, fitBrands: p.fitBrands, fitTypes: p.fitTypes }));
  const gear = ["casques", "equipement", "accessoires"].flatMap((c) => parts.filter((p) => p.category === c).slice(0, 4));

  return (
    <main className="flex flex-col gap-7 pt-4 md:gap-14 md:pt-6">
      <section className={WRAP}>
        <SectionTitle title="Pièces par catégorie" href="/catalogue" link="Tout le catalogue" />
        <div className="grid grid-cols-4 gap-2 md:grid-cols-[repeat(auto-fit,minmax(112px,1fr))] md:gap-3">
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={`/catalogue?cat=${c.id}`} className="tap lift flex h-[86px] flex-col items-center justify-center gap-1.5 rounded-[14px] border border-line bg-card md:h-auto md:gap-2.5 md:rounded-[18px] md:px-3 md:pt-5 md:pb-4">
              <span className="flex size-[42px] items-center justify-center rounded-full bg-pri-soft md:size-16">
                <PartIcon icon={c.icon} color="var(--color-pri-ink)" strokeWidth={2.2} className="size-[26px] md:size-[38px]" />
              </span>
              <span className="text-xs font-semibold md:text-sm">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className={`${WRAP} flex flex-col gap-4 md:hidden`}>
        <MyBikeCard />
      </div>

      <section className={`${WRAP} grid gap-3 md:grid-cols-2 md:gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]`}>
        <PromoCarousel />
        <MotoFinder partFits={parts.map((p) => ({ fits: p.fits, fitBrands: p.fitBrands, fitTypes: p.fitTypes, universal: p.universal }))} />
      </section>


      {deals.length > 0 && (
        <section id="ventes-flash" className={`${WRAP} scroll-mt-4`}>
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3 md:mb-[18px]">
            <div className="flex items-center gap-2.5">
              <h2 className="disp text-2xl md:text-[40px]">Ventes flash</h2>
              <span className="flex gap-[3px] font-mono text-[13px] md:text-base" aria-label="Se termine dans 5 heures 42 minutes">
                {["05", "42", "10"].map((n, i) => (
                  <span key={i} className="flex items-center gap-[3px]">
                    {i > 0 && <span className="font-bold text-sale">:</span>}
                    <span className="rounded-md bg-sale px-[5px] py-[3px] text-white md:px-2 md:py-1.5">{n}</span>
                  </span>
                ))}
              </span>
            </div>
            <Link href="/catalogue" className="text-[13px] font-semibold text-pri-ink md:text-sm">
              Tout voir →
            </Link>
          </div>
          <div className="noscroll -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-4 md:gap-3.5 md:px-0 2xl:grid-cols-8">
            {deals.map((p) => (
              <Link key={p.id} href={`/pieces/${p.id}`} className="tap lift flex w-[152px] shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-card md:w-auto md:rounded-[18px]">
                <span className="bp relative flex h-[104px] items-center justify-center md:h-40">
                  <PartIcon icon={p.icon} className="size-[62px] md:size-24" />
                  <PromoTag part={p} className="absolute top-2 right-2" />
                </span>
                <span className="flex flex-1 flex-col gap-1 p-2.5 md:gap-1.5 md:p-3.5">
                  <span className="line-clamp-2 min-h-[33px] text-[12.5px] leading-snug font-semibold md:min-h-[38px] md:text-sm">{p.name}</span>
                  <span className="flex items-baseline gap-1.5">
                    <strong className="disp text-[22px] text-sale md:text-[28px]">{dt(p.price)}</strong>
                    <span className="text-xs text-mut line-through">{dt(p.oldPrice!)}</span>
                  </span>
                  <span className="h-1 overflow-hidden rounded-full bg-sunk">
                    <span className="block h-1 rounded-full bg-sale" style={{ width: `${Math.min(100, p.stock * 10)}%` }} />
                  </span>
                  <span className="text-[11.5px] text-mut">Plus que {p.stock}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className={WRAP}>
        <BikeParts parts={compact} />
      </div>

      <section className={WRAP}>
        <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-3 md:mb-[18px]">
          <h2 className="disp text-2xl md:text-[40px]">Casques &amp; équipement</h2>
          <div className="flex gap-4 text-[13px] font-semibold md:text-sm">
            <Link href="/catalogue?cat=casques" className="text-pri-ink">Casques →</Link>
            <Link href="/catalogue?cat=equipement" className="text-pri-ink">Équipement →</Link>
            <Link href="/catalogue?cat=accessoires" className="text-pri-ink">Accessoires →</Link>
          </div>
        </div>
        <div className="noscroll -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-4 md:gap-3.5 md:px-0 xl:grid-cols-6 [&>*]:w-[220px] [&>*]:shrink-0 md:[&>*]:w-auto">
          {gear.map((p, i) => (
            <PartCard key={p.id} part={p} fitsLabel="Universel · toutes motos" delay={i * 40} />
          ))}
        </div>
      </section>

      <section className={WRAP}>
        <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-2 md:mb-[18px]">
          <h2 className="disp text-2xl md:text-[40px]">Par type de moto</h2>
          <span className="hidden text-sm text-mut md:inline">Chaque type a sa couleur, partout sur le site</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] md:gap-3.5">
          {TYPES.map((t) => (
            <Link key={t.id} href={`/catalogue?type=${encodeURIComponent(t.id)}`} className="group flex h-[150px] flex-col justify-between overflow-hidden rounded-[20px] p-3.5 transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-card md:h-[196px] md:p-[18px]" style={{ background: t.soft }}>
              <span className="font-mono text-[11px] md:text-xs" style={{ color: t.ink }}>
                {t.cc}
              </span>
              <MotoIcon type={t.id} color={t.fg} strokeWidth={2.2} className="w-[96px] self-center transition-transform duration-300 group-hover:translate-x-1.5 md:w-[132px]" />
              <span>
                <span className="disp block text-2xl md:text-3xl">{t.label}</span>
                <span className="mt-0.5 block truncate text-xs text-ink2 md:text-[13px]">{t.examples}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className={WRAP}>
        <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-2 md:mb-[18px]">
          <h2 className="disp text-2xl md:text-[40px]">Par marque</h2>
          <span className="flex flex-wrap gap-x-3.5 gap-y-1.5 text-[12.5px] text-mut">
            {TYPES.map((t) => (
              <span key={t.id} className="flex items-center gap-1.5">
                <span className="size-[9px] rounded-full" style={{ background: t.fg }} />
                {t.label}
              </span>
            ))}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:gap-3">
          {BRANDS.map((b) => {
            const ts = TYPES.filter((t) => b.models.some((m) => m.type === t.id));
            return (
              <Link key={b.id} href={`/catalogue?brand=${b.id}`} className="lift flex flex-col items-center gap-1.5 rounded-[18px] border border-line bg-card px-2 pt-3.5 pb-3 text-center md:px-3.5 md:pt-4">
                <span className="disp flex size-10 items-center justify-center rounded-full bg-sunk text-lg md:size-12 md:text-xl">{b.ini}</span>
                <span className="text-[13px] font-bold md:text-[15px]">{b.short}</span>
                <span className="text-[11.5px] text-mut md:text-[12.5px]">{plural(b.models.length, "modèle", "modèles")}</span>
                <span className="flex gap-1" aria-label={`Types : ${ts.map((t) => t.label).join(", ")}`}>
                  {ts.map((t) => (
                    <span key={t.id} className="size-[9px] rounded-full" style={{ background: t.fg }} />
                  ))}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-label="Promotions partenaires" className={`${WRAP} grid gap-3 md:grid-cols-2 md:gap-3.5`}>
        {[
          { bg: "#0B7D73", tag: "PROMO MARQUE", title: "Huile 4T 10W-40 · -15 %", sub: "Sur les bidons de 4 L, cette semaine seulement", icon: PART_ICONS.oil, href: "/catalogue?cat=filtration" },
          { bg: "#7C3AED", tag: "PNEUS", title: "Montage & équilibrage offerts", sub: "Pour toute paire de pneus route ou trail", icon: PART_ICONS.tyre, href: "/catalogue?cat=pneus" },
        ].map((p) => (
          <Link key={p.tag} href={p.href} className="paint lift flex min-h-[112px] items-center gap-3.5 rounded-[20px] px-4 py-4 text-white md:min-h-[150px] md:gap-5 md:p-6" style={{ background: p.bg }}>
            <span className="flex h-20 w-[70px] shrink-0 items-center justify-center rounded-[14px] bg-white/15 md:h-[104px] md:w-24">
              <svg viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-12 md:size-[62px]">
                <path d={p.icon} />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="inline-block rounded bg-white/20 px-1.5 py-0.5 text-[10.5px] font-extrabold tracking-[1.2px]">{p.tag}</span>
              <span className="disp mt-1.5 block text-[25px] md:text-[34px]">{p.title}</span>
              <span className="mt-1 block text-[12.5px] opacity-95 md:text-sm">{p.sub}</span>
            </span>
            <ChevronRight className="shrink-0 md:hidden" />
          </Link>
        ))}
      </section>

      <section className={`${WRAP} md:hidden`}>
        <div className="paint flex items-center gap-3.5 rounded-[20px] bg-ink p-4 text-white">
          <span className="flex size-[52px] shrink-0 -skew-x-6 items-center justify-center rounded-[14px] bg-pri">
            <ScanIcon size={26} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="disp block text-[22px]">IA Mécano</span>
            <span className="mt-[3px] block text-[12.5px] leading-snug text-[#C8CAD0]">Photographiez la pièce usée, on trouve la référence et les vendeurs.</span>
          </span>
          <ChevronRight className="shrink-0" />
        </div>
      </section>

      <section className={WRAP}>
        <SectionTitle title="Magasins vérifiés" />
        <div className="grid gap-2 md:grid-cols-[repeat(auto-fill,minmax(270px,1fr))] md:gap-3.5">
          {shops.map((s) => (
            <div key={s.id} className="lift flex items-center gap-3 rounded-2xl border border-line bg-card p-3 md:flex-col md:items-stretch md:gap-3 md:rounded-[18px] md:p-[18px]">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="disp flex size-[46px] shrink-0 items-center justify-center rounded-xl bg-pri-soft text-[19px] text-pri-ink">{s.ini}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold md:text-[15px] md:font-bold">{s.name}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-xs text-mut md:text-[13px]">
                    <StarIcon size={13} className="text-[#F5A524]" />
                    {s.rating} ({s.reviews}) · {s.city}
                  </span>
                </span>
              </div>
              <span className="shrink-0 rounded-md bg-sunk px-2 py-1 text-[11px] font-semibold whitespace-nowrap text-ink2 md:self-start md:text-xs">{s.tag.split(" · ")[0]}</span>
              <span className="hidden text-[13px] font-bold text-ok md:block">Ouvert · {s.hours}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
