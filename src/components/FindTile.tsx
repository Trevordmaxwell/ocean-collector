import type { ImageSourcePropType } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { SpecimenBadge } from "./SpecimenBadge";
import { palette, radius, shadows, spacing, typography } from "../theme";

interface FindTileProps {
  title: string;
  subtitle: string;
  emoji?: string;
  imageSource?: ImageSourcePropType;
  imageUri?: string;
  palettePair: [string, string];
  detail?: string;
  onPress?: () => void;
  trailingLabel?: string;
}

export function FindTile({
  title,
  subtitle,
  emoji,
  imageSource,
  imageUri,
  palettePair,
  detail,
  onPress,
  trailingLabel,
}: FindTileProps) {
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <LinearGradient colors={palettePair} style={styles.tile}>
        <SpecimenBadge
          emoji={emoji}
          imageSource={imageSource}
          imageUri={imageUri}
          size={58}
        />
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {detail ? <Text style={styles.detail}>{detail}</Text> : null}
        </View>
        {trailingLabel ? <Text style={styles.trailing}>{trailingLabel}</Text> : null}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
  },
  tile: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadows.soft,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: typography.headingSoft,
    fontSize: 18,
    color: palette.ink,
  },
  subtitle: {
    fontFamily: typography.bodyMedium,
    color: palette.deep,
    fontSize: 14,
  },
  detail: {
    fontFamily: typography.body,
    color: palette.mist,
    fontSize: 13,
    lineHeight: 18,
  },
  trailing: {
    fontFamily: typography.bodyBold,
    color: palette.deep,
    fontSize: 13,
  },
});
