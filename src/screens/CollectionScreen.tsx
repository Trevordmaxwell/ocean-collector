import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Chip } from "../components/Chip";
import { FindTile } from "../components/FindTile";
import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { StatPill } from "../components/StatPill";
import { useOceanStore } from "../store/useOceanStore";
import { palette, spacing, typography } from "../theme";
import { formatFriendlyDate } from "../utils/format";
import type { CollectionCategory } from "../types/models";
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

export function CollectionScreen({ navigation }: TabScreenProps<"Collection">) {
  const collection = useOceanStore((state) => state.collection);
  const [activeFilter, setActiveFilter] = useState<"all" | CollectionCategory>("all");
  const [activeSort, setActiveSort] = useState<(typeof sortOptions)[number]["value"]>("recent");

  const favorites = collection.filter((item) => item.favorite).length;
  const shellCount = collection.filter((item) => item.category === "shell").length;
  const toothCount = collection.filter((item) => item.category === "sharkTooth").length;
  const glassCount = collection.filter((item) => item.category === "seaGlass").length;
  const cleanupCount = collection.filter((item) => item.category === "trash").length;

  const filteredItems = collection
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
    });

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />

      <OceanCard
        title="My Collection"
        subtitle="A scrapbook of shells, shark teeth, sea glass, and cleanup wins."
        icon="📚"
      >
        <View style={styles.statRow}>
          <StatPill label="Saved" value={`${collection.length}`} />
          <StatPill label="Favorites" value={`${favorites}`} />
          <StatPill label="Shells" value={`${shellCount}`} />
          <StatPill label="Teeth" value={`${toothCount}`} />
          <StatPill label="Glass" value={`${glassCount}`} />
          <StatPill label="Cleanup" value={`${cleanupCount}`} />
        </View>

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

      <SectionTitle
        title="Saved finds"
        subtitle={
          filteredItems.length === 0
            ? "Once you save something, it will show up here with points and notes."
            : "Tap a card for details, favorite toggles, and the original guide card."
        }
      />

      {filteredItems.length === 0 ? (
        <OceanCard
          title="No treasures in this bucket yet"
          subtitle="Try identifying a shell, logging sea glass, or adding a cleanup moment from the home screen."
          icon="🪣"
        />
      ) : (
        <View style={styles.list}>
          {filteredItems.map((item) => (
            <FindTile
              key={item.id}
              title={item.title}
              subtitle={`${item.subtitle} • ${item.location}`}
              emoji={item.specimenEmoji}
              imageSource={item.specimenImageSource}
              imageUri={item.specimenImageUri}
              palettePair={item.cardPalette}
              detail={`${item.favorite ? "★ Favorite" : formatFriendlyDate(item.foundDate)} • ${item.notes || "No notes yet"}`}
              trailingLabel={`+${item.pointsAwarded}`}
              onPress={() =>
                navigation.navigate("CollectionItem", {
                  itemId: item.id,
                  category: item.category,
                })
              }
            />
          ))}
        </View>
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
});
