import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { Chip } from "../components/Chip";
import { FindTile } from "../components/FindTile";
import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { getLibraryItems } from "../data/library";
import { useOceanStore } from "../store/useOceanStore";
import { palette, radius, spacing, typography } from "../theme";
import { getScientificLine } from "../utils/format";
import type { LibraryCategory } from "../types/models";
import type { RootScreenProps } from "../navigation/types";

function getFilterOptions(category: LibraryCategory) {
  if (category === "shell") {
    const items = getLibraryItems("shell");
    return [...new Set(items.map((item) => item.shellType))];
  }

  const items = getLibraryItems("sharkTooth");
  return [...new Set(items.map((item) => item.toothProfile.serration))];
}

export function LibraryScreen({ navigation, route }: RootScreenProps<"Library">) {
  const { category, initialQuery } = route.params;
  const showScientificNames = useOceanStore(
    (state) => state.preferences.showScientificNames,
  );
  const [query, setQuery] = useState(initialQuery ?? "");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    setQuery(initialQuery ?? "");
  }, [initialQuery]);

  const items =
    category === "shell"
      ? getLibraryItems("shell").filter((item) => {
          const searchText = `${item.commonName} ${item.scientificName ?? ""} ${item.summary} ${item.lookalikes.join(" ")}`.toLowerCase();
          const matchesQuery =
            query.trim().length === 0 || searchText.includes(query.toLowerCase());
          const matchesFilter =
            activeFilter === "All" || item.shellType === activeFilter;

          return matchesQuery && matchesFilter;
        })
      : getLibraryItems("sharkTooth").filter((item) => {
          const searchText = `${item.commonName} ${item.scientificName ?? ""} ${item.summary} ${item.lookalikes.join(" ")}`.toLowerCase();
          const matchesQuery =
            query.trim().length === 0 || searchText.includes(query.toLowerCase());
          const matchesFilter =
            activeFilter === "All" || item.toothProfile.serration === activeFilter;

          return matchesQuery && matchesFilter;
        });

  const filters = ["All", ...getFilterOptions(category)];

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>← Back</Text>
      </Pressable>

      <OceanCard
        title={category === "shell" ? "Shell Library" : "Shark Tooth Library"}
        subtitle="Compare shapes, colors, textures, and lookalikes slowly. Save only when the guide card really feels right."
        icon={category === "shell" ? "📖" : "🗂️"}
      >
        <TextInput
          placeholder={category === "shell" ? "Search scallop, olive, glossy..." : "Search serrated, broad, sand tiger..."}
          placeholderTextColor={palette.mist}
          style={styles.input}
          value={query}
          onChangeText={setQuery}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              active={filter === activeFilter}
              onPress={() => setActiveFilter(filter)}
            />
          ))}
        </ScrollView>
      </OceanCard>

      <SectionTitle
        title={`${items.length} guide cards`}
        subtitle="Open a guide card to review clues, collector notes, and stewardship tips before confirming a match."
      />

      {items.length === 0 ? (
        <OceanCard
          title="No guide cards match that search yet"
          subtitle="Try a broader word like scallop, whelk, serrated, or smooth. Unknown is an okay outcome too."
          icon="🧭"
        />
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <FindTile
              key={item.id}
              title={item.commonName}
              subtitle={
                getScientificLine(showScientificNames, item.scientificName) ?? item.summary
              }
              emoji={item.specimenEmoji}
              imageSource={item.specimenImageSource}
              imageUri={item.specimenImageUri}
              palettePair={item.cardPalette}
              detail={item.confusionNote}
              trailingLabel={"shellType" in item ? item.shellType : item.toothProfile.serration}
              onPress={() => navigation.navigate("ItemDetail", { category, id: item.id })}
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
  backButton: {
    fontFamily: typography.bodyBold,
    color: palette.deep,
    fontSize: 15,
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
  filterRow: {
    gap: spacing.xs,
  },
  list: {
    gap: spacing.sm,
  },
});
