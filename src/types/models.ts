import type { ImageSourcePropType } from "react-native";

export type LibraryCategory = "shell" | "sharkTooth";
export type CollectionCategory = LibraryCategory | "seaGlass" | "trash";
export type CollectorRarity = "everyday" | "special" | "dream";
export type BadgeRuleKind =
  | "points"
  | "collection"
  | "shell"
  | "sharkTooth"
  | "seaGlass"
  | "trash";
export type QuestCadence = "daily" | "weekly";
export type QuestRuleKind =
  | "finds"
  | "shell"
  | "sharkTooth"
  | "seaGlass"
  | "trash"
  | "favorites";
export type ShopCategory = "journalTheme" | "stickerPack" | "frame" | "wallpaper";
export type RewardAction =
  | "identify_shell"
  | "identify_shark_tooth"
  | "save_suggested_shell"
  | "save_suggested_shark_tooth"
  | "log_sea_glass"
  | "log_trash"
  | "save_manual_guide"
  | "save_unknown_find"
  | "claim_quest"
  | "redeem_shop_item";
export type IdentificationStatus = "confirmed" | "suggested" | "unknown" | "logged";
export type IdentificationSource =
  | "manual-guide"
  | "manual-library"
  | "experimental-ai"
  | "unknown-journal"
  | "sea-glass-log"
  | "trash-log"
  | "legacy-migration";
export type SuggestionConfidenceBand = "promising" | "possible" | "stretch";

export interface CollectorPreferences {
  collectorName: string;
  favoriteBeach: string;
  showScientificNames: boolean;
}

export interface JournalMeta {
  lastSavedAt?: string;
  lastExportedAt?: string;
  storageVersion: number;
}

export interface AppNotice {
  id: string;
  title: string;
  message: string;
  tone: "success" | "info" | "error";
}

export interface CollectionIdentification {
  status: IdentificationStatus;
  source: IdentificationSource;
  label: string;
  note: string;
}

export interface FactCard {
  id: string;
  title: string;
  body: string;
  icon: string;
  mood: "curiosity" | "stewardship" | "wow";
}

export interface BaseLibraryItem {
  id: string;
  commonName: string;
  scientificName?: string;
  summary: string;
  identifyingFeatures: string[];
  colors: string[];
  shapeNotes: string[];
  sizeRange: string;
  regions: string[];
  habitat: string;
  funFacts: string[];
  lookalikes: string[];
  specimenEmoji: string;
  specimenImageSource?: ImageSourcePropType;
  specimenImageUri?: string;
  specimenImageSourceUrl?: string;
  specimenImageCredit?: string;
  collectorRarity?: CollectorRarity;
  collectorNote?: string;
  confusionNote?: string;
  stewardshipTip?: string;
  cardPalette: [string, string];
  factCards: FactCard[];
}

export interface ShellSpecies extends BaseLibraryItem {
  category: "shell";
  shellType:
    | "spiral"
    | "scallop"
    | "clam"
    | "whelk"
    | "olive"
    | "conch"
    | "bonnet"
    | "ark";
  inhabitantInfo: string;
}

export interface ToothProfile {
  serration: "smooth" | "fine" | "strong";
  width: "narrow" | "balanced" | "broad";
  curvature: "straight" | "slight" | "curved";
  mouthRegion: string;
  toothUse: string;
  comparisonTips: string[];
}

export interface SharkSpecies extends BaseLibraryItem {
  category: "sharkTooth";
  sharkName: string;
  era: string;
  toothProfile: ToothProfile;
}

export interface SeaGlassPreset {
  id: string;
  colorName: string;
  colorHex: string;
  rarity: "common" | "uncommon" | "rare";
  funFact: string;
  pointsBonus: number;
}

export interface TrashCategory {
  id: string;
  label: string;
  icon: string;
  basePoints: number;
  encouragement: string;
}

export interface SeaGlassEntry {
  id: string;
  presetId: string;
  colorName: string;
  size: "tiny" | "small" | "medium" | "large";
  shape: "rounded" | "jagged" | "gem" | "chunky";
  surface: "flat" | "curved";
  rarity: SeaGlassPreset["rarity"];
  foundDate: string;
  location: string;
  note: string;
  userPhotoUri?: string;
}

export interface TrashEntry {
  id: string;
  trashCategoryId: string;
  label: string;
  count: number;
  foundDate: string;
  location: string;
  note: string;
  userPhotoUri?: string;
}

export interface RewardTransaction {
  id: string;
  action: RewardAction;
  points: number;
  label: string;
  detail: string;
  createdAt: string;
}

export interface UserPoints {
  total: number;
  spent: number;
  level: number;
  streakDays: number;
  lastActivityDate?: string;
  transactions: RewardTransaction[];
}

