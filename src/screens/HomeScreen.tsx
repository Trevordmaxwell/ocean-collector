import { Pressable, StyleSheet, Text, View } from "react-native";

import { FindTile } from "../components/FindTile";
import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { StatPill } from "../components/StatPill";
import { beachFactCards } from "../data";
import { rewardBadges } from "../services/rewardEngine";
import { useOceanStore } from "../store/useOceanStore";
import { gradients, palette, radius, spacing, typography } from "../theme";
import type { TabScreenProps } from "../navigation/types";

const actionCards = [
  {
    label: "Identify a Shell",
    subtitle: "Photo ID or compare by hand",
    emoji: "🐚",
    palettePair: gradients.shell as [string, string],
    target: { screen: "Identify", params: { category: "shell" as const } },
  },
  {
    label: "Identify a Shark Tooth",
    subtitle: "Find the closest tooth profile",
    emoji: "🦈",
    palettePair: gradients.tooth as [string, string],
    target: { screen: "Identify", params: { category: "sharkTooth" as const } },
  },
  {
    label: "Browse Shell Library",
    subtitle: "Pretty guide cards and quick clues",
    emoji: "🌸",
    palettePair: gradients.shell as [string, string],
    target: { screen: "Library", params: { category: "shell" as const } },
  },
  {
    label: "Browse Shark Tooth Library",
    subtitle: "Smooth vs serrated at a glance",
    emoji: "🦷",
    palettePair: gradients.tooth as [string, string],
    target: { screen: "Library", params: { category: "sharkTooth" as const } },
  },
  {
    label: "Log Sea Glass",
    subtitle: "Color, rarity, and sparkle points",
    emoji: "💎",
    palettePair: gradients.seaGlass as [string, string],
    target: { screen: "AddSeaGlass" as const },
  },
  {
    label: "Log Trash Pickup",
    subtitle: "Earn stewardship rewards",
    emoji: "🪣",
    palettePair: gradients.cleanup as [string, string],
    target: { screen: "AddTrash" as const },
  },
];

export function HomeScreen({ navigation }: TabScreenProps<"Home">) {
  const totalPoints = useOceanStore((state) => state.points.total);
  const level = useOceanStore((state) => state.points.level);
  const collection = useOceanStore((state) => state.collection);
  const trashEntries = useOceanStore((state) => state.trashEntries);
  const unlockedBadgeIds = useOceanStore((state) => state.unlockedBadgeIds);

  const cleanupPieces = trashEntries.reduce((total, entry) => total + entry.count, 0);
  const latestBadge = rewardBadges.find((badge) => unlockedBadgeIds.includes(badge.id));

  function openAction(actionLabel: string) {
    switch (actionLabel) {
      case "Identify a Shell":
        navigation.navigate("Identify", { category: "shell" });
        break;
      case "Identify a Shark Tooth":
        navigation.navigate("Identify", { category: "sharkTooth" });
        break;
      case "Browse Shell Library":
        navigation.navigate("Library", { category: "shell" });
        break;
      case "Browse Shark Tooth Library":
        navigation.navigate("Library", { category: "sharkTooth" });
        break;
      case "Log Sea Glass":
        navigation.navigate("AddSeaGlass");
        break;
      case "Log Trash Pickup":
        navigation.navigate("AddTrash");
        break;
    }
  }

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />

      <OceanCard
        title="Welcome back, tide explorer"
        subtitle="Cute beach journaling with points, facts, and treasure-card vibes."
        icon="🌊"
        accent={gradients.hero}
      >
        <View style={styles.statRow}>
          <StatPill label="Points" value={`${totalPoints}`} />
          <StatPill label="Level" value={`${level}`} />
          <StatPill label="Finds" value={`${collection.length}`} />
        </View>

        <View style={styles.heroFooter}>
          <Text style={styles.heroFooterText}>
            Cleanup pieces rescued: <Text style={styles.heroFooterBold}>{cleanupPieces}</Text>
          </Text>
          <Text style={styles.heroFooterText}>
            Latest badge:{" "}
            <Text style={styles.heroFooterBold}>{latestBadge?.title ?? "Almost there"}</Text>
          </Text>
        </View>
      </OceanCard>

      <SectionTitle
        title="Main Adventure Menu"
        subtitle="Everything important is one tap away."
      />

      <View style={styles.actionList}>
        {actionCards.map((card) => (
          <FindTile
            key={card.label}
            title={card.label}
            subtitle={card.subtitle}
            emoji={card.emoji}
            palettePair={card.palettePair}
            onPress={() => openAction(card.label)}
          />
        ))}
      </View>

      <SectionTitle
        title="Collection Shortcuts"
        subtitle="Jump straight to your saved treasures, badges, and fun facts."
      />

      <View style={styles.quickRow}>
        <Pressable onPress={() => navigation.navigate("Collection")} style={styles.quickButton}>
          <Text style={styles.quickEmoji}>📚</Text>
          <Text style={styles.quickLabel}>My Collection</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Rewards")} style={styles.quickButton}>
          <Text style={styles.quickEmoji}>🏅</Text>
          <Text style={styles.quickLabel}>Rewards</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Facts")} style={styles.quickButton}>
          <Text style={styles.quickEmoji}>🫧</Text>
          <Text style={styles.quickLabel}>Learn</Text>
        </Pressable>
      </View>

      <SectionTitle title="Beachy Fun Facts" subtitle="Little nuggets to keep the wonder going." />
      {beachFactCards.slice(0, 3).map((fact) => (
        <OceanCard
          key={fact.id}
          title={fact.title}
          subtitle={fact.body}
          icon={fact.icon}
          accent={["rgba(255,255,255,0.82)", "rgba(255,255,255,0.62)"]}
        />
      ))}
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
  heroFooter: {
    gap: 4,
  },
  heroFooterText: {
    fontFamily: typography.bodyMedium,
    color: palette.deep,
    fontSize: 14,
  },
  heroFooterBold: {
    fontFamily: typography.bodyBold,
  },
  actionList: {
    gap: spacing.sm,
  },
  quickRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  quickButton: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: palette.border,
  },
  quickEmoji: {
    fontSize: 28,
  },
  quickLabel: {
    textAlign: "center",
    fontFamily: typography.bodyBold,
    fontSize: 14,
    color: palette.ink,
  },
});
