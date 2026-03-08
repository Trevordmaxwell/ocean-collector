import { sharkSpecies, shellSpecies } from "../data";
import type {
  IdentificationMatch,
  IdentificationSession,
  LibraryCategory,
} from "../types/models";

function hashValue(value: string) {
  return [...value].reduce((total, char, index) => {
    return total + char.charCodeAt(0) * (index + 17);
  }, 0);
}

function getReason(category: LibraryCategory, index: number) {
  const shellReasons = [
    "The silhouette and surface feel closest to this shell's shape notes.",
    "Your photo seems to line up with this shell's color palette and opening shape.",
    "The overall profile looks similar to the guide card proportions.",
  ];
  const sharkReasons = [
    "The tooth outline and edge style look closest to this profile.",
    "The width and curvature feel most similar to this shark tooth example.",
    "This match lines up with the visible crown shape and root balance.",
  ];

  return (category === "shell" ? shellReasons : sharkReasons)[index]!;
}

export async function identifyBeachFind(
  category: LibraryCategory,
  imageUri: string,
): Promise<IdentificationSession> {
  const library = category === "shell" ? shellSpecies : sharkSpecies;
  const offset = hashValue(`${category}:${imageUri}`);

  const matches = library
    .map<IdentificationMatch>((item, index) => {
      const wobble = (offset + index * 37) % 21;
      const confidence = Math.max(57, 91 - wobble - index * 6);

      return {
        id: item.id,
        category,
        confidence,
        reason: getReason(category, Math.min(index, 2)),
      };
    })
    .sort((left, right) => right.confidence - left.confidence)
    .slice(0, 3);

  await new Promise((resolve) => setTimeout(resolve, 850));

  return {
    category,
    imageUri,
    provider: "placeholder-ai",
    matches,
  };
}
