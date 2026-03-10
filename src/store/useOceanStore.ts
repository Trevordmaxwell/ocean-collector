import AsyncStorage from "@react-native-async-storage/async-storage";

const { create } = require("zustand") as typeof import("zustand");
const { createJSONStorage, persist } = require("zustand/middleware") as typeof import(
  "zustand/middleware"
);

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
  createQuestCelebration,
  createId,
  createRewardTransaction,
  evaluateBadgeUnlocks,
  getLevelFromPoints,
  getPointsForSeaGlass,
  getPointsForTrash,
  getTrashMilestoneCelebration,
} from "../services/rewardEngine";
import type {
  CollectionCategory,
  CollectionIdentification,
  CollectorPreferences,
  JournalMeta,
  LibraryCategory,
  OceanStoreState,
  UserDataExport,
  UserCollectionItem,
  UserPoints,
} from "../types/models";

const STORAGE_VERSION = 2;
const STORE_NAME = "ocean-collector-store";

const defaultPreferences: CollectorPreferences = {
  collectorName: "tide explorer",
  favoriteBeach: "",
  showScientificNames: true,
};

const defaultJournalMeta: JournalMeta = {
  storageVersion: STORAGE_VERSION,
};

function createDefaultPoints(): UserPoints {
  return {
    total: 0,
    spent: 0,
    level: 1,
    streakDays: 1,
    lastActivityDate: undefined,
    transactions: [],
  };
}

function createNotice(
  title: string,
  message: string,
  tone: "success" | "info" | "error" = "success",
) {
  return {
    id: createId("notice"),
    title,
    message,
    tone,
  };
}

function createCollectionIdentification(
  input: CollectionIdentification,
): CollectionIdentification {
  return {
    status: input.status,
    source: input.source,
    label: input.label,
    note: input.note,
  };
}

function getLegacyIdentification(
  item: Partial<UserCollectionItem> & { category?: CollectionCategory },
): CollectionIdentification {
  if (item.category === "seaGlass") {
    return {
      status: "logged",
      source: "sea-glass-log",
      label: "Logged sea glass memory",
      note: "Saved before Ocean Collector added richer journal labels.",
    };
  }

  if (item.category === "trash") {
    return {
      status: "logged",
      source: "trash-log",
      label: "Logged cleanup moment",
      note: "Saved before Ocean Collector added richer journal labels.",
    };
  }

  if (item.referenceId) {
    return {
      status: "suggested",
      source: "legacy-migration",
      label: "Saved before trust update",
      note: "This entry was saved before Ocean Collector started separating suggestions from confirmed IDs.",
    };
  }

  return {
    status: "unknown",
    source: "legacy-migration",
    label: "Unknown beach find",
    note: "This entry was saved without a confirmed ID before the journal trust update.",
  };
}

function migrateCollectionItem(
  item: Partial<UserCollectionItem> & { category?: CollectionCategory },
): UserCollectionItem {
  return {
    id: item.id ?? createId("collection"),
    category: item.category ?? "shell",
    referenceId: item.referenceId,
    title: item.title ?? "Saved beach find",
    subtitle: item.subtitle ?? "Journal entry",
    scientificName:
      typeof item.scientificName === "string" ? item.scientificName : undefined,
    foundDate: item.foundDate ?? new Date().toISOString(),
    location: item.location ?? "Beach adventure",
    notes: item.notes ?? "",
    favorite: Boolean(item.favorite),
    pointsAwarded: typeof item.pointsAwarded === "number" ? item.pointsAwarded : 0,
    userPhotoUri:
      typeof item.userPhotoUri === "string" ? item.userPhotoUri : undefined,
    specimenEmoji: item.specimenEmoji ?? "🫧",
    specimenImageSource: item.specimenImageSource,
    specimenImageUri:
      typeof item.specimenImageUri === "string" ? item.specimenImageUri : undefined,
    specimenImageSourceUrl:
      typeof item.specimenImageSourceUrl === "string"
        ? item.specimenImageSourceUrl
        : undefined,
    specimenImageCredit:
      typeof item.specimenImageCredit === "string"
        ? item.specimenImageCredit
        : undefined,
    collectorRarity: item.collectorRarity,
    identification: item.identification
      ? createCollectionIdentification(item.identification)
      : getLegacyIdentification(item),
    cardPalette:
      item.cardPalette && item.cardPalette.length === 2
        ? item.cardPalette
        : ["#FFFDF8", "#F4FBFF"],
  };
}

