import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { Chip } from "../components/Chip";
import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { SpecimenPhoto } from "../components/SpecimenPhoto";
import { getLibraryItem } from "../data/library";
import { useOceanStore } from "../store/useOceanStore";
import { gradients, palette, radius, spacing, typography } from "../theme";
import type { RootScreenProps } from "../navigation/types";

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
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonLabel}>{saveLabel}</Text>
        </Pressable>
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
});
