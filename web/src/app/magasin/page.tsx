import type { Metadata } from "next";
import { WRAP } from "@/lib/ui";
import { dataSource } from "@/lib/data";
import { SellerDashboard } from "./seller-dashboard";

export const metadata: Metadata = { title: "Espace magasin" };

export default function SellerPage() {
  return (
    <main className={`${WRAP} pt-4 md:pt-8`}>
      <div className="mb-5 flex items-center gap-3">
        <span className="disp flex size-[52px] items-center justify-center rounded-xl bg-pri text-[22px] text-white">MP</span>
        <div>
          <h1 className="disp text-[24px] md:text-4xl">Moto Pièces Express</h1>
          <p className="mt-0.5 text-[12.5px] text-mut">
            Vendeur certifié · ★ 4,9 (88) · Ariana · données {dataSource() === "erp" ? "SupplyChain Pro" : "de démonstration"}
          </p>
        </div>
      </div>
      <SellerDashboard />
    </main>
  );
}
