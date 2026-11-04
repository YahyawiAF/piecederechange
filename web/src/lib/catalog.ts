import { circle as C } from "./moto";
import type { CategoryId, Condition, PartIconId } from "./types";

/** Part drawings, viewBox 0 0 48 48, stroked. */
export const PART_ICONS: Record<PartIconId, string> = {
  disc: C(24, 24, 17) + C(24, 24, 6) + C(24, 12.5, 1.6) + C(35.5, 24, 1.6) + C(24, 35.5, 1.6) + C(12.5, 24, 1.6) + "M15.5 15.5l2 2M32.5 32.5l-2-2M32.5 15.5l-2 2M15.5 32.5l2-2",
  pads: "M8 14h32v8a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4zM8 30h32v8H8zM12 18h24M14 34h20" + C(14, 10, 2) + C(34, 10, 2),
  piston: "M14 9h20v18H14zM14 13.5h20M14 17.5h20" + C(24, 22.5, 2) + "M20 27l2.5 9h3l2.5-9" + C(24, 39, 3),
  plug: "M21 4h6v5h-6zM18.5 9h11v13h-11zM21 13h6M21 17h6M16 22h16v5H16zM20 27h8v7h-8zM24 34v5h4",
  chain: C(14, 24, 8) + C(14, 24, 3) + C(36, 24, 6) + C(36, 24, 2) + "M14 16L36 18M14 32L36 30M20 15.4v1.6M26 16v1.6M32 16.6v1.6M20 31v1.6M26 30.4v1.6M32 29.8v1.6",
  belt: C(15, 24, 9) + C(15, 24, 3) + C(35, 24, 6) + C(35, 24, 2) + "M15 15L35 18M15 33L35 30",
  rollers: C(14, 16, 6) + C(34, 16, 6) + C(14, 34, 6) + C(34, 34, 6) + C(14, 16, 2) + C(34, 16, 2) + C(14, 34, 2) + C(34, 34, 2),
  filter: "M12 13a12 4 0 1 0 24 0a12 4 0 1 0-24 0M12 13v22a12 4 0 0 0 24 0V13M18 20v13M24 20v14M30 20v13",
  shock: C(24, 6, 2.5) + "M24 8.5V12M18 12h12M17 15l14 3.5-14 3.5 14 3.5-14 3.5 14 3.5M18 33h12M24 33v6.5" + C(24, 42, 2.5),
  tyre: C(24, 24, 18) + C(24, 24, 10) + C(24, 24, 3) + "M24 6v4M24 38v4M6 24h4M38 24h4M11.3 11.3l2.8 2.8M33.9 33.9l2.8 2.8M36.7 11.3l-2.8 2.8M14.1 33.9l-2.8 2.8",
  fairing: "M10 37C12 23 22 13 36 10l4 6c-10 4-16 12-18 21zM36 10l2-4M16 30h8",
  lever: "M6 30l28-10a3 3 0 0 1 2 5.6L8 36zM34 20v-6h6v8" + C(37, 14, 1.5),
  battery: "M8 16h32v22H8zM13 12h6v4h-6zM29 12h6v4h-6zM13 27h7M28 27h7M31.5 23.5v7",
  caliper: "M10 14h22a8 8 0 0 1 8 8v4a8 8 0 0 1-8 8H10zM10 20h20M10 28h20" + C(34, 24, 2) + "M16 14v-4M26 14v-4",
  oil: "M14 16h16l4 6v18H14zM18 16v-5h8v5M18 28h12M18 33h8",
  helmet: "M8 33C8 21 15 12 25 12s16 8 16 19v5a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2zM24 22h16.5M24 22c0 4 1 8 3 9h14M12 38v3h7v-3",
  glove: "M15 41V25l-4.5-6.5a2.5 2.5 0 0 1 4-3L19 20V10a2 2 0 0 1 4 0v9V8a2 2 0 0 1 4 0v11V10a2 2 0 0 1 4 0v11-5a2 2 0 0 1 4 0v12c0 7-4 12-11 13h-5zM15 35h14",
  lock: "M15 23v-9a9 9 0 0 1 18 0v9M11 23h26v18H11zM24 30v5",
  topcase: "M9 19l3-7h24l3 7M8 19h32v6a14 14 0 0 1-2 7l-2 6H12l-2-6a14 14 0 0 1-2-7zM20 27h8",
  phone: "M17 5h14a2 2 0 0 1 2 2v23a2 2 0 0 1-2 2H17a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM22 28h4M12 12v14M36 12v14M24 32v7M17 42h14",
};

