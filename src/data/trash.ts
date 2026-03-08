import type { TrashCategory } from "../types/models";

export const trashCategories: TrashCategory[] = [
  {
    id: "plastic-fragment",
    label: "Plastic Fragment",
    icon: "🧴",
    basePoints: 12,
    encouragement: "Little pieces matter. Tiny cleanup wins keep the beach safer for wildlife.",
  },
  {
    id: "bottle-cap",
    label: "Bottle Cap",
    icon: "🥤",
    basePoints: 10,
    encouragement: "Bottle caps are easy to miss, so snagging one is a solid beach helper move.",
  },
  {
    id: "fishing-line",
    label: "Fishing Line",
    icon: "🎣",
    basePoints: 18,
    encouragement: "Removing tangled line is a big stewardship win for birds, turtles, and curious paws.",
  },
  {
    id: "aluminum-can",
    label: "Can",
    icon: "🥫",
    basePoints: 14,
    encouragement: "One bulky item gone means a cleaner shoreline right away.",
  },
  {
    id: "foam-piece",
    label: "Foam Piece",
    icon: "🫧",
    basePoints: 13,
    encouragement: "Foam breaks down into many bits, so every piece you remove helps.",
  },
  {
    id: "cigarette-butt",
    label: "Cigarette Butt",
    icon: "🚭",
    basePoints: 16,
    encouragement: "Not glamorous, but absolutely worth collecting. Beaches appreciate this one.",
  },
];
