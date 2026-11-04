import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useApp } from "../context/AppContext";
import { Chip, PressScale } from "../components/ui";
import { openCall, openWhatsApp, orderWhatsAppMessage } from "../services/linking";
import { FALLBACK_PART_IMAGE, colors, radii, shadow, space } from "../theme";
import type { Order, OrderStatus } from "../types";
import type { MainTabParamList, RootStackParamList } from "../navigation/types";

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Orders">,
  NativeStackScreenProps<RootStackParamList>
>;

type FilterKey = "all" | "en_cours" | "ready" | "delivered" | "cancelled";

const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  reserved: { label: "Réservée", bg: "#DBEAFE", color: "#1565C0" },
  confirmed: { label: "Confirmée", bg: "#E0E7FF", color: "#4338CA" },
  preparing: { label: "En préparation", bg: "#FEF3C7", color: "#92400E" },
  ready: { label: "Prête à retirer", bg: "#D1FAE5", color: "#065F46" },
  delivered: { label: "Livrée", bg: "#E2E8F0", color: "#334155" },
  cancelled: { label: "Annulée", bg: "#FEE2E2", color: "#B91C1C" },
};

const STEPS: { key: OrderStatus; label: string; icon: string }[] = [
  { key: "reserved", label: "Réservé", icon: "📦" },
  { key: "confirmed", label: "Confirmé", icon: "✓" },
  { key: "preparing", label: "Préparation", icon: "⏱" },
  { key: "ready", label: "Prêt", icon: "📫" },
  { key: "delivered", label: "Livré", icon: "🚚" },
];

function matches(o: Order, f: FilterKey) {
  if (f === "all") return true;
  if (f === "en_cours") return ["reserved", "confirmed", "preparing"].includes(o.status);
  return o.status === f;
}

