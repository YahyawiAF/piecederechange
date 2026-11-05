"use client";

import { useState } from "react";
import { ChevronRight } from "./icons";

/** "Voir les 11 catégories" button shown on phones under a collapsed grid. */
export function MoreButton({ open, total, onToggle, label }: { open: boolean; total: number; onToggle: () => void; label: string }) {
  return (
    <button onClick={onToggle} aria-expanded={open} className="tap mt-2 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-line bg-card text-[13.5px] font-bold sm:hidden">
      {open ? "Réduire" : `Voir les ${total} ${label}`}
      <ChevronRight size={16} className={`transition-transform duration-200 ${open ? "-rotate-90" : "rotate-90"}`} />
    </button>
  );
}

/** On phones, shows only the first `visible` grid items until the visitor expands the list. Larger screens show everything. */
export function MobileMore({ items, visible = 4, className, label }: { items: React.ReactNode[]; visible?: number; className: string; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className={className}>
        {items.map((item, i) => (
          <div key={i} className={i >= visible ? (open ? "enter" : "max-sm:hidden") : ""} style={open && i >= visible ? { animationDelay: `${(i - visible) * 25}ms` } : undefined}>
            {item}
          </div>
        ))}
      </div>
      {items.length > visible && <MoreButton open={open} total={items.length} onToggle={() => setOpen(!open)} label={label} />}
    </>
  );
}
