import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { SpecimenPhoto } from "../components/SpecimenPhoto";
import { useOceanStore } from "../store/useOceanStore";
import { palette, radius, spacing, typography } from "../theme";
import { formatFriendlyDate } from "../utils/format";
import type { RootScreenProps } from "../navigation/types";

export function CollectionItemScreen({
  navigation,
  route,
}: RootScreenProps<"CollectionItem">) {
  const collection = useOceanStore((state) => state.collection);
  const toggleFavorite = useOceanStore((state) => state.toggleFavorite);
  const item = collection.find((entry) => entry.id === route.params.itemId);

  if (!item) {
    return (
      <ScreenShell>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </Pressable>
        <OceanCard title="Collection card missing" subtitle="This saved item could not be found." />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>← Back</Text>
      </Pressable>

      <OceanCard
        title={item.title}
        subtitle={item.subtitle}
        icon={item.specimenEmoji}
        imageSource={item.specimenImageSource}
        imageUri={item.specimenImageUri}
        accent={item.cardPalette}
      >
        {item.specimenImageSource || item.specimenImageUri ? (
          <>
            <SpecimenPhoto
              title={item.title}
              imageSource={item.specimenImageSource}
              imageUri={item.specimenImageUri}
              emoji={item.specimenEmoji}
            />
            {item.specimenImageCredit ? (
              <Pressable
                onPress={() => {
                  if (item.specimenImageSourceUrl) {
                    Linking.openURL(item.specimenImageSourceUrl).catch(() => undefined);
                  }
                }}
              >
                <Text style={styles.photoCredit}>
                  {item.specimenImageSourceUrl
                    ? `Guide photo via Wikimedia Commons • ${item.specimenImageCredit}`
                    : `Artwork • ${item.specimenImageCredit}`}
                </Text>
              </Pressable>
            ) : null}
          </>
        ) : null}
        <Text style={styles.detailLine}>Found: {formatFriendlyDate(item.foundDate)}</Text>
        <Text style={styles.detailLine}>Location: {item.location}</Text>
        <Text style={styles.detailLine}>Points earned: +{item.pointsAwarded}</Text>
        <Text style={styles.detailLine}>Favorite: {item.favorite ? "Yes" : "Not yet"}</Text>
        {item.referenceId && (item.category === "shell" || item.category === "sharkTooth") ? (
          <Pressable
            onPress={() =>
              navigation.navigate("ItemDetail", {
                category: item.category === "shell" ? "shell" : "sharkTooth",
                id: item.referenceId!,
              })
            }
            style={styles.guideButton}
          >
            <Text style={styles.guideButtonLabel}>Open original guide card</Text>
          </Pressable>
        ) : null}
        <Pressable onPress={() => toggleFavorite(item.id)} style={styles.favoriteButton}>
          <Text style={styles.favoriteButtonLabel}>
            {item.favorite ? "Remove favorite star" : "Mark as favorite"}
          </Text>
        </Pressable>
      </OceanCard>

      <SectionTitle title="Notes" subtitle="A simple beach-journal entry." />
      <OceanCard subtitle={item.notes || "No notes were saved for this find yet."} />
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
  detailLine: {
    fontFamily: typography.body,
    color: palette.deep,
    fontSize: 15,
    lineHeight: 22,
  },
  photoCredit: {
    fontFamily: typography.body,
    color: palette.mist,
    fontSize: 12,
    lineHeight: 18,
  },
  favoriteButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
    backgroundColor: palette.deep,
  },
  guideButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
    backgroundColor: "rgba(255,255,255,0.78)",
    borderWidth: 1,
    borderColor: palette.border,
  },
  guideButtonLabel: {
    fontFamily: typography.bodyBold,
    fontSize: 15,
    color: palette.deep,
  },
  favoriteButtonLabel: {
    fontFamily: typography.headingSoft,
    fontSize: 16,
    color: palette.pearl,
  },
});
