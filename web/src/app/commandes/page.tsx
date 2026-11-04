import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getOrders } from "@/lib/data";
import { WRAP } from "@/lib/ui";
import { ChatIcon } from "@/components/icons";
import { OrdersView } from "@/components/orders-view";

export const metadata: Metadata = { title: "Mes commandes" };

export default function OrdersPage({ searchParams }: PageProps<"/commandes">) {
  return (
    <main className={`${WRAP} pt-4 md:pt-8`}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="disp text-[30px] md:text-5xl">Mes commandes</h1>
          <p className="mt-1 text-sm text-mut">Suivez vos réservations, retraits et livraisons, et retrouvez vos factures.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/catalogue" className="tap hidden h-11 items-center rounded-xl border-[1.5px] border-line bg-card px-4 text-sm font-semibold hover:border-line2 md:flex">
            Continuer mes achats
          </Link>
          <a href="#" className="tap flex h-11 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-white">
            <ChatIcon size={17} /> Besoin d&apos;aide ?
          </a>
        </div>
      </div>
      <Suspense fallback={<div className="h-[600px] animate-pulse rounded-2xl bg-sunk" />}>
        <Orders searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Orders({ searchParams }: { searchParams: PageProps<"/commandes">["searchParams"] }) {
  const sp = await searchParams;
  const newCode = typeof sp.nouvelle === "string" ? sp.nouvelle.slice(0, 40) : undefined;
  const orders = await getOrders();
  return <OrdersView orders={orders} newCode={newCode} />;
}
