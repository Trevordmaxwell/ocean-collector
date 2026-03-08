import { trashCategories } from "../data";
import type {
  CollectionCategory,
  RewardAction,
  RewardBadge,
  RewardTransaction,
  UserCollectionItem,
} from "../types/models";

const LEVEL_STEP = 90;

export const rewardBadges: RewardBadge[] = [
  {
    id: "first-find",
    title: "First Find",
    description: "Save your first beach treasure to begin your collection journal.",
    icon: "🌟",
    accent: ["#FFE7A8", "#FAD3C9"],
    ruleKind: "collection",
    threshold: 1,
  },
  {
    id: "shell-seeker",
    title: "Shell Seeker",
    description: "Collect three shell finds.",
    icon: "🐚",
    accent: ["#F7D6C7", "#FFF2E8"],
    ruleKind: "shell",
    threshold: 3,
  },
  {
    id: "tooth-tracker",
    title: "Tooth Tracker",
    description: "Collect three shark tooth finds.",
    icon: "🦈",
    accent: ["#CAE8F5", "#EFF9FD"],
    ruleKind: "sharkTooth",
    threshold: 3,
  },
  {
    id: "sea-glass-spotter",
    title: "Sea Glass Spotter",
    description: "Log two sea glass gems.",
    icon: "💎",
    accent: ["#CBEFDF", "#EDFFF8"],
    ruleKind: "seaGlass",
    threshold: 2,
  },
  {
    id: "beach-helper",
    title: "Beach Helper",
    description: "Pick up five pieces of trash.",
    icon: "🫶",
    accent: ["#FFE4B6", "#FFF6DD"],
    ruleKind: "trash",
    threshold: 5,
  },
  {
    id: "tide-pool-hero",
    title: "Tide Pool Hero",
    description: "Reach 120 points across your finds and cleanup wins.",
    icon: "🏅",
    accent: ["#FFE6A8", "#F8CED5"],
    ruleKind: "points",
    threshold: 120,
  },
  {
    id: "cleanup-captain",
    title: "Cleanup Captain",
    description: "Log ten pieces of beach trash.",
    icon: "🪣",
    accent: ["#FFDEB8", "#F5CDC1"],
    ruleKind: "trash",
    threshold: 10,
  },
  {
    id: "field-journalist",
    title: "Field Journalist",
    description: "Save ten finds into your collection journal.",
    icon: "📘",
    accent: ["#D5E8F8", "#FFF1D9"],
    ruleKind: "collection",
    threshold: 10,
  },
];

const baseRewardLabels: Record<
  RewardAction,
  { label: string; points: number; detail: string }
> = {
  identify_shell: {
    label: "Shell identified",
    points: 16,
    detail: "You matched a shell and tucked it into your journal.",
  },
  identify_shark_tooth: {
    label: "Shark tooth identified",
    points: 18,
    detail: "Sharp eye. You matched a shark tooth profile.",
  },
  log_sea_glass: {
    label: "Sea glass logged",
    points: 8,
    detail: "A glimmering extra for your beach collection.",
  },
  log_trash: {
    label: "Trash collected",
    points: 12,
    detail: "A beach stewardship win with instant impact.",
  },
  save_manual_guide: {
    label: "Guide save",
    points: 10,
    detail: "You compared an item manually and saved the best match.",
  },
};

export function createRewardTransaction(input: {
  action: RewardAction;
  detail?: string;
  points?: number;
}): RewardTransaction {
  const base = baseRewardLabels[input.action];

  return {
    id: createId("reward"),
    action: input.action,
    points: input.points ?? base.points,
    label: base.label,
    detail: input.detail ?? base.detail,
    createdAt: new Date().toISOString(),
  };
}

export function getPointsForTrash(trashCategoryId: string, count: number) {
  const category = trashCategories.find((item) => item.id === trashCategoryId);
  const basePoints = category?.basePoints ?? 12;
  return basePoints + Math.max(0, count - 1) * 3;
}

export function getPointsForSeaGlass(bonus: number) {
  return baseRewardLabels.log_sea_glass.points + bonus;
}

export function getLevelFromPoints(total: number) {
  return Math.max(1, Math.floor(total / LEVEL_STEP) + 1);
}

export function evaluateBadgeUnlocks(input: {
  totalPoints: number;
  collection: UserCollectionItem[];
  trashPieceCount: number;
}) {
  const shellCount = input.collection.filter((item) => item.category === "shell").length;
  const sharkCount = input.collection.filter(
    (item) => item.category === "sharkTooth",
  ).length;
  const seaGlassCount = input.collection.filter(
    (item) => item.category === "seaGlass",
  ).length;
  const collectionCount = input.collection.filter(
    (item) => item.category !== "trash",
  ).length;

  return rewardBadges
    .filter((badge) => {
      switch (badge.ruleKind) {
        case "points":
          return input.totalPoints >= badge.threshold;
        case "collection":
          return collectionCount >= badge.threshold;
        case "shell":
          return shellCount >= badge.threshold;
        case "sharkTooth":
          return sharkCount >= badge.threshold;
        case "seaGlass":
          return seaGlassCount >= badge.threshold;
        case "trash":
          return input.trashPieceCount >= badge.threshold;
        default:
          return false;
      }
    })
    .map((badge) => badge.id);
}

export function categoryLabel(category: CollectionCategory) {
  switch (category) {
    case "shell":
      return "Shell";
    case "sharkTooth":
      return "Shark Tooth";
    case "seaGlass":
      return "Sea Glass";
    case "trash":
      return "Cleanup";
  }
}

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
