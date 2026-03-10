import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

import { useOceanStore } from "../store/useOceanStore";
import { palette, radius, shadows, spacing, typography } from "../theme";

export function NoticeBanner() {
  const notice = useOceanStore((state) => state.pendingNotice);
  const dismissNotice = useOceanStore((state) => state.dismissNotice);
  const translateY = useRef(new Animated.Value(-28)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    translateY.setValue(-28);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    timeoutRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -24,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => dismissNotice());
    }, 2600);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [dismissNotice, notice, opacity, translateY]);

  if (!notice) {
    return null;
  }

  const toneStyle =
    notice.tone === "error"
      ? styles.errorTone
      : notice.tone === "info"
        ? styles.infoTone
        : styles.successTone;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.root,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Pressable onPress={dismissNotice}>
        <View style={[styles.card, toneStyle]}>
          <Text style={styles.title}>{notice.title}</Text>
          <Text style={styles.message}>{notice.message}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 20,
  },
  card: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    ...shadows.soft,
  },
  successTone: {
    backgroundColor: "rgba(234, 249, 243, 0.96)",
    borderColor: "rgba(97, 175, 134, 0.28)",
  },
  infoTone: {
    backgroundColor: "rgba(233, 245, 255, 0.97)",
    borderColor: "rgba(95, 165, 201, 0.28)",
  },
  errorTone: {
    backgroundColor: "rgba(255, 240, 236, 0.98)",
    borderColor: "rgba(231, 133, 115, 0.32)",
  },
  title: {
    fontFamily: typography.bodyBold,
    color: palette.ink,
    fontSize: 14,
  },
  message: {
    fontFamily: typography.body,
    color: palette.deep,
    fontSize: 13,
    lineHeight: 18,
  },
});