function getPersistentStateDefaults() {
  return {
    hasSeenWelcome: false,
    preferences: defaultPreferences,
    journalMeta: defaultJournalMeta,
    collection: [] as UserCollectionItem[],
    seaGlassEntries: [],
    trashEntries: [],
    findLogs: [],
    unlockedBadgeIds: [],
    claimedQuestIds: [],
    purchasedShopItemIds: [],
    equippedThemeId: undefined as string | undefined,
    points: createDefaultPoints(),
  };
}

function migratePersistedState(persistedState: unknown) {
  const state = persistedState as Partial<
    ReturnType<typeof getPersistentStateDefaults> & {
      collection: Array<Partial<UserCollectionItem> & { category?: CollectionCategory }>;
      seaGlassEntries: OceanStoreState["seaGlassEntries"];
      trashEntries: OceanStoreState["trashEntries"];
      findLogs: OceanStoreState["findLogs"];
      points: UserPoints;
      unlockedBadgeIds: string[];
      claimedQuestIds: string[];
      purchasedShopItemIds: string[];
      preferences: Partial<CollectorPreferences>;
      journalMeta: Partial<JournalMeta>;
    }
  >;

  const defaults = getPersistentStateDefaults();

  return {
    ...defaults,
    hasSeenWelcome: Boolean(state.hasSeenWelcome),
    preferences: {
      ...defaultPreferences,
      ...state.preferences,
    },
    journalMeta: {
      ...defaultJournalMeta,
      ...state.journalMeta,
      storageVersion: STORAGE_VERSION,
    },
    collection: Array.isArray(state.collection)
      ? state.collection.map((item) => migrateCollectionItem(item))
      : [],
    seaGlassEntries: Array.isArray(state.seaGlassEntries) ? state.seaGlassEntries : [],
    trashEntries: Array.isArray(state.trashEntries) ? state.trashEntries : [],
    findLogs: Array.isArray(state.findLogs) ? state.findLogs : [],
    unlockedBadgeIds: Array.isArray(state.unlockedBadgeIds)
      ? state.unlockedBadgeIds
      : [],
    claimedQuestIds: Array.isArray(state.claimedQuestIds) ? state.claimedQuestIds : [],
    purchasedShopItemIds: Array.isArray(state.purchasedShopItemIds)
      ? state.purchasedShopItemIds
      : [],
    equippedThemeId:
      typeof state.equippedThemeId === "string" ? state.equippedThemeId : undefined,
    points: state.points
      ? {
          ...createDefaultPoints(),
          ...state.points,
          transactions: Array.isArray(state.points.transactions)
            ? state.points.transactions
            : [],
        }
      : createDefaultPoints(),
  };
}

function buildRestoredState(input: UserDataExport) {
  return {
    hasSeenWelcome: Boolean(input.hasSeenWelcome),
    preferences: {
      ...defaultPreferences,
      ...input.preferences,
    },
    journalMeta: {
      ...defaultJournalMeta,
      ...input.journalMeta,
      storageVersion: STORAGE_VERSION,
      lastRestoredAt: new Date().toISOString(),
    },
    collection: Array.isArray(input.collection)
      ? input.collection.map((item) => migrateCollectionItem(item))
      : [],
    seaGlassEntries: Array.isArray(input.seaGlassEntries) ? input.seaGlassEntries : [],
    trashEntries: Array.isArray(input.trashEntries) ? input.trashEntries : [],
    findLogs: Array.isArray(input.findLogs) ? input.findLogs : [],
    unlockedBadgeIds: Array.isArray(input.unlockedBadgeIds) ? input.unlockedBadgeIds : [],
    claimedQuestIds: Array.isArray(input.claimedQuestIds) ? input.claimedQuestIds : [],
    purchasedShopItemIds: Array.isArray(input.purchasedShopItemIds)
      ? input.purchasedShopItemIds
      : [],
    equippedThemeId:
      typeof input.equippedThemeId === "string" ? input.equippedThemeId : undefined,
    points:
      input.points && typeof input.points.total === "number"
        ? {
            ...createDefaultPoints(),
            ...input.points,
            transactions: Array.isArray(input.points.transactions)
              ? input.points.transactions
              : [],
          }
        : createDefaultPoints(),
  };
}

function getRewardActionForLibrarySave(
  category: LibraryCategory,
  identification: CollectionIdentification,
) {
  if (identification.status === "suggested") {
    return category === "shell"
      ? ("save_suggested_shell" as const)
      : ("save_suggested_shark_tooth" as const);
  }

  return "save_manual_guide" as const;
}

function getCollectionSubtitle(identification: CollectionIdentification) {
  return identification.label;
}

