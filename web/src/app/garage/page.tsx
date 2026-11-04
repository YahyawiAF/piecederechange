import type { Metadata } from "next";
import { WRAP } from "@/lib/ui";
import { GaragePicker } from "@/components/garage-picker";

export const metadata: Metadata = { title: "Choisir ma moto" };

export default function GaragePage() {
  return (
    <main className={`${WRAP} pt-4 md:pt-8`}>
      <div className="mx-auto mb-4 max-w-3xl">
        <h1 className="disp text-[30px] md:text-5xl">Choisir ma moto</h1>
        <p className="mt-1 text-sm text-mut">Type, marque, modèle, année : on n&apos;affichera que les pièces compatibles.</p>
      </div>
      <GaragePicker />
    </main>
  );
}
