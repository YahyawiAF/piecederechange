import type { CatalogProvider } from "./provider";
import { ORDERS, PARTS, SHOPS } from "./mock-data";

export const mockProvider: CatalogProvider = {
  name: "demo",
  async listParts() {
    return PARTS;
  },
  async getPart(id) {
    return PARTS.find((p) => p.id === id) ?? null;
  },
  async listShops() {
    return SHOPS;
  },
  async listOrders() {
    return ORDERS;
  },
  async reserve(input) {
    const part = PARTS.find((p) => p.id === input.partId);
    if (!part) throw new Error("Pièce introuvable");
    const code = `RES-2026-${String(100 + Math.floor(Math.random() * 900))}`;
    return { code, total: part.price * input.quantity };
  },
};
