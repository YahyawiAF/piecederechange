"use client";

import Link from "next/link";
import { bikeQuery, useGarage } from "./garage-provider";
import { MotoIcon } from "./icons";

export function MyBikeLink() {
  const { active } = useGarage();
  return (
    <Link href={`/catalogue?${bikeQuery(active)}`} className="flex items-center gap-2 text-ink2 transition-colors hover:text-pri-ink">
      <MotoIcon type={active.model.type} color={active.type.fg} width={32} strokeWidth={3.2} />
      Ma {active.model.name}
    </Link>
  );
}
