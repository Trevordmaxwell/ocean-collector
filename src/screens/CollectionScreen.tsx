import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Chip } from "../components/Chip";
import { FindTile } from "../components/FindTile";
import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { useOceanStore } from "../store/useOceanStore";
import { palette, spacing, typography } from "../theme";
import type { CollectionCategory } from "../types/models";
import type { TabScreenProps } from "../navigation/types";

const filters: Array<{ label: string; value: "all" | CollectionCategory }> = [
  { label: "All", value: "all" },
  { label: "Shells", value: "shell" },
  { label: "Teeth", value: "sharkTooth" },
  { label: "Sea Glass", value: "seaGlass" },
  { label: "Cleanup", value: "trash" },
];

export function CollectionScreen({ navigation }: TabScreenProps<"Collection">) {
  const collection = useOceanStore((state) => state.collection);
  const [activeFilter, setActiveFilter] = useState<"all" | CollectionCategory>("all");

  const filteredItems = collection.filter((item) =>
    activeFilter === "all" ? true : item.category === activeFilter,
  );
  const favorites = collection.filter((item) => item.favorite).length;

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />

      <OceanCard
        title="My Collection"
        subtitle="A scrapbook of shells, shark teeth, sea glass, and cleanup wins."
        icon="📚"
      >
        <Text style={styles.helper}>
          {collection.length} saved item{collection.length === 1 ? "" : "s"} • {favorites} favorite
          {favorites === 1 ? "" : "s"}
        </Text>

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
      </OceanCard>

      <SectionTitle
        title="Saved finds"
        subtitle={
          filteredItems.length === 0
            ? "Once you save something, it will show up here with points and notes."
            : "Tap a card for details and favorite toggles."
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
              palettePair={item.cardPalette}
              detail={item.notes || "No notes yet"}
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
  helper: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: palette.deep,
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
