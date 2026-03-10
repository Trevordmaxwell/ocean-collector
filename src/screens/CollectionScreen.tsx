import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Chip } from "../components/Chip";
import { FindTile } from "../components/FindTile";
import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { StatPill } from "../components/StatPill";
import { sharkSpecies, shellSpecies } from "../data";
import { useOceanStore } from "../store/useOceanStore";
import { gradients, palette, spacing, typography } from "../theme";
import {
  formatFriendlyDate,
  formatFriendlyTime,
  formatIdentificationLabel,
  formatJournalBucket,
  formatRarityLabel,
  getScientificLine,
} from "../utils/format";
import type { CollectionCategory, UserCollectionItem } from "../types/models";
import type { TabScreenProps } from "../navigation/types";

const filters: Array<{ label: string; value: "all" | CollectionCategory }> = [
  { label: "All", value: "all" },
  { label: "Shells", value: "shell" },
  { label: "Teeth", value: "sharkTooth" },
  { label: "Sea Glass", value: "seaGlass" },
  { label: "Cleanup", value: "trash" },
];

const sortOptions = [
  { label: "Newest", value: "recent" },
  { label: "Favorites", value: "favorites" },
  { label: "Points", value: "points" },
  { label: "A-Z", value: "alpha" },
] as const;

function groupItemsByBucket(items: UserCollectionItem[]) {
  const groups = new Map<string, UserCollectionItem[]>();

  items.forEach((item) => {
    const bucket = formatJournalBucket(item.foundDate);

    if (!groups.has(bucket)) {
      groups.set(bucket, []);
    }

    groups.get(bucket)!.push(item);
  });

  return Array.from(groups.entries());
}

