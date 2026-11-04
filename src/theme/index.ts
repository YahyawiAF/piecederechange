export const colors = {
  primary: "#1565C0",
  primaryDark: "#0D47A1",
  primarySoft: "#E3F2FD",
  secondary: "#FFFFFF",
  accent: "#FF6D00",
  accentDark: "#E65100",
  success: "#16A34A",
  successSoft: "#ECFDF5",
  successMuted: "#D1FAE5",
  successDark: "#065F46",
  successBorder: "#A7F3D0",
  danger: "#DC2626",
  dangerSoft: "#FEF2F2",
  warning: "#D97706",
  warningSoft: "#FFFBEB",
  warningMuted: "#FEF3C7",
  warningDark: "#92400E",
  oem: "#4F46E5",
  adaptable: "#475569",
  background: "#F5F7FA",
  surface: "#F8FAFC",
  card: "#FFFFFF",
  dark: "#0F172A",
  text: "#0F172A",
  textMuted: "#64748B",
  border: "#E2E8F0",
  chip: "#E8F0FE",
  star: "#F59E0B",
  headerBlue: "#1565C0",
  whatsapp: "#047857",
  whatsappSoft: "#ECFDF5",
  whatsappBorder: "#A7F3D0",
  callSoft: "#EFF6FF",
  callBorder: "#BFDBFE",
  overlay: "rgba(15, 23, 42, 0.55)",
  white: "#FFFFFF",
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  btn: 14,
  card: 20,
  chip: 20,
  xl: 24,
  full: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
} as const;

export const typography = {
  h1: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: colors.text,
    lineHeight: 30,
  },
  h2: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: colors.text,
  },
  title: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: colors.text,
    lineHeight: 28,
  },
  section: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: colors.text,
  },
  label: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: colors.textMuted,
  },
  body: {
    fontSize: 15,
    fontWeight: "400" as const,
    color: colors.textMuted,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: colors.textMuted,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: colors.primary,
  },
} as const;

export const touch = {
  min: 48,
} as const;

export const layout = {
  maxWidth: 390,
} as const;

export const shadow = {
  card: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  pressed: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cta: {
    shadowColor: "#FF6D00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;

export const CONDITION_BADGE: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  original: { label: "D'ORIGINE", bg: "#1565C0", color: "#FFFFFF" },
  oem: { label: "QUALITÉ OEM", bg: "#4F46E5", color: "#FFFFFF" },
  used: { label: "OCCASION", bg: "#F59E0B", color: "#FFFFFF" },
  aftermarket: { label: "ADAPTABLE", bg: "#475569", color: "#FFFFFF" },
};

export const BRAND_STYLES: Record<
  string,
  { bg: string; text: string; letter: string }
> = {
  Honda: { bg: "#E60012", text: "#FFFFFF", letter: "H" },
  Yamaha: { bg: "#003399", text: "#FFFFFF", letter: "Y" },
  Peugeot: { bg: "#0C2340", text: "#FFFFFF", letter: "P" },
  Renault: { bg: "#FFCC00", text: "#0C2340", letter: "R" },
  BMW: { bg: "#FFFFFF", text: "#111111", letter: "B" },
  SYM: { bg: "#CC0000", text: "#FFFFFF", letter: "S" },
  Piaggio: { bg: "#0066B3", text: "#FFFFFF", letter: "P" },
  Vespa: { bg: "#0050A0", text: "#FFFFFF", letter: "V" },
  Toyota: { bg: "#EB0A1E", text: "#FFFFFF", letter: "T" },
};

export const VEHICLE_PHOTOS: Record<string, string> = {
  all: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=300&q=80",
  scooter:
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=300&q=80",
  motorcycle:
    "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=300&q=80",
  moped:
    "https://images.unsplash.com/photo-1558980394-dbb977039a2e?auto=format&fit=crop&w=300&q=80",
  car: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=300&q=80",
};

export const CATEGORY_THUMBS: Record<string, string> = {
  freinage:
    "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=300&q=80",
  moteur:
    "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=300&q=80",
  electricite:
    "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=300&q=80",
  transmission:
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=300&q=80",
  filtres:
    "https://images.unsplash.com/photo-1635073943204-01b84e31d49e?auto=format&fit=crop&w=300&q=80",
  suspension:
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=300&q=80",
  eclairage:
    "https://images.unsplash.com/photo-1591259358208-71c0b5dfa11a?auto=format&fit=crop&w=300&q=80",
  carrosserie:
    "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=300&q=80",
};

export const FALLBACK_PART_IMAGE =
  "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=600&q=80";
