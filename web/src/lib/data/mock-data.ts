// Demo catalogue used when no ERP is configured (ERP_ORG_ID empty).
// Prices, references and compatibilities are sample content.
import type { CategoryId, Condition, Order, Part, PartIconId, Shop } from "../types";

export const SHOPS: Shop[] = [
  { id: "mp", ini: "MP", name: "Moto Pièces Express", city: "Ariana", km: "1,8 km", rating: "4,9", reviews: 88, hours: "jusqu'à 19:00", tag: "Japonaises · roadsters & sportives", phone: "+216 70 000 001", whatsapp: "+21670000001", address: "Av. Habib Bourguiba, Ariana", delivery: "Retrait 1 h" },
  { id: "em", ini: "EM", name: "El Menzah Scooters & Motos", city: "Tunis", km: "2,3 km", rating: "4,9", reviews: 112, hours: "jusqu'à 20:00", tag: "Vespa, Piaggio, Honda scooters", phone: "+216 70 000 002", whatsapp: "+21670000002", address: "El Menzah 5, Tunis", delivery: "Livraison 24 h" },
  { id: "sm", ini: "SM", name: "Sousse Moto Parts", city: "Sousse", km: "4,2 km", rating: "4,8", reviews: 62, hours: "jusqu'à 18:30", tag: "Grosses cylindrées & trails", phone: "+216 70 000 003", whatsapp: "+21670000003", address: "Route de la Corniche, Sousse", delivery: "Livraison 24 h" },
  { id: "cb", ini: "CB", name: "Cap Bon Moto", city: "Nabeul", km: "5,1 km", rating: "4,7", reviews: 41, hours: "jusqu'à 19:00", tag: "50 cm³ & mobylettes", phone: "+216 70 000 004", whatsapp: "+21670000004", address: "Av. Farhat Hached, Nabeul", delivery: "Retrait 1 h" },
];

const shop = (id: string) => SHOPS.find((s) => s.id === id)!;

let seq = 0;
const P = (
  name: string,
  maker: string,
  ref: string,
  cond: Condition,
  price: number,
  category: CategoryId,
  icon: PartIconId,
  shopId: string,
  fits: string[],
  extra: Partial<Part> = {},
): Part => ({
  id: `p${++seq}`,
  name,
  maker,
  ref,
  oem: null,
  cond,
  price,
  oldPrice: null,
  stock: 9,
  position: null,
  category,
  icon,
  image: null,
  fits,
  description: null,
  specs: [],
  shop: shop(shopId),
  ...extra,
});

const NAKED_KAWA = ["z1000", "z900", "z650", "ninja650", "versys650", "vulcans"];
const BIG_EURO = ["gs", "f900", "s1000", "duke790", "adv890", "multi", "monster", "v4", "scrambler", "duke390", "rc390"];
const SMALL_SCOOT = ["pcx", "sh125", "forza", "nmax", "jet14", "agility", "django"];
const MAXI_SCOOT = ["tmax", "xmax", "ak550", "maxsym", "c400", "burgman"];
const VESPA = ["gts", "prima", "liberty", "mp3"];

