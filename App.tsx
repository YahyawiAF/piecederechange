import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, TextInput } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "./src/context/AppContext";
import { ShopProvider } from "./src/context/ShopContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

// Design system: Inter only (regular + bold)
const textBase = { fontFamily: "Inter_400Regular" as const };
const TextAny = Text as unknown as { defaultProps?: { style?: object } };
const InputAny = TextInput as unknown as { defaultProps?: { style?: object } };
TextAny.defaultProps = {
  ...TextAny.defaultProps,
  style: [TextAny.defaultProps?.style, textBase],
};
InputAny.defaultProps = {
  ...InputAny.defaultProps,
  style: [InputAny.defaultProps?.style, textBase],
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) setAppReady(true);
  }, [fontsLoaded]);

  const onLayout = useCallback(async () => {
    if (appReady) await SplashScreen.hideAsync();
  }, [appReady]);

  if (!appReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayout}>
      <SafeAreaProvider>
        <AppProvider>
          <ShopProvider>
            <StatusBar style="dark" />
            <RootNavigator />
          </ShopProvider>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
