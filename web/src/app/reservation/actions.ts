"use server";

import { redirect } from "next/navigation";
import { createReservation, getPart } from "@/lib/data";

export type ReserveState = { error?: string; fieldErrors?: Partial<Record<"customerName" | "phone" | "address", string>> };

export async function reserve(partId: string, _prev: ReserveState, form: FormData): Promise<ReserveState> {
  const customerName = String(form.get("customerName") ?? "").trim();
  const phone = String(form.get("phone") ?? "").replace(/\s/g, "");
  const mode = form.get("mode") === "express" ? "express" : "pickup";
  const address = String(form.get("address") ?? "").trim();
  const quantity = Math.min(9, Math.max(1, Number(form.get("quantity")) || 1));
  const fitting = form.get("fitting") === "on";
  const bikeLabel = String(form.get("bikeLabel") ?? "").slice(0, 80) || undefined;

  const fieldErrors: ReserveState["fieldErrors"] = {};
  if (customerName.length < 2) fieldErrors.customerName = "Indiquez votre nom.";
  if (!/^\d{8}$/.test(phone)) fieldErrors.phone = "Numéro à 8 chiffres, ex. 22 123 456.";
  if (mode === "express" && address.length < 5) fieldErrors.address = "Indiquez l'adresse de livraison.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const part = await getPart(partId);
  if (!part) return { error: "Cette pièce n'est plus disponible." };

  let code: string;
  try {
    ({ code } = await createReservation({ partId, quantity, customerName, phone: `+216${phone}`, mode, address, fitting, bikeLabel }));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "La réservation a échoué. Réessayez." };
  }
  redirect(`/commandes?nouvelle=${encodeURIComponent(code)}`);
}