export const PARTS: Part[] = [
  // Freinage
  P("Plaquettes avant EBC FA252HH frittées", "EBC", "FA252HH", "aftermarket", 145, "freinage", "pads", "em", ["z1000", "z900", "zx6r", "versys650"], {
    oem: "43082-0122", position: "Avant", description: "Plaquettes frittées HH pour un freinage puissant route et piste. Il en faut 2 jeux pour un double disque.",
    tag: "best", specs: [{ label: "Position", value: "Avant (gauche ou droite)" }, { label: "Composé", value: "Fritté HH, route & piste" }, { label: "Quantité", value: "1 jeu = 1 étrier" }, { label: "Garantie", value: "1 an" }],
  }),
  P("Plaquettes avant Kawasaki origine", "Kawasaki", "43082-0122", "original", 210, "freinage", "pads", "mp", ["z1000", "z900"], { position: "Avant", stock: 1 }),
  P("Plaquettes Brembo 07KA23SA Sinter", "Brembo", "07KA23SA", "aftermarket", 189, "freinage", "pads", "sm", ["z1000", "z900", "z650", "ninja650"], { position: "Avant" }),
  P("Plaquettes arrière Galfer FD329", "Galfer", "FD329G1375", "aftermarket", 98, "freinage", "pads", "mp", NAKED_KAWA, { position: "Arrière" }),
  P("Disque avant Brembo Serie Oro 310 mm", "Brembo", "78B40870", "aftermarket", 520, "freinage", "disc", "em", ["z1000", "z900"], { position: "Avant" }),
  P("Disque avant Galfer Wave 300 mm", "Galfer", "DF418CW", "aftermarket", 410, "freinage", "disc", "sm", ["mt07", "mt09", "tenere", "r3"], { position: "Avant", oldPrice: 489, stock: 4 }),
  P("Étrier avant Tokico 4 pistons", "Tokico", "43080-0141", "used", 380, "freinage", "caliper", "sm", ["z1000"], { position: "Avant", stock: 1 }),
  P("Plaquettes avant Brembo 07YA49SA", "Brembo", "07YA49SA", "aftermarket", 175, "freinage", "pads", "mp", ["mt07", "mt09", "tenere", "tmax", "r3"], { position: "Avant" }),
  P("Plaquettes Brembo carbone céramique", "Brembo", "07BB2635", "aftermarket", 98, "freinage", "pads", "em", [], { position: "Avant", fitBrands: ["vespa", "piaggio"] }),
  P("Plaquettes Galfer scooter maxi", "Galfer", "FD283G1054", "aftermarket", 132, "freinage", "pads", "cb", MAXI_SCOOT, { position: "Avant" }),
  P("Plaquettes EBC SFA415HH", "EBC", "SFA415HH", "aftermarket", 64, "freinage", "pads", "mp", SMALL_SCOOT, { position: "Avant" }),
  P("Mâchoires de frein arrière 50 cm³", "Newfren", "GF1112", "aftermarket", 18, "freinage", "pads", "cb", [], { position: "Arrière", fitTypes: ["50 cm³"] }),
  P("Plaquettes EBC FA630HH sport", "EBC", "FA630HH", "aftermarket", 150, "freinage", "pads", "sm", BIG_EURO, { position: "Avant" }),
  P("Plaquettes Lyndall Z-Plus", "Lyndall", "7258-Z+", "aftermarket", 240, "freinage", "pads", "sm", ["sportster", "streetbob"], { position: "Avant" }),
  P("Plaquettes Honda origine", "Honda", "06455-MJE-D01", "original", 190, "freinage", "pads", "mp", ["cb650r", "cbr600", "africa", "rebel"], { position: "Avant" }),
  P("Plaquettes Suzuki d’occasion, 60 %", "Suzuki", "59100-08830", "used", 70, "freinage", "pads", "cb", ["gsxs", "gsxr", "vstrom"], { position: "Avant" }),
  P("Leviers frein & embrayage CNC réglables", "Puig", "PUIG-LV-Z", "aftermarket", 95, "freinage", "lever", "mp", ["z1000", "z900", "z650", "ninja650", "mt07", "mt09"], { oldPrice: 129, stock: 3 }),
  // Kit chaîne
  P("Kit chaîne DID 525 ZVM-X 15/42", "DID", "DID-525ZVMX-1542", "aftermarket", 420, "chaine", "chain", "mp", ["z1000"], { stock: 2, tag: "best" }),
  P("Kit chaîne DID 520 VX3 renforcé", "DID", "DID-520VX3", "aftermarket", 289, "chaine", "chain", "sm", ["mt07", "z650", "ninja650", "duke390", "rc390", "cb650r"], { oldPrice: 359, stock: 5 }),
  P("Kit chaîne Regina 525 ZRP", "Regina", "REG-525ZRP", "aftermarket", 395, "chaine", "chain", "sm", ["gs", "africa", "tenere", "vstrom", "adv890"]),
  // Transmission scooter / moteur
  P("Courroie de transmission Piaggio", "Piaggio", "1A000415", "original", 135, "moteur", "belt", "em", ["gts", "mp3"]),
  P("Galets de variateur Malossi HT", "Malossi", "MAL-669357", "aftermarket", 89, "moteur", "rollers", "mp", ["gts", "tmax", "xmax", "liberty"], { tag: "new" }),
  P("Kit cylindre 50 cm³ fonte", "Airsal", "P103-CYL50", "aftermarket", 165, "moteur", "piston", "cb", ["103", "kisbee", "zip"]),
  P("Courroie de variateur 50 cm³", "Dayco", "KB50-BELT", "used", 25, "moteur", "belt", "cb", [], { fitTypes: ["50 cm³"] }),
  // Filtration
  P("Filtre à huile Kawasaki origine", "Kawasaki", "16097-0008", "original", 38, "filtration", "filter", "mp", NAKED_KAWA),
  P("Filtre à huile Piaggio origine", "Piaggio", "82635R", "original", 24, "filtration", "filter", "cb", [...VESPA, "zip"], { stock: 3 }),
  P("Filtre à huile Yamaha origine", "Yamaha", "5GH-13440-61", "original", 32, "filtration", "filter", "sm", ["mt07", "mt09", "tenere", "r6", "r3", "tmax", "xmax"]),
  P("Filtre à air BMW origine", "BMW", "13718554918", "original", 118, "filtration", "filter", "sm", ["gs"]),
  P("Huile 4T 10W-40 synthèse · 4 L", "Motul", "MOT-5100-4L", "aftermarket", 119, "filtration", "oil", "em", [], { oldPrice: 140, fitTypes: ["Roadster", "Sportive", "Trail", "Custom"] }),
  // Allumage / électricité
  P("Bougie NGK Iridium CR9EIA-9", "NGK", "CR9EIA-9", "oem", 42, "allumage", "plug", "sm", ["z1000", "z900", "z650", "ninja650", "mt07"], { tag: "best" }),
  P("Bougie NGK BR7HS", "NGK", "BR7HS", "oem", 12, "allumage", "plug", "cb", ["agility", "jet14", "django", "liberty"], { fitTypes: ["50 cm³"] }),
  P("Batterie Yuasa YTZ10S gel", "Yuasa", "YTZ10S", "oem", 245, "allumage", "battery", "mp", ["z1000", "rebel", "cbr600", "r6", "mt09", "duke790", "gsxs", "monster", "vulcans"], { oldPrice: 299, stock: 2 }),
  // Suspension / pneus / carénage
  P("Amortisseur arrière YSS réglable", "YSS", "YSS-MZ456", "aftermarket", 1290, "suspension", "shock", "sm", ["tenere", "mt07"], { oldPrice: 1490, stock: 1 }),
  P("Pneu arrière City Grip 130/70-13", "Michelin", "CG2-130-70-13", "aftermarket", 210, "pneus", "tyre", "em", ["pcx", "sh125", "nmax", "agility"], { position: "Arrière" }),
  P("Pneu avant Road 6 120/70 ZR17", "Michelin", "RD6-120-70-17", "aftermarket", 390, "pneus", "tyre", "sm", ["z1000", "z900", "z650", "mt09", "cb650r", "f900", "gsxs", "duke790", "monster", "ninja650", "r6"], { position: "Avant" }),
  P("Bulle fumée haute protection", "MRA", "MRA-4025", "aftermarket", 260, "carenage", "fairing", "mp", ["ninja650", "zx6r", "r6", "cbr600"]),
  // Casques (universal)
  P("Casque intégral Shark Ridill 2", "Shark", "HE1102", "aftermarket", 690, "casques", "helmet", "mp", [], { universal: true, oldPrice: 790, stock: 6, specs: [{ label: "Type", value: "Intégral" }, { label: "Tailles", value: "XS → XXL" }, { label: "Homologation", value: "ECE 22.06" }, { label: "Poids", value: "1 450 g" }] }),
  P("Casque modulable LS2 Valiant II", "LS2", "FF900", "aftermarket", 1150, "casques", "helmet", "sm", [], { universal: true, tag: "new", stock: 3, specs: [{ label: "Type", value: "Modulable 180°" }, { label: "Tailles", value: "S → XXL" }, { label: "Homologation", value: "ECE 22.06" }] }),
  P("Casque jet Vespa Visor 4.0", "Vespa", "606839M", "original", 420, "casques", "helmet", "em", [], { universal: true, tag: "best", stock: 8, specs: [{ label: "Type", value: "Jet avec visière" }, { label: "Tailles", value: "XS → XL" }] }),
  P("Casque cross Airoh Twist 3", "Airoh", "TW3-22", "aftermarket", 540, "casques", "helmet", "sm", [], { universal: true, stock: 4 }),
  // Équipement pilote (universal)
  P("Gants été Alpinestars SMX-1 Air v2", "Alpinestars", "3570518", "aftermarket", 189, "equipement", "glove", "mp", [], { universal: true, tag: "best", specs: [{ label: "Saison", value: "Été, ventilés" }, { label: "Tailles", value: "S → XXL" }, { label: "Norme", value: "EN 13594" }] }),
  P("Gants hiver Dainese Tempest 2 D-Dry", "Dainese", "1815946", "aftermarket", 259, "equipement", "glove", "sm", [], { universal: true, stock: 5 }),
  P("Blouson textile Ixon Fresh, protections CE", "Ixon", "IX-FRESH", "aftermarket", 449, "equipement", "glove", "em", [], { universal: true, oldPrice: 529, stock: 4 }),
  P("Bottes route TCX Street 3 WP", "TCX", "9573W", "aftermarket", 520, "equipement", "glove", "sm", [], { universal: true, tag: "new", stock: 2 }),
  // Accessoires
  P("Antivol U Abus Granit X-Plus 540", "Abus", "540-160HB", "aftermarket", 359, "accessoires", "lock", "mp", [], { universal: true, tag: "best", specs: [{ label: "Niveau", value: "15 / 15 (SRA)" }, { label: "Longueur", value: "230 mm" }] }),
  P("Bloque-disque alarme Xena XX6", "Xena", "XX6-YB", "aftermarket", 210, "accessoires", "lock", "cb", [], { universal: true, oldPrice: 249 }),
  P("Top case Givi E43 Monolock 43 L", "Givi", "E43NML", "aftermarket", 389, "accessoires", "topcase", "em", [], { universal: true, specs: [{ label: "Volume", value: "43 L, 1 casque intégral" }, { label: "Fixation", value: "Monolock, platine incluse" }] }),
  P("Support smartphone Quad Lock moto", "Quad Lock", "QLM-HBR", "aftermarket", 249, "accessoires", "phone", "mp", [], { universal: true, tag: "new" }),
  P("Intercom Cardo Spirit HD", "Cardo", "SPRT0101", "aftermarket", 499, "accessoires", "phone", "sm", [], { universal: true, oldPrice: 569, stock: 3 }),
  P("Housse moto étanche, taille L", "Bagster", "HOUSSE-L", "aftermarket", 79, "accessoires", "topcase", "cb", [], { universal: true }),
  P("Platine top case Givi pour Vespa GTS", "Givi", "SR5612", "aftermarket", 165, "accessoires", "topcase", "em", ["gts"]),
];

