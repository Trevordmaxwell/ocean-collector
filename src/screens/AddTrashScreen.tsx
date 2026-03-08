import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Chip } from "../components/Chip";
import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { trashCategories } from "../data";
import { getPointsForTrash } from "../services/rewardEngine";
import { useOceanStore } from "../store/useOceanStore";
import { palette, radius, spacing, typography } from "../theme";
import type { RootScreenProps } from "../navigation/types";

export function AddTrashScreen({ navigation }: RootScreenProps<"AddTrash">) {
  const [trashCategoryId, setTrashCategoryId] = useState(trashCategories[0]!.id);
  const [count, setCount] = useState(1);
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const addTrashPickup = useOceanStore((state) => state.addTrashPickup);

  const selectedCategory =
    trashCategories.find((item) => item.id === trashCategoryId) ?? trashCategories[0]!;
  const points = getPointsForTrash(trashCategoryId, count);

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>← Back</Text>
      </Pressable>

      <OceanCard
        title="Log Trash Pickup"
        subtitle="Make cleanup feel rewarding, hopeful, and visible."
        icon="🪣"
        accent={["#FFE8BD", "#FFF8E6"]}
      >
        <Text style={styles.label}>What did you pick up?</Text>
        <View style={styles.choiceWrap}>
          {trashCategories.map((category) => (
            <Chip
              key={category.id}
              label={`${category.icon} ${category.label}`}
              active={category.id === trashCategoryId}
              onPress={() => setTrashCategoryId(category.id)}
            />
          ))}
        </View>

        <Text style={styles.helper}>{selectedCategory.encouragement}</Text>

        <Text style={styles.label}>How many pieces?</Text>
        <View style={styles.counterRow}>
          <Pressable onPress={() => setCount((value) => Math.max(1, value - 1))} style={styles.counterButton}>
            <Text style={styles.counterButtonLabel}>−</Text>
          </Pressable>
          <Text style={styles.counterValue}>{count}</Text>
          <Pressable onPress={() => setCount((value) => value + 1)} style={styles.counterButton}>
            <Text style={styles.counterButtonLabel}>+</Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Location</Text>
        <TextInput
          placeholder="Near dune path, pier side, north end..."
          placeholderTextColor={palette.mist}
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          placeholder="Optional cleanup notes or mini impact story."
          placeholderTextColor={palette.mist}
          style={[styles.input, styles.notesInput]}
          multiline
          value={note}
          onChangeText={setNote}
        />

        <Pressable
          onPress={() => {
            addTrashPickup({
              trashCategoryId,
              count,
              location: location || "Beach cleanup",
              note,
            });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
              () => undefined,
            );
            Alert.alert("Logged!", `${count} cleanup item${count > 1 ? "s" : ""} saved.`);
            navigation.goBack();
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonLabel}>Save cleanup (+{points} pts)</Text>
        </Pressable>
      </OceanCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topSpacing: {
    height: spacing.sm,
  },
  backButton: {
    fontFamily: typography.bodyBold,
    color: palette.deep,
    fontSize: 15,
  },
  label: {
    fontFamily: typography.bodyBold,
    color: palette.ink,
    fontSize: 14,
  },
  helper: {
    fontFamily: typography.body,
    color: palette.deep,
    fontSize: 14,
    lineHeight: 20,
  },
  choiceWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  counterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.deep,
  },
  counterButtonLabel: {
    fontFamily: typography.heading,
    color: palette.pearl,
    fontSize: 24,
    marginTop: -2,
  },
  counterValue: {
    minWidth: 40,
    textAlign: "center",
    fontFamily: typography.heading,
    color: palette.ink,
    fontSize: 28,
  },
  input: {
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: typography.body,
    fontSize: 15,
    color: palette.ink,
  },
  notesInput: {
    minHeight: 84,
    textAlignVertical: "top",
  },
  primaryButton: {
    marginTop: spacing.xs,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
    backgroundColor: palette.deep,
    alignItems: "center",
  },
  primaryButtonLabel: {
    fontFamily: typography.headingSoft,
    fontSize: 16,
    color: palette.pearl,
  },
});
