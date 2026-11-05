// Carte fidélité PiècesExpress: 1 DT spent = 1 point, more per point at higher tiers.
// Tier depends on points earned over the last 12 months (not the current balance).

export type TierId = "bronze" | "argent" | "or" | "platine";

export type Tier = {
  id: TierId;
  name: string;
  /** Points earned over 12 months to reach this tier. */
  min: number;
  /** Points bonus on every purchase. */
  multiplier: number;
  perks: string[];
  /** Card finish. */
  card: string;
  /** Accent color for this tier on light backgrounds. */
  ink: string;
  /** Text color on the card. */
  text: string;
};

export const TIERS: Tier[] = [
  { id: "bronze", name: "Bronze", min: 0, multiplier: 1, perks: ["1 point par DT", "Offres réservées aux membres"], card: "linear-gradient(135deg,#7A4A2A 0%,#C88A5A 38%,#8A5533 62%,#5E3820 100%)", ink: "#8A5533", text: "#FFFFFF" },
  { id: "argent", name: "Argent", min: 1000, multiplier: 1.25, perks: ["+25 % de points", "Livraison offerte dès 100 DT"], card: "linear-gradient(135deg,#8E949E 0%,#E6E9ED 38%,#A9AEB7 62%,#757B85 100%)", ink: "#4E535C", text: "#1B1C20" },
  { id: "or", name: "Or", min: 3000, multiplier: 1.5, perks: ["+50 % de points", "Montage en atelier -20 %", "Ventes privées 24 h avant"], card: "linear-gradient(135deg,#B8891E 0%,#F6DC8C 36%,#D2A53A 60%,#A47A16 100%)", ink: "#8A6514", text: "#2B1D02" },
  { id: "platine", name: "Platine", min: 7000, multiplier: 2, perks: ["Points doublés", "Livraison toujours offerte", "Conseiller dédié"], card: "linear-gradient(135deg,#1B1C20 0%,#4A4F5A 35%,#16171B 60%,#2E3138 100%)", ink: "#1B1C20", text: "#FFFFFF" },
];

export const tierFor = (earned12m: number) => [...TIERS].reverse().find((t) => earned12m >= t.min)!;
export const nextTier = (t: Tier) => TIERS[TIERS.findIndex((x) => x.id === t.id) + 1] ?? null;

/** Points a purchase earns at a given tier. */
export const pointsFor = (amountDt: number, tier: Tier = TIERS[0]) => Math.floor(amountDt * tier.multiplier);

/** 100 points = 1 DT when used as a voucher. */
export const pointsValueDt = (points: number) => Math.floor(points / 100);

export type Reward = { id: string; title: string; detail: string; cost: number; icon: "voucher" | "truck" | "wrench" | "tag" };

export const REWARDS: Reward[] = [
  { id: "ship", title: "Livraison offerte", detail: "Sur votre prochaine commande express", cost: 300, icon: "truck" },
  { id: "v10", title: "Bon d'achat 10 DT", detail: "Dès 50 DT d'achat, tous magasins", cost: 1000, icon: "voucher" },
  { id: "fit", title: "Montage offert", detail: "Pose d'une pièce en atelier partenaire", cost: 1500, icon: "wrench" },
  { id: "v30", title: "Bon d'achat 30 DT", detail: "Dès 150 DT d'achat, tous magasins", cost: 2800, icon: "voucher" },
  { id: "helmet", title: "-15 % sur un casque", detail: "Casques et équipement pilote", cost: 2000, icon: "tag" },
];

export const EARN_RULES = [
  { title: "Achetez", detail: "1 point par DT, en magasin ou en ligne" },
  { title: "Donnez votre avis", detail: "+50 points par avis sur une pièce" },
  { title: "Parrainez", detail: "+300 points par ami qui commande" },
  { title: "Anniversaire", detail: "+200 points offerts chaque année" },
];
