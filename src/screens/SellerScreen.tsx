import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useApp } from "../context/AppContext";
import { useShop } from "../context/ShopContext";
import { formatTnd } from "../data/catalog";
import { Button, Chip, PressScale } from "../components/ui";
import { colors, radii, space, typography } from "../theme";
import type { RootStackParamList } from "../navigation/types";

export function SellerScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { extraParts, decrementStock, setMode, patchExtraParts } = useApp();
  const { shops, loadProducts, categories } = useShop();
  const [shopId, setShopId] = useState(shops[0]?.id);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const inventory = loadProducts({ shopId, query: q });
  const extraForShop = extraParts.filter((p) => p.shopId === shopId);
  const rows = useMemo(() => {
    const ids = new Set(extraForShop.map((e) => e.id));
    return [...extraForShop, ...inventory.filter((p) => !ids.has(p.id))];
  }, [extraForShop, inventory]);
  const shop = shops.find((s) => s.id === shopId);
  const units = rows.reduce((a, p) => a + p.stockQuantity, 0);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const importCsv = () => {
    Alert.alert(
      "Import catalogue",
      "En production : CSV/Excel (réf, marque, modèle, stock, prix). Démo : 0 ligne importée — utilisez « Ajouter une pièce ».",
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={typography.h2}>Catalogue fournisseur</Text>
      <Text style={styles.sub}>{shop?.name}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
        {shops.map((s) => (
          <Chip
            key={s.id}
            label={s.city}
            selected={shopId === s.id}
            onPress={() => {
              setShopId(s.id);
              setSelected([]);
            }}
          />
        ))}
      </ScrollView>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statN}>{rows.length}</Text>
          <Text style={styles.statL}>Références</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statN}>{units}</Text>
          <Text style={styles.statL}>Unités stock</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statN}>{selected.length}</Text>
          <Text style={styles.statL}>Sélection</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label="Ajouter une pièce"
          variant="accent"
          onPress={() => navigation.navigate("AddPart")}
          style={{ flex: 1 }}
        />
        <Button
          label="Import CSV"
          variant="outline"
          onPress={importCsv}
          style={{ flex: 1 }}
        />
      </View>

      {selected.length > 0 ? (
        <View style={styles.bulk}>
          <Text style={styles.bulkH}>{selected.length} sélectionnée(s)</Text>
          <Text style={styles.bulkP}>Changer la catégorie :</Text>
          <View style={styles.wrap}>
            {categories.map((c) => (
              <Chip
                key={c.id}
                label={c.name}
                onPress={() => {
                  void patchExtraParts(selected, {
                    categoryId: c.id,
                    category: c,
                    subCategoryId: c.subCategories[0]?.id ?? null,
                    subCategory: c.subCategories[0] ?? null,
                  });
                  Alert.alert("OK", `Catégorie « ${c.name} » appliquée aux pièces ajoutées (démo locale).`);
                }}
              />
            ))}
          </View>
          <PressScale onPress={() => setSelected([])}>
            <Text style={styles.clearSel}>Annuler la sélection</Text>
          </PressScale>
        </View>
      ) : null}

      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Filtrer le stock (nom, réf)…"
        placeholderTextColor={colors.textMuted}
        style={styles.search}
      />

      {rows.map((p) => {
        const on = selected.includes(p.id);
        return (
          <PressScale
            key={p.id}
            onPress={() => toggle(p.id)}
            style={[styles.row, on && styles.rowOn]}
          >
            <View style={[styles.check, on && styles.checkOn]}>
              <Text style={styles.checkTxt}>{on ? "✓" : ""}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{p.partName}</Text>
              <Text style={styles.meta}>
                {p.makerBrand} · {p.oemNumber ?? "—"} · {formatTnd(p.price)} · stock {p.stockQuantity}
              </Text>
            </View>
            <PressScale
              onPress={() => void decrementStock(p.id)}
              style={styles.sale}
            >
              <Text style={styles.saleTxt}>−1</Text>
            </PressScale>
          </PressScale>
        );
      })}

      <PressScale onPress={() => void setMode("buyer")} style={styles.back}>
        <Text style={styles.backTxt}>← Mode client / catalogue</Text>
      </PressScale>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.md, paddingBottom: 48 },
  sub: { color: colors.textMuted, marginTop: 4 },
  stats: { flexDirection: "row", gap: 8, marginVertical: 12 },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statN: { fontWeight: "800", fontSize: 20, color: colors.primary },
  statL: { fontSize: 11, fontWeight: "700", color: colors.textMuted, marginTop: 2 },
  actions: { flexDirection: "row", gap: 8, marginBottom: 12 },
  bulk: {
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  bulkH: { fontWeight: "800", color: colors.text },
  bulkP: { marginTop: 8, marginBottom: 6, color: colors.textMuted, fontSize: 13 },
  wrap: { flexDirection: "row", flexWrap: "wrap" },
  clearSel: { marginTop: 8, color: colors.primary, fontWeight: "700" },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: colors.card,
    color: colors.text,
  },
  row: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
  },
  checkOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkTxt: { color: colors.white, fontWeight: "800", fontSize: 12 },
  name: { fontWeight: "800", color: colors.text, fontSize: 14 },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  sale: {
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saleTxt: { color: colors.primary, fontWeight: "800" },
  back: { marginTop: 16, alignItems: "center", padding: 12 },
  backTxt: { color: colors.primary, fontWeight: "800" },
});
