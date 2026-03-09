import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useOceanStore } from "../store/useOceanStore";
import { palette, radius, shadows, spacing, typography } from "../theme";

export function CelebrationOverlay() {
  const celebration = useOceanStore((state) => state.pendingCelebration);
  const dismissCelebration = useOceanStore((state) => state.dismissCelebration);
  const backdrop = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.86)).current;
  const sharkX = useRef(new Animated.Value(-150)).current;
  const sharkY = useRef(new Animated.Value(64)).current;
  const bubbleOne = useRef(new Animated.Value(0)).current;
  const bubbleTwo = useRef(new Animated.Value(0)).current;
  const autoDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sharkRotate = useMemo(
    () =>
      sharkY.interpolate({
        inputRange: [-46, 0, 64],
        outputRange: ["-16deg", "6deg", "18deg"],
      }),
    [sharkY],
  );

  useEffect(() => {
    if (!celebration) {
      return undefined;
    }

    backdrop.setValue(0);
    cardScale.setValue(0.86);
    sharkX.setValue(-150);
    sharkY.setValue(64);
    bubbleOne.setValue(0);
    bubbleTwo.setValue(0);

    Animated.parallel([
      Animated.timing(backdrop, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        damping: 12,
        stiffness: 150,
        mass: 0.95,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(90),
        Animated.parallel([
          Animated.timing(sharkX, {
            toValue: 6,
            duration: 540,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(sharkY, {
              toValue: -48,
              duration: 250,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(sharkY, {
              toValue: 4,
              duration: 290,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(250),
        Animated.timing(bubbleOne, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(360),
        Animated.timing(bubbleTwo, {
          toValue: 1,
          duration: 440,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    autoDismissRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 0,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 0.92,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => dismissCelebration());
    }, 2800);

    return () => {
      if (autoDismissRef.current) {
        clearTimeout(autoDismissRef.current);
        autoDismissRef.current = null;
      }
    };
  }, [
    backdrop,
    bubbleOne,
    bubbleTwo,
    cardScale,
    celebration,
    dismissCelebration,
    sharkX,
    sharkY,
  ]);

  if (!celebration) {
    return null;
  }

  const mascot = celebration.kind === "quest" ? "🐬" : "🦈";
  const bannerLabel =
    celebration.kind === "quest" ? "Treasure claimed!" : "Splash milestone!";
  const rewardChipStyle =
    celebration.kind === "quest" ? styles.questRewardChip : styles.rewardChip;
  const rewardChipLabelStyle =
    celebration.kind === "quest"
      ? styles.questRewardChipLabel
      : styles.rewardChipLabel;

  return (
    <Animated.View pointerEvents="box-none" style={[styles.root, { opacity: backdrop }]}>
      <Pressable style={styles.backdropTap} onPress={dismissCelebration} />
      <View style={styles.cardWrap} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: cardScale }],
            },
          ]}
        >
          <View style={[styles.waveTop, { backgroundColor: celebration.accent[0] }]}>
            <Animated.Text
              style={[
                styles.shark,
                {
                  transform: [
                    { translateX: sharkX },
                    { translateY: sharkY },
                    { rotate: sharkRotate },
                  ],
                },
              ]}
            >
              {mascot}
            </Animated.Text>
            <Animated.View
              style={[
                styles.bubble,
                styles.bubbleOne,
                {
                  opacity: bubbleOne,
                  transform: [
                    {
                      translateY: bubbleOne.interpolate({
                        inputRange: [0, 1],
                        outputRange: [14, -12],
                      }),
                    },
                    {
                      scale: bubbleOne.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.bubble,
                styles.bubbleTwo,
                {
                  opacity: bubbleTwo,
                  transform: [
                    {
                      translateY: bubbleTwo.interpolate({
                        inputRange: [0, 1],
                        outputRange: [18, -18],
                      }),
                    },
                    {
                      scale: bubbleTwo.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1.08],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Text style={styles.waveText}>{bannerLabel}</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{celebration.title}</Text>
            <Text style={styles.description}>{celebration.description}</Text>

            <View style={rewardChipStyle}>
              <Text style={rewardChipLabelStyle}>{celebration.rewardLabel}</Text>
            </View>

            <Text style={styles.tapHint}>Tap anywhere to keep exploring</Text>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    padding: spacing.lg,
  },
  backdropTap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(18, 53, 73, 0.26)",
  },
  cardWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 380,
    overflow: "hidden",
    borderRadius: radius.lg + 8,
    backgroundColor: palette.pearl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.86)",
    ...shadows.card,
  },
  waveTop: {
    minHeight: 180,
    overflow: "hidden",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    justifyContent: "flex-end",
    backgroundColor: "#D9F1F9",
  },
  shark: {
    position: "absolute",
    left: 28,
    bottom: 26,
    fontSize: 58,
  },
  bubble: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.88)",
  },
  bubbleOne: {
    width: 18,
    height: 18,
    right: 84,
    top: 56,
  },
  bubbleTwo: {
    width: 12,
    height: 12,
    right: 56,
    top: 86,
  },
  waveText: {
    marginBottom: spacing.lg,
    fontFamily: typography.headingSoft,
    fontSize: 18,
    color: palette.deep,
    textAlign: "center",
  },
  content: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  title: {
    fontFamily: typography.heading,
    fontSize: 28,
    color: palette.ink,
    textAlign: "center",
  },
  description: {
    fontFamily: typography.bodyMedium,
    fontSize: 15,
    lineHeight: 22,
    color: palette.deep,
    textAlign: "center",
  },
  rewardChip: {
    marginTop: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: "#EAF9F3",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(34,83,109,0.08)",
  },
  rewardChipLabel: {
    fontFamily: typography.bodyBold,
    fontSize: 13,
    color: palette.kelp,
  },
  questRewardChip: {
    marginTop: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: "#FFF4C8",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.88)",
  },
  questRewardChipLabel: {
    fontFamily: typography.bodyBold,
    fontSize: 13,
    color: palette.deep,
  },
  tapHint: {
    fontFamily: typography.body,
    fontSize: 13,
    color: palette.mist,
  },
});
