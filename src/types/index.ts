export type PartCondition = "original" | "oem" | "aftermarket" | "used";
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type VehicleTypeId = "all" | "scooter" | "motorcycle" | "moped" | "car" | "truck";
export type AppMode = "buyer" | "seller";
export type DeliveryOption = "pickup" | "express_delivery";
export type AiScanType = "photo" | "vin" | "mechanic";

export type OrderStatus =
  | "reserved"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export type Shop = {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  city: string;
  address: string;
  distanceKm: string;
  rating: string;
  reviewsCount: number;
  openingHours: string;
  image: string;
  isVerified: boolean;
  badge: string;
};

export type SubCategory = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  subCategories: SubCategory[];
};

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  yearStart: number;
  yearEnd?: number | null;
  categoryType: VehicleTypeId;
  engine: string;
  sampleVin?: string | null;
};

export type Part = {
  id: string;
  shopId: string;
  partName: string;
  categoryId: string;
  subCategoryId: string | null;
  vehicleType: VehicleTypeId;
  oemNumber: string | null;
  partNumber: string | null;
  altReferences?: string[];
  makerBrand: string;
  position?: string | null;
  specs: { label: string; value: string }[];
  condition: PartCondition;
  price: number;
  buyPrice?: number | null;
  stockQuantity: number;
  status: StockStatus;
  shelfLocation: string;
  description: string | null;
  warranty: string | null;
  images: string[];
  featured: boolean;
  barcode: string | null;
  shop: Shop;
  category: Category;
  subCategory: SubCategory | null;
  compatibleVehicles: Vehicle[];
};

export type QuoteItem = {
  listingId: string;
  qty: number;
  addedAt: string;
};

export type SortKey = "relevance" | "price_asc" | "price_desc" | "stock";

export type SearchFilters = {
  query?: string;
  vehicleType?: string;
  categoryId?: string;
  subCategoryId?: string;
  brand?: string;
  model?: string;
  year?: number | string;
  engine?: string;
  makerBrand?: string;
  position?: string;
  condition?: string;
  stock?: string;
  priceMin?: number;
  priceMax?: number;
  city?: string;
  shopId?: string;
  sort?: SortKey;
};

export type Order = {
  id: string;
  orderCode: string;
  shopId: string;
  partId: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  deliveryOption: DeliveryOption;
  totalTnd: number;
  status: OrderStatus;
  notes?: string | null;
  createdAt: string;
  partName: string;
  partImage?: string | null;
  shopName: string;
  shopCity: string;
  shopPhone: string;
  shopWhatsapp: string;
};

export type GarageBike = {
  id: string;
  brandId: string;
  modelId: string;
  year: number;
  engineCc: number;
};

export type FavoriteItem = {
  listingId: string;
  savedAt: string;
};
