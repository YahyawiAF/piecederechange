import { SILHOUETTES, type MotoTypeId } from "@/lib/moto";
import { PART_ICONS } from "@/lib/catalog";
import type { PartIconId } from "@/lib/types";

type SvgProps = { className?: string; size?: number; strokeWidth?: number };

/** Motorcycle-type silhouette (72×44). */
export function MotoIcon({ type, color, width = 62, strokeWidth = 2.6, className }: { type: MotoTypeId | "all"; color: string; width?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg viewBox="0 0 72 44" width={width} height={(width * 44) / 72} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={SILHOUETTES[type]} />
    </svg>
  );
}

/** Part drawing (48×48). */
export function PartIcon({ icon, size = 48, strokeWidth = 1.6, color = "url(#pe-metal)", className }: { icon: PartIconId; size?: number; strokeWidth?: number; color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={PART_ICONS[icon]} />
    </svg>
  );
}

function make(d: string, defaults: { sw?: number; fill?: boolean } = {}) {
  return function Icon({ className, size = 22, strokeWidth }: SvgProps) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill={defaults.fill ? "currentColor" : "none"} stroke={defaults.fill ? "none" : "currentColor"} strokeWidth={strokeWidth ?? defaults.sw ?? 2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
        <path d={d} />
      </svg>
    );
  };
}

export const SearchIcon = make("M11 17.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM16 16l4.5 4.5");
export const ScanIcon = make("M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z");
export const PinIcon = make("M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z");
export const BellIcon = make("M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0", { sw: 1.9 });
export const HomeIcon = make("M4 11l8-6.5 8 6.5V20h-5.5v-5h-5v5H4z");
export const GridIcon = make("M5.5 4h3.5A1.5 1.5 0 0 1 10.5 5.5V9A1.5 1.5 0 0 1 9 10.5H5.5A1.5 1.5 0 0 1 4 9V5.5A1.5 1.5 0 0 1 5.5 4zM15 4h3.5A1.5 1.5 0 0 1 20 5.5V9a1.5 1.5 0 0 1-1.5 1.5H15A1.5 1.5 0 0 1 13.5 9V5.5A1.5 1.5 0 0 1 15 4zM5.5 13.5H9a1.5 1.5 0 0 1 1.5 1.5v3.5A1.5 1.5 0 0 1 9 20H5.5A1.5 1.5 0 0 1 4 18.5V15a1.5 1.5 0 0 1 1.5-1.5zM15 13.5h3.5A1.5 1.5 0 0 1 20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15a1.5 1.5 0 0 1-1.5-1.5V15a1.5 1.5 0 0 1 1.5-1.5z", { sw: 1.9 });
export const BagIcon = make("M5 7h14l-1.2 12.5H6.2zM9 7a3 3 0 0 1 6 0", { sw: 1.9 });
export const UserIcon = make("M12 12.3a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6zM4.5 20c1.3-3.6 4.2-5.4 7.5-5.4s6.2 1.8 7.5 5.4", { sw: 1.9 });
export const ChevronRight = make("M9 6l6 6-6 6", { sw: 2.2 });
export const ChevronLeft = make("M15 5l-7 7 7 7", { sw: 2.2 });
export const ArrowRight = make("M5 12h14M13 6l6 6-6 6", { sw: 2.4 });
export const CheckIcon = make("M5 12.5l4.5 4.5L19 7.5", { sw: 2.6 });
export const CloseIcon = make("M6 6l12 12M18 6L6 18", { sw: 2.2 });
export const PlusIcon = make("M12 5v14M5 12h14", { sw: 2.2 });
export const FilterIcon = make("M4 7h10M18 7h2M4 17h4M12 17h8M16 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM10 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", { sw: 2.1 });
export const HeartIcon = make("M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.3 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z", { sw: 1.9 });
export const PhoneIcon = make("M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z", { sw: 1.9 });
export const RouteIcon = make("M3 11l18-8-8 18-2-8z", { sw: 1.9 });
export const ChatIcon = make("M4 20l1.3-4A8.5 8.5 0 1 1 8.4 19zM9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z", { sw: 1.8 });
export const WrenchIcon = make("M14.5 6.5a4 4 0 0 0-5 5L4 17l3 3 5.5-5.5a4 4 0 0 0 5-5L15 12l-3-3z", { sw: 1.8 });
export const InfoIcon = make("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01");
export const TagIcon = make("M3 11.5V5a2 2 0 0 1 2-2h6.5L21 12.5 12.5 21zM8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z", { sw: 1.8 });
export const BarcodeIcon = make("M4 7V5h3M17 5h3v2M20 17v2h-3M7 19H4v-2M8 9v6M11 9v6M14 9v6M17 9v6", { sw: 1.8 });
export const SortIcon = make("M7 5v14M4 16l3 3 3-3M17 19V5M14 8l3-3 3 3", { sw: 2.1 });
export const GearIcon = make("M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1", { sw: 2.2 });
export const StarIcon = make("M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z", { fill: true });
export const BoxIcon = make("M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10", { sw: 1.8 });
export const ChartIcon = make("M4 20V10M10 20V4M16 20v-7M22 20H2", { sw: 2 });
