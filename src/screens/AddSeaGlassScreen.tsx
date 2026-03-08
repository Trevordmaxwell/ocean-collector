import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Chip } from "../components/Chip";
import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { seaGlassPresets } from "../data";
import { useOceanStore } from "../store/useOceanStore";
import { palette, radius, spacing, typography } from "../theme";
import type { RootScreenProps } from "../navigation/types";

const sizes = ["tiny", "small", "medium", "large"] as const;
const shapes = ["rounded", "jagged", "gem", "chunky"] as const;
const surfaces = ["flat", "curved"] as const;

export function AddSeaGlassScreen({ navigation }: RootScreenProps<"AddSeaGlass">) {
  const [selectedPresetId, setSelectedPresetId] = useState(seaGlassPresets[0]!.id);
  const [size, setSize] = useState<(typeof sizes)[number]>("small");
  const [shape, setShape] = useState<(typeof shapes)[number]>("rounded");
  const [surface, setSurface] = useState<(typeof surfaces)[number]>("flat");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const addSeaGlassFind = useOceanStore((state) => state.addSeaGlassFind);

  const preset = seaGlassPresets.find((entry) => entry.id === selectedPresetId) ?? seaGlassPresets[0]!;

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>← Back</Text>
      </Pressable>

      <OceanCard
        title="Log Sea Glass"
        subtitle="A lightweight, collectible bonus for sparkly little finds."
        icon="💎"
        accent={["#CBEFDF", "#F2FFF9"]}
      >
        <Text style={styles.label}>Color vibe</Text>
        <View style={styles.choiceWrap}>
          {seaGlassPresets.map((entry) => (
            <Pressable
              key={entry.id}
              onPress={() => setSelectedPresetId(entry.id)}
              style={[
                styles.colorChip,
                selectedPresetId === entry.id && styles.colorChipActive,
                { backgroundColor: entry.colorHex },
              ]}
            >
              <Text style={styles.colorChipLabel}>{entry.colorName}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.helper}>{preset.funFact}</Text>

        <Text style={styles.label}>Size</Text>
        <View style={styles.choiceWrap}>
          {sizes.map((entry) => (
            <Chip
              key={entry}
              label={entry}
              active={entry === size}
              onPress={() => setSize(entry)}
            />
          ))}
        </View>

        <Text style={styles.label}>Shape</Text>
        <Text style={styles.helper}>
          Pick the main shape, then whether the piece feels flat or curved.
        </Text>
        <View style={styles.choiceWrap}>
          {shapes.map((entry) => (
            <Chip
              key={entry}
              label={entry}
              active={entry === shape}
              onPress={() => setShape(entry)}
            />
          ))}
        </View>

        <View style={[styles.choiceWrap, styles.surfaceChoiceWrap]}>
          {surfaces.map((entry) => (
            <Chip
              key={entry}
              label={entry}
              active={entry === surface}
              onPress={() => setSurface(entry)}
            />
          ))}
        </View>
        <Text style={styles.shapeHelper}>
          Flat pieces often come from bottle walls, while curved ones can feel like little rim or neck treasures.
        </Text>

        <Text style={styles.label}>Where did you find it?</Text>
        <TextInput
          placeholder="Jetty edge, tide pool, shell line..."
          placeholderTextColor={palette.mist}
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          placeholder="Add sparkle notes, shape notes, or who found it."
          placeholderTextColor={palette.mist}
          style={[styles.input, styles.notesInput]}
          multiline
          value={note}
          onChangeText={setNote}
        />

        <Pressable
          onPress={() => {
            addSeaGlassFind({
              presetId: preset.id,
              colorName: preset.colorName,
              rarity: preset.rarity,
              size,
              shape,
              surface,
              location: location || "Beach wander",
              note,
            });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
              () => undefined,
            );
            Alert.alert("Added!", `${preset.colorName} sea glass joined your collection.`);
            navigation.goBack();
          }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonLabel}>
            Save sea glass (+{8 + preset.pointsBonus} pts)
          </Text>
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
  shapeHelper: {
    fontFamily: typography.body,
    color: palette.mist,
    fontSize: 13,
    lineHeight: 18,
  },
  choiceWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  surfaceChoiceWrap: {
    marginTop: spacing.xs,
  },
  colorChip: {
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorChipActive: {
    borderColor: palette.deep,
  },
  colorChipLabel: {
    fontFamily: typography.bodyBold,
    color: palette.ink,
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
