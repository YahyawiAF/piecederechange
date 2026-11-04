import {
  BRANDS,
  CITIES,
  MAKER_BRANDS,
  VEHICLE_TYPES,
  categories,
  parts as seedParts,
  shops,
  vehicles,
} from "./seed";
import type { Part, SearchFilters, Shop, SortKey } from "../types";

export function formatTnd(amount: number): string {
  return (
    amount.toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + " TND"
  );
}

export function getShop(id: string): Shop | undefined {
  return shops.find((s) => s.id === id);
}

export function getCategory(id: string) {
  return categories.find((c) => c.id === c.id && c.id === id);
}

export function getVehicle(id: string) {
  return vehicles.find((v) => v.id === id);
}

function yearMatches(part: Part, year: number): boolean {
  return part.compatibleVehicles.some((v) => {
    const end = v.yearEnd ?? 2099;
    return year >= v.yearStart && year <= end;
  });
}

export function listParts(
  filters: SearchFilters = {},
  extra: Part[] = [],
): Part[] {
  let rows = [...seedParts, ...extra];

  if (filters.shopId) {
    rows = rows.filter((p) => p.shopId === filters.shopId);
  }
  if (filters.city && filters.city !== "all") {
    rows = rows.filter((p) => p.shop.city === filters.city);
  }
  if (filters.vehicleType && filters.vehicleType !== "all") {
    rows = rows.filter(
      (p) =>
        p.vehicleType === filters.vehicleType ||
        p.compatibleVehicles.some((v) => v.categoryType === filters.vehicleType),
    );
  }
  if (filters.categoryId && filters.categoryId !== "all") {
    rows = rows.filter((p) => p.categoryId === filters.categoryId);
  }
  if (filters.subCategoryId && filters.subCategoryId !== "all") {
    rows = rows.filter((p) => p.subCategoryId === filters.subCategoryId);
  }
  if (filters.brand && filters.brand !== "all") {
    const b = filters.brand.toLowerCase();
    rows = rows.filter((p) =>
      p.compatibleVehicles.some((v) => v.brand.toLowerCase() === b),
    );
  }
  if (filters.model && filters.model !== "all") {
    const m = filters.model.toLowerCase();
    rows = rows.filter((p) =>
      p.compatibleVehicles.some((v) => v.model.toLowerCase() === m),
    );
  }
  if (filters.year && filters.year !== "all") {
    const y = Number(filters.year);
    if (!Number.isNaN(y)) rows = rows.filter((p) => yearMatches(p, y));
  }
  if (filters.engine && filters.engine !== "all") {
    const e = filters.engine.toLowerCase();
    rows = rows.filter((p) =>
      p.compatibleVehicles.some((v) => v.engine.toLowerCase().includes(e)),
    );
  }
  if (filters.makerBrand && filters.makerBrand !== "all") {
    const m = filters.makerBrand.toLowerCase();
    rows = rows.filter((p) => p.makerBrand.toLowerCase() === m);
  }
  if (filters.position && filters.position !== "all") {
    rows = rows.filter((p) => p.position === filters.position);
  }
  if (filters.condition && filters.condition !== "all") {
    rows = rows.filter((p) => p.condition === filters.condition);
  }
  if (filters.stock && filters.stock !== "all") {
    if (filters.stock === "in_stock") {
      rows = rows.filter((p) => p.status === "in_stock");
    } else if (filters.stock === "low_stock") {
      rows = rows.filter((p) => p.status === "low_stock");
    } else if (filters.stock === "out_of_stock") {
      rows = rows.filter((p) => p.status === "out_of_stock");
    } else if (filters.stock === "on_order") {
      rows = rows.filter((p) => p.status === "low_stock" || p.stockQuantity === 0);
    }
  }
  if (filters.priceMin != null) {
    rows = rows.filter((p) => p.price >= filters.priceMin!);
  }
  if (filters.priceMax != null) {
    rows = rows.filter((p) => p.price <= filters.priceMax!);
  }
  const q = filters.query?.trim().toLowerCase();
  if (q) {
    rows = rows.filter((p) => {
      const hay = [
        p.partName,
        p.makerBrand,
        p.oemNumber,
        p.partNumber,
        p.description,
        p.shop.name,
        p.shop.city,
        p.category.name,
        p.subCategory?.name,
        ...(p.altReferences ?? []),
        ...p.compatibleVehicles.map((v) => `${v.brand} ${v.model} ${v.engine}`),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  const sort: SortKey = filters.sort ?? "relevance";
  if (sort === "price_asc") rows = [...rows].sort((a, b) => a.price - b.price);
  if (sort === "price_desc") rows = [...rows].sort((a, b) => b.price - a.price);
  if (sort === "stock") {
    rows = [...rows].sort((a, b) => b.stockQuantity - a.stockQuantity);
  }

  return rows;
}

export function getPart(id: string, extra: Part[] = []): Part | undefined {
  return extra.find((p) => p.id === id) ?? seedParts.find((p) => p.id === id);
}

export function featuredParts(extra: Part[] = [], city?: string): Part[] {
  return listParts({ city }, extra)
    .filter((p) => p.featured)
    .slice(0, 6);
}

export function modelsForBrand(brand?: string): string[] {
  const list =
    !brand || brand === "all"
      ? vehicles
      : vehicles.filter((v) => v.brand.toLowerCase() === brand.toLowerCase());
  return [...new Set(list.map((v) => v.model))];
}

export function yearsFor(brand?: string, model?: string): number[] {
  const list = vehicles.filter((v) => {
    if (brand && brand !== "all" && v.brand !== brand) return false;
    if (model && model !== "all" && v.model !== model) return false;
    return true;
  });
  const years = new Set<number>();
  for (const v of list) {
    const end = v.yearEnd ?? new Date().getFullYear();
    for (let y = v.yearStart; y <= end; y += 1) years.add(y);
  }
  return [...years].sort((a, b) => b - a);
}

export function enginesFor(brand?: string, model?: string): string[] {
  const list = vehicles.filter((v) => {
    if (brand && brand !== "all" && v.brand !== brand) return false;
    if (model && model !== "all" && v.model !== model) return false;
    return true;
  });
  return [...new Set(list.map((v) => v.engine))];
}

export function modelsInParts(parts: Part[]): string[] {
  const set = new Set<string>();
  for (const p of parts) {
    for (const v of p.compatibleVehicles) set.add(v.model);
  }
  return [...set].sort((a, b) => a.localeCompare(b, "fr"));
}

export type FilterChip = { key: string; label: string };

export function activeFilterChips(f: SearchFilters): FilterChip[] {
  const chips: FilterChip[] = [];
  if (f.query?.trim()) chips.push({ key: "query", label: f.query.trim() });
  if (f.brand && f.brand !== "all") chips.push({ key: "brand", label: f.brand });
  if (f.model && f.model !== "all") chips.push({ key: "model", label: f.model });
  if (f.year && f.year !== "all") chips.push({ key: "year", label: String(f.year) });
  if (f.engine && f.engine !== "all") chips.push({ key: "engine", label: f.engine });
  if (f.makerBrand && f.makerBrand !== "all") {
    chips.push({ key: "makerBrand", label: f.makerBrand });
  }
  if (f.categoryId && f.categoryId !== "all") {
    const cat = categories.find((c) => c.id === f.categoryId);
    if (cat) chips.push({ key: "categoryId", label: cat.name });
  }
  if (f.subCategoryId && f.subCategoryId !== "all") {
    const sub = categories
      .flatMap((c) => c.subCategories)
      .find((s) => s.id === f.subCategoryId);
    if (sub) chips.push({ key: "subCategoryId", label: sub.name });
  }
  if (f.stock && f.stock !== "all") {
    const labels: Record<string, string> = {
      in_stock: "En stock",
      low_stock: "Stock limité",
      out_of_stock: "Rupture",
      on_order: "Sur commande",
    };
    chips.push({ key: "stock", label: labels[f.stock] ?? f.stock });
  }
  if (f.priceMin != null || f.priceMax != null) {
    chips.push({
      key: "price",
      label: `${f.priceMin ?? 0}–${f.priceMax ?? "∞"} TND`,
    });
  }
  if (f.condition && f.condition !== "all") {
    chips.push({ key: "condition", label: f.condition });
  }
  if (f.position && f.position !== "all") {
    chips.push({ key: "position", label: f.position });
  }
  if (f.shopId) {
    const shop = shops.find((s) => s.id === f.shopId);
    if (shop) chips.push({ key: "shopId", label: shop.name });
  }
  return chips;
}

export function clearChip(
  f: SearchFilters,
  key: string,
): SearchFilters {
  const next = { ...f };
  if (key === "query") next.query = "";
  if (key === "brand") {
    next.brand = "all";
    next.model = "all";
    next.year = undefined;
    next.engine = undefined;
  }
  if (key === "model") {
    next.model = "all";
    next.year = undefined;
    next.engine = undefined;
  }
  if (key === "year") next.year = undefined;
  if (key === "engine") next.engine = undefined;
  if (key === "makerBrand") next.makerBrand = "all";
  if (key === "categoryId") {
    next.categoryId = "all";
    next.subCategoryId = "all";
  }
  if (key === "subCategoryId") next.subCategoryId = "all";
  if (key === "stock") next.stock = "all";
  if (key === "price") {
    next.priceMin = undefined;
    next.priceMax = undefined;
  }
  if (key === "condition") next.condition = "all";
  if (key === "position") next.position = undefined;
  if (key === "shopId") next.shopId = undefined;
  return next;
}

export function emptyFilterHints(f: SearchFilters): string[] {
  const hints: string[] = [];
  if (f.year && f.year !== "all") hints.push(`Retirer « ${f.year} »`);
  if (f.makerBrand && f.makerBrand !== "all") {
    hints.push(`Retirer « ${f.makerBrand} »`);
    hints.push("Chercher toutes les marques");
  }
  if (f.model && f.model !== "all") hints.push(`Élargir à tous les modèles ${f.brand ?? ""}`.trim());
  if (f.categoryId && f.categoryId !== "all") hints.push("Retirer la catégorie");
  return hints.slice(0, 4);
}

export {
  BRANDS,
  CITIES,
  MAKER_BRANDS,
  VEHICLE_TYPES,
  categories,
  shops,
  vehicles,
  seedParts as parts,
};