export function OrdersScreen({ navigation }: Props) {
  const { orders, cancelOrder } = useApp();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [armId, setArmId] = useState<string | null>(null);
  const filtered = orders.filter((o) => matches(o, filter));
  const countFor = (f: FilterKey) => orders.filter((o) => matches(o, f)).length;
  const activeCount = countFor("en_cours");
  const readyCount = countFor("ready");
  const totalValue = orders
    .filter((o) => o.status !== "cancelled" && o.status !== "delivered")
    .reduce((acc, o) => acc + o.totalTnd, 0);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={[styles.head, shadow.card]}>
        <Text style={styles.h}>📦 Mes Commandes</Text>
        <Text style={styles.sub}>Suivi en temps réel de vos réservations</Text>
      </View>

      {orders.length > 0 ? (
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statN}>{activeCount}</Text>
            <Text style={styles.statL}>EN COURS</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>📫</Text>
            <Text style={styles.statN}>{readyCount}</Text>
            <Text style={styles.statL}>À RETIRER</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statN, { color: colors.primary }]}>
              {totalValue}
            </Text>
            <Text style={[styles.statL, { color: colors.primary }]}>TND</Text>
          </View>
        </View>
      ) : null}

      {orders.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {(
            [
              ["all", "Toutes"],
              ["en_cours", "En cours"],
              ["ready", "Prêtes"],
              ["delivered", "Livrées"],
              ["cancelled", "Annulées"],
            ] as [FilterKey, string][]
          ).map(([k, l]) => (
            <Chip
              key={k}
              label={l}
              count={countFor(k)}
              selected={filter === k}
              onPress={() => setFilter(k)}
            />
          ))}
        </ScrollView>
      ) : null}

      {filtered.map((order) => {
        const meta = STATUS_META[order.status] ?? STATUS_META.reserved;
        const idx = STEPS.findIndex((s) => s.key === order.status);
        return (
          <View key={order.id} style={[styles.card, shadow.card]}>
            <View style={styles.cardHead}>
              <Text style={styles.code}>{order.orderCode}</Text>
              <View style={[styles.stBadge, { backgroundColor: meta.bg }]}>
                <Text style={[styles.stTxt, { color: meta.color }]}>
                  {meta.label}
                </Text>
              </View>
              <Text style={styles.date}>
                {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                })}
              </Text>
            </View>

            <PressScale
              onPress={() =>
                navigation.navigate("Product", { listingId: order.partId })
              }
              style={styles.partRow}
            >
              <Image
                source={{ uri: order.partImage || FALLBACK_PART_IMAGE }}
                style={styles.thumb}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.partName}>{order.partName}</Text>
                <PressScale
                  onPress={() =>
                    navigation.navigate("Store", { storeId: order.shopId })
                  }
                >
                  <Text style={styles.shop}>
                    🏪 {order.shopName} · {order.shopCity}
                  </Text>
                </PressScale>
              </View>
              <Text style={styles.price}>{order.totalTnd} TND</Text>
            </PressScale>

            <View
              style={[
                styles.deliv,
                order.deliveryOption === "express_delivery"
                  ? styles.delivOrange
                  : styles.delivBlue,
              ]}
            >
              <Text
                style={{
                  fontWeight: "800",
                  fontSize: 11,
                  color:
                    order.deliveryOption === "express_delivery"
                      ? "#C2410C"
                      : colors.primary,
                }}
              >
                {order.deliveryOption === "express_delivery"
                  ? "🚚 Livraison express 24h"
                  : `🏪 Retrait en magasin • ${order.customerCity}`}
              </Text>
            </View>

            {order.status === "cancelled" ? (
              <Text style={styles.cancelNote}>
                Cette réservation a été annulée. Le stock a été libéré.
              </Text>
            ) : (
              <View style={styles.steps}>
                {STEPS.map((s, i) => (
                  <View key={s.key} style={styles.step}>
                    <View
                      style={[
                        styles.dot,
                        i <= idx && styles.dotOn,
                        i === idx && styles.dotNow,
                      ]}
                    >
                      <Text style={{ fontSize: 12 }}>{s.icon}</Text>
                    </View>
                    <Text style={[styles.stepL, i <= idx && { color: "#065F46" }]}>
                      {s.label}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {order.notes && order.status !== "cancelled" ? (
              <Text style={styles.note}>📝 {order.notes}</Text>
            ) : null}

            {order.status !== "cancelled" ? (
              <View style={styles.actions}>
                <PressScale
                  onPress={() =>
                    void openWhatsApp(
                      order.shopWhatsapp,
                      orderWhatsAppMessage(order.orderCode, order.partName),
                    )
                  }
                  style={styles.wa}
                >
                  <Text style={styles.waTxt}>WhatsApp</Text>
                </PressScale>
                <PressScale
                  onPress={() => void openCall(order.shopPhone)}
                  style={styles.call}
                >
                  <Text style={styles.callTxt}>Appeler</Text>
                </PressScale>
                {(order.status === "reserved" || order.status === "confirmed") && (
                  <PressScale
                    onPress={() => {
                      if (armId !== order.id) {
                        setArmId(order.id);
                        setTimeout(
                          () => setArmId((c) => (c === order.id ? null : c)),
                          3000,
                        );
                        return;
                      }
                      void cancelOrder(order.id);
                      setArmId(null);
                    }}
                    style={[styles.cancel, armId === order.id && styles.cancelArm]}
                  >
                    <Text
                      style={[
                        styles.cancelTxt,
                        armId === order.id && { color: "#fff" },
                      ]}
                    >
                      {armId === order.id ? "Confirmer ?" : "Annuler"}
                    </Text>
                  </PressScale>
                )}
              </View>
            ) : null}
          </View>
        );
      })}

      {orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 40 }}>📦</Text>
          <Text style={styles.emptyH}>Aucune réservation</Text>
          <PressScale
            onPress={() => navigation.navigate("Home")}
            style={styles.emptyBtn}
          >
            <Text style={styles.emptyBtnTxt}>Trouver une pièce maintenant</Text>
          </PressScale>
        </View>
      ) : filtered.length === 0 ? (
        <Text style={styles.none}>Aucune commande dans ce filtre.</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.md, paddingBottom: 40 },
  head: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  h: { fontWeight: "800", fontSize: 18, color: colors.text },
  sub: { color: colors.textMuted, marginTop: 4, fontSize: 13 },
  stats: { flexDirection: "row", gap: 8, marginBottom: 12 },
  stat: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: { fontSize: 18 },
  statN: { fontWeight: "800", fontSize: 20, color: colors.text },
  statL: { fontSize: 10, fontWeight: "800", color: colors.textMuted },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  code: { fontWeight: "800", color: colors.primary, fontSize: 14 },
  stBadge: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  stTxt: { fontSize: 10, fontWeight: "800" },
  date: { marginLeft: "auto", color: colors.textMuted, fontSize: 11, fontWeight: "600" },
  partRow: { flexDirection: "row", gap: 10, padding: 14, alignItems: "center" },
  thumb: { width: 64, height: 64, borderRadius: 16, backgroundColor: "#eee" },
  partName: { fontWeight: "800", color: colors.text, fontSize: 14 },
  shop: { color: colors.textMuted, marginTop: 4, fontSize: 12 },
  price: { fontWeight: "800", color: colors.primary, fontSize: 16 },
  deliv: {
    marginHorizontal: 14,
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  delivBlue: { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" },
  delivOrange: { backgroundColor: "#FFF7ED", borderColor: "#FED7AA" },
  steps: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 10,
  },
  step: { alignItems: "center", flex: 1 },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  dotOn: { backgroundColor: "#059669", borderColor: "#059669" },
  dotNow: { borderWidth: 3, borderColor: "#A7F3D0" },
  stepL: { fontSize: 9, fontWeight: "800", marginTop: 4, color: colors.textMuted },
  note: {
    marginHorizontal: 14,
    marginBottom: 10,
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 8,
    fontSize: 11,
    color: colors.textMuted,
  },
  cancelNote: {
    margin: 14,
    backgroundColor: "#FEF2F2",
    color: "#B91C1C",
    fontWeight: "700",
    padding: 10,
    borderRadius: 12,
  },
  actions: { flexDirection: "row", gap: 8, padding: 14, paddingTop: 0 },
  wa: {
    flex: 1,
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  waTxt: { color: "#047857", fontWeight: "800", fontSize: 12 },
  call: {
    flex: 1,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  callTxt: { color: colors.primary, fontWeight: "800", fontSize: 12 },
  cancel: {
    paddingHorizontal: 10,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  cancelArm: { backgroundColor: "#DC2626", borderColor: "#DC2626" },
  cancelTxt: { color: "#DC2626", fontWeight: "800", fontSize: 12 },
  empty: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyH: { fontWeight: "800", fontSize: 17 },
  emptyBtn: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  emptyBtnTxt: { color: "#fff", fontWeight: "800" },
  none: { textAlign: "center", color: colors.textMuted, marginTop: 20 },
});
