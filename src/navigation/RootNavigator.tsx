import React from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useApp } from "../context/AppContext";
import { AppHeader } from "../components/AppHeader";
import { HomeScreen } from "../screens/HomeScreen";
import { QuotesScreen } from "../screens/QuotesScreen";
import { OrdersScreen } from "../screens/OrdersScreen";
import { AccountScreen } from "../screens/AccountScreen";
import { ProductScreen } from "../screens/ProductScreen";
import { StoreScreen } from "../screens/StoreScreen";
import { ReserveScreen } from "../screens/ReserveScreen";
import { AiScanScreen } from "../screens/AiScanScreen";
import { AddPartScreen } from "../screens/AddPartScreen";
import { SellerScreen } from "../screens/SellerScreen";
import { colors, fontSize, layout } from "../theme";
import type { MainTabParamList, RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({
  emoji,
  focused,
  badge,
}: {
  emoji: string;
  focused: boolean;
  badge?: number;
}) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconOn]}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      {badge && badge > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeTxt}>{badge > 9 ? "9+" : badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

function BuyerTabs() {
  const { quotes, orders } = useApp();
  const openOrders = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled",
  ).length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Catalogue",
          tabBarIcon: ({ focused }) => <TabIcon emoji="▦" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Quotes"
        component={QuotesScreen}
        options={{
          title: "Devis",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="☰" focused={focused} badge={quotes.length} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: "Commandes",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📦" focused={focused} badge={openOrders} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: "Compte",
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

function MainTabs() {
  const { mode } = useApp();
  return (
    <View style={styles.main}>
      <AppHeader />
      {mode === "seller" ? <SellerScreen /> : <BuyerTabs />}
    </View>
  );
}

function BootScreen({
  navigation,
}: {
  navigation: { replace: (name: keyof RootStackParamList) => void };
}) {
  const { ready } = useApp();
  React.useEffect(() => {
    if (ready) navigation.replace("Main");
  }, [ready, navigation]);
  return (
    <View style={styles.boot}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.bootText}>PiècesExpress TN</Text>
    </View>
  );
}

export function RootNavigator() {
  return (
    <View style={styles.shellOuter}>
      <View style={styles.shellInner}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Boot" component={BootScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="Product"
              component={ProductScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="Store"
              component={StoreScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="Reserve"
              component={ReserveScreen}
              options={{ animation: "slide_from_bottom" }}
            />
            <Stack.Screen
              name="AiScan"
              component={AiScanScreen}
              options={{ animation: "slide_from_bottom" }}
            />
            <Stack.Screen
              name="AddPart"
              component={AddPartScreen}
              options={{ animation: "slide_from_bottom" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shellOuter: {
    flex: 1,
    backgroundColor: "#0B1220",
    alignItems: "center",
    justifyContent: Platform.OS === "web" ? "center" : "flex-start",
    paddingVertical: Platform.OS === "web" ? 16 : 0,
  },
  shellInner: {
    flex: 1,
    width: "100%",
    maxWidth: layout.maxWidth,
    maxHeight: Platform.OS === "web" ? 844 : undefined,
    backgroundColor: colors.background,
    overflow: "hidden",
    borderRadius: Platform.OS === "web" ? 28 : 0,
    borderWidth: Platform.OS === "web" ? 8 : 0,
    borderColor: "#111827",
  },
  main: { flex: 1, backgroundColor: colors.background },
  tabIcon: {
    width: 44,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconOn: { backgroundColor: colors.primarySoft },
  badge: {
    position: "absolute",
    top: -2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeTxt: { color: "#fff", fontSize: 9, fontWeight: "800" },
  boot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    gap: 16,
  },
  bootText: {
    color: "#fff",
    fontSize: fontSize.xl,
    fontWeight: "800",
  },
});
