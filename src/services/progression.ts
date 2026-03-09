import { rewardQuests, treasureShopItems } from "../data";
import type {
  CollectionCategory,
  QuestCadence,
  QuestProgress,
  ShopItem,
  UserCollectionItem,
  UserPoints,
} from "../types/models";

function pad(value: number) {
  return `${value}`.padStart(2, "0");
}

function toLocalDate(value: string | Date) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDayKey(value: string | Date) {
  const date = toLocalDate(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toWeekKey(value: string | Date) {
  const date = toLocalDate(value);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diffToMonday);
  return toDayKey(date);
}

function isInCadence(value: string, cadence: QuestCadence, now = new Date()) {
  return cadence === "daily"
    ? toDayKey(value) === toDayKey(now)
    : toWeekKey(value) === toWeekKey(now);
}

function countCollectionByCadence(
  collection: UserCollectionItem[],
  cadence: QuestCadence,
  category?: CollectionCategory,
) {
  return collection.filter((item) => {
    const matchesCategory = category ? item.category === category : item.category !== "trash";
    return matchesCategory && isInCadence(item.foundDate, cadence);
  }).length;
}

function countTrashPiecesByCadence(
  entries: Array<{ foundDate: string; count: number }>,
  cadence: QuestCadence,
) {
  return entries.reduce((total, entry) => {
    if (!isInCadence(entry.foundDate, cadence)) {
      return total;
    }

    return total + entry.count;
  }, 0);
}

export function getAvailablePoints(points: UserPoints) {
  return Math.max(0, points.total - points.spent);
}

export function getUpdatedActivityState(points: UserPoints, occurredAt: string) {
  const activityKey = toDayKey(occurredAt);

  if (!points.lastActivityDate) {
    return {
      streakDays: 1,
      lastActivityDate: activityKey,
    };
  }

  if (points.lastActivityDate === activityKey) {
    return {
      streakDays: points.streakDays,
      lastActivityDate: activityKey,
    };
  }

  const previous = toLocalDate(points.lastActivityDate);
  const current = toLocalDate(activityKey);
  const difference = Math.round((current.getTime() - previous.getTime()) / 86_400_000);

  return {
    streakDays: difference === 1 ? points.streakDays + 1 : 1,
    lastActivityDate: activityKey,
  };
}

export function getQuestProgresses(input: {
  collection: UserCollectionItem[];
  trashEntries: Array<{ foundDate: string; count: number }>;
  claimedQuestIds: string[];
}) {
  const now = new Date();

  return rewardQuests.map((quest): QuestProgress => {
    const cycleKey = quest.cadence === "daily" ? toDayKey(now) : toWeekKey(now);
    let progress = 0;

    switch (quest.ruleKind) {
      case "finds":
        progress = countCollectionByCadence(input.collection, quest.cadence);
        break;
      case "shell":
        progress = countCollectionByCadence(input.collection, quest.cadence, "shell");
        break;
      case "sharkTooth":
        progress = countCollectionByCadence(input.collection, quest.cadence, "sharkTooth");
        break;
      case "seaGlass":
        progress = countCollectionByCadence(input.collection, quest.cadence, "seaGlass");
        break;
      case "trash":
        progress = countTrashPiecesByCadence(input.trashEntries, quest.cadence);
        break;
      case "favorites":
        progress = input.collection.filter((item) => item.favorite).length;
        break;
    }

    return {
      quest,
      progress: Math.min(progress, quest.target),
      target: quest.target,
      cycleKey,
      claimed: input.claimedQuestIds.includes(`${quest.id}:${cycleKey}`),
    };
  });
}

export function getOwnedThemeItems(
  purchasedShopItemIds: string[],
  equippedThemeId?: string,
) {
  return treasureShopItems.filter(
    (item) => item.category === "journalTheme" && purchasedShopItemIds.includes(item.id),
  ).map((item) => ({
    ...item,
    equipped: item.id === equippedThemeId,
  }));
}

export function getEquippedTheme(
  purchasedShopItemIds: string[],
  equippedThemeId?: string,
): ShopItem | undefined {
  return getOwnedThemeItems(purchasedShopItemIds, equippedThemeId).find((item) => item.equipped);
}
