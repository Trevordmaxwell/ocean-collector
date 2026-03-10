import { Pressable, StyleSheet, Text, View } from "react-native";

import { FindTile } from "../components/FindTile";
import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { StatPill } from "../components/StatPill";
import { beachFactCards } from "../data";
import {
  getAvailablePoints,
  getEquippedTheme,
  getQuestProgresses,
} from "../services/progression";
import { rewardBadges } from "../services/rewardEngine";
import { useOceanStore } from "../store/useOceanStore";
import { gradients, palette, radius, spacing, typography } from "../theme";
import {
  formatFriendlyDate,
  formatFriendlyTime,
  formatIdentificationLabel,
  getScientificLine,
  isToday,
} from "../utils/format";
import type { TabScreenProps } from "../navigation/types";
import type { LibraryCategory } from "../types/models";

type QuickActionPalette = [string, string];

type JournalActionTarget =
  | { screen: "Identify"; params: { category: LibraryCategory } }
  | { screen: "Library"; params: { category: LibraryCategory } }
  | { screen: "AddSeaGlass" }
  | { screen: "AddTrash" }
  | { screen: "Facts" };

type JournalAction = {
  title: string;
  subtitle: string;
  emoji: string;
  accent: QuickActionPalette;
  onPressTarget: JournalActionTarget;
};

const primaryActions: JournalAction[] = [
  {
    title: "Log a shell",
    subtitle: "Start with a guide or AI assist",
    emoji: "🐚",
    accent: [...gradients.shell] as QuickActionPalette,
    onPressTarget: { screen: "Identify" as const, params: { category: "shell" as const } },
  },
  {
    title: "Log a tooth",
    subtitle: "Keep it cautious and compare slowly",
    emoji: "🦷",
    accent: [...gradients.tooth] as QuickActionPalette,
    onPressTarget: {
      screen: "Identify" as const,
      params: { category: "sharkTooth" as const },
    },
  },
  {
    title: "Sea glass sparkle",
    subtitle: "A lightweight bonus memory",
    emoji: "💎",
    accent: [...gradients.seaGlass] as QuickActionPalette,
    onPressTarget: { screen: "AddSeaGlass" as const },
  },
  {
    title: "Cleanup moment",
    subtitle: "A caring part of the journal",
    emoji: "🪣",
    accent: [...gradients.cleanup] as QuickActionPalette,
    onPressTarget: { screen: "AddTrash" as const },
  },
];

const secondaryActions: JournalAction[] = [
  {
    title: "Shell guide shelf",
    subtitle: "Browse shapes, colors, and lookalikes",
    emoji: "🌺",
    accent: [...gradients.shell] as QuickActionPalette,
    onPressTarget: { screen: "Library" as const, params: { category: "shell" as const } },
  },
  {
    title: "Tooth guide shelf",
    subtitle: "Compare serrations and overall shape",
    emoji: "🦈",
    accent: [...gradients.tooth] as QuickActionPalette,
    onPressTarget: {
      screen: "Library" as const,
      params: { category: "sharkTooth" as const },
    },
  },
  {
    title: "Fun facts",
    subtitle: "Little learning bites",
    emoji: "🫧",
    accent: [gradients.ocean[0], gradients.ocean[1]],
    onPressTarget: { screen: "Facts" as const },
  },
];

