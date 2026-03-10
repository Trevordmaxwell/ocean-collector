import type {
  OceanStoreState,
  UserDataExport,
  UserDataExportSummary,
} from "../types/models";

const USER_DATA_EXPORT_VERSION = 1;
const APP_VERSION = "0.1.0";

export function buildUserDataExport(state: OceanStoreState): UserDataExport {
  return {
    version: USER_DATA_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    preferences: state.preferences,
    journalMeta: state.journalMeta,
    hasSeenWelcome: state.hasSeenWelcome,
    collection: state.collection,
    seaGlassEntries: state.seaGlassEntries,
    trashEntries: state.trashEntries,
    findLogs: state.findLogs,
    points: state.points,
    unlockedBadgeIds: state.unlockedBadgeIds,
    claimedQuestIds: state.claimedQuestIds,
    purchasedShopItemIds: state.purchasedShopItemIds,
    equippedThemeId: state.equippedThemeId,
  };
}

export function serializeUserDataExport(state: OceanStoreState) {
  return JSON.stringify(buildUserDataExport(state), null, 2);
}

function extractJsonBlock(rawText: string) {
  const fencedMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  return rawText.trim();
}

export function parseUserDataExport(rawText: string) {
  try {
    const parsed = JSON.parse(extractJsonBlock(rawText)) as Partial<UserDataExport>;

    if (
      typeof parsed.version !== "number" ||
      typeof parsed.exportedAt !== "string" ||
      !Array.isArray(parsed.collection) ||
      !parsed.preferences ||
      typeof parsed.points?.total !== "number"
    ) {
      return {
        ok: false as const,
        message: "That export does not look like an Ocean Collector journal snapshot.",
      };
    }

    return {
      ok: true as const,
      data: parsed as UserDataExport,
    };
  } catch {
    return {
      ok: false as const,
      message: "The export text could not be parsed as JSON.",
    };
  }
}

export function summarizeUserDataExport(data: UserDataExport): UserDataExportSummary {
  const normalizedTrips = new Set(
    data.collection.map((item) => {
      const date = new Date(item.foundDate);
      const dayKey = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;
      return `${dayKey}:${item.location.trim().toLowerCase()}`;
    }),
  );

  return {
    collectorName: data.preferences.collectorName || "tide explorer",
    exportedAt: data.exportedAt,
    collectionCount: data.collection.length,
    favoritesCount: data.collection.filter((item) => item.favorite).length,
    trashCount: data.trashEntries.length,
    seaGlassCount: data.seaGlassEntries.length,
    tripCount: normalizedTrips.size,
    totalPoints: data.points.total,
    badgeCount: data.unlockedBadgeIds.length,
  };
}
