import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppMode, FavoriteItem, Order, Part, QuoteItem } from "../types";

const KEYS = {
  favorites: "@prm/favorites",
  orders: "@prm/orders",
  userName: "@prm/userName",
  phone: "@prm/phone",
  city: "@prm/city",
  mode: "@prm/mode",
  extraParts: "@prm/extraParts",
  quotes: "@prm/quotes",
} as const;

export async function loadFavorites(): Promise<FavoriteItem[]> {
  const raw = await AsyncStorage.getItem(KEYS.favorites);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as FavoriteItem[];
  } catch {
    return [];
  }
}

export async function saveFavorites(items: FavoriteItem[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.favorites, JSON.stringify(items));
}

export async function loadOrders(): Promise<Order[]> {
  const raw = await AsyncStorage.getItem(KEYS.orders);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export async function saveOrders(orders: Order[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.orders, JSON.stringify(orders));
}

export async function loadUserName(): Promise<string> {
  return (await AsyncStorage.getItem(KEYS.userName)) || "";
}

export async function saveUserName(name: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.userName, name);
}

export async function loadPhone(): Promise<string> {
  return (await AsyncStorage.getItem(KEYS.phone)) || "";
}

export async function savePhone(phone: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.phone, phone);
}

export async function loadCity(): Promise<string> {
  return (await AsyncStorage.getItem(KEYS.city)) || "all";
}

export async function saveCity(city: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.city, city);
}

export async function loadMode(): Promise<AppMode> {
  const raw = await AsyncStorage.getItem(KEYS.mode);
  return raw === "seller" ? "seller" : "buyer";
}

export async function saveMode(mode: AppMode): Promise<void> {
  await AsyncStorage.setItem(KEYS.mode, mode);
}

export async function loadExtraParts(): Promise<Part[]> {
  const raw = await AsyncStorage.getItem(KEYS.extraParts);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Part[];
  } catch {
    return [];
  }
}

export async function saveExtraParts(parts: Part[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.extraParts, JSON.stringify(parts));
}

export async function loadQuotes(): Promise<QuoteItem[]> {
  const raw = await AsyncStorage.getItem(KEYS.quotes);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as QuoteItem[];
  } catch {
    return [];
  }
}

export async function saveQuotes(items: QuoteItem[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.quotes, JSON.stringify(items));
}
