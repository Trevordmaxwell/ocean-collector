import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { Chip } from "../components/Chip";
import { FindTile } from "../components/FindTile";
import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { SpecimenPhoto } from "../components/SpecimenPhoto";
import { getLibraryItem, getLibraryItems } from "../data/library";
import { useOceanStore } from "../store/useOceanStore";
import { gradients, palette, radius, spacing, typography } from "../theme";
import type { RootScreenProps } from "../navigation/types";

function matchesLookalike(currentLookalikes: string[], currentName: string, candidateName: string) {
  const candidate = candidateName.toLowerCase();
  const current = currentName.toLowerCase();

  return currentLookalikes.some((lookalike) => {
    const normalized = lookalike.toLowerCase();
    return candidate.includes(normalized) || normalized.includes(candidate) || normalized.includes(current);
  });
}

export function ItemDetailScreen({ navigation, route }: RootScreenProps<"ItemDetail">) {
  const item = getLibraryItem(route.params.category, route.params.id);
  const saveIdentifiedFind = useOceanStore((state) => state.saveIdentifiedFind);

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
    route.params.category === "shell" ? "Save shell to collection" : "Save tooth to collection";
  const comparisonQuery = item.lookalikes[0] ?? item.commonName;
  const similarItems = getLibraryItems(route.params.category)
    .filter((candidate) => {
      if (candidate.id === item.id) {
        return false;
      }

      const candidateName = "sharkName" in candidate ? candidate.sharkName : candidate.commonName;
      const sameFamily =
        "shellType" in item && "shellType" in candidate
          ? item.shellType === candidate.shellType
          : "toothProfile" in item && "toothProfile" in candidate
            ? item.toothProfile.serration === candidate.toothProfile.serration
            : false;

      return (
        matchesLookalike(item.lookalikes, item.commonName, candidate.commonName) ||
        matchesLookalike(candidate.lookalikes, candidate.commonName, item.commonName) ||
        matchesLookalike(item.lookalikes, item.commonName, candidateName) ||
        sameFamily
      );
    })
    .slice(0, 3);

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>← Back</Text>
      </Pressable>

      <OceanCard
        title={item.commonName}
        subtitle={item.scientificName ?? item.summary}
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
        </View>
        <View style={styles.buttonRow}>
          <Pressable
            onPress={() => {
              saveIdentifiedFind({
                category: route.params.category,
                referenceId: item.id,
                location: "Library save",
                notes: "Saved from the detailed guide card.",
                source: "manual",
              });
              Alert.alert("Saved!", `${item.commonName} was added to your collection.`);
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
            <Text style={styles.secondaryButtonLabel}>Compare in Library</Text>
          </Pressable>
        </View>
      </OceanCard>

      <SectionTitle title="How to spot it" subtitle="Quick collector clues" />
      <OceanCard>
        {item.identifyingFeatures.map((feature) => (
          <Text key={feature} style={styles.bullet}>
            • {feature}
          </Text>
        ))}
      </OceanCard>

      <SectionTitle title="Shape & size" subtitle="Use these details when comparing." />
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

      <SectionTitle title="Lookalikes & fun facts" subtitle="Friendly extra context" />
      <OceanCard accent={route.params.category === "shell" ? gradients.shell : gradients.tooth}>
        <Text style={styles.detailLine}>Lookalikes: {item.lookalikes.join(", ")}</Text>
        {item.funFacts.map((fact) => (
          <Text key={fact} style={styles.bullet}>
            • {fact}
          </Text>
        ))}
      </OceanCard>

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
          subtitle="This guide card already has a compare shelf button if you want to search manually."
        />
      ) : (
        <View style={styles.similarList}>
          {similarItems.map((similarItem) => (
            <FindTile
              key={similarItem.id}
              title={similarItem.commonName}
              subtitle={similarItem.scientificName ?? similarItem.summary}
              emoji={similarItem.specimenEmoji}
              imageSource={similarItem.specimenImageSource}
              imageUri={similarItem.specimenImageUri}
              palettePair={similarItem.cardPalette}
              detail={similarItem.summary}
              trailingLabel={"shellType" in similarItem ? similarItem.shellType : similarItem.toothProfile.serration}
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
