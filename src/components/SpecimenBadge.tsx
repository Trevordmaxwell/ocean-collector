import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, type ImageSourcePropType } from "react-native";

import { palette, radius, shadows } from "../theme";

interface SpecimenBadgeProps {
  imageSource?: ImageSourcePropType;
  imageUri?: string;
  emoji?: string;
  size?: number;
}

export function SpecimenBadge({
  imageSource,
  imageUri,
  emoji = "🫧",
  size = 60,
}: SpecimenBadgeProps) {
  const [didError, setDidError] = useState(false);

  useEffect(() => {
    setDidError(false);
  }, [imageSource, imageUri]);

  const showImage = Boolean(imageSource || imageUri) && !didError;

  return (
    <View
      style={[
        styles.frame,
        {
          width: size,
          height: size,
          borderRadius: Math.min(radius.lg + 2, size / 2.8),
        },
      ]}
    >
      {showImage ? (
        <Image
          source={imageSource ?? { uri: imageUri }}
          resizeMode="contain"
          style={styles.image}
          onError={() => setDidError(true)}
        />
      ) : (
        <Text style={[styles.emoji, { fontSize: size * 0.46 }]}>{emoji}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    backgroundColor: "rgba(255,255,255,0.74)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    overflow: "hidden",
    ...shadows.soft,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  emoji: {
    color: palette.ink,
  },
});
