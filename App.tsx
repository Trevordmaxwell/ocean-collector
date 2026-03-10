import "react-native-gesture-handler";

import {
  Fredoka_600SemiBold,
  Fredoka_700Bold,
  useFonts as useFredokaFonts,
} from "@expo-google-fonts/fredoka";
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import { useFonts as useExpoFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { CelebrationOverlay } from "./src/components/CelebrationOverlay";
import { NoticeBanner } from "./src/components/NoticeBanner";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { useOceanStore } from "./src/store/useOceanStore";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function App() {
  const hasHydrated = useOceanStore((state) => state.hasHydrated);
  const [brandFontsLoaded, brandFontError] = useFredokaFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
  });
  const [bodyFontsLoaded, bodyFontError] = useExpoFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_700Bold,
  });

  const ready =
    (brandFontsLoaded && bodyFontsLoaded && hasHydrated) ||
    Boolean(brandFontError) ||
    Boolean(bodyFontError);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <View style={{ flex: 1 }}>
          <AppNavigator />
          <CelebrationOverlay />
          <NoticeBanner />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
