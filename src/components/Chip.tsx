import { Pressable, StyleSheet, Text } from "react-native";

import { palette, radius, spacing, typography } from "../theme";

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function Chip({ label, active = false, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipActive: {
    backgroundColor: palette.deep,
    borderColor: palette.deep,
  },
  label: {
    fontFamily: typography.bodyBold,
    fontSize: 13,
    color: palette.ink,
  },
  labelActive: {
    color: palette.pearl,
  },
});
