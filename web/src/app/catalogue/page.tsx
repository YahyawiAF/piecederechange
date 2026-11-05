import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { categoryById, plural } from "@/lib/catalog";
import { fitsLabel, parseFilters, scopeTitle } from "@/lib/filters";
import { searchParts } from "@/lib/data";
import { WRAP } from "@/lib/ui";
import { CheckIcon } from "@/components/icons";
import { PartCard, PartRow } from "@/components/parts";
import { SponsoredCard } from "@/components/ads";
import { ActivePills, CategoryBar, FilterProvider, FilterSidebar, MobileFilterBar, PromoToggle, ResultsArea, SortControl } from "@/components/catalogue/filters";

export const metadata: Metadata = { title: "Catalogue" };

export default function CataloguePage({ searchParams }: PageProps<"/catalogue">) {
  return (
    <main className={`${WRAP} pt-4 md:pt-5`}>
      <Suspense fallback={<CatalogueSkeleton />}>
        <Catalogue searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Catalogue({ searchParams }: { searchParams: PageProps<"/catalogue">["searchParams"] }) {
  const f = parseFilters(await searchParams);
  const { results, makerCounts, condCounts, catCounts, promoCount } = await searchParts(f);
  const cat = categoryById(f.cat);
  const bikeScoped = !!(f.type || f.brands.length || f.models.length || f.cc);
  const shops = new Set(results.map((p) => p.shop.id)).size;
  // Ad spot: the first advertised part that matches the current filters, shown once, at the top.
  const sponsored = results.find((p) => p.ad);
  const list = sponsored ? results.filter((p) => p.id !== sponsored.id) : results;

  return (
    <FilterProvider filters={f} makerCounts={makerCounts} condCounts={condCounts} catCounts={catCounts} promoCount={promoCount} total={results.length}>
      <nav aria-label="Fil d'Ariane" className="hidden flex-wrap gap-1.5 text-[13px] text-mut md:flex">
        <Link href="/">Accueil</Link>
        <span>/</span>
        <span>{scopeTitle(f)}</span>
        <span>/</span>
        <span className="font-semibold text-ink">{cat?.name ?? "Toutes les pièces"}</span>
      </nav>
      <div className="mt-0 mb-3 flex flex-wrap items-end justify-between gap-3 md:mt-2.5 md:mb-5">
        <h1 className="disp text-[30px] md:text-[clamp(34px,4vw,52px)]">{f.q ? `« ${f.q} »` : (cat?.name ?? "Catalogue")}</h1>
        <span className="text-sm text-mut">
          <strong className="text-ink">{plural(results.length, "offre", "offres")}</strong> · {plural(shops, "magasin", "magasins")}
        </span>
      </div>

      <CategoryBar />
      <div className="flex items-start gap-6">
        <FilterSidebar />
        <section className="min-w-0 flex-1">
          <MobileFilterBar />
          <ActivePills />
          <div className="my-3 flex flex-wrap items-center justify-between gap-2.5 md:mt-0 md:mb-3.5">
            {bikeScoped ? (
              <div className="flex items-center gap-2 rounded-xl border border-[#BFE6CD] bg-ok-soft px-3 py-2 text-[13.5px] text-[#14532D]">
                <CheckIcon size={16} className="text-ok" />
                {f.models.length === 1 ? `Toutes compatibles ${scopeTitle(f)}` : `Compatibles : ${scopeTitle(f)}`}
              </div>
            ) : (
              <span className="text-[13.5px] text-mut">Choisissez votre moto pour ne voir que les pièces compatibles.</span>
            )}
            <div className="hidden items-center gap-3 md:flex">
              <PromoToggle />
              <SortControl />
            </div>
          </div>

          <ResultsArea>
            {results.length > 0 ? (
              <>
                <div className="flex flex-col gap-2 md:hidden">
                  {sponsored && <SponsoredCard part={sponsored} fitsLabel={fitsLabel(sponsored, f)} />}
                  {list.map((p, i) => (
                    <PartRow key={p.id} part={p} fitsLabel={fitsLabel(p, f)} delay={Math.min(i, 8) * 40} />
                  ))}
                </div>
                <div className="hidden gap-3.5 md:grid md:grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
                  {sponsored && <SponsoredCard part={sponsored} fitsLabel={fitsLabel(sponsored, f)} />}
                  {list.map((p, i) => (
                    <PartCard key={p.id} part={p} fitsLabel={fitsLabel(p, f)} delay={Math.min(i, 8) * 35} />
                  ))}
                </div>
              </>
            ) : (
              <div className="enter flex flex-col items-center gap-2 rounded-[18px] border-[1.5px] border-dashed border-line2 bg-card px-5 py-10 text-center">
                <div className="disp text-[26px]">Aucune offre avec ces filtres</div>
                <p className="max-w-sm text-sm text-mut">Élargissez les filtres, ou demandez un devis : les magasins peuvent commander la pièce pour vous.</p>
                <Link href="/catalogue" className="tap mt-1.5 flex h-11 items-center rounded-xl border-[1.5px] border-line px-4 text-sm font-semibold hover:border-line2">
                  Tout effacer
                </Link>
              </div>
            )}
          </ResultsArea>
        </section>
      </div>
    </FilterProvider>
  );
}

function CatalogueSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="mb-5 h-12 w-64 rounded-lg bg-sunk" />
      <div className="flex gap-6">
        <div className="hidden h-[600px] w-[290px] shrink-0 rounded-[18px] bg-sunk md:block" />
        <div className="grid flex-1 gap-3.5 md:grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-sunk md:h-[380px]" />
          ))}
        </div>
      </div>
    </div>
  );
}
