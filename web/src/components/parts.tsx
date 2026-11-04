import Link from "next/link";
import { CONDITIONS, discountOf, dt } from "@/lib/catalog";
import type { Condition, Part } from "@/lib/types";
import { CheckIcon, PartIcon } from "./icons";
import { CompatStrip } from "./compat";

export function CondBadge({ cond, className = "" }: { cond: Condition; className?: string }) {
  const c = CONDITIONS[cond];
  return <span className={`inline-block rounded-[5px] border px-1.5 py-0.5 text-[10.5px] font-bold tracking-wide uppercase ${c.className} ${className}`}>{c.label}</span>;
}

export function StockLabel({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="text-xs font-bold text-sale">Rupture</span>;
  if (stock <= 2) return <span className="text-xs font-bold text-warn">Plus que {stock}</span>;
  return <span className="text-xs font-bold text-ok">● En stock</span>;
}

/** Corner tag on product pictures: discount first, else "Top vente" / "Nouveau". */
export function PromoTag({ part, className = "" }: { part: Pick<Part, "price" | "oldPrice" | "tag">; className?: string }) {
  const off = discountOf(part);
  if (off) return <span className={`disp rounded-md bg-sale px-2 py-1 text-[15px] leading-none text-white shadow-[0_2px_6px_rgb(225_29_72/0.3)] ${className}`}>-{off}%</span>;
  if (part.tag === "best") return <span className={`rounded-md bg-pri px-2 py-1 text-[11px] font-extrabold tracking-wide text-white uppercase ${className}`}>Top vente</span>;
  if (part.tag === "new") return <span className={`rounded-md bg-[#2F5BEA] px-2 py-1 text-[11px] font-extrabold tracking-wide text-white uppercase ${className}`}>Nouveau</span>;
  return null;
}

/** Grid card used on the web catalogue and home sections. */
export function PartCard({ part, fitsLabel, delay = 0 }: { part: Part; fitsLabel?: string; delay?: number }) {
  return (
    <Link href={`/pieces/${part.id}`} className="group lift enter flex flex-col overflow-hidden rounded-[18px] border border-line bg-card" style={{ animationDelay: `${delay}ms` }}>
      <span className="bp relative flex h-44 items-center justify-center">
        <PartIcon icon={part.icon} size={96} strokeWidth={1.4} className="transition-transform duration-300 group-hover:scale-105" />
        <CondBadge cond={part.cond} className="absolute top-2.5 left-2.5" />
        <PromoTag part={part} className="absolute top-2.5 right-2.5" />
        {part.position && <span className="absolute bottom-2.5 left-2.5 rounded-md border border-line bg-card px-2 py-0.5 text-[11px] font-bold text-ink2">{part.position}</span>}
      </span>
      <span className="flex flex-1 flex-col gap-1.5 p-3.5">
        <span className="disp text-base tracking-wide text-pri-ink">{part.maker}</span>
        <span className="text-[14.5px] leading-snug font-semibold">{part.name}</span>
        <span className="font-mono text-xs text-mut">{part.ref}</span>
        {!part.universal && <CompatStrip fit={part} />}
        {fitsLabel && (
          <span className="flex items-center gap-1 text-[12.5px] font-semibold text-ok">
            <CheckIcon size={14} strokeWidth={3} />
            <span className="truncate">{fitsLabel}</span>
          </span>
        )}
        <span className="text-[12.5px] text-mut">
          {part.shop.name} · {part.shop.km}
        </span>
        <span className="mt-auto flex items-baseline justify-between pt-2">
          <span className="flex items-baseline gap-2">
            <span className={`disp text-[28px] ${part.oldPrice ? "text-sale" : ""}`}>{dt(part.price)}</span>
            {part.oldPrice ? <span className="text-[13px] text-mut line-through">{dt(part.oldPrice)}</span> : null}
          </span>
          <StockLabel stock={part.stock} />
        </span>
      </span>
    </Link>
  );
}

/** Compact row used on phones. */
export function PartRow({ part, fitsLabel, delay = 0 }: { part: Part; fitsLabel?: string; delay?: number }) {
  return (
    <Link href={`/pieces/${part.id}`} className="lift enter flex gap-3 rounded-2xl border border-line bg-card p-2.5" style={{ animationDelay: `${delay}ms` }}>
      <span className="bp relative flex size-[72px] shrink-0 items-center justify-center rounded-xl">
        <PartIcon icon={part.icon} size={46} strokeWidth={1.7} />
        {part.position && <span className="absolute bottom-1 left-1 rounded bg-card px-1 text-[10px] font-bold text-ink2">{part.position}</span>}
        <PromoTag part={part} className="absolute -top-1.5 -right-1.5 !px-1.5 !py-0.5 !text-[10px]" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <span className="text-[13.5px] leading-snug font-semibold">{part.name}</span>
        <span className="flex flex-wrap items-center gap-1.5">
          <CondBadge cond={part.cond} />
          <span className="font-mono text-[11px] text-mut">
            {part.maker} · {part.ref}
          </span>
        </span>
        {!part.universal && <CompatStrip fit={part} />}
        {fitsLabel && (
          <span className="flex items-center gap-1 text-[11.5px] font-semibold text-ok">
            <CheckIcon size={13} strokeWidth={3} />
            <span className="truncate">{fitsLabel}</span>
          </span>
        )}
        <span className="text-[11.5px] text-mut">
          {part.shop.name} · {part.shop.km}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end justify-between">
        <span className="flex flex-col items-end">
          <strong className={`disp text-[21px] whitespace-nowrap ${part.oldPrice ? "text-sale" : ""}`}>{dt(part.price)}</strong>
          {part.oldPrice ? <span className="text-[11px] text-mut line-through">{dt(part.oldPrice)}</span> : null}
        </span>
        <StockLabel stock={part.stock} />
      </span>
    </Link>
  );
}
