import { getLibraryItem, getLibraryItems } from "../data/library";
import type { LibraryCategory } from "../types/models";

function matchesLookalike(
  currentLookalikes: string[],
  currentName: string,
  candidateName: string,
) {
  const candidate = candidateName.toLowerCase();
  const current = currentName.toLowerCase();

  return currentLookalikes.some((lookalike) => {
    const normalized = lookalike.toLowerCase();

    return (
      candidate.includes(normalized) ||
      normalized.includes(candidate) ||
      normalized.includes(current)
    );
  });
}

export function getComparableLibraryItems(
  category: LibraryCategory,
  itemId: string,
  limit = 3,
) {
  const item = getLibraryItem(category, itemId);

  if (!item) {
    return [];
  }

  return getLibraryItems(category)
    .filter((candidate) => {
      if (candidate.id === item.id) {
        return false;
      }

      const candidateName =
        "sharkName" in candidate ? candidate.sharkName : candidate.commonName;
      const sameFamily =
        "shellType" in item && "shellType" in candidate
          ? item.shellType === candidate.shellType
          : "toothProfile" in item && "toothProfile" in candidate
            ? item.toothProfile.serration === candidate.toothProfile.serration
            : false;

      return (
        matchesLookalike(item.lookalikes, item.commonName, candidate.commonName) ||
        matchesLookalike(candidate.lookalikes, candidate.commonName, item.commonName) ||
        matchesLookalike(item.lookalikes, item.commonName, candidateName) ||
        sameFamily
      );
    })
    .slice(0, limit);
}
