import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useApp } from "../context/AppContext";
import { useShop } from "../context/ShopContext";
import { formatTnd } from "../data/catalog";
import { Button, PressScale } from "../components/ui";
import { openWhatsApp } from "../services/linking";
import { colors, radii, space, typography } from "../theme";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Quotes">,
  NativeStackScreenProps<RootStackParamList>
>;

export function QuotesScreen({ navigation }: Props) {
  const { quotes, removeFromQuote, clearQuote } = useApp();
  const { getProduct } = useShop();
  const items = quotes
    .map((q) => ({ q, part: getProduct(q.listingId) }))
    .filter((x): x is { q: (typeof quotes)[0]; part: NonNullable<ReturnType<typeof getProduct>> } => !!x.part);
  const total = items.reduce((s, x) => s + x.part.price * x.q.qty, 0);

  const send = () => {
    if (items.length === 0) return;
    const shop = items[0].part.shop;
    const lines = items
      .map((x) => `• ${x.part.partName} (${x.part.oemNumber ?? x.part.id}) — ${formatTnd(x.part.price)}`)
      .join("\n");
    void openWhatsApp(
      shop.whatsapp,
      `Demande de devis PiècesExpress\n\n${lines}\n\nTotal indicatif : ${formatTnd(total)}`,
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={typography.h2}>Devis</Text>
      <Text style={styles.sub}>
        {items.length} ligne{items.length > 1 ? "s" : ""} · {formatTnd(total)}
      </Text>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyH}>Aucun article dans le devis</Text>
          <Text style={styles.emptyP}>
            Ouvrez une fiche pièce et touchez « Ajouter au devis ».
          </Text>
          <Button
            label="Ouvrir le catalogue"
            onPress={() => navigation.navigate("Home")}
          />
        </View>
      ) : (
        items.map(({ part, q }) => (
          <PressScale
            key={part.id}
            onPress={() => navigation.navigate("Product", { listingId: part.id })}
            style={styles.row}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{part.partName}</Text>
              <Text style={styles.meta}>
                {part.makerBrand} · {part.oemNumber ?? "sans réf."} · ×{q.qty}
              </Text>
              <Text style={styles.price}>{formatTnd(part.price)}</Text>
            </View>
            <PressScale onPress={() => void removeFromQuote(part.id)}>
              <Text style={styles.remove}>Retirer</Text>
            </PressScale>
          </PressScale>
        ))
      )}

      {items.length > 0 ? (
        <View style={styles.actions}>
          <Button label="Envoyer le devis" variant="accent" onPress={send} />
          <Button
            label="Vider le devis"
            variant="outline"
            onPress={() => {
              Alert.alert("Vider", "Supprimer toutes les lignes ?", [
                { text: "Annuler" },
                { text: "Vider", onPress: () => void clearQuote() },
              ]);
            }}
            style={{ marginTop: 8 }}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.md, paddingBottom: 40 },
  sub: { color: colors.textMuted, marginTop: 4, marginBottom: 16, fontSize: 14 },
  empty: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  emptyH: { fontWeight: "800", fontSize: 16, color: colors.text },
  emptyP: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    gap: 8,
  },
  name: { fontWeight: "800", color: colors.text, fontSize: 15 },
  meta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  price: { fontWeight: "800", marginTop: 4, color: colors.text },
  remove: { color: colors.danger, fontWeight: "700", fontSize: 13 },
  actions: { marginTop: 16 },
});
