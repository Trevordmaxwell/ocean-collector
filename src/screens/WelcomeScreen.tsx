import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ScreenShell } from "../components/ScreenShell";
import { palette, radius, spacing, typography } from "../theme";
import { useOceanStore } from "../store/useOceanStore";
import type { RootScreenProps } from "../navigation/types";

export function WelcomeScreen({ navigation }: RootScreenProps<"Welcome">) {
  const markWelcomeSeen = useOceanStore((state) => state.markWelcomeSeen);

  return (
    <ScreenShell scroll={false} contentContainerStyle={styles.root}>
      <View style={styles.content}>
        <View style={styles.heroBubble}>
          <Text style={styles.heroEmoji}>🐚</Text>
          <Text style={styles.heroEmoji}>🪸</Text>
          <Text style={styles.heroEmoji}>💎</Text>
        </View>

        <View style={styles.copy}>
          <Text style={styles.kicker}>Ocean Collector</Text>
          <Text style={styles.title}>A cozy beach treasure journal with cute Animal Crossing energy.</Text>
          <Text style={styles.subtitle}>
            Snap finds, compare shells and shark teeth, log sea glass, and turn beach cleanup into a feel-good collectible adventure.
          </Text>
        </View>

        <LinearGradient colors={["#F7D3D8", "#FFF1C7", "#CFEAF7"]} style={styles.callout}>
          <Text style={styles.calloutTitle}>Playful, pretty, and beginner-friendly</Text>
          <Text style={styles.calloutBody}>
            Ocean Collector keeps the science approachable, the colors dreamy, and the reward loop delightful.
          </Text>
        </LinearGradient>

        <Pressable
          onPress={() => {
            markWelcomeSeen();
            navigation.replace("MainTabs");
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonLabel}>Start Collecting</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  heroBubble: {
    alignSelf: "center",
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: "rgba(255,255,255,0.62)",
    borderRadius: 999,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  heroEmoji: {
    fontSize: 34,
  },
  copy: {
    gap: spacing.sm,
  },
  kicker: {
    fontFamily: typography.headingSoft,
    fontSize: 18,
    color: palette.lagoon,
  },
  title: {
    fontFamily: typography.heading,
    color: palette.ink,
    fontSize: 38,
    lineHeight: 44,
  },
  subtitle: {
    fontFamily: typography.body,
    color: palette.deep,
    fontSize: 17,
    lineHeight: 26,
  },
  callout: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  calloutTitle: {
    fontFamily: typography.headingSoft,
    fontSize: 18,
    color: palette.ink,
  },
  calloutBody: {
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: palette.deep,
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    backgroundColor: palette.deep,
  },
  primaryButtonLabel: {
    fontFamily: typography.headingSoft,
    color: palette.pearl,
    fontSize: 18,
  },
});
