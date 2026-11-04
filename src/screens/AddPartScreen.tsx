import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useApp } from "../context/AppContext";
import { useShop } from "../context/ShopContext";
import { Button, PressScale } from "../components/ui";
import { FALLBACK_PART_IMAGE, colors, space } from "../theme";
import type { Part, PartCondition, VehicleTypeId } from "../types";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AddPart">;

export function AddPartScreen({ navigation }: Props) {
  const { addExtraPart } = useApp();
  const { shops, categories } = useShop();
  const shop = shops[0];
  const [partName, setPartName] = useState("");
  const [price, setPrice] = useState("");
  const [oem, setOem] = useState("");
  const [stock, setStock] = useState("5");
  const [condition, setCondition] = useState<PartCondition>("original");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [vehicleType, setVehicleType] = useState<VehicleTypeId>("motorcycle");

  const submit = async () => {
    if (!partName.trim() || !price) {
      Alert.alert("Champs requis", "Nom et prix TND.");
      return;
    }
    const cat = categories.find((c) => c.id === categoryId) ?? categories[0];
    const part: Part = {
      id: `px_${Date.now()}`,
      shopId: shop.id,
      partName: partName.trim(),
      categoryId: cat.id,
      subCategoryId: cat.subCategories[0]?.id ?? null,
      vehicleType,
      oemNumber: oem || null,
      partNumber: null,
      condition,
      price: Number(price),
      buyPrice: null,
      stockQuantity: Number(stock) || 1,
      status: "in_stock",
      shelfLocation: "A-01",
      description: "Pièce enregistrée via ERP Magasin (démo).",
      warranty: "6 mois",
      images: [FALLBACK_PART_IMAGE],
      featured: true,
      makerBrand: "OEM",
      position: null,
      specs: [
        { label: "Origine", value: "Saisie magasin" },
        { label: "Garantie", value: "6 mois" },
      ],
      altReferences: [],
      barcode: `6910${Date.now().toString().slice(-8)}`,
      shop,
      category: cat,
      subCategory: cat.subCategories[0] ?? null,
      compatibleVehicles: [],
    };
    await addExtraPart(part);
    Alert.alert("Stock", "Pièce ajoutée et visible des acheteurs.");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.head}>
        <Text style={styles.h}>Ajouter une pièce</Text>
        <PressScale onPress={() => navigation.goBack()}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>✕</Text>
        </PressScale>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.label}>Nom</Text>
        <TextInput value={partName} onChangeText={setPartName} style={styles.input} />
        <Text style={styles.label}>Prix TND</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        <Text style={styles.label}>Réf OEM</Text>
        <TextInput value={oem} onChangeText={setOem} style={styles.input} />
        <Text style={styles.label}>Stock</Text>
        <TextInput
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
          style={styles.input}
        />
        <Text style={styles.label}>Catégorie</Text>
        {categories.map((c) => (
          <PressScale
            key={c.id}
            onPress={() => setCategoryId(c.id)}
            style={[styles.opt, categoryId === c.id && styles.optOn]}
          >
            <Text style={styles.optTxt}>{c.name}</Text>
          </PressScale>
        ))}
        <Text style={styles.label}>État</Text>
        {(["original", "oem", "aftermarket", "used"] as PartCondition[]).map(
          (c) => (
            <PressScale
              key={c}
              onPress={() => setCondition(c)}
              style={[styles.opt, condition === c && styles.optOn]}
            >
              <Text style={styles.optTxt}>{c}</Text>
            </PressScale>
          ),
        )}
        <Button
          label="Enregistrer au stock"
          variant="accent"
          onPress={() => void submit()}
          style={{ marginTop: 16 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  head: {
    backgroundColor: colors.primary,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  h: { color: "#fff", fontWeight: "800", fontSize: 16 },
  body: { padding: space.md, paddingBottom: 40 },
  label: { fontWeight: "800", marginTop: 10, marginBottom: 6 },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    fontWeight: "600",
  },
  opt: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
  },
  optOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optTxt: { fontWeight: "700" },
});