const line = (partId: string, qty = 1) => {
  const p = PARTS.find((x) => x.id === partId)!;
  return { partId, name: p.name, ref: p.ref, icon: p.icon, qty, unitPrice: p.price };
};
const byName = (name: string) => PARTS.find((p) => p.name.startsWith(name))!.id;

export const ORDERS: Order[] = [
  {
    code: "RES-2026-104", createdAt: "2026-11-04T10:12:00+01:00", status: "reserved", mode: "express", bike: "Kawasaki Z1000 · 2016",
    lines: [line(byName("Casque intégral Shark")), line(byName("Gants été Alpinestars"))], deliveryFee: 8, fitting: false, shop: shop("mp"),
    address: "Cité Ennasr 2, Ariana", events: [{ status: "reserved", at: "2026-11-04T10:12:00+01:00" }],
    note: "En attente de confirmation du magasin (habituellement moins de 15 min).",
  },
  {
    code: "RES-2026-094", createdAt: "2026-11-03T17:40:00+01:00", status: "preparing", mode: "express", bike: "Vespa GTS 300 · 2021",
    lines: [line(byName("Courroie de transmission Piaggio")), line(byName("Galets de variateur Malossi"))], deliveryFee: 8, fitting: false, shop: shop("em"),
    address: "El Menzah 5, Tunis", events: [{ status: "reserved", at: "2026-11-03T17:40:00+01:00" }, { status: "confirmed", at: "2026-11-03T17:52:00+01:00" }, { status: "preparing", at: "2026-11-04T09:05:00+01:00" }],
    note: "Livraison prévue aujourd'hui entre 14 h et 18 h. Le livreur vous appelle avant de passer.",
  },
  {
    code: "RES-2026-081", createdAt: "2026-11-03T11:20:00+01:00", status: "ready", mode: "pickup", bike: "Kawasaki Z1000 · 2016",
    lines: [line(byName("Plaquettes avant EBC FA252HH"), 2)], deliveryFee: 0, fitting: true, shop: shop("mp"),
    events: [{ status: "reserved", at: "2026-11-03T11:20:00+01:00" }, { status: "confirmed", at: "2026-11-03T11:31:00+01:00" }, { status: "preparing", at: "2026-11-03T15:00:00+01:00" }, { status: "ready", at: "2026-11-04T08:45:00+01:00" }],
    note: "Prête au retrait jusqu'au 6 nov. Montage possible sur place, environ 45 min.",
  },
  {
    code: "RES-2026-072", createdAt: "2026-10-21T09:15:00+01:00", status: "done", mode: "pickup", bike: "Kawasaki Z1000 · 2016",
    lines: [line(byName("Kit chaîne DID 525 ZVM-X")), line(byName("Bougie NGK Iridium"), 4)], deliveryFee: 0, fitting: true, shop: shop("mp"),
    events: [{ status: "reserved", at: "2026-10-21T09:15:00+01:00" }, { status: "confirmed", at: "2026-10-21T09:24:00+01:00" }, { status: "preparing", at: "2026-10-21T10:00:00+01:00" }, { status: "ready", at: "2026-10-21T16:30:00+01:00" }, { status: "done", at: "2026-10-22T11:05:00+01:00" }],
    note: "Récupérée et montée en atelier. Garantie 1 an jusqu'au 22 oct. 2027.",
  },
  {
    code: "RES-2026-063", createdAt: "2026-10-08T18:02:00+01:00", status: "done", mode: "express", bike: "Vespa GTS 300 · 2021",
    lines: [line(byName("Filtre à huile Piaggio")), line(byName("Antivol U Abus"))], deliveryFee: 8, fitting: false, shop: shop("em"),
    address: "El Menzah 5, Tunis",
    events: [{ status: "reserved", at: "2026-10-08T18:02:00+01:00" }, { status: "confirmed", at: "2026-10-08T18:10:00+01:00" }, { status: "preparing", at: "2026-10-09T09:00:00+01:00" }, { status: "ready", at: "2026-10-09T11:00:00+01:00" }, { status: "done", at: "2026-10-09T15:40:00+01:00" }],
    note: "Livrée le 9 oct. à 15:40.",
  },
  {
    code: "RES-2026-051", createdAt: "2026-09-27T14:30:00+01:00", status: "cancelled", mode: "pickup", bike: "Kawasaki Z1000 · 2016",
    lines: [line(byName("Batterie Yuasa YTZ10S"))], deliveryFee: 0, fitting: false, shop: shop("sm"),
    events: [{ status: "reserved", at: "2026-09-27T14:30:00+01:00" }, { status: "cancelled", at: "2026-09-27T16:00:00+01:00" }],
    note: "Annulée par vous. Rien n'a été facturé.",
  },
];
