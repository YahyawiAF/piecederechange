import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCustomer, getPart } from "@/lib/data";
import { tierFor } from "@/lib/loyalty";
import { WRAP } from "@/lib/ui";
import { ChevronLeft } from "@/components/icons";
import { ReserveForm } from "@/components/reserve-form";

export const metadata: Metadata = { title: "Réservation" };

export default function ReservationPage({ params }: PageProps<"/reservation/[id]">) {
  return (
    <main className={`${WRAP} pt-3 md:pt-8`}>
      <Suspense fallback={<div className="mx-auto h-[600px] max-w-2xl animate-pulse rounded-2xl bg-sunk" />}>
        <Reservation params={params} />
      </Suspense>
    </main>
  );
}

async function Reservation({ params }: { params: PageProps<"/reservation/[id]">["params"] }) {
  const { id } = await params;
  const part = await getPart(id);
  if (!part) notFound();
  return (
    <>
      <div className="mx-auto mb-4 flex max-w-2xl items-center gap-1">
        <Link href={`/pieces/${part.id}`} aria-label="Retour à la pièce" className="tap -ml-2.5 flex size-11 items-center justify-center rounded-full">
          <ChevronLeft />
        </Link>
        <h1 className="disp text-[26px] md:text-4xl">Réservation</h1>
      </div>
      <ReserveForm pointsPerDt={tierFor((await getCustomer()).earned12m).multiplier} partId={part.id} name={part.name} price={part.price} icon={part.icon} shopName={part.shop.name} shopAddress={part.shop.address} stock={part.stock} />
    </>
  );
}
