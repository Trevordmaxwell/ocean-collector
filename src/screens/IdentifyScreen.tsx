import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { FindTile } from "../components/FindTile";
import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { getLibraryItem } from "../data/library";
import { identifyBeachFind } from "../services/identification";
import { useOceanStore } from "../store/useOceanStore";
import { gradients, palette, radius, spacing, typography } from "../theme";
import type { IdentificationSession } from "../types/models";
import type { RootScreenProps } from "../navigation/types";

export function IdentifyScreen({ navigation, route }: RootScreenProps<"Identify">) {
  const { category } = route.params;
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [session, setSession] = useState<IdentificationSession | null>(null);
  const [loading, setLoading] = useState(false);
  const saveIdentifiedFind = useOceanStore((state) => state.saveIdentifiedFind);

  const title = category === "shell" ? "Identify a Shell" : "Identify a Shark Tooth";
  const accent = category === "shell" ? gradients.shell : gradients.tooth;

  async function runMockScan(uri: string) {
    setLoading(true);
    setSession(null);

    try {
      const result = await identifyBeachFind(category, uri);
      setSession(result);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => undefined,
      );
    } finally {
      setLoading(false);
    }
  }

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Photo access needed", "Please allow photo access to try the AI-style ID flow.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.9,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.canceled) {
      return;
    }

    const uri = result.assets[0]?.uri;

    if (!uri) {
      return;
    }

    setImageUri(uri);
    await runMockScan(uri);
  }

  function saveMatch(matchId: string, source: "ai" | "manual") {
    const item = getLibraryItem(category, matchId);

    if (!item) {
      return;
    }

    saveIdentifiedFind({
      category,
      referenceId: matchId,
      location: location || "Beach adventure",
      notes,
      userPhotoUri: imageUri || undefined,
      source,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => undefined,
    );
    Alert.alert("Saved!", `${item.commonName} joined your collection journal.`);
  }

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>← Back</Text>
      </Pressable>

      <OceanCard title={title} subtitle="Upload a photo for a playful best-guess match, or browse manually if you want to compare at your own pace." icon={category === "shell" ? "📷" : "🔎"} accent={accent}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Where did you find it?</Text>
          <TextInput
            placeholder="Myrtle Beach, tide line, family walk..."
            placeholderTextColor={palette.mist}
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            placeholder="Tiny clues like color, shine, or where it was sitting in the sand."
            placeholderTextColor={palette.mist}
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <View style={styles.buttonRow}>
          <Pressable onPress={pickImage} style={[styles.primaryButton, styles.flexButton]}>
            <Text style={styles.primaryButtonLabel}>Choose Photo</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              const demoUri = `demo://${category}/${Date.now()}`;
              setImageUri(demoUri);
              runMockScan(demoUri);
            }}
            style={[styles.secondaryButton, styles.flexButton]}
          >
            <Text style={styles.secondaryButtonLabel}>Try Demo Match</Text>
          </Pressable>
        </View>

        <Text style={styles.caption}>
          MVP note: this uses a placeholder AI pipeline with a clean service boundary, so a real classifier can plug in later.
        </Text>
      </OceanCard>

      {loading ? (
        <OceanCard title="Looking for the closest match..." subtitle="Searching the guide shelf." icon="✨">
          <ActivityIndicator color={palette.deep} />
        </OceanCard>
      ) : null}

      {session ? (
        <>
          <SectionTitle
            title="Best Guess Matches"
            subtitle="These are playful prototype predictions for the first pass."
          />
          {session.matches.map((match, index) => {
            const item = getLibraryItem(category, match.id);

            if (!item) {
              return null;
            }

            return (
              <OceanCard
                key={match.id}
                title={item.commonName}
                subtitle={`${match.confidence}% match • ${match.reason}`}
                icon={index === 0 ? "🌟" : "🫧"}
                accent={item.cardPalette}
              >
                <Text style={styles.resultBody}>{item.summary}</Text>
                <View style={styles.buttonRow}>
                  <Pressable
                    onPress={() => saveMatch(match.id, "ai")}
                    style={[styles.primaryButton, styles.flexButton]}
                  >
                    <Text style={styles.primaryButtonLabel}>Save to Collection</Text>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      navigation.navigate("ItemDetail", { category, id: match.id })
                    }
                    style={[styles.secondaryButton, styles.flexButton]}
                  >
                    <Text style={styles.secondaryButtonLabel}>Open Guide Card</Text>
                  </Pressable>
                </View>
              </OceanCard>
            );
          })}
        </>
      ) : null}

      <SectionTitle
        title="Prefer manual compare?"
        subtitle="Browse the full library with filters, lookalikes, and fun clues."
        actionLabel="Open Library"
        onPressAction={() => navigation.navigate("Library", { category })}
      />

      <FindTile
        title={category === "shell" ? "Shell Library" : "Shark Tooth Library"}
        subtitle="Scroll, compare, and save by hand"
        emoji={category === "shell" ? "🌺" : "🦷"}
        palettePair={accent as [string, string]}
        detail="Manual matching still awards points when you save a confident find."
        onPress={() => navigation.navigate("Library", { category })}
      />
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
  formGroup: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: typography.bodyBold,
    color: palette.ink,
    fontSize: 14,
  },
  input: {
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: typography.body,
    fontSize: 15,
    color: palette.ink,
  },
  notesInput: {
    minHeight: 88,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
  primaryButton: {
    borderRadius: radius.pill,
    backgroundColor: palette.deep,
    paddingVertical: spacing.sm + 2,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonLabel: {
    fontFamily: typography.headingSoft,
    color: palette.pearl,
    fontSize: 15,
  },
  secondaryButton: {
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.78)",
    paddingVertical: spacing.sm + 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: palette.border,
  },
  secondaryButtonLabel: {
    fontFamily: typography.bodyBold,
    color: palette.deep,
    fontSize: 15,
  },
  caption: {
    fontFamily: typography.body,
    color: palette.mist,
    fontSize: 13,
    lineHeight: 18,
  },
  resultBody: {
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: palette.deep,
  },
});