export type CategoryInfo = {
  id: CategoryId;
  name: string;
  icon: PartIconId;
  /** Short description for the mega menu. */
  blurb: string;
  /** Sub-categories, each opens a catalogue search inside the category. */
  subs: { label: string; q: string }[];
  /** Optional photo (e.g. from the ERP). The studio drawing is used when empty. */
  image?: string;
};

const sub = (label: string, q = label) => ({ label, q });

export const CATEGORIES: CategoryInfo[] = [
  { id: "freinage", name: "Freinage", icon: "disc", blurb: "Plaquettes, disques, étriers", subs: [sub("Plaquettes"), sub("Disques", "Disque"), sub("Étriers", "Étrier"), sub("Leviers")] },
  { id: "moteur", name: "Moteur", icon: "piston", blurb: "Transmission et haut moteur", subs: [sub("Courroies", "Courroie"), sub("Galets"), sub("Kits cylindre", "cylindre")] },
  { id: "chaine", name: "Kit chaîne", icon: "chain", blurb: "Chaînes, pignons, couronnes", subs: [sub("DID"), sub("Regina"), sub("Renforcés", "renforcé")] },
  { id: "filtration", name: "Filtration", icon: "filter", blurb: "Vidange et entretien", subs: [sub("Filtres à huile", "Filtre à huile"), sub("Filtres à air", "Filtre à air"), sub("Huile moteur", "Huile")] },
  { id: "suspension", name: "Suspension", icon: "shock", blurb: "Amortisseurs et fourches", subs: [sub("Amortisseurs", "Amortisseur")] },
  { id: "allumage", name: "Allumage", icon: "plug", blurb: "Bougies et batteries", subs: [sub("Bougies", "Bougie"), sub("Batteries", "Batterie")] },
  { id: "pneus", name: "Pneus", icon: "tyre", blurb: "Route, sport, scooter", subs: [sub("Avant", "Pneu avant"), sub("Arrière", "Pneu arrière")] },
  { id: "carenage", name: "Carénage", icon: "fairing", blurb: "Bulles et habillage", subs: [sub("Bulles", "Bulle")] },
  { id: "casques", name: "Casques", icon: "helmet", blurb: "Homologués ECE 22.06", subs: [sub("Intégral"), sub("Modulable"), sub("Jet"), sub("Cross")] },
  { id: "equipement", name: "Équipement", icon: "glove", blurb: "Gants, blousons, bottes", subs: [sub("Gants"), sub("Blousons", "Blouson"), sub("Bottes")] },
  { id: "accessoires", name: "Accessoires", icon: "topcase", blurb: "Sécurité, bagagerie, high-tech", subs: [sub("Antivols", "Antivol"), sub("Top cases", "Top case"), sub("Supports téléphone", "Support"), sub("Intercoms", "Intercom")] },
];

/** Discount in % when a part has an old price. */
export const discountOf = (p: { price: number; oldPrice?: number | null }) => (p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);

export const categoryById = (id?: string) => CATEGORIES.find((c) => c.id === id);

export const CONDITIONS: Record<Condition, { label: string; className: string }> = {
  original: { label: "Origine", className: "bg-ink text-white border-ink" },
  oem: { label: "OEM", className: "bg-card text-ink border-ink" },
  aftermarket: { label: "Adaptable", className: "bg-sunk text-ink2 border-sunk" },
  used: { label: "Occasion", className: "bg-warn-soft text-[#8A4B00] border-[#F2D9AE]" },
};

export const plural = (n: number, one: string, many: string) => `${n.toLocaleString("fr-FR")} ${n > 1 ? many : one}`;

export const dt = (n: number) => `${n.toLocaleString("fr-FR")} DT`;
