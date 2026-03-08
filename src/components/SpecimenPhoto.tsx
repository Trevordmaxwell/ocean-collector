import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { palette, radius, shadows, spacing, typography } from "../theme";

interface SpecimenPhotoProps {
  imageUri?: string;
  emoji?: string;
  title: string;
}

export function SpecimenPhoto({
  imageUri,
  emoji = "🫧",
  title,
}: SpecimenPhotoProps) {
  const [didError, setDidError] = useState(false);

  useEffect(() => {
    setDidError(false);
  }, [imageUri]);

  const showImage = Boolean(imageUri) && !didError;

  return (
    <View style={styles.frame}>
      {showImage ? (
        <Image
          accessibilityLabel={title}
          source={{ uri: imageUri }}
          resizeMode="contain"
          style={styles.image}
          onError={() => setDidError(true)}
        />
      ) : (
        <View style={styles.fallbackWrap}>
          <Text style={styles.fallbackEmoji}>{emoji}</Text>
          <Text style={styles.fallbackLabel}>{title}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    minHeight: 220,
    borderRadius: radius.lg + 8,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.72)",
    padding: spacing.md,
    justifyContent: "center",
    overflow: "hidden",
    ...shadows.soft,
  },
  image: {
    width: "100%",
    height: 220,
  },
  fallbackWrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  fallbackEmoji: {
    fontSize: 54,
  },
  fallbackLabel: {
    fontFamily: typography.bodyMedium,
    color: palette.mist,
    fontSize: 14,
  },
});
