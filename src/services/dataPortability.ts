import type { OceanStoreState, UserDataExport } from "../types/models";

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

export function parseUserDataExport(rawText: string) {
  try {
    const parsed = JSON.parse(rawText) as Partial<UserDataExport>;

    if (
      typeof parsed.version !== "number" ||
      typeof parsed.exportedAt !== "string" ||
      !Array.isArray(parsed.collection)
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
