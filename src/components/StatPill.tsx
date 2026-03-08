import { StyleSheet, Text, View } from "react-native";

import { palette, radius, spacing, typography } from "../theme";

interface StatPillProps {
  label: string;
  value: string;
}

export function StatPill({ label, value }: StatPillProps) {
  return (
    <View style={styles.pill}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flex: 1,
    minWidth: 100,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: "rgba(255,255,255,0.68)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 2,
  },
  value: {
    fontFamily: typography.heading,
    color: palette.deep,
    fontSize: 20,
  },
  label: {
    fontFamily: typography.bodyMedium,
    color: palette.mist,
    fontSize: 13,
  },
});
