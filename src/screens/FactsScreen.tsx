import { Pressable, StyleSheet, Text, View } from "react-native";

import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { beachFactCards, sharkSpecies, shellSpecies } from "../data";
import { palette, radius, spacing, typography } from "../theme";
import type { RootScreenProps } from "../navigation/types";

export function FactsScreen({ navigation }: RootScreenProps<"Facts">) {
  return (
    <ScreenShell>
      <View style={styles.topSpacing} />
      <View style={styles.headerRow}>
        <Pressable
          style={styles.headerButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
              return;
            }

            navigation.navigate("MainTabs", { screen: "Home" });
          }}
        >
          <Text style={styles.backButton}>← Back</Text>
        </Pressable>
        <Pressable
          style={[styles.headerButton, styles.headerButtonHome]}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "MainTabs", params: { screen: "Home" } }],
            })
          }
        >
          <Text style={styles.homeButton}>Home</Text>
        </Pressable>
      </View>

      <SectionTitle
        title="Learn & Fun Facts"
        subtitle="Short, friendly knowledge bites for curious beachcombers."
      />

      {beachFactCards.map((fact) => (
        <OceanCard key={fact.id} title={fact.title} subtitle={fact.body} icon={fact.icon} />
      ))}

      <SectionTitle title="Shell highlights" subtitle="A few sample library facts." />
      {shellSpecies.slice(0, 2).map((item) => (
        <OceanCard
          key={item.id}
          title={item.commonName}
          subtitle={item.funFacts[0]}
          icon={item.specimenEmoji}
          imageSource={item.specimenImageSource}
          imageUri={item.specimenImageUri}
          accent={item.cardPalette}
        />
      ))}

      <SectionTitle title="Shark tooth highlights" subtitle="Fun, not overly textbook." />
      {sharkSpecies.slice(0, 2).map((item) => (
        <OceanCard
          key={item.id}
          title={item.commonName}
          subtitle={item.funFacts[0]}
          icon={item.specimenEmoji}
          imageSource={item.specimenImageSource}
          imageUri={item.specimenImageUri}
          accent={item.cardPalette}
        />
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topSpacing: {
    height: spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerButton: {
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: palette.border,
  },
  headerButtonHome: {
    backgroundColor: "rgba(234,249,243,0.92)",
  },
  backButton: {
    fontFamily: typography.bodyBold,
    color: palette.deep,
    fontSize: 15,
  },
  homeButton: {
    fontFamily: typography.bodyBold,
    color: palette.kelp,
    fontSize: 15,
  },
});
