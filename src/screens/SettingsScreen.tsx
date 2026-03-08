import { StyleSheet, Text, View } from "react-native";

import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { palette, spacing, typography } from "../theme";

export function SettingsScreen() {
  return (
    <ScreenShell>
      <View style={styles.topSpacing} />
      <SectionTitle
        title="Settings & Profile"
        subtitle="Simple placeholders for the first polished foundation pass."
      />

      <OceanCard
        title="Collector Profile"
        subtitle="Future home for avatar customization, favorite beaches, and saved family profiles."
        icon="🪪"
      />
      <OceanCard
        title="AI Identification"
        subtitle="The current photo flow is a placeholder service boundary. Next step is swapping in a real classifier or hosted vision API."
        icon="🤖"
      />
      <OceanCard
        title="Cloud Sync"
        subtitle="Local-first store today. The data shape is ready for future sync and account systems later."
        icon="☁️"
      />
      <OceanCard
        title="Design direction"
        subtitle="Soft ocean colors, toy-like depth, rounded cards, and a cute collectible vibe inspired by cozy life sims."
        icon="🎨"
      >
        <Text style={styles.body}>
          Ocean Collector is intentionally warm and family-friendly, not clinical or dry.
        </Text>
      </OceanCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topSpacing: {
    height: spacing.sm,
  },
  body: {
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: palette.deep,
  },
});
