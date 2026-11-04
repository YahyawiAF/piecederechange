import type { Order, Part, ReservationInput, ReservationResult, Shop } from "../types";

/**
 * Everything the site needs from a back office. Two implementations:
 * - mock.ts: built-in demo catalogue (default)
 * - erp.ts: SupplyChain Pro storefront API (when ERP_ORG_ID is set)
 */
export interface CatalogProvider {
  readonly name: "demo" | "erp";
  /** Every sellable part. Filtering by bike happens in lib/filters.ts. */
  listParts(opts?: { search?: string }): Promise<Part[]>;
  getPart(id: string): Promise<Part | null>;
  listShops(): Promise<Shop[]>;
  listOrders(): Promise<Order[]>;
  reserve(input: ReservationInput): Promise<ReservationResult>;
}
