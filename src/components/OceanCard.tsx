import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { SpecimenBadge } from "./SpecimenBadge";
import { palette, radius, shadows, spacing, typography } from "../theme";

interface OceanCardProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  icon?: string;
  imageUri?: string;
  accent?: readonly [string, string, ...string[]];
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function OceanCard({
  title,
  subtitle,
  icon,
  imageUri,
  accent,
  onPress,
  style,
  children,
}: OceanCardProps) {
  const gradientColors =
    accent ?? ([palette.pearl, "rgba(255,255,255,0.9)"] as const);

  const content = (
    <LinearGradient colors={gradientColors} style={styles.card}>
      {(title || subtitle || icon) && (
        <View style={styles.header}>
          <View style={styles.headerText}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {imageUri || icon ? <SpecimenBadge emoji={icon} imageUri={imageUri} size={60} /> : null}
        </View>
      )}
      {children}
    </LinearGradient>
  );

  if (!onPress) {
    return <View style={style}>{content}</View>;
  }

  return (
    <Pressable onPress={onPress} style={style}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: typography.headingSoft,
    fontSize: 20,
    color: palette.ink,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 14,
    color: palette.mist,
    lineHeight: 20,
  },
});
