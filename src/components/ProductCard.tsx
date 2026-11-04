import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import type { Part } from "../types";
import { FALLBACK_PART_IMAGE, colors, radii, shadow } from "../theme";
import { formatTnd } from "../data/catalog";
import { PressScale } from "./ui";

export function ProductCard({
  part,
  onPress,
}: {
  part: Part;
  onPress: () => void;
  isFavorite?: boolean;
  onReserve?: () => void;
  onOpenShop?: () => void;
  onToggleFavorite?: () => void;
}) {
  const inStock = part.status === "in_stock";
  const image = part.images[0] || FALLBACK_PART_IMAGE;
  const vehicle = part.compatibleVehicles[0];
  const years = vehicle
    ? `${vehicle.yearStart}–${vehicle.yearEnd ?? "…"}`
    : null;

  return (
    <PressScale onPress={onPress} style={[styles.card, shadow.card]}>
      <Image source={{ uri: image }} style={styles.photo} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {part.partName}
        </Text>
        <Text style={styles.maker}>{part.makerBrand}</Text>
        <Text style={styles.ref}>
          Réf. {part.oemNumber || part.partNumber || part.id}
        </Text>

        {vehicle ? (
          <Text style={styles.compat} numberOfLines={1}>
            {vehicle.brand} {vehicle.model} {years}
          </Text>
        ) : (
          <Text style={styles.compat}>Compatibilité à confirmer</Text>
        )}
        <Text style={styles.ok}>✓ Compatible</Text>

        <View style={styles.bottom}>
          <Text style={styles.price}>{formatTnd(part.price)}</Text>
          <View style={styles.stockRow}>
            <View
              style={[
                styles.dot,
                { backgroundColor: inStock ? colors.success : colors.warning },
              ]}
            />
            <Text style={[styles.stock, !inStock && { color: colors.warningDark }]}>
              {inStock ? "En stock" : part.status === "out_of_stock" ? "Rupture" : "Stock limité"}
            </Text>
          </View>
        </View>

        <Text style={styles.details}>Voir le détail →</Text>
      </View>
    </PressScale>
  );
}

export function EmptyResults({
  onReset,
  hints,
}: {
  onReset: () => void;
  onAi?: () => void;
  hints?: string[];
}) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>Aucune pièce compatible</Text>
      <Text style={styles.emptyHint}>Vous pouvez essayer :</Text>
      {(hints && hints.length > 0 ? hints : ["Élargir la marque", "Retirer l’année"]).map(
        (h) => (
          <Text key={h} style={styles.try}>
            • {h}
          </Text>
        ),
      )}
      <PressScale onPress={onReset} style={styles.emptyReset}>
        <Text style={styles.emptyResetTxt}>Effacer les filtres</Text>
      </PressScale>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 12,
    flexDirection: "row",
  },
  photo: { width: 108, minHeight: 148, backgroundColor: colors.surface },
  body: { flex: 1, padding: 14, gap: 3 },
  name: { fontSize: 16, fontWeight: "800", color: colors.text, lineHeight: 21 },
  maker: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  ref: { fontSize: 13, color: colors.text, fontWeight: "600" },
  compat: { fontSize: 13, color: colors.text, marginTop: 4 },
  ok: { fontSize: 13, color: colors.successDark, fontWeight: "700" },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  price: { fontSize: 18, fontWeight: "800", color: colors.text },
  stockRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  stock: { fontSize: 13, fontWeight: "700", color: colors.successDark },
  details: { marginTop: 8, color: colors.primary, fontWeight: "700", fontSize: 14 },
  empty: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  emptyTitle: { fontWeight: "800", fontSize: 18, color: colors.text },
  emptyHint: { color: colors.textMuted, fontSize: 14 },
  try: { color: colors.text, fontSize: 14 },
  emptyReset: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  emptyResetTxt: { color: colors.white, fontWeight: "700" },
});
