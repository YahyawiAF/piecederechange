import type { CSSProperties } from "react";

// Motorcycle reference data: types, brands and models.
// This is app-side reference data (it does not come from the ERP). ERP products
// point at these model ids through their compatibility tags — see data/erp.ts.

/** SVG path for a circle, so icons can be one `d` string. */
export const circle = (x: number, y: number, r: number) =>
  `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const C = circle;

export type MotoTypeId = "Roadster" | "Sportive" | "Trail" | "Scooter" | "Custom" | "50 cm³";

/** Motorcycle silhouettes, viewBox 0 0 72 44, drawn as strokes. */
export const SILHOUETTES: Record<MotoTypeId | "all", string> = {
  all: [C(16, 32, 9), C(56, 32, 9), "M16 32L31 29", "M9 20L22 21L28 18Q36 12 45 15", "M56 32L48 12"].join(""),
  Roadster: [C(16, 32, 9), C(56, 32, 9), "M16 32L31 29", "M30 21H41L39 30H31Z", "M9 20L22 21L28 18Q36 12 45 15", "M56 32L48 12", "M44 11L51 9.5", C(52.5, 17, 2.5)].join(""),
  Sportive: [C(16, 32, 9), C(56, 32, 9), "M16 32L31 28", "M6 15L24 21", "M24 21L31 16Q39 11 47 12Q55 13 57 19Q57 25 49 27L33 28Z", "M45 12Q49 6 55 11", "M56 32L53 26"].join(""),
  Trail: [C(16, 32, 9), C(57, 31, 10), "M16 32L31 28", "M29 20H41L39 29H31Z", "M9 17L24 18L30 16Q37 10 46 12", "M3 13H12V22H3Z", "M57 31L49 8", "M51 16L61 19L56 21", "M52 12L54 3", "M42 8H50"].join(""),
  Scooter: [C(17, 35, 7), C(55, 35, 7), "M9 27Q9 19 19 19H33Q35 24 33 30H44", "M9 27H26", "M44 30Q46 18 50 11", "M50 13L55 35", "M46 10H54", "M15 18Q24 13 34 16"].join(""),
  Custom: [C(14, 32, 9), C(60, 32, 9), "M14 32L30 30", "M6 23Q14 21 20 25Q26 27 30 23Q36 16 45 18", "M31 30L34 21M39 30L41 21", "M60 32L46 10", "M46 10L44 4L40 5", C(53.5, 16, 2.5)].join(""),
  "50 cm³": [C(16, 32, 9), C(56, 32, 9), "M26 31L48 13", "M26 31L23 18", "M18 17H28", "M9 22H22", C(28, 31, 3), "M28 31L31 36", "M34 27h7v5h-7z", "M56 32L48 12", "M44 11H52"].join(""),
};

export type MotoType = {
  id: MotoTypeId;
  label: string;
  cc: string;
  examples: string;
  /** Icon / border colour. */
  fg: string;
  /** Text colour on `soft` (passes 4.5:1). */
  ink: string;
  /** Tinted background. */
  soft: string;
};

export const TYPES: MotoType[] = [
  { id: "Roadster", label: "Roadster", cc: "125 – 1300 cm³", examples: "Z1000, MT-07, Duke", fg: "#2F5BEA", ink: "#1E40AF", soft: "#E9EFFE" },
  { id: "Sportive", label: "Sportive", cc: "300 – 1300 cm³", examples: "Ninja, R6, Panigale", fg: "#E11D48", ink: "#BE123C", soft: "#FDE9EE" },
  { id: "Trail", label: "Trail", cc: "300 – 1300 cm³", examples: "GS, Ténéré, Africa Twin", fg: "#D97706", ink: "#9A4A06", soft: "#FDF1DE" },
  { id: "Scooter", label: "Scooter", cc: "125 – 560 cm³", examples: "Vespa, TMAX, PCX", fg: "#0D9488", ink: "#0F766E", soft: "#DDF4F0" },
  { id: "Custom", label: "Custom", cc: "470 – 1900 cm³", examples: "Rebel, Vulcan S, Sportster", fg: "#7C3AED", ink: "#6D28D9", soft: "#F0EAFE" },
  { id: "50 cm³", label: "50 cm³", cc: "Mobs & scooters", examples: "103 SP, Kisbee, Zip", fg: "#65A30D", ink: "#4D7C0F", soft: "#EEF6DF" },
];

export const ALL_TYPE = { id: "all" as const, label: "Tous", fg: "#1B1C20", ink: "#1B1C20", soft: "#EEECE6" };

export const typeById = (id: string) => TYPES.find((t) => t.id === id);

/** Selected type tile: glossy tint with a colored glow, like fresh paint. */
export const tileStyle = (t: { fg: string; soft: string }, on: boolean): CSSProperties =>
  on
    ? { borderColor: t.fg, background: `linear-gradient(180deg, #ffffff 0%, ${t.soft} 100%)`, boxShadow: `0 10px 22px -12px ${t.fg}, inset 0 1px 0 #ffffff` }
    : { borderColor: "var(--color-line)", background: "var(--color-card)" };

export type MotoModel = {
  id: string;
  name: string;
  cc: number;
  type: MotoTypeId;
  from: number;
  to: number | null;
};

export type MotoBrand = {
  id: string;
  name: string;
  short: string;
  ini: string;
  models: MotoModel[];
};

const M = (id: string, name: string, cc: number, type: MotoTypeId, from: number, to: number | null = null): MotoModel => ({ id, name, cc, type, from, to });

export const BRANDS: MotoBrand[] = [
  { id: "kawasaki", name: "Kawasaki", short: "Kawasaki", ini: "KA", models: [M("z1000", "Z1000", 1043, "Roadster", 2010, 2020), M("z900", "Z900", 948, "Roadster", 2017), M("z650", "Z650", 649, "Roadster", 2017), M("ninja650", "Ninja 650", 649, "Sportive", 2017), M("zx6r", "Ninja ZX-6R", 636, "Sportive", 2019), M("versys650", "Versys 650", 649, "Trail", 2015), M("vulcans", "Vulcan S", 649, "Custom", 2015)] },
  { id: "yamaha", name: "Yamaha", short: "Yamaha", ini: "YA", models: [M("mt07", "MT-07", 689, "Roadster", 2014), M("mt09", "MT-09", 890, "Roadster", 2021), M("r6", "YZF-R6", 599, "Sportive", 2017, 2020), M("r3", "YZF-R3", 321, "Sportive", 2019), M("tenere", "Ténéré 700", 689, "Trail", 2019), M("tmax", "TMAX 560", 562, "Scooter", 2020), M("xmax", "XMAX 300", 292, "Scooter", 2017), M("nmax", "NMAX 155", 155, "Scooter", 2015), M("bws", "BW's 50", 49, "50 cm³", 2018)] },
  { id: "honda", name: "Honda", short: "Honda", ini: "HO", models: [M("cb650r", "CB650R", 649, "Roadster", 2019), M("cbr600", "CBR600RR", 599, "Sportive", 2013, 2020), M("africa", "Africa Twin", 1084, "Trail", 2020), M("forza", "Forza 350", 330, "Scooter", 2021), M("pcx", "PCX 160", 157, "Scooter", 2021), M("sh125", "SH 125i", 125, "Scooter", 2020), M("rebel", "Rebel 500", 471, "Custom", 2017)] },
  { id: "vespa", name: "Vespa", short: "Vespa", ini: "VE", models: [M("gts", "GTS 300", 278, "Scooter", 2019), M("prima", "Primavera 125", 125, "Scooter", 2014), M("sprint50", "Sprint 50", 50, "50 cm³", 2014)] },
  { id: "bmw", name: "BMW", short: "BMW", ini: "BM", models: [M("f900", "F 900 R", 895, "Roadster", 2020), M("s1000", "S 1000 RR", 999, "Sportive", 2019), M("gs", "R 1250 GS", 1254, "Trail", 2019), M("c400", "C 400 X", 350, "Scooter", 2018)] },
  { id: "ktm", name: "KTM", short: "KTM", ini: "KT", models: [M("duke390", "390 Duke", 373, "Roadster", 2017), M("duke790", "790 Duke", 799, "Roadster", 2018), M("rc390", "RC 390", 373, "Sportive", 2017), M("adv890", "890 Adventure", 889, "Trail", 2021)] },
  { id: "ducati", name: "Ducati", short: "Ducati", ini: "DU", models: [M("monster", "Monster 821", 821, "Roadster", 2014, 2020), M("v4", "Panigale V4", 1103, "Sportive", 2018), M("multi", "Multistrada V4", 1158, "Trail", 2021), M("scrambler", "Scrambler 800", 803, "Custom", 2015)] },
  { id: "suzuki", name: "Suzuki", short: "Suzuki", ini: "SU", models: [M("gsxs", "GSX-S750", 749, "Roadster", 2017), M("gsxr", "GSX-R750", 750, "Sportive", 2011), M("vstrom", "V-Strom 650", 645, "Trail", 2017), M("burgman", "Burgman 400", 400, "Scooter", 2017)] },
  { id: "harley", name: "Harley-Davidson", short: "Harley-D.", ini: "HD", models: [M("sportster", "Sportster S", 1252, "Custom", 2021), M("streetbob", "Street Bob 114", 1868, "Custom", 2021)] },
  { id: "sym", name: "SYM", short: "SYM", ini: "SY", models: [M("jet14", "Jet 14", 125, "Scooter", 2018), M("maxsym", "Maxsym TL 500", 465, "Scooter", 2020), M("orbit", "Orbit III 50", 50, "50 cm³", 2016)] },
  { id: "kymco", name: "Kymco", short: "Kymco", ini: "KY", models: [M("ak550", "AK 550", 550, "Scooter", 2017), M("agility", "Agility 125", 125, "Scooter", 2015), M("agility50", "Agility 50", 50, "50 cm³", 2015)] },
  { id: "peugeot", name: "Peugeot", short: "Peugeot", ini: "PE", models: [M("django", "Django 125", 125, "Scooter", 2014), M("103", "103 SP", 49, "50 cm³", 1980), M("kisbee", "Kisbee 50", 50, "50 cm³", 2018)] },
  { id: "piaggio", name: "Piaggio", short: "Piaggio", ini: "PI", models: [M("mp3", "MP3 500", 493, "Scooter", 2014), M("liberty", "Liberty 125", 125, "Scooter", 2016), M("zip", "Zip 50", 50, "50 cm³", 2000)] },
];

export type ModelWithBrand = MotoModel & { brand: string; brandName: string };

export const ALL_MODELS: ModelWithBrand[] = BRANDS.flatMap((b) => b.models.map((m) => ({ ...m, brand: b.id, brandName: b.name })));

export const modelById = (id: string) => ALL_MODELS.find((m) => m.id === id);
export const brandById = (id: string) => BRANDS.find((b) => b.id === id);

export const brandsForType = (type: string) => BRANDS.filter((b) => type === "all" || b.models.some((m) => m.type === type));
export const modelsFor = (b: MotoBrand, type: string) => b.models.filter((m) => type === "all" || m.type === type);

export const yearsLabel = (m: MotoModel) => `${m.from} – ${m.to ?? "auj."}`;

export const CC_RANGES = [
  { id: "all", label: "Toutes", min: 0, max: 99999 },
  { id: "c50", label: "≤ 50", min: 0, max: 50 },
  { id: "c125", label: "51 – 125", min: 51, max: 125 },
  { id: "c500", label: "126 – 500", min: 126, max: 500 },
  { id: "c900", label: "501 – 900", min: 501, max: 900 },
  { id: "cbig", label: "900 +", min: 901, max: 99999 },
] as const;
