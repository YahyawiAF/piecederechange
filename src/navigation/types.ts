import type { NavigatorScreenParams } from "@react-navigation/native";
import type { AiScanType } from "../types";

export type CatalogParams = {
  categoryId?: string;
  subCategoryId?: string;
  brand?: string;
  model?: string;
  year?: number | string;
  makerBrand?: string;
  vehicleType?: string;
  query?: string;
  shopId?: string;
};

export type RootStackParamList = {
  Boot: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Product: { listingId: string };
  Store: { storeId: string };
  Reserve: { listingId: string };
  AiScan: { type?: AiScanType } | undefined;
  AddPart: undefined;
};

export type MainTabParamList = {
  Home: CatalogParams | undefined;
  Quotes: undefined;
  Orders: undefined;
  Account: undefined;
};
