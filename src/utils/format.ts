import type {
  CollectionIdentification,
  CollectorRarity,
} from "../types/models";

function toLocalDate(value: string) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatFriendlyDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatFriendlyTime(value?: string) {
  if (!value) {
    return "Not yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatJournalBucket(value: string) {
  const target = toLocalDate(value);
  const today = toLocalDate(new Date().toISOString());
  const diffDays = Math.round((today.getTime() - target.getTime()) / 86_400_000);

  if (diffDays === 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return "This week";
  }

  return "Earlier finds";
}

export function isToday(value: string) {
  return formatJournalBucket(value) === "Today";
}

export function formatRarityLabel(rarity?: CollectorRarity) {
  switch (rarity) {
    case "dream":
      return "Dream find";
    case "special":
      return "Special find";
    case "everyday":
      return "Everyday find";
    default:
      return undefined;
  }
}

export function formatIdentificationLabel(identification: CollectionIdentification) {
  switch (identification.status) {
    case "confirmed":
      return "Collector-confirmed";
    case "suggested":
      return "Suggested match";
    case "unknown":
      return "Unknown for now";
    case "logged":
      return identification.label;
  }
}

export function getScientificLine(
  showScientificNames: boolean,
  scientificName?: string,
) {
  return showScientificNames && scientificName ? scientificName : undefined;
}
