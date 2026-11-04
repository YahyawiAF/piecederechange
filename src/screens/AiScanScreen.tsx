import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useShop } from "../context/ShopContext";
import { Button, PressScale } from "../components/ui";
import { colors, space } from "../theme";
import type { AiScanType, Part } from "../types";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AiScan">;

const PRESETS: { id: string; label: string; keyword: string }[] = [
  { id: "alternateur", label: "Alternateur", keyword: "alternateur" },
  { id: "plaquettes", label: "Plaquettes", keyword: "plaquette" },
  { id: "courroie", label: "Courroie", keyword: "courroie" },
  { id: "bougie", label: "Bougie", keyword: "bougie" },
  { id: "piston", label: "Piston", keyword: "piston" },
  { id: "pare-chocs", label: "Pare-chocs", keyword: "pare-chocs" },
];

export function AiScanScreen({ navigation, route }: Props) {
  const { loadProducts } = useShop();
  const [tab, setTab] = useState<AiScanType>(route.params?.type ?? "mechanic");
  const [preset, setPreset] = useState("alternateur");
  const [vin, setVin] = useState("VF3208PURE201");
  const [prompt, setPrompt] = useState(
    "Problème de freinage ou bruit métallique au freinage",
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    title: string;
    detail: string;
    parts: Part[];
  } | null>(null);

  const run = () => {
    setLoading(true);
    setTimeout(() => {
      const all = loadProducts();
      let parts: Part[] = [];
      let title = "";
      let detail = "";
      if (tab === "photo") {
        const kw = PRESETS.find((p) => p.id === preset)?.keyword ?? preset;
        parts = all.filter((p) => p.partName.toLowerCase().includes(kw));
        title = `Détecté : ${PRESETS.find((p) => p.id === preset)?.label}`;
        detail = `Confiance 96% · ${parts.length} pièce(s) en stock`;
      } else if (tab === "vin") {
        const v = vin.toUpperCase();
        parts = all.filter((p) =>
          p.compatibleVehicles.some((veh) =>
            (veh.sampleVin || "").toUpperCase().includes(v.slice(0, 6)),
          ),
        );
        if (parts.length === 0) {
          parts = all.filter((p) =>
            p.compatibleVehicles.some((veh) =>
              v.includes(veh.brand.slice(0, 3).toUpperCase()),
            ),
          );
        }
        title = `VIN ${vin}`;
        detail = `${parts.length} pièce(s) compatibles trouvées`;
      } else {
        const kw = prompt.toLowerCase().includes("frein")
          ? "frein"
          : prompt.toLowerCase().includes("batterie")
            ? "batterie"
            : prompt.toLowerCase().includes("huile")
              ? "filtre"
              : "bougie";
        parts = all.filter(
          (p) =>
            p.partName.toLowerCase().includes(kw) ||
            p.category.name.toLowerCase().includes(kw) ||
            p.subCategory?.name.toLowerCase().includes(kw),
        );
        title = "Diagnostic IA Mécano";
        detail = `Symptôme analysé · suggestion : ${kw}`;
      }
      setResult({ title, detail, parts: parts.slice(0, 6) });
      setLoading(false);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.h}>✨ Assistant IA PiècesExpress</Text>
          <Text style={styles.sub}>Recherche visuelle & décodage châssis</Text>
        </View>
        <PressScale onPress={() => navigation.goBack()} style={styles.close}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>✕</Text>
        </PressScale>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.tabs}>
          {(
            [
              ["photo", "📷 Photo"],
              ["vin", "🔢 VIN"],
              ["mechanic", "🔧 Mécano"],
            ] as [AiScanType, string][]
          ).map(([id, label]) => (
            <PressScale
              key={id}
              onPress={() => {
                setTab(id);
                setResult(null);
              }}
              style={[styles.tab, tab === id && styles.tabOn]}
            >
              <Text style={[styles.tabTxt, tab === id && { color: "#fff" }]}>
                {label}
              </Text>
            </PressScale>
          ))}
        </View>

        {tab === "photo" ? (
          <View style={styles.presets}>
            {PRESETS.map((p) => (
              <PressScale
                key={p.id}
                onPress={() => setPreset(p.id)}
                style={[styles.preset, preset === p.id && styles.presetOn]}
              >
                <Text
                  style={[
                    styles.presetTxt,
                    preset === p.id && { color: "#fff" },
                  ]}
                >
                  {p.label}
                </Text>
              </PressScale>
            ))}
            <Text style={styles.hint}>
              Démo : choisissez le type de pièce (pas de caméra réelle).
            </Text>
          </View>
        ) : null}

        {tab === "vin" ? (
          <TextInput
            value={vin}
            onChangeText={setVin}
            autoCapitalize="characters"
            style={styles.input}
            placeholder="N° châssis"
          />
        ) : null}

        {tab === "mechanic" ? (
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            multiline
            style={[styles.input, { minHeight: 90 }]}
            placeholder="Décrivez le problème…"
          />
        ) : null}

        <Button
          label={loading ? "Analyse…" : "Lancer l'IA"}
          variant="accent"
          disabled={loading}
          onPress={run}
          style={{ marginTop: 12 }}
        />

        {result ? (
          <View style={styles.result}>
            <Text style={styles.resH}>{result.title}</Text>
            <Text style={styles.resD}>{result.detail}</Text>
            {result.parts.map((p) => (
              <PressScale
                key={p.id}
                onPress={() =>
                  navigation.replace("Product", { listingId: p.id })
                }
                style={styles.hit}
              >
                <Text style={styles.hitName}>{p.partName}</Text>
                <Text style={styles.hitMeta}>
                  {p.price} TND · {p.shop.city}
                </Text>
              </PressScale>
            ))}
            {result.parts.length === 0 ? (
              <Text style={styles.hint}>Aucun stock correspondant.</Text>
            ) : null}
          </View>
        ) : null}
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
  },
  h: { color: "#fff", fontWeight: "800", fontSize: 16 },
  sub: { color: "#BFDBFE", fontSize: 11, marginTop: 2 },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: space.md, paddingBottom: 40 },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 12 },
  tab: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  tabOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabTxt: { fontWeight: "800", fontSize: 12, color: colors.text },
  presets: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  preset: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  presetOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  presetTxt: { fontWeight: "800", fontSize: 12 },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    fontWeight: "600",
  },
  hint: { color: colors.textMuted, fontSize: 12, marginTop: 8 },
  result: { marginTop: 16, gap: 8 },
  resH: { fontWeight: "800", fontSize: 16 },
  resD: { color: colors.textMuted, marginBottom: 8 },
  hit: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hitName: { fontWeight: "800", color: colors.text },
  hitMeta: { color: colors.primary, fontWeight: "700", marginTop: 4 },
});
