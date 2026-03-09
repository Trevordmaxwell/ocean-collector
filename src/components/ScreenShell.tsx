import { LinearGradient } from "expo-linear-gradient";
import { useRef, type PropsWithChildren } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { gradients, palette, spacing } from "../theme";

interface ScreenShellProps extends PropsWithChildren {
  scroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function ScreenShell({
  children,
  scroll = true,
  contentContainerStyle,
}: ScreenShellProps) {
  const scrollRef = useRef<ScrollView | null>(null);

  useFocusEffect(() => {
    if (!scroll) {
      return;
    }

    requestAnimationFrame(() => {
      if (Platform.OS === "web") {
        window.scrollTo(0, 0);
      }
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    });
  });

  const content = scroll ? (
    <ScrollView
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.staticContent, contentContainerStyle]}>{children}</View>
  );

  return (
    <LinearGradient colors={gradients.app} style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={[styles.orb, styles.orbOne]} />
        <View style={[styles.orb, styles.orbTwo]} />
        <View style={[styles.orb, styles.orbThree]} />
        {content}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl * 3 + spacing.sm,
    gap: spacing.md,
  },
  staticContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl * 2,
    gap: spacing.md,
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.45,
  },
  orbOne: {
    width: 180,
    height: 180,
    top: -30,
    right: -50,
    backgroundColor: palette.shellPink,
  },
  orbTwo: {
    width: 120,
    height: 120,
    top: 180,
    left: -40,
    backgroundColor: palette.foam,
  },
  orbThree: {
    width: 150,
    height: 150,
    bottom: 100,
    right: -60,
    backgroundColor: "#FCEFB5",
  },
});
