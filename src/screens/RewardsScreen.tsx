import { StyleSheet, Text, View } from "react-native";

import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { StatPill } from "../components/StatPill";
import { rewardBadges } from "../services/rewardEngine";
import { useOceanStore } from "../store/useOceanStore";
import { palette, spacing, typography } from "../theme";

export function RewardsScreen() {
  const points = useOceanStore((state) => state.points);
  const unlockedBadgeIds = useOceanStore((state) => state.unlockedBadgeIds);
  const trashEntries = useOceanStore((state) => state.trashEntries);
  const collection = useOceanStore((state) => state.collection);

  const cleanupPieces = trashEntries.reduce((total, entry) => total + entry.count, 0);
  const nextBadge = rewardBadges.find((badge) => !unlockedBadgeIds.includes(badge.id));

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />

      <OceanCard
        title="Rewards & Badges"
        subtitle="A gentle little game layer to celebrate curiosity and cleanup."
        icon="🏅"
        accent={["#FFE6AE", "#F8D2D7"]}
      >
        <View style={styles.stats}>
          <StatPill label="Points" value={`${points.total}`} />
          <StatPill label="Level" value={`${points.level}`} />
          <StatPill label="Cleanup" value={`${cleanupPieces}`} />
        </View>
        <Text style={styles.helper}>
          Next badge: {nextBadge?.title ?? "All current MVP badges unlocked"}
        </Text>
      </OceanCard>

      <SectionTitle title="Unlocked badges" subtitle="Cute milestones for collecting and stewardship." />
      {rewardBadges.map((badge) => {
        const unlocked = unlockedBadgeIds.includes(badge.id);

        return (
          <OceanCard
            key={badge.id}
            title={`${badge.icon} ${badge.title}`}
            subtitle={badge.description}
            accent={unlocked ? badge.accent : ["rgba(255,255,255,0.72)", "rgba(255,255,255,0.6)"]}
          >
            <Text style={styles.badgeStatus}>{unlocked ? "Unlocked" : "Locked for now"}</Text>
          </OceanCard>
        );
      })}

      <SectionTitle title="Recent point moments" subtitle="Your latest actions in the beach journal loop." />
      {points.transactions.length === 0 ? (
        <OceanCard
          title="No point history yet"
          subtitle="Save a find or log a cleanup moment to start your reward trail."
        />
      ) : (
        points.transactions.map((transaction) => (
          <OceanCard
            key={transaction.id}
            title={`${transaction.label} • +${transaction.points}`}
            subtitle={transaction.detail}
            icon="✨"
          />
        ))
      )}

      <OceanCard
        title="Why points matter"
        subtitle={`This architecture already supports more badges, streaks, seasonal events, and future monetized collector packs without changing the core data shape. You currently have ${collection.length} saved journal items.`}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topSpacing: {
    height: spacing.sm,
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  helper: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: palette.deep,
  },
  badgeStatus: {
    fontFamily: typography.bodyBold,
    color: palette.deep,
    fontSize: 14,
  },
});
