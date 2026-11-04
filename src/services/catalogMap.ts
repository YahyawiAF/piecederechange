import type { Part } from "../types";

export function formatTnd(amount: number): string {
  return (
    amount.toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + " TND"
  );
}

/** @deprecated Use Part from types. Kept so older imports compile during the redesign. */
export type CatalogItem = {
  id: string;
  name: string;
  priceTnd: number;
  brand: string | null;
  categoryId: string | null;
  categoryName: string | null;
  available: boolean;
  stock: number;
  sku: string;
  description: string | null;
  imageUrl: string | null;
  images: string[];
  tags: string[];
  unit: string | null;
  featured: boolean;
  storeName: string;
  storePhone: string | null;
  storeWhatsapp: string | null;
  storeCity: string | null;
  storeAddress: string | null;
};

export function partToLegacy(p: Part): CatalogItem {
  return {
    id: p.id,
    name: p.partName,
    priceTnd: p.price,
    brand: p.compatibleVehicles[0]?.brand ?? null,
    categoryId: p.categoryId,
    categoryName: p.category.name,
    available: p.status !== "out_of_stock",
    stock: p.stockQuantity,
    sku: p.oemNumber ?? p.partNumber ?? p.id,
    description: p.description,
    imageUrl: p.images[0] ?? null,
    images: p.images,
    tags: [],
    unit: "pcs",
    featured: p.featured,
    storeName: p.shop.name,
    storePhone: p.shop.phone,
    storeWhatsapp: p.shop.whatsapp,
    storeCity: p.shop.city,
    storeAddress: p.shop.address,
  };
}
