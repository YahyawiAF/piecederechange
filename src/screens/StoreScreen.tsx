import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useApp } from "../context/AppContext";
import { useShop } from "../context/ShopContext";
import { modelsInParts } from "../data/catalog";
import { ProductCard } from "../components/ProductCard";
import { Badge, Chip, PressScale } from "../components/ui";
import { openCall, openWhatsApp } from "../services/linking";
import { colors, radii, space, typography } from "../theme";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Store">;

export function StoreScreen({ navigation, route }: Props) {
  const { isFavorite, toggleFavorite } = useApp();
  const { getShopById, loadProducts, categories } = useShop();
  const shop = getShopById(route.params.storeId);
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [model, setModel] = useState("all");

  const allStock = useMemo(
    () => loadProducts({ shopId: route.params.storeId }),
    [loadProducts, route.params.storeId],
  );

  const categoryCounts = useMemo(
    () =>
      categories
        .map((c) => ({
          ...c,
          count: allStock.filter((p) => p.categoryId === c.id).length,
        }))
        .filter((c) => c.count > 0),
    [categories, allStock],
  );

  const shopModels = useMemo(() => modelsInParts(allStock), [allStock]);

  const inventory = useMemo(
    () =>
      loadProducts({
        shopId: route.params.storeId,
        query: q,
        categoryId,
        model,
      }),
    [loadProducts, route.params.storeId, q, categoryId, model],
  );

  const hasFilters = categoryId !== "all" || model !== "all" || !!q.trim();

  const reset = () => {
    setQ("");
    setCategoryId("all");
    setModel("all");
  };

  if (!shop) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Boutique introuvable</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView>
        <View style={styles.cover}>
          <Image source={{ uri: shop.image }} style={styles.coverImg} />
          <PressScale onPress={() => navigation.goBack()} style={styles.close}>
            <Text style={{ color: colors.white, fontWeight: "800" }}>✕</Text>
          </PressScale>
          <View style={styles.coverInfo}>
            <Badge label={shop.badge} variant="accent" />
            <Text style={styles.name}>{shop.name}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.meta}>
            📍 {shop.address} · {shop.city}
          </Text>
          <Text style={styles.meta}>
            ★ {shop.rating} ({shop.reviewsCount} avis) · 🕒 {shop.openingHours}
          </Text>

          <View style={styles.actions}>
            <PressScale
              onPress={() => void openCall(shop.phone)}
              style={styles.call}
            >
              <Text style={styles.callTxt}>Appeler</Text>
            </PressScale>
            <PressScale
              onPress={() =>
                void openWhatsApp(
                  shop.whatsapp,
                  `Bonjour ${shop.name}, je vous contacte depuis PiècesExpress TN.`,
                )
              }
              style={styles.wa}
            >
              <Text style={styles.waTxt}>WhatsApp</Text>
            </PressScale>
          </View>

          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Chercher dans le stock…"
            placeholderTextColor={colors.textMuted}
            style={styles.search}
          />

          <Text style={styles.filterLabel}>Catégorie</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            <Chip
              label="Toutes"
              count={allStock.length}
              selected={categoryId === "all"}
              onPress={() => setCategoryId("all")}
            />
            {categoryCounts.map((c) => (
              <Chip
                key={c.id}
                label={c.name}
                count={c.count}
                selected={categoryId === c.id}
                onPress={() => setCategoryId(c.id)}
              />
            ))}
          </ScrollView>

          {shopModels.length > 0 ? (
            <>
              <Text style={styles.filterLabel}>Modèle compatible</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                <Chip
                  label="Tous"
                  selected={model === "all"}
                  onPress={() => setModel("all")}
                />
                {shopModels.map((m) => (
                  <Chip
                    key={m}
                    label={m}
                    selected={model === m}
                    onPress={() => setModel(m)}
                  />
                ))}
              </ScrollView>
            </>
          ) : null}

          <View style={styles.stockHead}>
            <Text style={styles.section}>
              Stock magasin ({inventory.length})
            </Text>
            {hasFilters ? (
              <PressScale onPress={reset}>
                <Text style={styles.reset}>Réinitialiser</Text>
              </PressScale>
            ) : null}
          </View>
          {inventory.map((p) => (
            <ProductCard
              key={p.id}
              part={p}
              isFavorite={isFavorite(p.id)}
              onPress={() => navigation.navigate("Product", { listingId: p.id })}
              onReserve={() => navigation.navigate("Reserve", { listingId: p.id })}
              onOpenShop={() => undefined}
              onToggleFavorite={() => void toggleFavorite(p.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.card },
  missing: { padding: 24 },
  cover: { height: 160, backgroundColor: colors.dark },
  coverImg: { width: "100%", height: "100%", opacity: 0.65 },
  close: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
  },
  coverInfo: { position: "absolute", bottom: 12, left: 16, right: 16, gap: 6 },
  name: { color: colors.white, fontWeight: "800", fontSize: 20 },
  body: { padding: space.md },
  meta: { color: colors.textMuted, marginBottom: 4 },
  actions: { flexDirection: "row", gap: 8, marginVertical: 12 },
  call: {
    flex: 1,
    backgroundColor: colors.primarySoft,
    borderRadius: radii.btn,
    padding: 12,
    alignItems: "center",
  },
  callTxt: { color: colors.primary, fontWeight: "800" },
  wa: {
    flex: 1,
    backgroundColor: colors.whatsappSoft,
    borderRadius: radii.btn,
    padding: 12,
    alignItems: "center",
  },
  waTxt: { color: colors.whatsapp, fontWeight: "800" },
  search: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  filterLabel: {
    ...typography.label,
    marginBottom: 8,
    marginTop: 4,
  },
  chipRow: { paddingBottom: 10 },
  stockHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 4,
  },
  section: { fontWeight: "800", color: colors.text },
  reset: { color: colors.danger, fontWeight: "800", fontSize: 12 },
});
