import { create } from "zustand";

import {
  seaGlassPresets,
  sharkSpecies,
  shellSpecies,
  trashCategories,
  treasureShopItems,
} from "../data";
import {
  getAvailablePoints,
  getQuestProgresses,
  getUpdatedActivityState,
} from "../services/progression";
import {
  createId,
  createRewardTransaction,
  evaluateBadgeUnlocks,
  getLevelFromPoints,
  getPointsForSeaGlass,
  getTrashMilestoneCelebration,
  getPointsForTrash,
} from "../services/rewardEngine";
import type {
  CollectionCategory,
  OceanStoreState,
  UserCollectionItem,
} from "../types/models";

function makeCollectionItem(input: {
  category: CollectionCategory;
  title: string;
  subtitle: string;
  referenceId?: string;
  location: string;
  notes: string;
  pointsAwarded: number;
  specimenEmoji: string;
  specimenImageSource?: UserCollectionItem["specimenImageSource"];
  specimenImageUri?: string;
  specimenImageSourceUrl?: string;
  specimenImageCredit?: string;
  cardPalette: [string, string];
  userPhotoUri?: string;
}): UserCollectionItem {
  return {
    id: createId("collection"),
    category: input.category,
    referenceId: input.referenceId,
    title: input.title,
    subtitle: input.subtitle,
    foundDate: new Date().toISOString(),
    location: input.location,
    notes: input.notes,
    favorite: false,
    pointsAwarded: input.pointsAwarded,
    userPhotoUri: input.userPhotoUri,
    specimenEmoji: input.specimenEmoji,
    specimenImageSource: input.specimenImageSource,
    specimenImageUri: input.specimenImageUri,
    specimenImageSourceUrl: input.specimenImageSourceUrl,
    specimenImageCredit: input.specimenImageCredit,
    cardPalette: input.cardPalette,
  };
}