export function HomeScreen({ navigation }: TabScreenProps<"Home">) {
  const points = useOceanStore((state) => state.points);
  const collection = useOceanStore((state) => state.collection);
  const findLogs = useOceanStore((state) => state.findLogs);
  const trashEntries = useOceanStore((state) => state.trashEntries);
  const claimedQuestIds = useOceanStore((state) => state.claimedQuestIds);
  const purchasedShopItemIds = useOceanStore((state) => state.purchasedShopItemIds);
  const equippedThemeId = useOceanStore((state) => state.equippedThemeId);
  const preferences = useOceanStore((state) => state.preferences);
  const journalMeta = useOceanStore((state) => state.journalMeta);
  const unlockedBadgeIds = useOceanStore((state) => state.unlockedBadgeIds);

  const cleanupPieces = trashEntries.reduce((total, entry) => total + entry.count, 0);
  const availablePoints = getAvailablePoints(points);
  const activeTheme = getEquippedTheme(purchasedShopItemIds, equippedThemeId);
  const heroAccent = activeTheme?.previewGradient ?? gradients.hero;
  const latestBadge = rewardBadges.find((badge) => unlockedBadgeIds.includes(badge.id));
  const latestCollectionItem = collection[0];
  const todayFindCount = findLogs.filter((entry) => isToday(entry.occurredAt)).length;
  const recentMemories = collection.slice(0, 3);
  const questProgresses = getQuestProgresses({
    collection,
    trashEntries,
    claimedQuestIds,
  });
  const nextQuest = questProgresses.find((entry) => !entry.claimed) ?? questProgresses[0];
  const journalPrompt =
    todayFindCount === 0
      ? "What little detail on your next beach walk might deserve a page in the journal?"
      : "Pick one find from today and add a note about where it was sitting in the sand.";

  function openTarget(target: JournalActionTarget) {
    if (target.screen === "Identify") {
      navigation.navigate("Identify", target.params);
      return;
    }

    if (target.screen === "Library") {
      navigation.navigate("Library", target.params);
      return;
    }

    if (target.screen === "AddSeaGlass") {
      navigation.navigate("AddSeaGlass");
      return;
    }

    if (target.screen === "AddTrash") {
      navigation.navigate("AddTrash");
      return;
    }

    navigation.navigate("Facts");
  }

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />

      <OceanCard
        title={`${preferences.collectorName}'s Tide Journal`}
        subtitle={
          preferences.favoriteBeach
            ? `${preferences.favoriteBeach} • saved locally on this device`
            : "A cozy beach-walk companion for finds, facts, and cleanup memories."
        }
        icon="📘"
        accent={heroAccent}
      >
        <View style={styles.statRow}>
          <StatPill label="Today" value={`${todayFindCount}`} />
          <StatPill label="Collection" value={`${collection.length}`} />
          <StatPill label="Streak" value={`${points.streakDays}d`} />
          <StatPill label="Available" value={`${availablePoints}`} />
        </View>

        <View style={styles.heroNotes}>
          <Text style={styles.heroLine}>
            Last saved locally:{" "}
            <Text style={styles.heroStrong}>
              {formatFriendlyTime(journalMeta.lastSavedAt)}
            </Text>
          </Text>
          <Text style={styles.heroLine}>
            Cleanup pieces rescued:{" "}
            <Text style={styles.heroStrong}>{cleanupPieces}</Text>
          </Text>
          <Text style={styles.heroLine}>
            Latest badge:{" "}
            <Text style={styles.heroStrong}>{latestBadge?.title ?? "Still building"}</Text>
          </Text>
        </View>
      </OceanCard>

      <SectionTitle
        title="Today's beach page"
        subtitle="Open the journal like a memory book, not a dashboard."
      />
      {latestCollectionItem ? (
        <OceanCard
          title={latestCollectionItem.title}
          subtitle={
            getScientificLine(
              preferences.showScientificNames,
              latestCollectionItem.scientificName,
            ) ?? latestCollectionItem.identification.label
          }
          icon={latestCollectionItem.specimenEmoji}
          imageSource={latestCollectionItem.specimenImageSource}
          imageUri={latestCollectionItem.specimenImageUri}
          accent={latestCollectionItem.cardPalette}
        >
          <Text style={styles.featuredMeta}>
            {formatIdentificationLabel(latestCollectionItem.identification)} •{" "}
            {formatFriendlyDate(latestCollectionItem.foundDate)}
          </Text>
          <Text style={styles.featuredMeta}>
            {latestCollectionItem.location || "Beach adventure"}
          </Text>
          <Text style={styles.featuredNote}>
            {latestCollectionItem.notes || "No extra note yet. Add one the next time you open it."}
          </Text>
          <View style={styles.buttonRow}>
            <Pressable
              onPress={() =>
                navigation.navigate("CollectionItem", {
                  itemId: latestCollectionItem.id,
                  category: latestCollectionItem.category,
                })
              }
              style={[styles.primaryButton, styles.flexButton]}
            >
              <Text style={styles.primaryButtonLabel}>Open latest memory</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Collection")}
              style={[styles.secondaryButton, styles.flexButton]}
            >
              <Text style={styles.secondaryButtonLabel}>Browse journal</Text>
            </Pressable>
          </View>
        </OceanCard>
      ) : (
        <OceanCard
          title="Your first page is still waiting"
          subtitle="Start with one shell, one tooth, one cleanup moment, or one piece of sea glass. Tiny entries count."
          icon="🫶"
          accent={gradients.ocean}
        >
          <Text style={styles.featuredNote}>{journalPrompt}</Text>
        </OceanCard>
      )}

      <SectionTitle
        title="Beach walk actions"
        subtitle="Quick taps with a little more personality."
      />
      <View style={styles.grid}>
        {primaryActions.map((action) => (
          <Pressable
            key={action.title}
            onPress={() => openTarget(action.onPressTarget)}
            style={[styles.gridCard, { backgroundColor: action.accent[0] }]}
          >
            <Text style={styles.gridEmoji}>{action.emoji}</Text>
            <Text style={styles.gridTitle}>{action.title}</Text>
            <Text style={styles.gridSubtitle}>{action.subtitle}</Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle
        title="Little habit loop"
        subtitle="One gentle quest and one journal prompt are enough to keep momentum."
        actionLabel="Open rewards"
        onPressAction={() => navigation.navigate("Rewards")}
      />
      {nextQuest ? (
        <OceanCard
          title={`${nextQuest.quest.icon} ${nextQuest.quest.title}`}
          subtitle={nextQuest.quest.description}
          accent={nextQuest.quest.accent}
        >
          <Text style={styles.questLine}>
            {nextQuest.progress}/{nextQuest.target} complete • +
            {nextQuest.quest.rewardPoints} pts
          </Text>
          <Text style={styles.promptLine}>{journalPrompt}</Text>
        </OceanCard>
      ) : null}

      <SectionTitle
        title="Guide shelves and cozy extras"
        subtitle="Manual compare, fun facts, and slower treasure-hunting tools."
      />
      <View style={styles.secondaryList}>
        {secondaryActions.map((action) => (
          <FindTile
            key={action.title}
            title={action.title}
            subtitle={action.subtitle}
            emoji={action.emoji}
            palettePair={action.accent}
            detail="The manual route stays the most transparent one inside the app."
            onPress={() => openTarget(action.onPressTarget)}
          />
        ))}
      </View>

      <SectionTitle
        title="Recent beach memories"
        subtitle="The latest little pages from your collection journal."
      />
      {recentMemories.length === 0 ? (
        <OceanCard
          title="Nothing saved yet"
          subtitle="Once you journal a find, it will start feeling more like a scrapbook than a checklist."
          icon="🐚"
        />
      ) : (
        recentMemories.map((item) => (
          <FindTile
            key={item.id}
            title={item.title}
            subtitle={
              getScientificLine(preferences.showScientificNames, item.scientificName) ??
              item.identification.label
            }
            emoji={item.specimenEmoji}
            imageSource={item.specimenImageSource}
            imageUri={item.specimenImageUri}
            palettePair={item.cardPalette}
            detail={`${item.location} • ${item.notes || "A tucked-away little memory."}`}
            trailingLabel={`+${item.pointsAwarded}`}
            onPress={() =>
              navigation.navigate("CollectionItem", {
                itemId: item.id,
                category: item.category,
              })
            }
          />
        ))
      )}

      <SectionTitle title="One tiny fact for the road" subtitle="Because wonder keeps people coming back." />
      <OceanCard
        title={beachFactCards[0]!.title}
        subtitle={beachFactCards[0]!.body}
        icon={beachFactCards[0]!.icon}
      />
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
  heroNotes: {
    gap: 4,
  },
  heroLine: {
    fontFamily: typography.bodyMedium,
    color: palette.deep,
    fontSize: 14,
  },
  heroStrong: {
    fontFamily: typography.bodyBold,
  },
  featuredMeta: {
    fontFamily: typography.bodyBold,
    color: palette.deep,
    fontSize: 13,
  },
  featuredNote: {
    fontFamily: typography.body,
    color: palette.deep,
    fontSize: 14,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
  primaryButton: {
    borderRadius: radius.pill,
    backgroundColor: palette.deep,
    paddingVertical: spacing.sm + 2,
    alignItems: "center",
  },
  primaryButtonLabel: {
    fontFamily: typography.headingSoft,
    fontSize: 15,
    color: palette.pearl,
    textAlign: "center",
  },
  secondaryButton: {
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.78)",
    paddingVertical: spacing.sm + 2,
    alignItems: "center",
    borderWidth: 1,
    borderColor: palette.border,
  },
  secondaryButtonLabel: {
    fontFamily: typography.bodyBold,
    fontSize: 15,
    color: palette.deep,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  gridCard: {
    width: "48%",
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    gap: spacing.xs,
  },
  gridEmoji: {
    fontSize: 28,
  },
  gridTitle: {
    fontFamily: typography.headingSoft,
    fontSize: 17,
    color: palette.ink,
  },
  gridSubtitle: {
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 18,
    color: palette.deep,
  },
  questLine: {
    fontFamily: typography.bodyBold,
    color: palette.deep,
    fontSize: 14,
  },
  promptLine: {
    fontFamily: typography.body,
    color: palette.kelp,
    fontSize: 14,
    lineHeight: 20,
  },
  secondaryList: {
    gap: spacing.sm,
  },
});
