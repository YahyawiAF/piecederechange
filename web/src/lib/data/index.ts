// The only module pages import for data. Picks the ERP when it is configured, else the demo catalogue.
import { cacheLife, cacheTag } from "next/cache";
import { applyFilters, matchBase } from "../filters";
import type { CatalogFilters, Part, ReservationInput } from "../types";
import { erpProvider, isErpConfigured } from "./erp";
import { mockProvider } from "./mock";

const provider = () => (isErpConfigured() ? erpProvider : mockProvider);

export const dataSource = () => provider().name;

/** All parts, cached for a few minutes (stock changes in the ERP show up after that). */
export async function getAllParts(): Promise<Part[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("parts");
  return provider().listParts();
}

/** Parts for the catalogue, plus the counts the sidebar shows. */
export async function searchParts(f: CatalogFilters) {
  const all = await getAllParts();
  const base = matchBase(all, f);
  const count = <K extends "maker" | "cond">(key: K) =>
    base.reduce<Record<string, number>>((acc, p) => {
      acc[p[key]] = (acc[p[key]] ?? 0) + 1;
      return acc;
    }, {});
  // Per-category counts ignore the category filter so every tab shows what switching would give.
  const catCounts = matchBase(all, { ...f, cat: undefined }).reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
  const promoCount = matchBase(all, { ...f, promo: false }).filter((p) => p.oldPrice && p.oldPrice > p.price).length;
  return { results: applyFilters(all, f), makerCounts: count("maker"), condCounts: count("cond"), catCounts, promoCount };
}

export async function getPart(id: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("parts", `part-${id}`);
  return provider().getPart(id);
}

export async function getShops() {
  "use cache";
  cacheLife("hours");
  cacheTag("shops");
  return provider().listShops();
}

export async function getOrders() {
  return provider().listOrders();
}

/** Parts with an ad (new or sponsored), for the ad spots. */
export async function getSpotlights() {
  return (await getAllParts()).filter((p) => p.ad);
}

export async function getDeals() {
  return (await getAllParts()).filter((p) => p.oldPrice).slice(0, 8);
}

export async function createReservation(input: ReservationInput) {
  return provider().reserve(input);
}
