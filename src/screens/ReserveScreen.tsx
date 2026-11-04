import React, { useState } from "react";
import {
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
import { Button, PressScale } from "../components/ui";
import { colors, radii, space } from "../theme";
import type { DeliveryOption } from "../types";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Reserve">;

export function ReserveScreen({ navigation, route }: Props) {
  const { userName, phone, reservePart } = useApp();
  const { getProduct } = useShop();
  const part = getProduct(route.params.listingId);
  const [customerName, setCustomerName] = useState(userName);
  const [customerPhone, setCustomerPhone] = useState(phone || "+216 ");
  const [customerCity, setCustomerCity] = useState("Tunis");
  const [delivery, setDelivery] = useState<DeliveryOption>("pickup");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [doneCode, setDoneCode] = useState<string | null>(null);

  if (!part) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.h}>Produit introuvable</Text>
        <Button label="Retour" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const submit = async () => {
    if (!customerName.trim() || customerPhone.replace(/\D/g, "").length < 8) {
      return;
    }
    setLoading(true);
    try {
      const order = await reservePart({
        part,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerCity,
        deliveryOption: delivery,
        notes,
      });
      setDoneCode(order.orderCode);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.h}>
          {doneCode ? "Réservation confirmée !" : "Réserver la pièce en magasin"}
        </Text>
        <PressScale onPress={() => navigation.goBack()} style={styles.close}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>✕</Text>
        </PressScale>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {doneCode ? (
          <View style={styles.success}>
            <Text style={{ fontSize: 48 }}>✅</Text>
            <Text style={styles.code}>{doneCode}</Text>
            <Text style={styles.hint}>
              Présentez ce code au magasin {part.shop.name} ({part.shop.city}).
            </Text>
            <Button
              label="Voir mes commandes"
              onPress={() =>
                navigation.navigate("Main", { screen: "Orders" })
              }
            />
            <Button
              label="Fermer"
              variant="outline"
              onPress={() => navigation.goBack()}
              style={{ marginTop: 8 }}
            />
          </View>
        ) : (
          <>
            <View style={styles.partBox}>
              <Text style={styles.partName}>{part.partName}</Text>
              <Text style={styles.price}>{part.price} TND</Text>
              <Text style={styles.meta}>
                {part.shop.name} · {part.shop.city}
              </Text>
            </View>

            <Text style={styles.label}>Nom</Text>
            <TextInput
              value={customerName}
              onChangeText={setCustomerName}
              style={styles.input}
            />
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              value={customerPhone}
              onChangeText={setCustomerPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />
            <Text style={styles.label}>Ville</Text>
            <TextInput
              value={customerCity}
              onChangeText={setCustomerCity}
              style={styles.input}
            />

            <Text style={styles.label}>Mode</Text>
            <View style={styles.row}>
              <PressScale
                onPress={() => setDelivery("pickup")}
                style={[
                  styles.mode,
                  delivery === "pickup" && styles.modeOn,
                ]}
              >
                <Text style={styles.modeTxt}>🏪 Retrait magasin</Text>
              </PressScale>
              <PressScale
                onPress={() => setDelivery("express_delivery")}
                style={[
                  styles.mode,
                  delivery === "express_delivery" && styles.modeOrange,
                ]}
              >
                <Text style={styles.modeTxt}>🚚 Express 24h</Text>
              </PressScale>
            </View>

            <Text style={styles.label}>Note (optionnel)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Ex: retrait aujourd'hui à 16h"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { minHeight: 80 }]}
              multiline
            />

            <Button
              label={loading ? "Réservation…" : "Confirmer la réservation"}
              variant="accent"
              disabled={loading}
              onPress={() => void submit()}
              style={{ marginTop: 16 }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  h: { color: "#fff", fontWeight: "800", fontSize: 16, flex: 1 },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: space.md, paddingBottom: 40 },
  success: { alignItems: "center", gap: 12, paddingTop: 24 },
  code: { fontWeight: "800", fontSize: 22, color: colors.primary },
  hint: { textAlign: "center", color: colors.textMuted },
  partBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  partName: { fontWeight: "800", color: colors.text },
  price: { fontWeight: "800", color: colors.primary, fontSize: 20, marginTop: 4 },
  meta: { color: colors.textMuted, marginTop: 4 },
  label: { fontWeight: "800", marginTop: 12, marginBottom: 6, color: colors.text },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontWeight: "600",
    color: colors.text,
  },
  row: { flexDirection: "row", gap: 8 },
  mode: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
  },
  modeOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  modeOrange: { borderColor: colors.accent, backgroundColor: "#FFF7ED" },
  modeTxt: { fontWeight: "800", fontSize: 12, color: colors.text },
});