export const useOceanStore = create<OceanStoreState>()(
  (set, get) => ({
    hasSeenWelcome: false,
    collection: [],
    seaGlassEntries: [],
    trashEntries: [],
    findLogs: [],
    unlockedBadgeIds: [],
    claimedQuestIds: [],
    purchasedShopItemIds: [],
    equippedThemeId: undefined,
    pendingCelebration: null,
    points: {
      total: 0,
      spent: 0,
      level: 1,
      streakDays: 1,
      lastActivityDate: undefined,
      transactions: [],
    },
    markWelcomeSeen: () => set({ hasSeenWelcome: true }),
    saveIdentifiedFind: ({ category, referenceId, location, notes, userPhotoUri, source }) =>
      set((state) => {
        const item =
          category === "shell"
            ? shellSpecies.find((entry) => entry.id === referenceId)
            : sharkSpecies.find((entry) => entry.id === referenceId);

        if (!item) {
          return state;
        }

        const action =
          category === "shell"
            ? source === "manual"
              ? "save_manual_guide"
              : "identify_shell"
            : source === "manual"
              ? "save_manual_guide"
              : "identify_shark_tooth";

        const reward = createRewardTransaction({
          action,
          detail: `${item.commonName} saved to your collection.`,
        });

        const nextCollection = [
          makeCollectionItem({
            category,
            referenceId: item.id,
            title: item.commonName,
            subtitle:
              "sharkName" in item
                ? item.sharkName
                : item.scientificName ?? "Shell guide match",
            location,
            notes,
            userPhotoUri,
            pointsAwarded: reward.points,
            specimenEmoji: item.specimenEmoji,
            specimenImageSource: item.specimenImageSource,
            specimenImageUri: item.specimenImageUri,
            specimenImageSourceUrl: item.specimenImageSourceUrl,
            specimenImageCredit: item.specimenImageCredit,
            cardPalette: item.cardPalette,
          }),
          ...state.collection,
        ];

        const nextTotal = state.points.total + reward.points;
        const activityState = getUpdatedActivityState(state.points, reward.createdAt);

        return {
          collection: nextCollection,
          findLogs: [
            {
              id: createId("log"),
              category,
              title: item.commonName,
              points: reward.points,
              occurredAt: reward.createdAt,
              note: notes,
            },
            ...state.findLogs,
          ],
          points: {
            total: nextTotal,
            spent: state.points.spent,
            level: getLevelFromPoints(nextTotal),
            streakDays: activityState.streakDays,
            lastActivityDate: activityState.lastActivityDate,
            transactions: [reward, ...state.points.transactions].slice(0, 20),
          },
          unlockedBadgeIds: evaluateBadgeUnlocks({
            totalPoints: nextTotal,
            collection: nextCollection,
            trashPieceCount: state.trashEntries.reduce(
              (total, entry) => total + entry.count,
              0,
            ),
          }),
        };
      }),
    addSeaGlassFind: ({
      presetId,
      colorName,
      size,
      shape,
      surface,
      rarity,
      location,
      note,
      userPhotoUri,
    }) =>
      set((state) => {
        const preset = seaGlassPresets.find((entry) => entry.id === presetId);
        const reward = createRewardTransaction({
          action: "log_sea_glass",
          detail: `${colorName} sea glass tucked into your collection.`,
          points: getPointsForSeaGlass(preset?.pointsBonus ?? 0),
        });

        const nextSeaGlassEntries = [
          {
            id: createId("sea-glass"),
            presetId,
            colorName,
            size,
            shape,
            surface,
            rarity,
            location,
            note,
            userPhotoUri,
            foundDate: reward.createdAt,
          },
          ...state.seaGlassEntries,
        ];

        const nextCollection = [
          makeCollectionItem({
            category: "seaGlass",
            title: `${colorName} Sea Glass`,
            subtitle: `${surface} ${shape} • ${rarity} rarity`,
            location,
            notes: note,
            userPhotoUri,
            pointsAwarded: reward.points,
            specimenEmoji: "💎",
            cardPalette: [preset?.colorHex ?? "#BEE8DA", "#F3FFF9"],
          }),
          ...state.collection,
        ];

        const nextTotal = state.points.total + reward.points;
        const activityState = getUpdatedActivityState(state.points, reward.createdAt);

        return {
          seaGlassEntries: nextSeaGlassEntries,
          collection: nextCollection,
          findLogs: [
            {
              id: createId("log"),
              category: "seaGlass",
              title: `${colorName} Sea Glass`,
              points: reward.points,
              occurredAt: reward.createdAt,
              note,
            },
            ...state.findLogs,
          ],
          points: {
            total: nextTotal,
            spent: state.points.spent,
            level: getLevelFromPoints(nextTotal),
            streakDays: activityState.streakDays,
            lastActivityDate: activityState.lastActivityDate,
            transactions: [reward, ...state.points.transactions].slice(0, 20),
          },
          unlockedBadgeIds: evaluateBadgeUnlocks({
            totalPoints: nextTotal,
            collection: nextCollection,
            trashPieceCount: state.trashEntries.reduce(
              (total, entry) => total + entry.count,
              0,
            ),
          }),
        };
      }),
    addTrashPickup: ({ trashCategoryId, count, location, note, userPhotoUri }) => {
      let celebration = null;

      set((state) => {
        const category = trashCategories.find((entry) => entry.id === trashCategoryId);
        const reward = createRewardTransaction({
          action: "log_trash",
          detail: category?.encouragement ?? "Beach cleanup logged.",
          points: getPointsForTrash(trashCategoryId, count),
        });

        const nextTrashEntries = [
          {
            id: createId("trash"),
            trashCategoryId,
            label: category?.label ?? "Trash Pickup",
            count,
            location,
            note,
            userPhotoUri,
            foundDate: reward.createdAt,
          },
          ...state.trashEntries,
        ];

        const nextCollection = [
          makeCollectionItem({
            category: "trash",
            title: `${category?.label ?? "Cleanup"} x${count}`,
            subtitle: "Beach stewardship log",
            location,
            notes: note,
            userPhotoUri,
            pointsAwarded: reward.points,
            specimenEmoji: category?.icon ?? "🪣",
            cardPalette: ["#FFE3BA", "#FFF7E3"],
          }),
          ...state.collection,
        ];

        const nextTotal = state.points.total + reward.points;
        const previousTrashPieceCount = state.trashEntries.reduce(
          (total, entry) => total + entry.count,
          0,
        );
        const trashPieceCount = nextTrashEntries.reduce(
          (total, entry) => total + entry.count,
          0,
        );
        celebration = getTrashMilestoneCelebration(previousTrashPieceCount, trashPieceCount);
        const activityState = getUpdatedActivityState(state.points, reward.createdAt);

        return {
          trashEntries: nextTrashEntries,
          collection: nextCollection,
          findLogs: [
            {
              id: createId("log"),
              category: "trash",
              title: category?.label ?? "Beach Cleanup",
              points: reward.points,
              occurredAt: reward.createdAt,
              note,
            },
            ...state.findLogs,
          ],
          points: {
            total: nextTotal,
            spent: state.points.spent,
            level: getLevelFromPoints(nextTotal),
            streakDays: activityState.streakDays,
            lastActivityDate: activityState.lastActivityDate,
            transactions: [reward, ...state.points.transactions].slice(0, 20),
          },
          unlockedBadgeIds: evaluateBadgeUnlocks({
            totalPoints: nextTotal,
            collection: nextCollection,
            trashPieceCount,
          }),
          pendingCelebration: celebration,
        };
      });

      return celebration;
    },
    claimQuest: (questId) => {
      const state = get();
      const questProgress = getQuestProgresses({
        collection: state.collection,
        trashEntries: state.trashEntries,
        claimedQuestIds: state.claimedQuestIds,
      }).find((entry) => entry.quest.id === questId);

      if (!questProgress) {
        return { ok: false, message: "That quest could not be found." };
      }

      if (questProgress.claimed) {
        return { ok: false, message: "That quest reward is already claimed." };
      }

      if (questProgress.progress < questProgress.target) {
        return { ok: false, message: "Keep exploring a little more before claiming this quest." };
      }

      const reward = createRewardTransaction({
        action: "claim_quest",
        detail: `${questProgress.quest.title} completed.`,
        points: questProgress.quest.rewardPoints,
      });

      set((current) => {
        const nextTotal = current.points.total + reward.points;
        const trashPieceCount = current.trashEntries.reduce(
          (total, entry) => total + entry.count,
          0,
        );
        const activityState = getUpdatedActivityState(current.points, reward.createdAt);

        return {
          claimedQuestIds: [
            ...current.claimedQuestIds,
            `${questProgress.quest.id}:${questProgress.cycleKey}`,
          ],
          points: {
            total: nextTotal,
            spent: current.points.spent,
            level: getLevelFromPoints(nextTotal),
            streakDays: activityState.streakDays,
            lastActivityDate: activityState.lastActivityDate,
            transactions: [reward, ...current.points.transactions].slice(0, 20),
          },
          unlockedBadgeIds: evaluateBadgeUnlocks({
            totalPoints: nextTotal,
            collection: current.collection,
            trashPieceCount,
          }),
        };
      });

      return {
        ok: true,
        message: `${questProgress.quest.rewardPoints} points splashed into your reward bucket.`,
      };
    },
    purchaseShopItem: (itemId) => {
      const state = get();
      const item = treasureShopItems.find((entry) => entry.id === itemId);

      if (!item) {
        return { ok: false, message: "That treasure shop item is missing." };
      }

      if (state.purchasedShopItemIds.includes(item.id)) {
        return { ok: false, message: "You already own this treasure." };
      }

      const availablePoints = getAvailablePoints(state.points);

      if (availablePoints < item.cost) {
        return {
          ok: false,
          message: `You need ${item.cost - availablePoints} more points to redeem this.`,
        };
      }

      const purchase = createRewardTransaction({
        action: "redeem_shop_item",
        detail: `${item.title} joined your treasure chest.`,
        points: -item.cost,
      });

      set((current) => ({
        purchasedShopItemIds: [...current.purchasedShopItemIds, item.id],
        equippedThemeId:
          current.equippedThemeId || item.category !== "journalTheme"
            ? current.equippedThemeId
            : item.id,
        points: {
          ...current.points,
          spent: current.points.spent + item.cost,
          transactions: [purchase, ...current.points.transactions].slice(0, 20),
        },
      }));

      return {
        ok: true,
        message: `${item.title} is now tucked into your treasure chest.`,
      };
    },
    equipTheme: (itemId) =>
      set((state) => {
        const item = treasureShopItems.find((entry) => entry.id === itemId);

        if (!item || item.category !== "journalTheme") {
          return state;
        }

        if (!state.purchasedShopItemIds.includes(itemId)) {
          return state;
        }

        return { equippedThemeId: itemId };
      }),
    toggleFavorite: (itemId) =>
      set((state) => ({
        collection: state.collection.map((item) =>
          item.id === itemId ? { ...item, favorite: !item.favorite } : item,
        ),
      })),
    dismissCelebration: () => set({ pendingCelebration: null }),
  }),
);
