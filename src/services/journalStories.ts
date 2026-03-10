import type { CollectionCategory, UserCollectionItem } from "../types/models";

export interface BeachTripSummary {
  id: string;
  location: string;
  foundDate: string;
  items: UserCollectionItem[];
  totalPoints: number;
  favoriteCount: number;
  categoryCounts: Record<CollectionCategory, number>;
  highlightTitles: string[];
}

function pad(value: number) {
  return `${value}`.padStart(2, "0");
}

function getDayKey(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function normalizeLocation(value: string) {
  return value.trim().toLowerCase();
}

export function getBeachTripSummaries(collection: UserCollectionItem[]) {
  const grouped = new Map<string, UserCollectionItem[]>();

  collection.forEach((item) => {
    const key = `${getDayKey(item.foundDate)}:${normalizeLocation(item.location)}`;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)!.push(item);
  });

  return Array.from(grouped.entries())
    .map(([id, items]): BeachTripSummary => {
      const sortedItems = [...items].sort((left, right) =>
        right.foundDate.localeCompare(left.foundDate),
      );
      const categoryCounts: Record<CollectionCategory, number> = {
        shell: 0,
        sharkTooth: 0,
        seaGlass: 0,
        trash: 0,
      };

      sortedItems.forEach((item) => {
        categoryCounts[item.category] += 1;
      });

      return {
        id,
        location: sortedItems[0]?.location || "Beach adventure",
        foundDate: sortedItems[0]?.foundDate || new Date().toISOString(),
        items: sortedItems,
        totalPoints: sortedItems.reduce((total, item) => total + item.pointsAwarded, 0),
        favoriteCount: sortedItems.filter((item) => item.favorite).length,
        categoryCounts,
        highlightTitles: sortedItems.slice(0, 3).map((item) => item.title),
      };
    })
    .sort((left, right) => right.foundDate.localeCompare(left.foundDate));
}

export function getSameTripItems(
  collection: UserCollectionItem[],
  currentItem: UserCollectionItem,
  limit = 3,
) {
  const currentTripId = `${getDayKey(currentItem.foundDate)}:${normalizeLocation(
    currentItem.location,
  )}`;

  return collection
    .filter((item) => {
      if (item.id === currentItem.id) {
        return false;
      }

      return (
        `${getDayKey(item.foundDate)}:${normalizeLocation(item.location)}` === currentTripId
      );
    })
    .slice(0, limit);
}
