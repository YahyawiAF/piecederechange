import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { colors, shadow, space } from "../theme";
import { PressScale } from "./ui";

export function AppHeader() {
  const { mode, setMode } = useApp();

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={[styles.bar, shadow.header]}>
        <View>
          <Text style={styles.brand}>
            Pièces<Text style={styles.accent}>Express</Text>
          </Text>
          <Text style={styles.sub}>
            {mode === "buyer" ? "Catalogue pièces" : "Gestion fournisseur"}
          </Text>
        </View>
        <View style={styles.modeWrap}>
          <PressScale
            onPress={() => void setMode("buyer")}
            style={[styles.modeBtn, mode === "buyer" && styles.modeOn]}
          >
            <Text style={[styles.modeTxt, mode === "buyer" && styles.modeTxtOn]}>
              Client
            </Text>
          </PressScale>
          <PressScale
            onPress={() => void setMode("seller")}
            style={[styles.modeBtn, mode === "seller" && styles.modeSeller]}
          >
            <Text
              style={[styles.modeTxt, mode === "seller" && { color: colors.white }]}
            >
              Fournisseur
            </Text>
          </PressScale>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.dark },
  bar: {
    backgroundColor: colors.dark,
    paddingHorizontal: space.md,
    paddingBottom: 12,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: { color: colors.white, fontSize: 18, fontWeight: "800" },
  accent: { color: "#93C5FD" },
  sub: { color: "#94A3B8", fontSize: 12, marginTop: 2, fontWeight: "600" },
  modeWrap: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 3,
  },
  modeBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  modeOn: { backgroundColor: colors.white },
  modeSeller: { backgroundColor: colors.accent },
  modeTxt: { color: "#94A3B8", fontSize: 12, fontWeight: "800" },
  modeTxtOn: { color: colors.dark },
});
