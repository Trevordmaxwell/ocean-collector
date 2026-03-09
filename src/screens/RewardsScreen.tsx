import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { StatPill } from "../components/StatPill";
import { rewardQuests, treasureShopItems } from "../data";
import {
  getAvailablePoints,
  getOwnedThemeItems,
  getQuestProgresses,
} from "../services/progression";
import { rewardBadges } from "../services/rewardEngine";
import { useOceanStore } from "../store/useOceanStore";
import { palette, radius, spacing, typography } from "../theme";

function formatPointChange(points: number) {
  return `${points >= 0 ? "+" : ""}${points}`;
}

export function RewardsScreen() {
  const points = useOceanStore((state) => state.points);
  const unlockedBadgeIds = useOceanStore((state) => state.unlockedBadgeIds);
  const trashEntries = useOceanStore((state) => state.trashEntries);
  const collection = useOceanStore((state) => state.collection);
  const claimedQuestIds = useOceanStore((state) => state.claimedQuestIds);
  const purchasedShopItemIds = useOceanStore((state) => state.purchasedShopItemIds);
  const equippedThemeId = useOceanStore((state) => state.equippedThemeId);
  const claimQuest = useOceanStore((state) => state.claimQuest);
  const purchaseShopItem = useOceanStore((state) => state.purchaseShopItem);
  const equipTheme = useOceanStore((state) => state.equipTheme);

  const cleanupPieces = trashEntries.reduce((total, entry) => total + entry.count, 0);
  const nextBadge = rewardBadges.find((badge) => !unlockedBadgeIds.includes(badge.id));
  const availablePoints = getAvailablePoints(points);
  const questProgresses = getQuestProgresses({
    collection,
    trashEntries,
    claimedQuestIds,
  });
  const ownedThemeItems = getOwnedThemeItems(purchasedShopItemIds, equippedThemeId);
  const shopInventory = treasureShopItems.map((item) => ({
    ...item,
    owned: purchasedShopItemIds.includes(item.id),
  }));
  const claimableQuests = questProgresses.filter(
    (entry) => entry.progress >= entry.target && !entry.claimed,
  ).length;

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />

      <OceanCard
        title="Rewards, Quests & Treasure Shop"
        subtitle="Collect points, claim cozy quests, and cash them in for fun unlocks."
        icon="🏅"
        accent={["#FFE6AE", "#F8D2D7"]}
      >
        <View style={styles.stats}>
          <StatPill label="Total" value={`${points.total}`} />
          <StatPill label="Available" value={`${availablePoints}`} />
          <StatPill label="Spent" value={`${points.spent}`} />
          <StatPill label="Streak" value={`${points.streakDays}d`} />
          <StatPill label="Level" value={`${points.level}`} />
          <StatPill label="Cleanup" value={`${cleanupPieces}`} />
        </View>
        <Text style={styles.helper}>
          {claimableQuests > 0
            ? `${claimableQuests} quest reward${claimableQuests === 1 ? "" : "s"} ready to claim.`
            : `Next badge: ${nextBadge?.title ?? "All current MVP badges unlocked"}`}
        </Text>
      </OceanCard>

      <SectionTitle
        title="Quest board"
        subtitle="A daily and weekly loop to keep beach walks game-y."
      />
      {questProgresses.map((entry) => {
        const canClaim = entry.progress >= entry.target && !entry.claimed;

        return (
          <OceanCard
            key={entry.quest.id}
            title={`${entry.quest.icon} ${entry.quest.title}`}
            subtitle={entry.quest.description}
            accent={entry.quest.accent}
          >
            <Text style={styles.questLine}>
              {entry.progress}/{entry.target} complete • {entry.quest.cadence} • +
              {entry.quest.rewardPoints} pts
            </Text>
            <Pressable
              disabled={!canClaim}
              onPress={() => {
                const result = claimQuest(entry.quest.id);

                if (!result.ok) {
                  Alert.alert("Not yet", result.message);
                }
              }}
              style={[
                styles.secondaryButton,
                canClaim ? styles.claimButton : styles.disabledButton,
              ]}
            >
              <Text
                style={[
                  styles.secondaryButtonLabel,
                  !canClaim && styles.disabledButtonLabel,
                ]}
              >
                {entry.claimed ? "Claimed" : canClaim ? "Claim reward" : "Still in progress"}
              </Text>
            </Pressable>
            {entry.claimed ? (
              <Text style={styles.claimedQuestNote}>
                Claimed with a splash. Your points are already tucked into the total above.
              </Text>
            ) : null}
          </OceanCard>
        );
      })}

      <SectionTitle
        title="Treasure Shop"
        subtitle="Cash in points for cute cosmetic rewards and future goodies."
      />
      {shopInventory.map((item) => {
        const canAfford = availablePoints >= item.cost;
        const canEquip = item.owned && item.category === "journalTheme";
        const isEquipped = item.id === equippedThemeId;

        return (
          <OceanCard
            key={item.id}
            title={`${item.icon} ${item.title}`}
            subtitle={`${item.cost} pts • ${item.description}`}
            accent={item.accent}
          >
            <Text style={styles.shopLine}>{item.perk}</Text>
            {item.owned ? (
              canEquip ? (
                <Pressable
                  onPress={() => equipTheme(item.id)}
                  style={[
                    styles.secondaryButton,
                    isEquipped ? styles.equippedButton : styles.claimButton,
                  ]}
                >
                  <Text style={styles.secondaryButtonLabel}>
                    {isEquipped ? "Equipped theme" : "Equip theme"}
                  </Text>
                </Pressable>
              ) : (
                <Text style={styles.ownedLabel}>Owned and tucked into your treasure chest.</Text>
              )
            ) : (
              <Pressable
                disabled={!canAfford}
                onPress={() => {
                  const result = purchaseShopItem(item.id);
                  Alert.alert(result.ok ? "Treasure unlocked!" : "Need more points", result.message);
                }}
                style={[
                  styles.secondaryButton,
                  canAfford ? styles.claimButton : styles.disabledButton,
                ]}
              >
                <Text
                  style={[
                    styles.secondaryButtonLabel,
                    !canAfford && styles.disabledButtonLabel,
                  ]}
                >
                  {canAfford ? "Redeem reward" : `Need ${item.cost - availablePoints} more`}
                </Text>
              </Pressable>
            )}
          </OceanCard>
        );
      })}

      {ownedThemeItems.length > 0 ? (
        <>
          <SectionTitle
            title="Owned themes"
            subtitle="Your journal themes are ready to swap whenever you want."
          />
          {ownedThemeItems.map((item) => (
            <OceanCard
              key={item.id}
              title={`${item.icon} ${item.title}`}
              subtitle={item.equipped ? "Currently equipped" : "Owned journal theme"}
              accent={item.previewGradient ?? item.accent}
            >
              <Text style={styles.shopLine}>{item.perk}</Text>
            </OceanCard>
          ))}
        </>
      ) : null}

      <SectionTitle
        title="Unlocked badges"
        subtitle="Cute milestones for collecting and stewardship."
      />
      {rewardBadges.map((badge) => {
        const unlocked = unlockedBadgeIds.includes(badge.id);

        return (
          <OceanCard
            key={badge.id}
            title={`${badge.icon} ${badge.title}`}
            subtitle={badge.description}
            accent={unlocked ? badge.accent : ["rgba(255,255,255,0.72)", "rgba(255,255,255,0.6)"]}
          >
            <Text style={styles.badgeStatus}>
              {unlocked ? "Unlocked" : `Locked • goal ${badge.threshold}`}
            </Text>
          </OceanCard>
        );
      })}

      <SectionTitle
        title="Recent point moments"
        subtitle="Your latest actions in the beach journal loop."
      />
      {points.transactions.length === 0 ? (
        <OceanCard
          title="No point history yet"
          subtitle="Save a find or log a cleanup moment to start your reward trail."
        />
      ) : (
        points.transactions.map((transaction) => (
          <OceanCard
            key={transaction.id}
            title={`${transaction.label} • ${formatPointChange(transaction.points)}`}
            subtitle={transaction.detail}
            icon={transaction.points >= 0 ? "✨" : "🛍️"}
          />
        ))
      )}

      <OceanCard
        title="What changed in this version"
        subtitle={`The rewards tab now doubles as a quest board and little cosmetic shop. You currently have ${collection.length} saved journal items and ${rewardQuests.length} rotating quests.`}
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
  questLine: {
    fontFamily: typography.bodyBold,
    color: palette.deep,
    fontSize: 14,
  },
  shopLine: {
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: palette.deep,
  },
  badgeStatus: {
    fontFamily: typography.bodyBold,
    color: palette.deep,
    fontSize: 14,
  },
  ownedLabel: {
    fontFamily: typography.bodyBold,
    fontSize: 14,
    color: palette.kelp,
  },
  claimedQuestNote: {
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 19,
    color: palette.deep,
    textAlign: "center",
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
  },
  claimButton: {
    backgroundColor: palette.deep,
    borderColor: palette.deep,
  },
  equippedButton: {
    backgroundColor: "rgba(97, 175, 134, 0.18)",
    borderColor: "rgba(97, 175, 134, 0.35)",
  },
  disabledButton: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderColor: palette.border,
  },
  secondaryButtonLabel: {
    fontFamily: typography.bodyBold,
    color: palette.pearl,
    fontSize: 15,
  },
  disabledButtonLabel: {
    color: palette.mist,
  },
});