export function CollectionScreen({ navigation }: TabScreenProps<"Collection">) {
  const collection = useOceanStore((state) => state.collection);
  const journalMeta = useOceanStore((state) => state.journalMeta);
  const preferences = useOceanStore((state) => state.preferences);
  const [activeFilter, setActiveFilter] = useState<"all" | CollectionCategory>("all");
  const [activeSort, setActiveSort] = useState<(typeof sortOptions)[number]["value"]>("recent");

  const favorites = collection.filter((item) => item.favorite).length;
  const shellCount = collection.filter((item) => item.category === "shell").length;
  const toothCount = collection.filter((item) => item.category === "sharkTooth").length;
  const glassCount = collection.filter((item) => item.category === "seaGlass").length;
  const cleanupCount = collection.filter((item) => item.category === "trash").length;
  const uniqueShells = new Set(
    collection
      .filter((item) => item.category === "shell" && item.referenceId)
      .map((item) => item.referenceId),
  ).size;
  const uniqueTeeth = new Set(
    collection
      .filter((item) => item.category === "sharkTooth" && item.referenceId)
      .map((item) => item.referenceId),
  ).size;
  const pinnedFavorites = collection.filter((item) => item.favorite).slice(0, 3);

  const filteredItems = useMemo(
    () =>
      collection
        .filter((item) => (activeFilter === "all" ? true : item.category === activeFilter))
        .sort((left, right) => {
          switch (activeSort) {
            case "favorites":
              if (left.favorite !== right.favorite) {
                return left.favorite ? -1 : 1;
              }
              return right.foundDate.localeCompare(left.foundDate);
            case "points":
              return right.pointsAwarded - left.pointsAwarded;
            case "alpha":
              return left.title.localeCompare(right.title);
            case "recent":
            default:
              return right.foundDate.localeCompare(left.foundDate);
          }
        }),
    [activeFilter, activeSort, collection],
  );

  const groupedItems = groupItemsByBucket(filteredItems);

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />

      <OceanCard
        title="Treasure Album"
        subtitle="A scrapbook-y shelf for finds, cleanup wins, and little beach memories."
        icon="🐚"
        accent={gradients.ocean}
      >
        <View style={styles.statRow}>
          <StatPill label="Saved" value={`${collection.length}`} />
          <StatPill label="Favorites" value={`${favorites}`} />
          <StatPill label="Shell shelf" value={`${uniqueShells}/${shellSpecies.length}`} />
          <StatPill label="Tooth shelf" value={`${uniqueTeeth}/${sharkSpecies.length}`} />
        </View>

        <Text style={styles.helperLine}>
          Last saved locally:{" "}
          <Text style={styles.helperStrong}>
            {formatFriendlyTime(journalMeta.lastSavedAt)}
          </Text>
        </Text>
        <Text style={styles.helperLine}>
          Categories:{" "}
          <Text style={styles.helperStrong}>
            {shellCount} shells • {toothCount} teeth • {glassCount} glass • {cleanupCount} cleanup
          </Text>
        </Text>
      </OceanCard>

      <SectionTitle
        title="Album tabs"
        subtitle="Filter by collection type or change the mood of the shelf."
      />

      <OceanCard>
        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Category</Text>
          <View style={styles.filterRow}>
            {filters.map((filter) => (
              <Chip
                key={filter.value}
                label={filter.label}
                active={filter.value === activeFilter}
                onPress={() => setActiveFilter(filter.value)}
              />
            ))}
          </View>
        </View>

        <View style={styles.filterBlock}>
          <Text style={styles.filterLabel}>Sort</Text>
          <View style={styles.filterRow}>
            {sortOptions.map((sortOption) => (
              <Chip
                key={sortOption.value}
                label={sortOption.label}
                active={sortOption.value === activeSort}
                onPress={() => setActiveSort(sortOption.value)}
              />
            ))}
          </View>
        </View>
      </OceanCard>

      {pinnedFavorites.length > 0 && activeFilter === "all" ? (
        <>
          <SectionTitle
            title="Pinned treasures"
            subtitle="The little finds you loved enough to star."
          />
          <View style={styles.list}>
            {pinnedFavorites.map((item) => (
              <FindTile
                key={item.id}
                title={item.title}
                subtitle={
                  getScientificLine(preferences.showScientificNames, item.scientificName) ??
                  formatIdentificationLabel(item.identification)
                }
                emoji={item.specimenEmoji}
                imageSource={item.specimenImageSource}
                imageUri={item.specimenImageUri}
                palettePair={item.cardPalette}
                detail={`${item.location} • ${
                  item.notes || "A favorite memory with room for more notes."
                }`}
                trailingLabel={formatRarityLabel(item.collectorRarity) ?? "Favorite"}
                onPress={() =>
                  navigation.navigate("CollectionItem", {
                    itemId: item.id,
                    category: item.category,
                  })
                }
              />
            ))}
          </View>
        </>
      ) : null}

      <SectionTitle
        title="Memory lane"
        subtitle={
          filteredItems.length === 0
            ? "Once you save something, this album starts to feel personal very quickly."
            : "Grouped like little pages instead of one endless feed."
        }
      />

      {filteredItems.length === 0 ? (
        <OceanCard
          title="No treasures in this album tab yet"
          subtitle="Try logging a shell, tooth, sea glass piece, or cleanup moment from the home screen."
          icon="🪣"
        />
      ) : (
        groupedItems.map(([bucket, items]) => (
          <View key={bucket} style={styles.groupWrap}>
            <Text style={styles.groupTitle}>{bucket}</Text>
            <View style={styles.list}>
              {items.map((item) => (
                <FindTile
                  key={item.id}
                  title={item.title}
                  subtitle={
                    getScientificLine(preferences.showScientificNames, item.scientificName) ??
                    formatIdentificationLabel(item.identification)
                  }
                  emoji={item.specimenEmoji}
                  imageSource={item.specimenImageSource}
                  imageUri={item.specimenImageUri}
                  palettePair={item.cardPalette}
                  detail={`${formatFriendlyDate(item.foundDate)} • ${item.location} • ${
                    item.notes || "No notes yet."
                  }`}
                  trailingLabel={formatRarityLabel(item.collectorRarity) ?? `+${item.pointsAwarded}`}
                  onPress={() =>
                    navigation.navigate("CollectionItem", {
                      itemId: item.id,
                      category: item.category,
                    })
                  }
                />
              ))}
            </View>
          </View>
        ))
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topSpacing: {
    height: spacing.sm,
  },
  statRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  helperLine: {
    fontFamily: typography.body,
    fontSize: 14,
    color: palette.deep,
  },
  helperStrong: {
    fontFamily: typography.bodyBold,
  },
  filterBlock: {
    gap: spacing.xs,
  },
  filterLabel: {
    fontFamily: typography.bodyBold,
    fontSize: 14,
    color: palette.ink,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  list: {
    gap: spacing.sm,
  },
  groupWrap: {
    gap: spacing.sm,
  },
  groupTitle: {
    fontFamily: typography.headingSoft,
    fontSize: 18,
    color: palette.ink,
  },
});
