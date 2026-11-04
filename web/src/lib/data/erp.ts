// SupplyChain Pro ERP (Nest) — storefront API, same endpoints as the Expo app (src/services/storefrontApi.ts).
//
//   GET  /storefront/:orgId/shop
//   GET  /storefront/:orgId/products?page&limit&search
//   GET  /storefront/:orgId/products/:id
//   POST /storefront/:orgId/reservations
//
// Bike compatibility, condition and position are read from product tags until the ERP has dedicated fields:
//   moto:z1000   moto:gts        → compatible model ids (lib/moto.ts), one tag per model
//   marque:vespa                 → every model of that brand
//   type:scooter  type:50        → every bike of that motorcycle type
//   etat:original|oem|aftermarket|used
//   position:avant|arriere
//   oem:43082-0122               → OEM equivalent reference
import type { CatalogProvider } from "./provider";
import { TYPES } from "../moto";
import type { CategoryId, Condition, Part, PartIconId, Shop } from "../types";

const API_URL = (process.env.ERP_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
const ORG_ID = (process.env.ERP_ORG_ID ?? "").trim();

export const isErpConfigured = () => ORG_ID.length > 10;

type StorefrontShop = { id: string; name: string; logoUrl: string | null; phone: string | null; addressLine: string | null; city: string | null; whatsapp: string | null };
type StorefrontProduct = {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  brand: string | null;
  sellingPrice: number;
  stock: number;
  available: boolean;
  img: string | null;
  images: string[];
  categoryName: string | null;
  tags: string[];
};
type Paginated<T> = { data: T[]; meta: { total: number; page: number; limit: number; totalPages: number } };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/storefront/${ORG_ID}${path}`, {
    ...init,
    headers: { Accept: "application/json", "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(body?.message ? String(body.message) : `ERP: erreur ${res.status}`);
  return body as T;
}

const media = (path: string | null) => (!path ? null : /^https?:\/\//.test(path) ? path : `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`);

const CATEGORY_WORDS: [RegExp, CategoryId, PartIconId][] = [
  [/casque|helmet/i, "casques", "helmet"],
  [/gant|blouson|veste|botte|equipement|équipement/i, "equipement", "glove"],
  [/antivol|top.?case|support|intercom|housse|sacoche|accessoire/i, "accessoires", "topcase"],
  [/frein|plaquette|disque|etrier|étrier/i, "freinage", "pads"],
  [/chaine|chaîne|pignon|couronne/i, "chaine", "chain"],
  [/filtre|huile|vidange/i, "filtration", "filter"],
  [/amorti|fourche|suspension/i, "suspension", "shock"],
  [/bougie|batterie|allumage|electri|électri/i, "allumage", "plug"],
  [/pneu/i, "pneus", "tyre"],
  [/carenage|carénage|bulle|retro|rétro/i, "carenage", "fairing"],
];

function categoryOf(p: StorefrontProduct): [CategoryId, PartIconId] {
  const text = `${p.categoryName ?? ""} ${p.name}`;
  for (const [re, cat, icon] of CATEGORY_WORDS) if (re.test(text)) return [cat, icon];
  return ["moteur", "piston"];
}

/** "scooter", "50", "50cc" → "Scooter", "50 cm³". */
const typeFromTag = (v: string) => TYPES.find((t) => t.id.toLowerCase().replace(/[^a-z0-9]/g, "").startsWith(v.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 2)))?.id;

const tagValues = (tags: string[], key: string) => tags.filter((t) => t.toLowerCase().startsWith(`${key}:`)).map((t) => t.slice(key.length + 1).trim());

function toShop(s: StorefrontShop): Shop {
  const ini = s.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return { id: s.id, ini, name: s.name, city: s.city ?? "", km: s.city ?? "", rating: "—", reviews: 0, hours: "", tag: "", phone: s.phone, whatsapp: s.whatsapp, address: s.addressLine, delivery: "Retrait en magasin" };
}

function toPart(p: StorefrontProduct, shop: Shop): Part {
  const [category, icon] = categoryOf(p);
  const cond = tagValues(p.tags, "etat")[0] as Condition | undefined;
  const pos = tagValues(p.tags, "position")[0]?.toLowerCase();
  return {
    id: p.id,
    name: p.name,
    maker: p.brand ?? "—",
    ref: p.sku,
    oem: tagValues(p.tags, "oem")[0] ?? null,
    cond: cond && ["original", "oem", "aftermarket", "used"].includes(cond) ? cond : "aftermarket",
    price: Number(p.sellingPrice) || 0,
    oldPrice: null,
    stock: p.available ? p.stock : 0,
    position: pos === "avant" ? "Avant" : pos === "arriere" || pos === "arrière" ? "Arrière" : null,
    category,
    icon,
    image: media(p.img),
    fits: tagValues(p.tags, "moto").map((s) => s.toLowerCase()),
    fitBrands: tagValues(p.tags, "marque").map((s) => s.toLowerCase()),
    fitTypes: tagValues(p.tags, "type").flatMap((v) => typeFromTag(v) ?? []),
    universal: p.tags.some((t) => t.toLowerCase() === "universel") || ["casques", "equipement"].includes(category),
    tag: p.tags.some((t) => t.toLowerCase() === "nouveau") ? "new" : p.tags.some((t) => t.toLowerCase() === "top") ? "best" : null,
    description: p.description,
    specs: [],
    shop,
  };
}

async function shopInfo() {
  return toShop(await request<StorefrontShop>("/shop"));
}

export const erpProvider: CatalogProvider = {
  name: "erp",
  async listParts(opts) {
    const shop = await shopInfo();
    const parts: Part[] = [];
    // The storefront API is paginated; read up to 10 pages of 100.
    for (let page = 1; page <= 10; page++) {
      const q = new URLSearchParams({ page: String(page), limit: "100" });
      if (opts?.search) q.set("search", opts.search);
      const res = await request<Paginated<StorefrontProduct>>(`/products?${q}`);
      parts.push(...res.data.map((p) => toPart(p, shop)));
      if (page >= res.meta.totalPages) break;
    }
    return parts;
  },
  async getPart(id) {
    try {
      const [p, shop] = await Promise.all([request<StorefrontProduct>(`/products/${encodeURIComponent(id)}`), shopInfo()]);
      return toPart(p, shop);
    } catch {
      return null;
    }
  },
  async listShops() {
    return [await shopInfo()];
  },
  async listOrders() {
    // The storefront API has no "my reservations" endpoint yet; add one to the ERP to fill this page.
    return [];
  },
  async reserve(input) {
    const notes = [input.mode === "express" ? `Livraison : ${input.address ?? ""}` : "Retrait en magasin", input.fitting ? "Montage en atelier demandé" : ""].filter(Boolean).join(" · ");
    const res = await request<{ orderNumber: string; totalTnd: number }>("/reservations", {
      method: "POST",
      body: JSON.stringify({ productId: input.partId, quantity: input.quantity, customerName: input.customerName, phone: input.phone, notes, bikeLabel: input.bikeLabel }),
    });
    return { code: res.orderNumber, total: res.totalTnd };
  },
};
