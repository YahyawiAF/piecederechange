import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useApp } from "./AppContext";
import {
  BRANDS,
  categories,
  getPart,
  getShop,
  listParts,
  shops,
} from "../data/catalog";
import type { Part, SearchFilters, Shop } from "../types";
import type { Category } from "../types";

type ShopState = {
  ready: boolean;
  demoMode: boolean;
  shops: Shop[];
  categories: Category[];
  brands: readonly string[];
  loadProducts: (filters?: SearchFilters) => Part[];
  getProduct: (id: string) => Part | undefined;
  getShopById: (id: string) => Shop | undefined;
};

const Ctx = createContext<ShopState | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const { extraParts, selectedCity } = useApp();

  const loadProducts = useCallback(
    (filters: SearchFilters = {}) =>
      listParts({ city: selectedCity, ...filters }, extraParts),
    [extraParts, selectedCity],
  );

  const getProduct = useCallback(
    (id: string) => getPart(id, extraParts),
    [extraParts],
  );

  const value = useMemo<ShopState>(
    () => ({
      ready: true,
      demoMode: true,
      shops,
      categories,
      brands: BRANDS,
      loadProducts,
      getProduct,
      getShopById: getShop,
    }),
    [loadProducts, getProduct],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useShop must be used within ShopProvider");
  return v;
}
