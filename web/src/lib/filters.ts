// Catalogue filters: URL <-> filter object, and the matching logic shared by every data provider.
import { ALL_MODELS, CC_RANGES, modelById } from "./moto";
import { fitsModel, fittingModels } from "./compat";
import { CATEGORIES } from "./catalog";
import type { CatalogFilters, Condition, Part } from "./types";

type RawParams = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
const list = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v.join(",") : v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const CONDS: Condition[] = ["original", "oem", "aftermarket", "used"];

export function parseFilters(sp: RawParams): CatalogFilters {
  const cat = one(sp.cat);
  const pos = one(sp.pos);
  const sort = one(sp.sort);
  const cc = one(sp.cc);
  return {
    q: one(sp.q)?.slice(0, 80),
    cat: CATEGORIES.some((c) => c.id === cat) ? (cat as CatalogFilters["cat"]) : undefined,
    type: one(sp.type),
    brands: list(sp.brand),
    models: list(sp.model),
    cc: CC_RANGES.some((r) => r.id === cc) ? cc : undefined,
    pos: pos === "Avant" || pos === "Arrière" ? pos : undefined,
    makers: list(sp.maker),
    conds: list(sp.cond).filter((c): c is Condition => CONDS.includes(c as Condition)),
    sort: sort === "price" || sort === "price_desc" || sort === "distance" ? sort : "relevance",
    promo: one(sp.promo) === "1",
  };
}

/** Motorcycle models the filters point at (type, brands, models, engine size). Null = no bike filter. */
export function scopeModels(f: CatalogFilters) {
  if (!f.type && !f.brands.length && !f.models.length && !f.cc) return null;
  const range = CC_RANGES.find((r) => r.id === (f.cc ?? "all"))!;
  let list = ALL_MODELS.filter(
    (m) => (!f.type || f.type === "all" || m.type === f.type) && m.cc >= range.min && m.cc <= range.max && (!f.brands.length || f.brands.includes(m.brand)),
  );
  if (f.models.length) list = list.filter((m) => f.models.includes(m.id));
  return list;
}

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[\s-]/g, "");

/** Parts matching the bike + part filters, before maker/condition so the sidebar can show counts. */
export function matchBase(parts: Part[], f: CatalogFilters) {
  const scope = scopeModels(f);
  const q = f.q ? norm(f.q) : "";
  return parts.filter(
    (p) =>
      (!scope || scope.some((m) => fitsModel(p, m))) &&
      (!f.cat || p.category === f.cat) &&
      (!f.pos || p.position === f.pos) &&
      (!f.promo || !!(p.oldPrice && p.oldPrice > p.price)) &&
      (!q || norm(`${p.name} ${p.maker} ${p.ref} ${p.oem ?? ""}`).includes(q) || p.fits.some((id) => norm(modelById(id)?.name ?? "").includes(q))),
  );
}

export function applyFilters(parts: Part[], f: CatalogFilters) {
  let res = matchBase(parts, f).filter((p) => (!f.makers.length || f.makers.includes(p.maker)) && (!f.conds.length || f.conds.includes(p.cond)));
  if (f.sort === "price") res = [...res].sort((a, b) => a.price - b.price);
  if (f.sort === "price_desc") res = [...res].sort((a, b) => b.price - a.price);
  if (f.sort === "distance") res = [...res].sort((a, b) => parseFloat(a.shop.km.replace(",", ".")) - parseFloat(b.shop.km.replace(",", ".")));
  return res;
}

/** "Va sur Z1000, Z900 +2" — which of the selected bikes a part fits. */
export function fitsLabel(p: Part, f: CatalogFilters) {
  if (p.universal) return "Universel · toutes motos";
  const scope = scopeModels(f);
  const names = (scope ?? []).filter((m) => fitsModel(p, m)).map((m) => m.name);
  if (!names.length) {
    const all = fittingModels(p).map((m) => m.name);
    return all.length ? `Va sur ${all.slice(0, 2).join(", ")}${all.length > 2 ? ` +${all.length - 2}` : ""}` : undefined;
  }
  if (f.models.length === 1) return `Compatible ${names[0]}`;
  return `Va sur ${names.slice(0, 2).join(", ")}${names.length > 2 ? ` +${names.length - 2}` : ""}`;
}

/** Short human label for the selected bikes, e.g. "Kawasaki Z1000" or "Tous les scooter". */
export function scopeTitle(f: CatalogFilters) {
  const models = f.models.map(modelById).filter(Boolean);
  if (models.length === 1) return `${models[0]!.brandName} ${models[0]!.name}`;
  if (models.length > 1) return `${models.length} modèles`;
  if (f.brands.length) {
    const names = f.brands.map((id) => ALL_MODELS.find((m) => m.brand === id)?.brandName ?? id);
    return names.join(", ") + (f.type && f.type !== "all" ? ` · ${f.type}` : "");
  }
  if (f.type && f.type !== "all") return `Tous les ${f.type.toLowerCase()}`;
  return "Toutes les motos";
}

/** Serialize back to a query string (only non-empty keys). */
export function toQuery(f: Partial<CatalogFilters>) {
  const q = new URLSearchParams();
  if (f.q) q.set("q", f.q);
  if (f.cat) q.set("cat", f.cat);
  if (f.type && f.type !== "all") q.set("type", f.type);
  if (f.brands?.length) q.set("brand", f.brands.join(","));
  if (f.models?.length) q.set("model", f.models.join(","));
  if (f.cc && f.cc !== "all") q.set("cc", f.cc);
  if (f.pos) q.set("pos", f.pos);
  if (f.makers?.length) q.set("maker", f.makers.join(","));
  if (f.conds?.length) q.set("cond", f.conds.join(","));
  if (f.promo) q.set("promo", "1");
  if (f.sort && f.sort !== "relevance") q.set("sort", f.sort);
  const s = q.toString();
  return s ? `?${s}` : "";
}
