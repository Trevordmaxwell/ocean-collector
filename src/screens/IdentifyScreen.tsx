import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { FindTile } from "../components/FindTile";
import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { getLibraryItem } from "../data/library";
import { buildAIAssistPayload, parseAIAssistResponse } from "../services/aiAssist";
import { useOceanStore } from "../store/useOceanStore";
import { gradients, palette, radius, spacing, typography } from "../theme";
import type { IdentificationSession } from "../types/models";
import type { RootScreenProps } from "../navigation/types";

function getConfidenceLabel(value: IdentificationSession["matches"][number]["confidenceBand"]) {
  switch (value) {
    case "promising":
      return "Promising clue";
    case "possible":
      return "Possible match";
    case "stretch":
      return "Stretch match";
  }
}

function buildCombinedLocation(beachName: string, placeOnBeach: string) {
  const beach = beachName.trim();
  const place = placeOnBeach.trim();

  if (beach && place) {
    return `${beach} • ${place}`;
  }

  return beach || place || "Beach adventure";
}

export function IdentifyScreen({ navigation, route }: RootScreenProps<"Identify">) {
  const { category } = route.params;
  const [beachName, setBeachName] = useState("");
  const [placeOnBeach, setPlaceOnBeach] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [importText, setImportText] = useState("");
  const [session, setSession] = useState<IdentificationSession | null>(null);
  const saveLibraryMatch = useOceanStore((state) => state.saveLibraryMatch);
  const saveUnknownFind = useOceanStore((state) => state.saveUnknownFind);
  const showNotice = useOceanStore((state) => state.showNotice);

  const title = category === "shell" ? "Identify a Shell" : "Identify a Shark Tooth";
  const accent = category === "shell" ? gradients.shell : gradients.tooth;
  const payload = useMemo(
    () =>
      buildAIAssistPayload({
        category,
        location: buildCombinedLocation(beachName, placeOnBeach),
        notes,
        hasPhoto: Boolean(imageUri),
      }),
    [category, imageUri, beachName, notes, placeOnBeach],
  );
  const location = buildCombinedLocation(beachName, placeOnBeach);

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Photo access needed",
        "Ocean Collector only uses your photo to help you prepare an AI-assist request or save it with your journal entry.",
      );
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
    setSession(null);
    Haptics.selectionAsync().catch(() => undefined);
    showNotice({
      title: "Photo attached",
      message:
        "Nice. You can now copy a prompt for your preferred AI model and keep the result clearly labeled as a suggestion.",
      tone: "info",
    });
  }

  async function copyPrompt() {
    await Clipboard.setStringAsync(payload.prompt);
    Haptics.selectionAsync().catch(() => undefined);
    showNotice({
      title: "Prompt copied",
      message:
        "Paste it into your preferred AI tool with your photo. Ask it to reply with JSON only.",
      tone: "success",
    });
  }

  async function copyTemplate() {
    await Clipboard.setStringAsync(payload.responseTemplate);
    Haptics.selectionAsync().catch(() => undefined);
    showNotice({
      title: "Reply shape copied",
      message: "Your AI now has the exact response format Ocean Collector expects.",
      tone: "success",
    });
  }

  function importResult() {
    const result = parseAIAssistResponse({
      category,
      imageUri,
      rawText: importText,
    });

    if (!result.ok) {
      showNotice({
        title: "Reply needs a tweak",
        message: result.message,
        tone: "error",
      });
      return;
    }

    setSession(result.session);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => undefined,
    );
  }

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>← Back</Text>
      </Pressable>

      <OceanCard
        title={title}
        subtitle="Ocean Collector does not pretend to know the answer from a photo alone. Instead, it helps you prepare an AI-assisted suggestion you can review honestly."
        icon={category === "shell" ? "📷" : "🔎"}
        accent={accent}
      >
        <View style={styles.formGroup}>
          <Text style={styles.label}>Beach name</Text>
          <TextInput
            placeholder="Newport Beach"
            placeholderTextColor={palette.mist}
            style={styles.input}
            value={beachName}
            onChangeText={setBeachName}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Place on the beach</Text>
          <TextInput
            placeholder="Pier, tide pool, shell line..."
            placeholderTextColor={palette.mist}
            style={styles.input}
            value={placeOnBeach}
            onChangeText={setPlaceOnBeach}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes for your future self</Text>
          <TextInput
            placeholder="Color, shine, size, ridges, serrations, where it was sitting in the sand..."
            placeholderTextColor={palette.mist}
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>

        <View style={styles.buttonRow}>
          <Pressable onPress={pickImage} style={[styles.primaryButton, styles.flexButton]}>
            <Text style={styles.primaryButtonLabel}>
              {imageUri ? "Change Photo" : "Choose Photo"}
            </Text>
          </Pressable>
          <Pressable
            onPress={copyPrompt}
            style={[styles.secondaryButton, styles.flexButton]}
          >
            <Text style={styles.secondaryButtonLabel}>Copy AI Prompt</Text>
          </Pressable>
        </View>

        <Pressable onPress={copyTemplate} style={styles.ghostButton}>
          <Text style={styles.ghostButtonLabel}>Copy response shape</Text>
        </Pressable>

        <Text style={styles.caption}>
          {imageUri
            ? "Photo attached. Bring that photo and the copied prompt to your preferred AI tool, then paste the JSON reply back here."
            : "You can still prepare a text-only prompt, but a photo plus notes will usually lead to a more useful suggestion."}
        </Text>
      </OceanCard>

      <OceanCard
        title="Paste AI reply"
        subtitle="Keep it experimental and transparent. The app will treat this as a suggestion to review, not a final ID."
        icon="🤝"
      >
        <TextInput
          placeholder='Paste JSON or a ```json``` block here. If the AI stays unsure, that is a good result too.'
          placeholderTextColor={palette.mist}
          style={[styles.input, styles.importInput]}
          value={importText}
          onChangeText={setImportText}
          multiline
        />
        <View style={styles.buttonRow}>
          <Pressable
            onPress={importResult}
            style={[styles.primaryButton, styles.flexButton]}
          >
            <Text style={styles.primaryButtonLabel}>Import suggestion</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              saveUnknownFind({
                category,
                location: location || "Beach adventure",
                notes: notes || "Saved from the AI-assist screen as unknown for now.",
                userPhotoUri: imageUri || undefined,
              });
              navigation.navigate("MainTabs", { screen: "Collection" });
            }}
            style={[styles.secondaryButton, styles.flexButton]}
          >
            <Text style={styles.secondaryButtonLabel}>Save as unknown</Text>
          </Pressable>
        </View>
      </OceanCard>

      {session ? (
        <>
          <SectionTitle
            title="AI-assisted suggestions"
            subtitle={session.disclaimer}
          />
          <OceanCard
            title={session.status === "matches" ? "What the AI noticed" : "Stay delightfully unsure"}
            subtitle={session.summary}
            icon={session.status === "matches" ? "🫧" : "🌫️"}
            accent={session.status === "matches" ? accent : gradients.ocean}
          >
            {session.observedTraits.length > 0 ? (
              <Text style={styles.resultBody}>
                Traits noticed: {session.observedTraits.join(", ")}
              </Text>
            ) : (
              <Text style={styles.resultBody}>
                No strong traits were listed. That usually means this find should stay unknown until you compare more carefully.
              </Text>
            )}
          </OceanCard>

          {session.status === "matches" ? (
            session.matches.map((match) => {
              const item = getLibraryItem(category, match.id);

              if (!item) {
                return null;
              }

              return (
                <OceanCard
                  key={match.id}
                  title={item.commonName}
                  subtitle={`${getConfidenceLabel(match.confidenceBand)} • ${match.reason}`}
                  icon={item.specimenEmoji}
                  imageSource={item.specimenImageSource}
                  imageUri={item.specimenImageUri}
                  accent={item.cardPalette}
                >
                  <Text style={styles.resultBody}>{item.summary}</Text>
                  {match.traitsNoticed.length > 0 ? (
                    <Text style={styles.traitsLine}>
                      AI noticed: {match.traitsNoticed.join(", ")}
                    </Text>
                  ) : null}
                  <View style={styles.buttonRow}>
                    <Pressable
                      onPress={() => {
                        saveLibraryMatch({
                          category,
                          referenceId: match.id,
                          location: location || "Beach adventure",
                          notes:
                            notes ||
                            "Saved from an AI-assisted suggestion to review later.",
                          userPhotoUri: imageUri || undefined,
                          identification: {
                            status: "suggested",
                            source: "experimental-ai",
                            label: "AI-assisted suggestion",
                            note:
                              "Saved from a pasted AI response. Review the guide card before treating this as confirmed.",
                          },
                        });
                        navigation.navigate("MainTabs", { screen: "Collection" });
                      }}
                      style={[styles.primaryButton, styles.flexButton]}
                    >
                      <Text style={styles.primaryButtonLabel}>Save as suggestion</Text>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        navigation.navigate("ItemDetail", { category, id: match.id })
                      }
                      style={[styles.secondaryButton, styles.flexButton]}
                    >
                      <Text style={styles.secondaryButtonLabel}>Review guide card</Text>
                    </Pressable>
                  </View>
                </OceanCard>
              );
            })
          ) : (
            <OceanCard
              title="Unknown is still a good journal entry"
              subtitle="You can save it as a mystery or head to the guide shelf for a slower compare."
              icon="❓"
            >
              <View style={styles.buttonRow}>
                <Pressable
                  onPress={() => {
                    saveUnknownFind({
                      category,
                      location: location || "Beach adventure",
                      notes:
                        notes || "Saved after an inconclusive AI-assisted suggestion.",
                      userPhotoUri: imageUri || undefined,
                    });
                    navigation.navigate("MainTabs", { screen: "Collection" });
                  }}
                  style={[styles.primaryButton, styles.flexButton]}
                >
                  <Text style={styles.primaryButtonLabel}>Save mystery find</Text>
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate("Library", { category })}
                  style={[styles.secondaryButton, styles.flexButton]}
                >
                  <Text style={styles.secondaryButtonLabel}>Open library</Text>
                </Pressable>
              </View>
            </OceanCard>
          )}
        </>
      ) : null}

      <SectionTitle
        title="Prefer the slower, more honest route?"
        subtitle="The built-in library is still the best place to compare shape, lookalikes, and facts at your own pace."
        actionLabel="Open Library"
        onPressAction={() => navigation.navigate("Library", { category })}
      />

      <FindTile
        title={category === "shell" ? "Manual Shell Compare" : "Manual Tooth Compare"}
        subtitle="Browse the guide shelf and confirm only what really feels right"
        emoji={category === "shell" ? "🌺" : "🦷"}
        palettePair={accent as [string, string]}
        detail="When you save from a guide card, Ocean Collector treats that as a collector-confirmed match."
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
  importInput: {
    minHeight: 180,
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
    textAlign: "center",
  },
  ghostButton: {
    alignSelf: "flex-start",
  },
  ghostButtonLabel: {
    fontFamily: typography.bodyBold,
    color: palette.kelp,
    fontSize: 14,
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
  traitsLine: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
    color: palette.kelp,
  },
});
