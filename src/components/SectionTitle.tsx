import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette, spacing, typography } from "../theme";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onPressAction?: () => void;
}

export function SectionTitle({
  title,
  subtitle,
  actionLabel,
  onPressAction,
}: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onPressAction ? (
        <Pressable onPress={onPressAction}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: typography.headingSoft,
    fontSize: 22,
    color: palette.ink,
  },
  subtitle: {
    fontFamily: typography.body,
    color: palette.mist,
    fontSize: 14,
  },
  action: {
    fontFamily: typography.bodyBold,
    color: palette.lagoon,
    fontSize: 14,
  },
});
