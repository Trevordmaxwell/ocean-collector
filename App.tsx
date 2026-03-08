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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppNavigator } from "./src/navigation/AppNavigator";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function App() {
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
    (brandFontsLoaded && bodyFontsLoaded) ||
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
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
