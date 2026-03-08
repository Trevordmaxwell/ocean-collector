import { Pressable, StyleSheet, Text, View } from "react-native";

import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
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

      <OceanCard title={item.title} subtitle={item.subtitle} icon={item.specimenEmoji} accent={item.cardPalette}>
        <Text style={styles.detailLine}>Found: {formatFriendlyDate(item.foundDate)}</Text>
        <Text style={styles.detailLine}>Location: {item.location}</Text>
        <Text style={styles.detailLine}>Points earned: +{item.pointsAwarded}</Text>
        <Text style={styles.detailLine}>Favorite: {item.favorite ? "Yes" : "Not yet"}</Text>
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
  favoriteButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
    backgroundColor: palette.deep,
  },
  favoriteButtonLabel: {
    fontFamily: typography.headingSoft,
    fontSize: 16,
    color: palette.pearl,
  },
});
