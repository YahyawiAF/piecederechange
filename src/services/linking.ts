import { Linking, Alert } from "react-native";
import type { Part } from "../types";

export async function openCall(phone: string | null | undefined) {
  if (!phone) {
    Alert.alert("Appel", "Numéro du magasin non renseigné.");
    return;
  }
  const url = `tel:${phone.replace(/\s/g, "")}`;
  await Linking.openURL(url);
}

export async function openWhatsApp(
  whatsapp: string | null | undefined,
  message: string,
) {
  const digits = (whatsapp ?? "").replace(/\D/g, "");
  if (digits.length < 8) {
    Alert.alert("WhatsApp", "Numéro WhatsApp manquant.");
    return;
  }
  const url = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  await Linking.openURL(url);
}

export function partInterestMessage(part: Part): string {
  return `Bonjour, je suis intéressé par "${part.partName}" à ${part.price} TND sur PiècesExpress TN. Est-elle disponible ?`;
}

export function orderWhatsAppMessage(code: string, partName: string): string {
  return `Bonjour, je vous contacte au sujet de ma réservation ${code} (${partName}).`;
}
