import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  AppMode,
  DeliveryOption,
  FavoriteItem,
  Order,
  Part,
  QuoteItem,
} from "../types";
import { demoOrders, demoProfile } from "../data/seed";
import { getPart } from "../data/catalog";
import {
  loadCity,
  loadExtraParts,
  loadFavorites,
  loadMode,
  loadOrders,
  loadPhone,
  loadQuotes,
  loadUserName,
  saveCity,
  saveExtraParts,
  saveFavorites,
  saveMode,
  saveOrders,
  savePhone,
  saveQuotes,
  saveUserName,
} from "../services/storage";

type AppState = {
  ready: boolean;
  mode: AppMode;
  setMode: (m: AppMode) => Promise<void>;
  selectedCity: string;
  setSelectedCity: (city: string) => Promise<void>;
  userName: string;
  phone: string;
  setProfile: (name: string, phone: string) => Promise<void>;
  favorites: FavoriteItem[];
  extraParts: Part[];
  orders: Order[];
  quotes: QuoteItem[];
  addToQuote: (listingId: string) => Promise<void>;
  removeFromQuote: (listingId: string) => Promise<void>;
  isQuoted: (listingId: string) => boolean;
  clearQuote: () => Promise<void>;
  patchExtraParts: (ids: string[], patch: Partial<Part>) => Promise<void>;
  toggleFavorite: (listingId: string) => Promise<void>;
  isFavorite: (listingId: string) => boolean;
  reservePart: (opts: {
    part: Part;
    customerName: string;
    customerPhone: string;
    customerCity: string;
    deliveryOption: DeliveryOption;
    notes?: string;
  }) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  addExtraPart: (part: Part) => Promise<void>;
  decrementStock: (partId: string) => Promise<void>;
};

const Ctx = createContext<AppState | null>(null);

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [mode, setModeState] = useState<AppMode>("buyer");
  const [selectedCity, setCityState] = useState("all");
  const [userName, setUserNameState] = useState(demoProfile.userName);
  const [phone, setPhoneState] = useState(demoProfile.phone);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [extraParts, setExtraParts] = useState<Part[]>([]);

  useEffect(() => {
    (async () => {
      const [f, o, n, p, c, m, extra, q] = await Promise.all([
        loadFavorites(),
        loadOrders(),
        loadUserName(),
        loadPhone(),
        loadCity(),
        loadMode(),
        loadExtraParts(),
        loadQuotes(),
      ]);
      setFavorites(f);
      setOrders(o.length ? o : demoOrders);
      setUserNameState(n || demoProfile.userName);
      setPhoneState(p || demoProfile.phone);
      setCityState(c || "all");
      setModeState(m);
      setExtraParts(extra);
      setQuotes(q);
      if (!o.length) await saveOrders(demoOrders);
      if (!n) await saveUserName(demoProfile.userName);
      if (!p) await savePhone(demoProfile.phone);
      setReady(true);
    })();
  }, []);

  const setMode = useCallback(async (m: AppMode) => {
    setModeState(m);
    await saveMode(m);
  }, []);

  const setSelectedCity = useCallback(async (city: string) => {
    setCityState(city);
    await saveCity(city);
  }, []);

  const setProfile = useCallback(async (name: string, phoneValue: string) => {
    setUserNameState(name);
    setPhoneState(phoneValue);
    await Promise.all([saveUserName(name), savePhone(phoneValue)]);
  }, []);

  const toggleFavorite = useCallback(async (listingId: string) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.listingId === listingId);
      const next = exists
        ? prev.filter((item) => item.listingId !== listingId)
        : [...prev, { listingId, savedAt: new Date().toISOString() }];
      void saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (listingId: string) => favorites.some((f) => f.listingId === listingId),
    [favorites],
  );

  const reservePart = useCallback(
    async (opts: {
      part: Part;
      customerName: string;
      customerPhone: string;
      customerCity: string;
      deliveryOption: DeliveryOption;
      notes?: string;
    }) => {
      const year = new Date().getFullYear();
      const order: Order = {
        id: uid("ord"),
        orderCode: `RES-${year}-${Math.floor(Math.random() * 900 + 100)}`,
        shopId: opts.part.shopId,
        partId: opts.part.id,
        customerName: opts.customerName,
        customerPhone: opts.customerPhone,
        customerCity: opts.customerCity,
        deliveryOption: opts.deliveryOption,
        totalTnd: opts.part.price,
        status: "reserved",
        notes: opts.notes || null,
        createdAt: new Date().toISOString(),
        partName: opts.part.partName,
        partImage: opts.part.images[0] ?? null,
        shopName: opts.part.shop.name,
        shopCity: opts.part.shop.city,
        shopPhone: opts.part.shop.phone,
        shopWhatsapp: opts.part.shop.whatsapp,
      };
      setOrders((prev) => {
        const next = [order, ...prev];
        void saveOrders(next);
        return next;
      });
      return order;
    },
    [],
  );

  const cancelOrder = useCallback(async (orderId: string) => {
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === orderId ? { ...o, status: "cancelled" as const } : o,
      );
      void saveOrders(next);
      return next;
    });
  }, []);

  const addExtraPart = useCallback(async (part: Part) => {
    setExtraParts((prev) => {
      const next = [part, ...prev];
      void saveExtraParts(next);
      return next;
    });
  }, []);

  const decrementStock = useCallback(async (partId: string) => {
    setExtraParts((prev) => {
      const next = prev.map((p) => {
        if (p.id !== partId) return p;
        const qty = Math.max(0, p.stockQuantity - 1);
        return {
          ...p,
          stockQuantity: qty,
          status: qty === 0 ? "out_of_stock" : qty <= 3 ? "low_stock" : "in_stock",
        } as Part;
      });
      void saveExtraParts(next);
      return next;
    });
  }, []);

  const addToQuote = useCallback(async (listingId: string) => {
    setQuotes((prev) => {
      if (prev.some((q) => q.listingId === listingId)) return prev;
      const next = [
        ...prev,
        { listingId, qty: 1, addedAt: new Date().toISOString() },
      ];
      void saveQuotes(next);
      return next;
    });
  }, []);

  const removeFromQuote = useCallback(async (listingId: string) => {
    setQuotes((prev) => {
      const next = prev.filter((q) => q.listingId !== listingId);
      void saveQuotes(next);
      return next;
    });
  }, []);

  const isQuoted = useCallback(
    (listingId: string) => quotes.some((q) => q.listingId === listingId),
    [quotes],
  );

  const clearQuote = useCallback(async () => {
    setQuotes([]);
    await saveQuotes([]);
  }, []);

  const patchExtraParts = useCallback(
    async (ids: string[], patch: Partial<Part>) => {
      setExtraParts((prev) => {
        const next = prev.map((p) =>
          ids.includes(p.id) ? { ...p, ...patch } : p,
        );
        void saveExtraParts(next);
        return next;
      });
    },
    [],
  );

  return (
    <Ctx.Provider
      value={{
        ready,
        mode,
        setMode,
        selectedCity,
        setSelectedCity,
        userName,
        phone,
        setProfile,
        favorites,
        extraParts,
        orders,
        quotes,
        toggleFavorite,
        isFavorite,
        reservePart,
        cancelOrder,
        addExtraPart,
        decrementStock,
        addToQuote,
        removeFromQuote,
        isQuoted,
        clearQuote,
        patchExtraParts,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}

export function usePartLookup() {
  const { extraParts } = useApp();
  return (id: string) => getPart(id, extraParts);
}
