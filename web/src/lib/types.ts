export type Condition = "original" | "oem" | "aftermarket" | "used";

export type PartIconId =
  | "disc" | "pads" | "piston" | "plug" | "chain" | "belt" | "rollers" | "filter"
  | "shock" | "tyre" | "fairing" | "lever" | "battery" | "caliper" | "oil"
  | "helmet" | "glove" | "lock" | "topcase" | "phone";

export type CategoryId =
  | "freinage" | "moteur" | "chaine" | "filtration" | "suspension" | "allumage" | "pneus" | "carenage"
  | "casques" | "equipement" | "accessoires";

export type Shop = {
  id: string;
  ini: string;
  name: string;
  city: string;
  km: string;
  rating: string;
  reviews: number;
  hours: string;
  tag: string;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  delivery: string;
};

export type Part = {
  id: string;
  name: string;
  /** Part manufacturer, e.g. EBC, Brembo. */
  maker: string;
  ref: string;
  oem: string | null;
  cond: Condition;
  price: number;
  oldPrice?: number | null;
  stock: number;
  position: "Avant" | "Arrière" | null;
  category: CategoryId;
  icon: PartIconId;
  image: string | null;
  /** Compatible motorcycle model ids (see lib/moto.ts). */
  fits: string[];
  /** Fits every model of these brands (ids from lib/moto.ts). */
  fitBrands?: string[];
  /** Fits every bike of these motorcycle types. */
  fitTypes?: string[];
  /** Fits every bike (helmets, gloves, locks…). */
  universal?: boolean;
  /** Merchandising tag shown on the card's top-right corner (a discount always wins). */
  tag?: "new" | "best" | null;
  /** Advertised part: shown in the ad spots (Accueil spotlight, top of the catalogue). */
  ad?: { kind: "new" | "sponsored"; headline: string; sub?: string } | null;
  description: string | null;
  specs: { label: string; value: string }[];
  shop: Shop;
};

export type OrderStatus = "reserved" | "confirmed" | "preparing" | "ready" | "done" | "cancelled";

export type OrderLine = { partId: string; name: string; ref: string; icon: PartIconId; qty: number; unitPrice: number };

export type Order = {
  code: string;
  /** ISO date-time. */
  createdAt: string;
  status: OrderStatus;
  mode: "pickup" | "express";
  bike: string;
  lines: OrderLine[];
  deliveryFee: number;
  fitting: boolean;
  shop: Shop;
  address?: string;
  /** Steps reached so far, oldest first. */
  events: { status: OrderStatus; at: string }[];
  note: string;
};

export type CatalogFilters = {
  q?: string;
  cat?: CategoryId;
  type?: string;
  brands: string[];
  models: string[];
  cc?: string;
  pos?: "Avant" | "Arrière";
  makers: string[];
  conds: Condition[];
  sort?: "relevance" | "price" | "price_desc" | "distance";
  /** Only discounted parts. */
  promo?: boolean;
};

export type ReservationInput = {
  partId: string;
  quantity: number;
  customerName: string;
  phone: string;
  mode: "pickup" | "express";
  address?: string;
  fitting: boolean;
  bikeLabel?: string;
};

export type ReservationResult = { code: string; total: number };

export type NotificationKind = "order" | "promo" | "loyalty" | "stock";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  /** ISO date-time. */
  at: string;
  href: string;
};

export type LoyaltyEvent = { id: string; at: string; label: string; points: number };

export type Customer = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  memberSince: string;
  cardNumber: string;
  /** Current points balance. */
  points: number;
  /** Points earned over the last 12 months (decides the tier). */
  earned12m: number;
  history: LoyaltyEvent[];
};
