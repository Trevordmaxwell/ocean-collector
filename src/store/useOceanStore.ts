import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { seaGlassPresets, sharkSpecies, shellSpecies, trashCategories } from "../data";
import {
  createId,
  createRewardTransaction,
  evaluateBadgeUnlocks,
  getLevelFromPoints,
  getPointsForSeaGlass,
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
    cardPalette: input.cardPalette,
  };
}

export const useOceanStore = create<OceanStoreState>()(
  persist(
    (set) => ({
      hasSeenWelcome: false,
      collection: [],
      seaGlassEntries: [],
      trashEntries: [],
      findLogs: [],
      unlockedBadgeIds: [],
      points: {
        total: 0,
        level: 1,
        streakDays: 1,
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
              cardPalette: item.cardPalette,
            }),
            ...state.collection,
          ];

          const nextTotal = state.points.total + reward.points;

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
              level: getLevelFromPoints(nextTotal),
              streakDays: state.points.streakDays,
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
      addSeaGlassFind: ({ presetId, colorName, size, shape, rarity, location, note, userPhotoUri }) =>
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
              subtitle: `${rarity} rarity`,
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
              level: getLevelFromPoints(nextTotal),
              streakDays: state.points.streakDays,
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
      addTrashPickup: ({ trashCategoryId, count, location, note, userPhotoUri }) =>
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
          const trashPieceCount = nextTrashEntries.reduce(
            (total, entry) => total + entry.count,
            0,
          );

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
              level: getLevelFromPoints(nextTotal),
              streakDays: state.points.streakDays,
              transactions: [reward, ...state.points.transactions].slice(0, 20),
            },
            unlockedBadgeIds: evaluateBadgeUnlocks({
              totalPoints: nextTotal,
              collection: nextCollection,
              trashPieceCount,
            }),
          };
        }),
      toggleFavorite: (itemId) =>
        set((state) => ({
          collection: state.collection.map((item) =>
            item.id === itemId ? { ...item, favorite: !item.favorite } : item,
          ),
        })),
    }),
    {
      name: "ocean-collector-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasSeenWelcome: state.hasSeenWelcome,
        collection: state.collection,
        seaGlassEntries: state.seaGlassEntries,
        trashEntries: state.trashEntries,
        findLogs: state.findLogs,
        points: state.points,
        unlockedBadgeIds: state.unlockedBadgeIds,
      }),
    },
  ),
);