export interface RewardBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: [string, string];
  ruleKind: BadgeRuleKind;
  threshold: number;
}

export interface RewardQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: [string, string];
  cadence: QuestCadence;
  rewardPoints: number;
  ruleKind: QuestRuleKind;
  target: number;
}

export interface QuestProgress {
  quest: RewardQuest;
  progress: number;
  target: number;
  cycleKey: string;
  claimed: boolean;
}

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: [string, string];
  cost: number;
  category: ShopCategory;
  perk: string;
  previewGradient?: [string, string, string];
}

export interface MilestoneCelebration {
  id: string;
  kind: "trash" | "quest";
  title: string;
  description: string;
  threshold: number;
  rewardLabel: string;
  accent: [string, string];
}

export interface FindLog {
  id: string;
  category: CollectionCategory;
  title: string;
  points: number;
  occurredAt: string;
  note?: string;
}

export interface UserCollectionItem {
  id: string;
  category: CollectionCategory;
  referenceId?: string;
  title: string;
  subtitle: string;
  scientificName?: string;
  foundDate: string;
  location: string;
  notes: string;
  favorite: boolean;
  pointsAwarded: number;
  userPhotoUri?: string;
  specimenEmoji: string;
  specimenImageSource?: ImageSourcePropType;
  specimenImageUri?: string;
  specimenImageSourceUrl?: string;
  specimenImageCredit?: string;
  collectorRarity?: CollectorRarity;
  identification: CollectionIdentification;
  cardPalette: [string, string];
}

export interface IdentificationMatch {
  id: string;
  confidenceBand: SuggestionConfidenceBand;
  reason: string;
  category: LibraryCategory;
  traitsNoticed: string[];
}

export interface IdentificationSession {
  category: LibraryCategory;
  imageUri: string;
  provider: "experimental-ai-export";
  status: "matches" | "inconclusive";
  summary: string;
  disclaimer: string;
  observedTraits: string[];
  matches: IdentificationMatch[];
  rawResponse: string;
}

export interface AIAssistCatalogEntry {
  id: string;
  commonName: string;
  scientificName?: string;
  summary: string;
  identifyingFeatures: string[];
  lookalikes: string[];
}

export interface AIAssistExportPayload {
  category: LibraryCategory;
  location: string;
  notes: string;
  hasPhoto: boolean;
  prompt: string;
  responseTemplate: string;
  catalog: AIAssistCatalogEntry[];
}

export interface UserDataExport {
  version: number;
  exportedAt: string;
  appVersion: string;
  preferences: CollectorPreferences;
  journalMeta: JournalMeta;
  hasSeenWelcome: boolean;
  collection: UserCollectionItem[];
  seaGlassEntries: SeaGlassEntry[];
  trashEntries: TrashEntry[];
  findLogs: FindLog[];
  points: UserPoints;
  unlockedBadgeIds: string[];
  claimedQuestIds: string[];
  purchasedShopItemIds: string[];
  equippedThemeId?: string;
}

export interface OceanStoreState {
  hasSeenWelcome: boolean;
  hasHydrated: boolean;
  preferences: CollectorPreferences;
  journalMeta: JournalMeta;
  collection: UserCollectionItem[];
  seaGlassEntries: SeaGlassEntry[];
  trashEntries: TrashEntry[];
  findLogs: FindLog[];
  points: UserPoints;
  unlockedBadgeIds: string[];
  claimedQuestIds: string[];
  purchasedShopItemIds: string[];
  equippedThemeId?: string;
  pendingCelebration: MilestoneCelebration | null;
  pendingNotice: AppNotice | null;
  setHasHydrated: (value: boolean) => void;
  markWelcomeSeen: () => void;
  updatePreferences: (input: Partial<CollectorPreferences>) => void;
  markDataExported: (exportedAt?: string) => void;
  saveLibraryMatch: (input: {
    category: LibraryCategory;
    referenceId: string;
    location: string;
    notes: string;
    userPhotoUri?: string;
    identification: CollectionIdentification;
  }) => void;
  saveUnknownFind: (input: {
    category: LibraryCategory;
    location: string;
    notes: string;
    userPhotoUri?: string;
  }) => void;
  addSeaGlassFind: (input: Omit<SeaGlassEntry, "id" | "foundDate">) => void;
  addTrashPickup: (
    input: Omit<TrashEntry, "id" | "foundDate" | "label">,
  ) => MilestoneCelebration | null;
  claimQuest: (questId: string) => { ok: boolean; message: string };
  purchaseShopItem: (itemId: string) => { ok: boolean; message: string };
  equipTheme: (itemId: string) => void;
  toggleFavorite: (itemId: string) => void;
  showNotice: (input: Omit<AppNotice, "id">) => void;
  dismissNotice: () => void;
  dismissCelebration: () => void;
}
