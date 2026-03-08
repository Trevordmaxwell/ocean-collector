import { sharkSpecies, shellSpecies } from ".";
import type { LibraryCategory, SharkSpecies, ShellSpecies } from "../types/models";

export function getLibraryItems<T extends LibraryCategory>(
  category: T,
): T extends "shell" ? ShellSpecies[] : SharkSpecies[] {
  return (category === "shell" ? shellSpecies : sharkSpecies) as T extends "shell"
    ? ShellSpecies[]
    : SharkSpecies[];
}

export function getLibraryItem<T extends LibraryCategory>(
  category: T,
  id: string,
): (T extends "shell" ? ShellSpecies : SharkSpecies) | undefined {
  return getLibraryItems(category).find((item) => item.id === id) as
    | (T extends "shell" ? ShellSpecies : SharkSpecies)
    | undefined;
}
