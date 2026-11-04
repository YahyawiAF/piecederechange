import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useApp } from "../context/AppContext";
import { useShop } from "../context/ShopContext";
import { Badge, Button, PressScale } from "../components/ui";
import { openCall, openWhatsApp } from "../services/linking";
import { formatTnd } from "../data/catalog";
import {
  FALLBACK_PART_IMAGE,
  colors,
  radii,
  shadow,
  space,
  typography,
} from "../theme";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Product">;

export function ProductScreen({ navigation, route }: Props) {
  const { isQuoted, addToQuote, removeFromQuote } = useApp();
  const { getProduct } = useShop();
  const part = getProduct(route.params.listingId);
  const [openSpecs, setOpenSpecs] = useState(true);

  if (!part) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Pièce introuvable</Text>
        <Button label="Retour" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const quoted = isQuoted(part.id);
  const image = part.images[0] || FALLBACK_PART_IMAGE;
  const inStock = part.status === "in_stock";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <PressScale onPress={() => navigation.goBack()} style={styles.icon}>
          <Text style={styles.iconTxt}>←</Text>
        </PressScale>
        <Text style={styles.topTitle} numberOfLines={1}>
          Fiche pièce
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Image source={{ uri: image }} style={styles.hero} />

        <View style={styles.pad}>
          <Text style={styles.maker}>{part.makerBrand}</Text>
          <Text style={styles.name}>{part.partName}</Text>
          <Text style={styles.ref}>
            Réf. OEM {part.oemNumber || "—"}
          </Text>
          {part.partNumber ? (
            <Text style={styles.refMuted}>Réf. fabricant {part.partNumber}</Text>
          ) : null}

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatTnd(part.price)}</Text>
            <Badge
              label={inStock ? "En stock" : part.status === "out_of_stock" ? "Rupture" : "Stock limité"}
              variant={inStock ? "success" : "warning"}
            />
          </View>

          {part.description ? (
            <Text style={styles.desc}>{part.description}</Text>
          ) : null}

          <Text style={styles.h2}>Véhicules compatibles</Text>
          {part.compatibleVehicles.length === 0 ? (
            <Text style={styles.muted}>À confirmer auprès du fournisseur.</Text>
          ) : (
            part.compatibleVehicles.map((v) => (
              <PressScale
                key={v.id}
                onPress={() =>
                  navigation.navigate("Main", {
                    screen: "Home",
                    params: { brand: v.brand, model: v.model },
                  })
                }
                style={styles.compat}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.compatBrand}>{v.brand}</Text>
                  <Text style={styles.compatLine}>
                    → {v.model} · {v.yearStart}–{v.yearEnd ?? "…"}
                  </Text>
                  <Text style={styles.compatLine}>→ {v.engine}</Text>
                </View>
                <Text style={styles.link}>Pièces ›</Text>
              </PressScale>
            ))
          )}

          <PressScale onPress={() => setOpenSpecs((v) => !v)} style={styles.specHead}>
            <Text style={styles.h2}>Caractéristiques</Text>
            <Text style={styles.link}>{openSpecs ? "Masquer" : "Afficher"}</Text>
          </PressScale>
          {openSpecs
            ? part.specs.map((s) => (
                <View key={s.label} style={styles.specRow}>
                  <Text style={styles.specK}>{s.label}</Text>
                  <Text style={styles.specV}>{s.value}</Text>
                </View>
              ))
            : null}

          <Text style={styles.h2}>Références</Text>
          <View style={styles.specRow}>
            <Text style={styles.specK}>OEM</Text>
            <Text style={styles.specV}>{part.oemNumber || "—"}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specK}>Fabricant</Text>
            <Text style={styles.specV}>{part.partNumber || "—"}</Text>
          </View>
          {(part.altReferences ?? []).map((r) => (
            <View key={r} style={styles.specRow}>
              <Text style={styles.specK}>Alternative</Text>
              <Text style={styles.specV}>{r}</Text>
            </View>
          ))}

          <PressScale
            onPress={() => navigation.navigate("Store", { storeId: part.shopId })}
            style={styles.shop}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.shopKicker}>Fournisseur</Text>
              <Text style={styles.shopName}>{part.shop.name}</Text>
              <Text style={styles.muted}>
                {part.shop.city} · {part.shop.openingHours}
              </Text>
            </View>
            <Text style={styles.link}>Stock ›</Text>
          </PressScale>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PressScale
          onPress={() =>
            quoted ? void removeFromQuote(part.id) : void addToQuote(part.id)
          }
          style={[styles.quote, quoted && styles.quoteOn]}
        >
          <Text style={[styles.quoteTxt, quoted && { color: colors.white }]}>
            {quoted ? "Dans le devis" : "Ajouter au devis"}
          </Text>
        </PressScale>
        <PressScale
          onPress={() =>
            void openWhatsApp(
              part.shop.whatsapp,
              `Bonjour, demande de disponibilité : ${part.partName} (${part.oemNumber ?? part.id})`,
            )
          }
          style={styles.ghost}
        >
          <Text style={styles.ghostTxt}>Dispo</Text>
        </PressScale>
        <PressScale
          onPress={() => void openCall(part.shop.phone)}
          style={[styles.contact, shadow.cta]}
        >
          <Text style={styles.contactTxt}>Contacter</Text>
        </PressScale>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  missing: { padding: 24, fontWeight: "700" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
    color: colors.text,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTxt: { fontSize: 18, fontWeight: "700", color: colors.text },
  body: { paddingBottom: 24 },
  hero: { width: "100%", height: 240, backgroundColor: colors.surface },
  pad: { padding: space.md },
  maker: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  name: { ...typography.title, marginTop: 4 },
  ref: { marginTop: 6, fontSize: 15, fontWeight: "700", color: colors.text },
  refMuted: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  price: { fontSize: 28, fontWeight: "800", color: colors.text },
  desc: { ...typography.body, marginTop: 12, color: colors.text },
  h2: { ...typography.section, marginTop: 22, marginBottom: 8 },
  muted: { color: colors.textMuted, fontSize: 14 },
  compat: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  compatBrand: { fontWeight: "800", fontSize: 15, color: colors.text },
  compatLine: { color: colors.text, fontSize: 14, marginTop: 2 },
  link: { color: colors.primary, fontWeight: "700", fontSize: 13 },
  specHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  specK: { color: colors.textMuted, fontSize: 14, fontWeight: "600" },
  specV: { color: colors.text, fontSize: 14, fontWeight: "700" },
  shop: {
    marginTop: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  shopKicker: { fontSize: 12, fontWeight: "700", color: colors.textMuted },
  shopName: { fontWeight: "800", fontSize: 15, color: colors.text },
  footer: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  quote: {
    flex: 1.4,
    minHeight: 48,
    borderRadius: radii.btn,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  quoteOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  quoteTxt: { color: colors.primary, fontWeight: "800" },
  ghost: {
    flex: 0.8,
    minHeight: 48,
    borderRadius: radii.btn,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  ghostTxt: { color: colors.text, fontWeight: "700" },
  contact: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.btn,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  contactTxt: { color: colors.white, fontWeight: "800" },
});
