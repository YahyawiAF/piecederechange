// Which bikes a part fits. A part can be linked to:
//   - exact models          fits:      ["z1000", "mt07"]
//   - every model of brands  fitBrands: ["vespa", "piaggio"]
//   - every bike of types    fitTypes:  ["50 cm³"]
//   - every bike             universal: true
// and any mix of these, so one part can relate to several brands and types.
import { ALL_MODELS, BRANDS, TYPES, type ModelWithBrand, type MotoBrand, type MotoType } from "./moto";

export type FitInfo = { fits: string[]; fitBrands?: string[]; fitTypes?: string[]; universal?: boolean };

export const fitsModel = (p: FitInfo, m: Pick<ModelWithBrand, "id" | "brand" | "type">) =>
  !!p.universal || p.fits.includes(m.id) || !!p.fitBrands?.includes(m.brand) || !!p.fitTypes?.includes(m.type);

/** Models a part fits (empty for universal parts: they fit everything). */
export const fittingModels = (p: FitInfo) => (p.universal ? [] : ALL_MODELS.filter((m) => fitsModel(p, m)));

export type BrandGroup = { brand: MotoBrand; models: ModelWithBrand[]; allModels: boolean };

export type CompatSummary = {
  universal: boolean;
  brands: BrandGroup[];
  types: (MotoType & { allBikes: boolean })[];
  modelCount: number;
};

/** Brands (with their models) and motorcycle types a part is related to, in catalogue order. */
export function compatSummary(p: FitInfo): CompatSummary {
  if (p.universal) return { universal: true, brands: [], types: [], modelCount: 0 };
  const models = fittingModels(p);
  const brands = BRANDS.map((brand) => ({
    brand,
    models: models.filter((m) => m.brand === brand.id),
    allModels: !!p.fitBrands?.includes(brand.id),
  })).filter((g) => g.models.length);
  const types = TYPES.filter((t) => models.some((m) => m.type === t.id)).map((t) => ({ ...t, allBikes: !!p.fitTypes?.includes(t.id) }));
  return { universal: false, brands, types, modelCount: models.length };
}

/** Plain-text summary, e.g. "Kawasaki, Yamaha +2". */
export const brandsLabel = (s: CompatSummary, max = 2) =>
  s.universal ? "Toutes marques" : s.brands.slice(0, max).map((g) => g.brand.short).join(", ") + (s.brands.length > max ? ` +${s.brands.length - max}` : "");
