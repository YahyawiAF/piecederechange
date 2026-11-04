import Link from "next/link";
import { WRAP } from "@/lib/ui";

export default function NotFound() {
  return (
    <main className={`${WRAP} flex flex-col items-center gap-3 py-20 text-center`}>
      <h1 className="disp text-5xl">Pièce introuvable</h1>
      <p className="max-w-md text-mut">Cette page n&apos;existe pas ou la pièce n&apos;est plus en vente.</p>
      <Link href="/catalogue" className="tap mt-2 flex h-12 items-center rounded-xl bg-pri px-5 font-bold text-white hover:bg-pri-h">
        Parcourir le catalogue
      </Link>
    </main>
  );
}
