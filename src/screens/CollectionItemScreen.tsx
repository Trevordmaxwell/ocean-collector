import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { FindTile } from "../components/FindTile";
import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { SpecimenPhoto } from "../components/SpecimenPhoto";
import { getComparableLibraryItems } from "../services/libraryCompare";
import { getSameTripItems } from "../services/journalStories";
import { useOceanStore } from "../store/useOceanStore";
import { palette, radius, spacing, typography } from "../theme";
import {
  formatFriendlyDate,
  formatIdentificationLabel,
  formatRarityLabel,
  getScientificLine,
} from "../utils/format";
import type { RootScreenProps } from "../navigation/types";

export function CollectionItemScreen({
  navigation,
  route,
}: RootScreenProps<"CollectionItem">) {
  const collection = useOceanStore((state) => state.collection);
  const toggleFavorite = useOceanStore((state) => state.toggleFavorite);
  const showScientificNames = useOceanStore(
    (state) => state.preferences.showScientificNames,
  );
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

  const rarityLabel = formatRarityLabel(item.collectorRarity);
  const sameTripItems = getSameTripItems(collection, item);
  const compareCandidates =
    item.referenceId && (item.category === "shell" || item.category === "sharkTooth")
      ? getComparableLibraryItems(item.category, item.referenceId)
      : [];

  function returnToAlbum() {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("MainTabs", { screen: "Collection" });
  }

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>← Back</Text>
      </Pressable>

      <OceanCard
        title={item.title}
        subtitle={
          getScientificLine(showScientificNames, item.scientificName) ??
          formatIdentificationLabel(item.identification)
        }
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

        <Text style={styles.detailLine}>Saved: {formatFriendlyDate(item.foundDate)}</Text>
        <Text style={styles.detailLine}>Location: {item.location}</Text>
        <Text style={styles.detailLine}>
          Journal label: {formatIdentificationLabel(item.identification)}
        </Text>
        <Text style={styles.detailLine}>Trust note: {item.identification.note}</Text>
        <Text style={styles.detailLine}>Points earned: +{item.pointsAwarded}</Text>
        <Text style={styles.detailLine}>
          Favorite star: {item.favorite ? "Pinned in your album" : "Not pinned yet"}
        </Text>
        {rarityLabel ? <Text style={styles.detailLine}>Collector vibe: {rarityLabel}</Text> : null}

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
            {item.favorite ? "Remove favorite star" : "Pin this memory"}
          </Text>
        </Pressable>
        <View style={styles.navigationRow}>
          <Pressable
            onPress={returnToAlbum}
            style={[styles.navigationButton, styles.navigationButtonSoft]}
          >
            <Text style={styles.navigationButtonLabel}>Return to album</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
            style={[styles.navigationButton, styles.navigationButtonSoft]}
          >
            <Text style={styles.navigationButtonLabel}>Home</Text>
          </Pressable>
        </View>
      </OceanCard>

      <SectionTitle title="Journal note" subtitle="A little memory from the beach walk." />
      <OceanCard
        subtitle={item.notes || "No note was saved yet. Add more the next time you log a find."}
      />

      <SectionTitle
        title="Same beach walk"
        subtitle="Other little memories from the same day and place."
      />
      {sameTripItems.length === 0 ? (
        <OceanCard
          title="A solo page for now"
          subtitle="Save a few finds from the same walk and this card will start feeling like a trip spread."
          icon="🧺"
        />
      ) : (
        <View style={styles.relatedList}>
          {sameTripItems.map((tripItem) => (
            <FindTile
              key={tripItem.id}
              title={tripItem.title}
              subtitle={
                getScientificLine(showScientificNames, tripItem.scientificName) ??
                formatIdentificationLabel(tripItem.identification)
              }
              emoji={tripItem.specimenEmoji}
              imageSource={tripItem.specimenImageSource}
              imageUri={tripItem.specimenImageUri}
              palettePair={tripItem.cardPalette}
              detail={tripItem.notes || "Another tucked-away note from this walk."}
              trailingLabel={`+${tripItem.pointsAwarded}`}
              onPress={() =>
                navigation.push("CollectionItem", {
                  itemId: tripItem.id,
                  category: tripItem.category,
                })
              }
            />
          ))}
        </View>
      )}

      {compareCandidates.length > 0 ? (
        <>
          <SectionTitle
            title="Compare guide neighbors"
            subtitle="Nearby shell or tooth matches, just in case you want a second look."
          />
          <View style={styles.relatedList}>
            {compareCandidates.map((candidate) => (
              <FindTile
                key={candidate.id}
                title={candidate.commonName}
                subtitle={
                  getScientificLine(showScientificNames, candidate.scientificName) ??
                  candidate.summary
                }
                emoji={candidate.specimenEmoji}
                imageSource={candidate.specimenImageSource}
                imageUri={candidate.specimenImageUri}
                palettePair={candidate.cardPalette}
                detail={
                  candidate.confusionNote ??
                  "Compare the big silhouette first, then the smaller clues."
                }
                trailingLabel={
                  "shellType" in candidate
                    ? candidate.shellType
                    : candidate.toothProfile.serration
                }
                onPress={() =>
                  navigation.push("ItemDetail", {
                    category: item.category === "shell" ? "shell" : "sharkTooth",
                    id: candidate.id,
                  })
                }
              />
            ))}
          </View>
        </>
      ) : null}
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
  relatedList: {
    gap: spacing.sm,
  },
  navigationRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  navigationButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: palette.border,
  },
  navigationButtonSoft: {
    backgroundColor: "rgba(255,255,255,0.78)",
  },
  navigationButtonLabel: {
    fontFamily: typography.bodyBold,
    fontSize: 15,
    color: palette.deep,
  },
});
