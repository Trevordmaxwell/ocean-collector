import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { Chip } from "../components/Chip";
import { FindTile } from "../components/FindTile";
import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { SpecimenPhoto } from "../components/SpecimenPhoto";
import { getLibraryItem } from "../data/library";
import { getComparableLibraryItems } from "../services/libraryCompare";
import { useOceanStore } from "../store/useOceanStore";
import { gradients, palette, radius, spacing, typography } from "../theme";
import { formatRarityLabel, getScientificLine } from "../utils/format";
import type { RootScreenProps } from "../navigation/types";

export function ItemDetailScreen({ navigation, route }: RootScreenProps<"ItemDetail">) {
  const item = getLibraryItem(route.params.category, route.params.id);
  const showScientificNames = useOceanStore(
    (state) => state.preferences.showScientificNames,
  );
  const saveLibraryMatch = useOceanStore((state) => state.saveLibraryMatch);

  if (!item) {
    return (
      <ScreenShell>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </Pressable>
        <OceanCard title="Guide card missing" subtitle="This entry could not be found." />
      </ScreenShell>
    );
  }

  const saveLabel =
    route.params.category === "shell"
      ? "Confirm and save shell"
      : "Confirm and save tooth";
  const comparisonQuery = item.lookalikes[0] ?? item.commonName;
  const scientificLine =
    getScientificLine(showScientificNames, item.scientificName) ?? item.summary;
  const rarityLabel = formatRarityLabel(item.collectorRarity);
  const similarItems = getComparableLibraryItems(route.params.category, item.id);

  function returnToGuideShelf() {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Library", {
      category: route.params.category,
    });
  }

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>← Back</Text>
      </Pressable>

      <OceanCard
        title={item.commonName}
        subtitle={scientificLine}
        icon={item.specimenEmoji}
        imageSource={item.specimenImageSource}
        imageUri={item.specimenImageUri}
        accent={item.cardPalette}
      >
        <Text style={styles.summary}>{item.summary}</Text>
        <SpecimenPhoto
          title={item.commonName}
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
                ? `Specimen photo via Wikimedia Commons • ${item.specimenImageCredit}`
                : `Artwork • ${item.specimenImageCredit}`}
            </Text>
          </Pressable>
        ) : null}
        <View style={styles.chipRow}>
          {item.colors.map((color) => (
            <Chip key={color} label={color} />
          ))}
          {rarityLabel ? <Chip label={rarityLabel} /> : null}
        </View>
        <View style={styles.buttonRow}>
          <Pressable
            onPress={() => {
              saveLibraryMatch({
                category: route.params.category,
                referenceId: item.id,
                location: "Guide card review",
                notes: "Saved after reviewing the full guide card.",
                identification: {
                  status: "confirmed",
                  source: "manual-guide",
                  label: "Collector-confirmed guide match",
                  note:
                    "Saved after reviewing the guide card and deciding the match felt right.",
                },
              });
              navigation.navigate("MainTabs", { screen: "Collection" });
            }}
            style={[styles.primaryButton, styles.flexButton]}
          >
            <Text style={styles.primaryButtonLabel}>{saveLabel}</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate("Library", {
                category: route.params.category,
                initialQuery: comparisonQuery,
              })
            }
            style={[styles.secondaryButton, styles.flexButton]}
          >
            <Text style={styles.secondaryButtonLabel}>Compare more</Text>
          </Pressable>
        </View>
        <View style={styles.buttonRow}>
          <Pressable
            onPress={returnToGuideShelf}
            style={[styles.secondaryButton, styles.flexButton]}
          >
            <Text style={styles.secondaryButtonLabel}>Back to guide shelf</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
            style={[styles.secondaryButton, styles.flexButton]}
          >
            <Text style={styles.secondaryButtonLabel}>Home</Text>
          </Pressable>
        </View>
      </OceanCard>

      <SectionTitle
        title="Collector notebook"
        subtitle="A little more journal-like than a plain data card."
      />
      <OceanCard accent={route.params.category === "shell" ? gradients.shell : gradients.tooth}>
        <Text style={styles.detailLine}>
          Collector note:{" "}
          {item.collectorNote ??
            "Take a slow look at the big shapes before falling in love with tiny details."}
        </Text>
        <Text style={styles.detailLine}>
          Confusion note:{" "}
          {item.confusionNote ??
            "Use the lookalikes list and compare the overall silhouette before naming it."}
        </Text>
        <Text style={styles.detailLine}>Lookalikes: {item.lookalikes.join(", ")}</Text>
      </OceanCard>

      <SectionTitle title="How to spot it" subtitle="The clues worth checking first." />
      <OceanCard>
        {item.identifyingFeatures.map((feature) => (
          <Text key={feature} style={styles.bullet}>
            • {feature}
          </Text>
        ))}
      </OceanCard>

      <SectionTitle
        title="Shape, size, and where it belongs"
        subtitle="Use these details when comparing carefully."
      />
      <OceanCard>
        <Text style={styles.detailLine}>Shape notes: {item.shapeNotes.join(", ")}</Text>
        <Text style={styles.detailLine}>Size range: {item.sizeRange}</Text>
        <Text style={styles.detailLine}>Common regions: {item.regions.join(", ")}</Text>
        <Text style={styles.detailLine}>Habitat: {item.habitat}</Text>
        {"toothProfile" in item ? (
          <>
            <Text style={styles.detailLine}>Serration: {item.toothProfile.serration}</Text>
            <Text style={styles.detailLine}>Width: {item.toothProfile.width}</Text>
            <Text style={styles.detailLine}>Curvature: {item.toothProfile.curvature}</Text>
            <Text style={styles.detailLine}>Mouth region: {item.toothProfile.mouthRegion}</Text>
            <Text style={styles.detailLine}>Tooth use: {item.toothProfile.toothUse}</Text>
          </>
        ) : (
          <Text style={styles.detailLine}>Inhabitant info: {item.inhabitantInfo}</Text>
        )}
      </OceanCard>

      <SectionTitle
        title="Beach kindness note"
        subtitle="The journal should help you learn without taking too much."
      />
      <OceanCard
        title="Respectful collecting"
        subtitle={
          item.stewardshipTip ??
          "If it is alive, freshly occupied, or protected where you are collecting, let it stay part of the beach."
        }
        icon="🌿"
      />

      <SectionTitle
        title="Fun facts"
        subtitle="Real value, still light and friendly."
      />
      {item.funFacts.map((fact) => (
        <OceanCard key={fact} subtitle={fact} icon="✨" />
      ))}

      <SectionTitle
        title="Compare similar finds"
        subtitle="Jump between nearby matches without losing your place."
        actionLabel="Open compare shelf"
        onPressAction={() =>
          navigation.navigate("Library", {
            category: route.params.category,
            initialQuery: comparisonQuery,
          })
        }
      />
      {similarItems.length === 0 ? (
        <OceanCard
          title="No close lookalikes loaded yet"
          subtitle="The compare shelf button above is still handy if you want to search manually."
        />
      ) : (
        <View style={styles.similarList}>
          {similarItems.map((similarItem) => (
            <FindTile
              key={similarItem.id}
              title={similarItem.commonName}
              subtitle={
                getScientificLine(showScientificNames, similarItem.scientificName) ??
                similarItem.summary
              }
              emoji={similarItem.specimenEmoji}
              imageSource={similarItem.specimenImageSource}
              imageUri={similarItem.specimenImageUri}
              palettePair={similarItem.cardPalette}
              detail={
                similarItem.confusionNote ??
                "Compare the big shape first, then double-check the little clues."
              }
              trailingLabel={
                "shellType" in similarItem
                  ? similarItem.shellType
                  : similarItem.toothProfile.serration
              }
              onPress={() =>
                navigation.push("ItemDetail", {
                  category: route.params.category,
                  id: similarItem.id,
                })
              }
            />
          ))}
        </View>
      )}

      <SectionTitle title="Fact cards" subtitle="Tiny bits of learning, not a lecture." />
      {item.factCards.map((fact) => (
        <OceanCard key={fact.id} title={fact.title} subtitle={fact.body} icon={fact.icon} />
      ))}
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
  summary: {
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
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: palette.deep,
    paddingVertical: spacing.sm + 2,
  },
  primaryButtonLabel: {
    fontFamily: typography.headingSoft,
    color: palette.pearl,
    fontSize: 16,
    textAlign: "center",
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.78)",
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: spacing.sm + 2,
  },
  secondaryButtonLabel: {
    fontFamily: typography.bodyBold,
    color: palette.deep,
    fontSize: 15,
    textAlign: "center",
  },
  bullet: {
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: palette.deep,
  },
  detailLine: {
    fontFamily: typography.body,
    color: palette.deep,
    fontSize: 15,
    lineHeight: 22,
  },
  similarList: {
    gap: spacing.sm,
  },
});
