import type { ImageSourcePropType } from "react-native";

export type LibraryCategory = "shell" | "sharkTooth";
export type CollectionCategory = LibraryCategory | "seaGlass" | "trash";
export type BadgeRuleKind =
  | "points"
  | "collection"
  | "shell"
  | "sharkTooth"
  | "seaGlass"
  | "trash";
export type RewardAction =
  | "identify_shell"
  | "identify_shark_tooth"
  | "log_sea_glass"
  | "log_trash"
  | "save_manual_guide";

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
  level: number;
  streakDays: number;
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

export interface MilestoneCelebration {
  id: string;
  kind: "trash";
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
  cardPalette: [string, string];
}

export interface IdentificationMatch {
  id: string;
  confidence: number;
  reason: string;
  category: LibraryCategory;
}

export interface IdentificationSession {
  category: LibraryCategory;
  imageUri: string;
  provider: "placeholder-ai";
  matches: IdentificationMatch[];
}

export interface OceanStoreState {
  hasSeenWelcome: boolean;
  collection: UserCollectionItem[];
  seaGlassEntries: SeaGlassEntry[];
  trashEntries: TrashEntry[];
  findLogs: FindLog[];
  points: UserPoints;
  unlockedBadgeIds: string[];
  pendingCelebration: MilestoneCelebration | null;
  markWelcomeSeen: () => void;
  saveIdentifiedFind: (input: {
    category: LibraryCategory;
    referenceId: string;
    location: string;
    notes: string;
    userPhotoUri?: string;
    source: "ai" | "manual";
  }) => void;
  addSeaGlassFind: (input: Omit<SeaGlassEntry, "id" | "foundDate">) => void;
  addTrashPickup: (
    input: Omit<TrashEntry, "id" | "foundDate" | "label">,
  ) => MilestoneCelebration | null;
  toggleFavorite: (itemId: string) => void;
  dismissCelebration: () => void;
}
