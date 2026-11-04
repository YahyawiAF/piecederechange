import { Platform } from "react-native";

const RAW = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

function normalizeBaseUrl(raw: string): string {
  let base = raw.trim().replace(/\/$/, "");
  if (!base) base = "http://localhost:4000";
  if (Platform.OS === "android") {
    try {
      const withScheme = base.includes("://") ? base : `http://${base}`;
      const u = new URL(withScheme);
      if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
        u.hostname = "10.0.2.2";
        base = u.toString().replace(/\/$/, "");
      }
    } catch {
      /* keep */
    }
  }
  return base;
}

export const API_BASE_URL = normalizeBaseUrl(RAW);

/** ERP organization UUID — when empty, app runs with local fake catalog. */
export const ORG_ID = (process.env.EXPO_PUBLIC_ORG_ID ?? "").trim();

export function isErpConfigured(): boolean {
  return ORG_ID.length > 10;
}

/** No ERP org → use seed data in `src/data/seed.ts` for local testing. */
export function isDemoMode(): boolean {
  return !isErpConfigured();
}

export function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/${path}`;
}
