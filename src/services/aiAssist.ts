import { getLibraryItems } from "../data/library";
import type {
  AIAssistCatalogEntry,
  AIAssistExportPayload,
  IdentificationMatch,
  IdentificationSession,
  LibraryCategory,
  SuggestionConfidenceBand,
} from "../types/models";

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function normalizeConfidenceBand(value: string): SuggestionConfidenceBand {
  switch (normalize(value)) {
    case "promising":
    case "strong":
    case "high":
      return "promising";
    case "stretch":
    case "low":
      return "stretch";
    case "possible":
    case "medium":
    default:
      return "possible";
  }
}

function buildCatalog(category: LibraryCategory): AIAssistCatalogEntry[] {
  return getLibraryItems(category).map((item) => ({
    id: item.id,
    commonName: item.commonName,
    scientificName: item.scientificName,
    summary: item.summary,
    identifyingFeatures: item.identifyingFeatures.slice(0, 3),
    lookalikes: item.lookalikes.slice(0, 3),
  }));
}

export function buildAIAssistPayload(input: {
  category: LibraryCategory;
  location: string;
  notes: string;
  hasPhoto: boolean;
}): AIAssistExportPayload {
  const categoryLabel = input.category === "shell" ? "shell" : "shark tooth";
  const catalog = buildCatalog(input.category);
  const responseTemplate = JSON.stringify(
    {
      status: "matches",
      summary: "Short gentle summary of what seems most likely.",
      observedTraits: ["trait one", "trait two"],
      possibleMatches: [
        {
          id: catalog[0]?.id ?? "shell-id",
          confidenceBand: "promising",
          reason: "Why it resembles this catalog entry.",
          traitsNoticed: ["rounded ribs", "peach patches"],
        },
      ],
      noteToUser:
        "State clearly if this is only a suggestion and when the result should stay unknown.",
    },
    null,
    2,
  );

  const prompt = [
    "You are helping Ocean Collector, a cozy beach journal app.",
    `The user wants an AI-assisted suggestion for a ${categoryLabel}, not an authoritative identification.`,
    input.hasPhoto
      ? "Assume the user is attaching a photo alongside this prompt."
      : "No photo is attached, so rely only on the notes and remain cautious.",
    `Beach context: ${input.location || "Location not provided."}`,
    `User notes: ${input.notes || "No extra notes were provided."}`,
    "Choose only from the catalog IDs below.",
    "If you are not reasonably confident, return status \"inconclusive\" with an empty possibleMatches array.",
    "Respond with JSON only, using this exact shape:",
    responseTemplate,
    "Catalog:",
    JSON.stringify(catalog, null, 2),
  ].join("\n\n");

  return {
    category: input.category,
    location: input.location,
    notes: input.notes,
    hasPhoto: input.hasPhoto,
    prompt,
    responseTemplate,
    catalog,
  };
}

function extractJsonBlock(rawText: string) {
  const fencedMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  return rawText.trim();
}

function resolveLibraryId(category: LibraryCategory, candidate: {
  id?: string;
  commonName?: string;
  scientificName?: string;
}) {
  const items = getLibraryItems(category);
  const byId = candidate.id
    ? items.find((item) => normalize(item.id) === normalize(candidate.id!))
    : undefined;

  if (byId) {
    return byId.id;
  }

  const byName = candidate.commonName
    ? items.find((item) => normalize(item.commonName) === normalize(candidate.commonName!))
    : undefined;

  if (byName) {
    return byName.id;
  }

  const byScientific = candidate.scientificName
    ? items.find(
        (item) =>
          item.scientificName &&
          normalize(item.scientificName) === normalize(candidate.scientificName!),
      )
    : undefined;

  return byScientific?.id;
}

function normalizeMatches(
  category: LibraryCategory,
  rawMatches: unknown,
): IdentificationMatch[] {
  if (!Array.isArray(rawMatches)) {
    return [];
  }

  return rawMatches
    .map((match) => {
      const candidate = match as {
        id?: string;
        commonName?: string;
        scientificName?: string;
        confidenceBand?: string;
        reason?: string;
        traitsNoticed?: string[];
      };
      const id = resolveLibraryId(category, candidate);

      if (!id || typeof candidate.reason !== "string") {
        return null;
      }

      return {
        id,
        category,
        confidenceBand: normalizeConfidenceBand(candidate.confidenceBand ?? "possible"),
        reason: candidate.reason,
        traitsNoticed: Array.isArray(candidate.traitsNoticed)
          ? candidate.traitsNoticed.filter(
              (trait): trait is string => typeof trait === "string" && trait.length > 0,
            )
          : [],
      };
    })
    .filter((match): match is IdentificationMatch => Boolean(match));
}

export function parseAIAssistResponse(input: {
  category: LibraryCategory;
  imageUri?: string;
  rawText: string;
}) {
  try {
    const jsonText = extractJsonBlock(input.rawText);
    const parsed = JSON.parse(jsonText) as {
      status?: string;
      summary?: string;
      observedTraits?: string[];
      possibleMatches?: unknown;
    };
    const matches = normalizeMatches(input.category, parsed.possibleMatches);
    const status =
      normalize(parsed.status ?? "") === "inconclusive" || matches.length === 0
        ? "inconclusive"
        : "matches";

    const session: IdentificationSession = {
      category: input.category,
      imageUri: input.imageUri ?? "",
      provider: "experimental-ai-export",
      status,
      summary:
        typeof parsed.summary === "string" && parsed.summary.trim().length > 0
          ? parsed.summary.trim()
          : status === "matches"
            ? "Here are the closest AI-assisted suggestions to review."
            : "The reply stayed cautious, so this find should remain unknown for now.",
      disclaimer:
        "AI-assisted only. Treat this as a suggestion to review against the guide cards, not a final identification.",
      observedTraits: Array.isArray(parsed.observedTraits)
        ? parsed.observedTraits.filter(
            (trait): trait is string => typeof trait === "string" && trait.length > 0,
          )
        : [],
      matches,
      rawResponse: jsonText,
    };

    return { ok: true as const, session };
  } catch {
    return {
      ok: false as const,
      message:
        "That AI reply could not be parsed. Ask your AI to return JSON only, then paste the reply again.",
    };
  }
}