function makeCollectionItem(input: {
  category: CollectionCategory;
  title: string;
  subtitle: string;
  scientificName?: string;
  referenceId?: string;
  location: string;
  notes: string;
  pointsAwarded: number;
  specimenEmoji: string;
  specimenImageSource?: UserCollectionItem["specimenImageSource"];
  specimenImageUri?: string;
  specimenImageSourceUrl?: string;
  specimenImageCredit?: string;
  collectorRarity?: UserCollectionItem["collectorRarity"];
  identification: CollectionIdentification;
  cardPalette: [string, string];
  userPhotoUri?: string;
}): UserCollectionItem {
  return {
    id: createId("collection"),
    category: input.category,
    referenceId: input.referenceId,
    title: input.title,
    subtitle: input.subtitle,
    scientificName: input.scientificName,
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
    collectorRarity: input.collectorRarity,
    identification: createCollectionIdentification(input.identification),
    cardPalette: input.cardPalette,
  };
}

export const useOceanStore = create<OceanStoreState>()(
  persist(
    (set, get) => ({
      ...getPersistentStateDefaults(),
      hasHydrated: false,
      pendingCelebration: null,
      pendingNotice: null,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      markWelcomeSeen: () => set({ hasSeenWelcome: true }),
      updatePreferences: (input) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...input,
          },
        })),
      markDataExported: (exportedAt = new Date().toISOString()) =>
        set((state) => ({
          journalMeta: {
            ...state.journalMeta,
            lastExportedAt: exportedAt,
          },
          pendingNotice: createNotice(
            "Export ready",
            "A fresh journal snapshot was prepared for you to copy or share.",
            "success",
          ),
        })),
      restoreImportedData: (input) => {
        const restored = buildRestoredState(input);

        set((state) => ({
          ...restored,
          hasHydrated: state.hasHydrated,
          pendingCelebration: null,
          pendingNotice: createNotice(
            "Journal restored",
            `${restored.collection.length} saved memories were restored onto this device.`,
            "success",
          ),
        }));

        return {
          ok: true,
          message: `${restored.collection.length} saved memories were restored onto this device.`,
        };
      },
      saveLibraryMatch: ({
        category,
        referenceId,
        location,
        notes,
        userPhotoUri,
        identification,
      }) =>
        set((state) => {
          const item =
            category === "shell"
              ? shellSpecies.find((entry) => entry.id === referenceId)
              : sharkSpecies.find((entry) => entry.id === referenceId);

          if (!item) {
            return {
              pendingNotice: createNotice(
                "Guide card missing",
                "That guide entry could not be found, so nothing was saved.",
                "error",
              ),
            };
          }

          const reward = createRewardTransaction({
            action: getRewardActionForLibrarySave(category, identification),
            detail:
              identification.status === "suggested"
                ? `${item.commonName} saved as an AI-assisted suggestion.`
                : `${item.commonName} saved as a confirmed guide match.`,
          });

          const nextCollection = [
            makeCollectionItem({
              category,
              referenceId: item.id,
              title: item.commonName,
              subtitle: getCollectionSubtitle(identification),
              scientificName: item.scientificName,
              location,
              notes,
              userPhotoUri,
              pointsAwarded: reward.points,
              specimenEmoji: item.specimenEmoji,
              specimenImageSource: item.specimenImageSource,
              specimenImageUri: item.specimenImageUri,
              specimenImageSourceUrl: item.specimenImageSourceUrl,
              specimenImageCredit: item.specimenImageCredit,
              collectorRarity: item.collectorRarity,
              identification,
              cardPalette: item.cardPalette,
            }),
            ...state.collection,
          ];

          const nextTotal = state.points.total + reward.points;
          const activityState = getUpdatedActivityState(state.points, reward.createdAt);
          const nextTrashPieceCount = state.trashEntries.reduce(
            (total, entry) => total + entry.count,
            0,
          );

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
              trashPieceCount: nextTrashPieceCount,
            }),
            journalMeta: {
              ...state.journalMeta,
              lastSavedAt: reward.createdAt,
            },
            pendingNotice: createNotice(
              "Saved locally",
              identification.status === "suggested"
                ? `${item.commonName} joined your journal as a suggestion to review later.`
                : `${item.commonName} joined your journal as a confirmed guide match.`,
              "success",
            ),
          };
        }),
      saveUnknownFind: ({ category, location, notes, userPhotoUri }) =>
        set((state) => {
          const reward = createRewardTransaction({
            action: "save_unknown_find",
            detail:
              category === "shell"
                ? "An unknown shell was saved so you can revisit it later."
                : "An unknown shark tooth was saved so you can revisit it later.",
          });
          const title =
            category === "shell" ? "Unknown Shell" : "Unknown Shark Tooth";
          const nextCollection = [
            makeCollectionItem({
              category,
              title,
              subtitle: "Unknown for now",
              location,
              notes,
              userPhotoUri,
              pointsAwarded: reward.points,
              specimenEmoji: "❓",
              identification: {
                status: "unknown",
                source: "unknown-journal",
                label: "Unknown for now",
                note: "Saved without a confirmed identification so you can compare it later.",
              },
              cardPalette:
                category === "shell" ? ["#F3D8CD", "#FFF8F2"] : ["#D6E8F2", "#F4FBFF"],
            }),
            ...state.collection,
          ];
          const nextTotal = state.points.total + reward.points;
          const activityState = getUpdatedActivityState(state.points, reward.createdAt);
          const nextTrashPieceCount = state.trashEntries.reduce(
            (total, entry) => total + entry.count,
            0,
          );

          return {
            collection: nextCollection,
            findLogs: [
              {
                id: createId("log"),
                category,
                title,
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
              trashPieceCount: nextTrashPieceCount,
            }),
            journalMeta: {
              ...state.journalMeta,
              lastSavedAt: reward.createdAt,
            },
            pendingNotice: createNotice(
              "Saved locally",
              `${title} was tucked into your journal so you can identify it later.`,
            ),
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
              subtitle: "Logged sea glass memory",
              location,
              notes: note,
              userPhotoUri,
              pointsAwarded: reward.points,
              specimenEmoji: "💎",
              collectorRarity:
                rarity === "rare"
                  ? "dream"
                  : rarity === "uncommon"
                    ? "special"
                    : "everyday",
              identification: {
                status: "logged",
                source: "sea-glass-log",
                label: "Logged sea glass memory",
                note: `${surface} ${shape} sea glass saved to your journal.`,
              },
              cardPalette: [preset?.colorHex ?? "#BEE8DA", "#F3FFF9"],
            }),
            ...state.collection,
          ];

          const nextTotal = state.points.total + reward.points;
          const activityState = getUpdatedActivityState(state.points, reward.createdAt);
          const nextTrashPieceCount = state.trashEntries.reduce(
            (total, entry) => total + entry.count,
            0,
          );

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
              trashPieceCount: nextTrashPieceCount,
            }),
            journalMeta: {
              ...state.journalMeta,
              lastSavedAt: reward.createdAt,
            },
            pendingNotice: createNotice(
              "Saved locally",
              `${colorName} sea glass joined your journal.`,
            ),
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
              subtitle: "Logged cleanup moment",
              location,
              notes: note,
              userPhotoUri,
              pointsAwarded: reward.points,
              specimenEmoji: category?.icon ?? "🪣",
              identification: {
                status: "logged",
                source: "trash-log",
                label: "Logged cleanup moment",
                note: `${count} cleanup piece${count === 1 ? "" : "s"} saved to your journal.`,
              },
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
          celebration = getTrashMilestoneCelebration(
            previousTrashPieceCount,
            trashPieceCount,
          );
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
            journalMeta: {
              ...state.journalMeta,
              lastSavedAt: reward.createdAt,
            },
            pendingCelebration: celebration,
            pendingNotice: celebration
              ? null
              : createNotice(
                  "Saved locally",
                  `${count} cleanup item${count === 1 ? "" : "s"} added to your beach log.`,
                ),
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
          return {
            ok: false,
            message: "Keep exploring a little more before claiming this quest.",
          };
        }

        const reward = createRewardTransaction({
          action: "claim_quest",
          detail: `${questProgress.quest.title} completed.`,
          points: questProgress.quest.rewardPoints,
        });
        const celebration = createQuestCelebration({
          title: questProgress.quest.title,
          rewardPoints: questProgress.quest.rewardPoints,
          cadence: questProgress.quest.cadence,
          accent: questProgress.quest.accent,
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
            journalMeta: {
              ...current.journalMeta,
              lastSavedAt: reward.createdAt,
            },
            pendingCelebration: celebration,
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
          journalMeta: {
            ...state.journalMeta,
            lastSavedAt: new Date().toISOString(),
          },
        })),
      showNotice: (input) =>
        set({
          pendingNotice: createNotice(input.title, input.message, input.tone),
        }),
      dismissNotice: () => set({ pendingNotice: null }),
      dismissCelebration: () => set({ pendingCelebration: null }),
    }),
    {
      name: STORE_NAME,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasSeenWelcome: state.hasSeenWelcome,
        preferences: state.preferences,
        journalMeta: state.journalMeta,
        collection: state.collection,
        seaGlassEntries: state.seaGlassEntries,
        trashEntries: state.trashEntries,
        findLogs: state.findLogs,
        points: state.points,
        unlockedBadgeIds: state.unlockedBadgeIds,
        claimedQuestIds: state.claimedQuestIds,
        purchasedShopItemIds: state.purchasedShopItemIds,
        equippedThemeId: state.equippedThemeId,
      }),
      migrate: (persistedState) => migratePersistedState(persistedState),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
