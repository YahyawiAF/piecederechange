import { API_BASE_URL, ORG_ID } from "../config";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  if (!res.ok) {
    const msg =
      typeof body === "object" &&
      body &&
      "message" in body &&
      (body as { message: unknown }).message
        ? String((body as { message: unknown }).message)
        : `Erreur ${res.status}`;
    throw new ApiError(msg, res.status, body);
  }
  return body as T;
}

export type StorefrontShop = {
  id: string;
  name: string;
  logoUrl: string | null;
  phone: string | null;
  addressLine: string | null;
  city: string | null;
  footer: string | null;
  whatsapp: string | null;
};

export type StorefrontCategory = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

export type StorefrontProduct = {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  barcode: string | null;
  brand: string | null;
  sellingPrice: number;
  stock: number;
  available: boolean;
  img: string | null;
  images: string[];
  categoryId: string | null;
  categoryName: string | null;
  unit: string | null;
  tags: string[];
  featured: boolean;
  status: string;
};

export type Paginated<T> = {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export type ReserveResult = {
  id: string;
  orderNumber: string;
  status: string;
  totalTnd: number;
  createdAt: string;
  productName: string;
  quantity: number;
};

function base() {
  if (!ORG_ID) throw new ApiError("EXPO_PUBLIC_ORG_ID manquant", 0);
  return `/storefront/${ORG_ID}`;
}

export const storefrontApi = {
  getShop: () => request<StorefrontShop>(`${base()}/shop`),

  listCategories: () =>
    request<StorefrontCategory[]>(`${base()}/categories`),

  listBrands: () => request<string[]>(`${base()}/brands`),

  listProducts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    brand?: string;
    inStockOnly?: boolean;
  }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.search) q.set("search", params.search);
    if (params?.categoryId) q.set("categoryId", params.categoryId);
    if (params?.brand) q.set("brand", params.brand);
    if (params?.inStockOnly) q.set("inStockOnly", "1");
    const qs = q.toString();
    return request<Paginated<StorefrontProduct>>(
      `${base()}/products${qs ? `?${qs}` : ""}`,
    );
  },

  getProduct: (productId: string) =>
    request<StorefrontProduct>(`${base()}/products/${productId}`),

  reserve: (body: {
    productId: string;
    quantity: number;
    customerName: string;
    phone: string;
    notes?: string;
    bikeLabel?: string;
  }) =>
    request<ReserveResult>(`${base()}/reservations`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
