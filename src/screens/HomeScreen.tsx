import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useShop } from "../context/ShopContext";
import {
  activeFilterChips,
  clearChip,
  emptyFilterHints,
} from "../data/catalog";
import { EmptyResults, ProductCard } from "../components/ProductCard";
import { FilterPanel } from "../components/FilterPanel";
import { PressScale } from "../components/ui";
import { colors, radii, space, typography } from "../theme";
import type { SearchFilters, SortKey } from "../types";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

const emptyFilters: SearchFilters = {
  query: "",
  brand: "all",
  model: "all",
  categoryId: "all",
  subCategoryId: "all",
  stock: "all",
  sort: "relevance",
};

export function HomeScreen({ navigation, route }: Props) {
  const { categories, loadProducts } = useShop();
  const [filters, setFilters] = useState<SearchFilters>({
    ...emptyFilters,
    ...route.params,
  });
  const [sheet, setSheet] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  React.useEffect(() => {
    if (!route.params) return;
    setFilters((prev) => ({ ...prev, ...route.params }));
  }, [route.params]);

  const items = useMemo(() => loadProducts(filters), [loadProducts, filters]);
  const chips = activeFilterChips(filters);
  const trail = [
    "Toutes les pièces",
    filters.brand && filters.brand !== "all" ? filters.brand : null,
    filters.model && filters.model !== "all" ? filters.model : null,
    filters.year ? String(filters.year) : null,
    categories.find((c) => c.id === filters.categoryId)?.name,
  ].filter(Boolean) as string[];

  const reset = () => setFilters({ ...emptyFilters });

  const sorts: { id: SortKey; label: string }[] = [
    { id: "relevance", label: "Pertinence" },
    { id: "price_asc", label: "Prix ↑" },
    { id: "price_desc", label: "Prix ↓" },
    { id: "stock", label: "Stock" },
  ];

  return (
    <View style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          value={filters.query ?? ""}
          onChangeText={(query) => setFilters((f) => ({ ...f, query }))}
          placeholder="Nom, référence ou modèle…"
          placeholderTextColor={colors.textMuted}
          style={styles.search}
        />

        <View style={styles.toolbar}>
          <PressScale onPress={() => setSheet(true)} style={styles.toolBtn}>
            <Text style={styles.toolTxt}>
              Filtres{chips.length ? ` (${chips.length})` : ""}
            </Text>
          </PressScale>
          <PressScale onPress={() => setSortOpen(true)} style={styles.toolBtn}>
            <Text style={styles.toolTxt}>Trier</Text>
          </PressScale>
        </View>

        {chips.length > 0 ? (
          <View style={styles.chipRow}>
            {chips.map((c) => (
              <PressScale
                key={c.key}
                onPress={() => setFilters((f) => clearChip(f, c.key))}
                style={styles.chip}
              >
                <Text style={styles.chipTxt}>{c.label} ×</Text>
              </PressScale>
            ))}
            <PressScale onPress={reset}>
              <Text style={styles.clear}>Tout effacer</Text>
            </PressScale>
          </View>
        ) : null}

        <Text style={styles.trail}>{trail.join("  →  ")}</Text>
        <Text style={styles.count}>
          {items.length} pièce{items.length > 1 ? "s" : ""} trouvée
          {items.length > 1 ? "s" : ""}
        </Text>
        {items.length === 0 ? (
          <EmptyResults onReset={reset} hints={emptyFilterHints(filters)} />
        ) : (
          items.map((p) => (
            <ProductCard
              key={p.id}
              part={p}
              onPress={() => navigation.navigate("Product", { listingId: p.id })}
            />
          ))
        )}
      </ScrollView>

      <Modal visible={sheet} animationType="slide">
        <SafeAreaView style={styles.sheet} edges={["top", "bottom"]}>
          <View style={styles.sheetBar}>
            <Text style={typography.h2}>Filtres</Text>
            <PressScale onPress={() => setSheet(false)}>
              <Text style={styles.done}>Fermer</Text>
            </PressScale>
          </View>
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            categories={categories}
          />
          <PressScale onPress={() => setSheet(false)} style={styles.apply}>
            <Text style={styles.applyTxt}>
              Voir {items.length} pièce{items.length > 1 ? "s" : ""}
            </Text>
          </PressScale>
        </SafeAreaView>
      </Modal>

      <Modal visible={sortOpen} transparent animationType="fade">
        <PressScale style={styles.overlay} onPress={() => setSortOpen(false)}>
          <View style={styles.sortSheet}>
            <View style={styles.sortHandle} />
            <Text style={styles.sortTitle}>Trier par</Text>
            {sorts.map((s) => (
              <PressScale
                key={s.id}
                onPress={() => {
                  setFilters((f) => ({ ...f, sort: s.id }));
                  setSortOpen(false);
                }}
                style={[styles.sortRow, filters.sort === s.id && styles.sortOn]}
              >
                <Text style={styles.sortTxt}>{s.label}</Text>
              </PressScale>
            ))}
          </View>
        </PressScale>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: space.md, paddingBottom: 32 },
  search: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  toolbar: { flexDirection: "row", gap: 8, marginTop: 12 },
  toolBtn: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  toolTxt: { fontWeight: "700", color: colors.text, fontSize: 15 },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  chip: {
    backgroundColor: colors.primarySoft,
    borderRadius: radii.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipTxt: { color: colors.primary, fontWeight: "700", fontSize: 13 },
  clear: { color: colors.danger, fontWeight: "700", fontSize: 13 },
  trail: {
    marginTop: 14,
    marginBottom: 6,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  count: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 12,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: space.md,
    paddingBottom: 12,
  },
  sheetBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  done: { color: colors.primary, fontWeight: "700", fontSize: 16 },
  apply: {
    backgroundColor: colors.primary,
    borderRadius: radii.btn,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  applyTxt: { color: colors.white, fontWeight: "800", fontSize: 16 },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  sortSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 28,
  },
  sortHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  sortTitle: { fontWeight: "800", fontSize: 16, marginBottom: 8 },
  sortRow: { paddingVertical: 14 },
  sortOn: {
    backgroundColor: colors.primarySoft,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  sortTxt: { fontSize: 16, fontWeight: "600", color: colors.text },
});
