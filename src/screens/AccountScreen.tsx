import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui";
import { colors, space } from "../theme";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Account">,
  NativeStackScreenProps<RootStackParamList>
>;

export function AccountScreen({}: Props) {
  const { userName, phone, setProfile, setMode, selectedCity } = useApp();
  const [nameDraft, setNameDraft] = useState(userName);
  const [phoneDraft, setPhoneDraft] = useState(phone);
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avTxt}>{initials || "AT"}</Text>
        </View>
        <View>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.meta}>
            {phone} • {selectedCity === "all" ? "Tunisie" : selectedCity}
          </Text>
        </View>
      </View>

      <View style={styles.cardCol}>
        <Text style={styles.label}>Nom</Text>
        <TextInput value={nameDraft} onChangeText={setNameDraft} style={styles.input} />
        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          value={phoneDraft}
          onChangeText={setPhoneDraft}
          keyboardType="phone-pad"
          style={styles.input}
        />
        <Button
          label="Enregistrer"
          onPress={async () => {
            await setProfile(nameDraft.trim() || "Client", phoneDraft.trim());
            Alert.alert("OK", "Profil enregistré.");
          }}
          style={{ marginTop: 12 }}
        />
      </View>

      <View style={styles.cta}>
        <Text style={styles.ctaH}>Vous êtes vendeur de pièces ?</Text>
        <Text style={styles.ctaP}>
          Logiciel de stock gratuit et votre inventaire visible par des milliers
          de conducteurs.
        </Text>
        <Button
          label="Activer le Mode ERP Magasin"
          variant="outline"
          onPress={() => void setMode("seller")}
          textStyle={{ color: "#C2410C" }}
          style={styles.ctaBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.md, paddingBottom: 40, gap: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avTxt: { color: "#fff", fontWeight: "800", fontSize: 20 },
  name: { fontWeight: "800", fontSize: 17, color: colors.text },
  meta: { color: colors.textMuted, marginTop: 4 },
  cardCol: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { fontWeight: "800", marginTop: 8, marginBottom: 6, color: colors.text },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontWeight: "600",
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: 24,
    padding: 18,
    gap: 8,
  },
  ctaH: { color: "#fff", fontWeight: "800", fontSize: 16 },
  ctaP: { color: "#FFEDD5", fontSize: 13, lineHeight: 18 },
  ctaBtn: { backgroundColor: "#fff", borderWidth: 0, marginTop: 8 },
});
