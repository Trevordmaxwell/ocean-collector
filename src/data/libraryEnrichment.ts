import type { SharkSpecies, ShellSpecies } from "../types/models";

type EntryStoryFields = Pick<
  ShellSpecies,
  "collectorRarity" | "collectorNote" | "confusionNote" | "stewardshipTip"
>;
type SharkStoryFields = Pick<
  SharkSpecies,
  "collectorRarity" | "collectorNote" | "confusionNote" | "stewardshipTip"
>;

const shellOverrides: Record<string, Partial<EntryStoryFields>> = {
  "lettered-olive": {
    collectorRarity: "special",
    collectorNote:
      "A glossy whole olive always feels polished and display-ready, even before you clean off the sand.",
    confusionNote:
      "Lettered olives stay smoother and shinier than augers or other long spiral shells, so trust the overall silky shape first.",
  },
  junonia: {
    collectorRarity: "dream",
    collectorNote:
      "A whole junonia is the kind of beach-walk find people talk about all week.",
    confusionNote:
      "Compare the tidy square-ish spots against banded tulips or spotted olives before calling it a junonia.",
  },
  "horse-conch": {
    collectorRarity: "dream",
    collectorNote:
      "Even a fragment can feel thrilling because horse conchs get so dramatically large.",
  },
  "calico-scallop": {
    collectorRarity: "special",
    collectorNote:
      "Calico scallops make great scrapbook stars because the color patches feel painterly even when the shell is worn.",
    stewardshipTip:
      "Fresh paired scallops can still be living bivalves, so favor empty beach shells and skip collecting anything clearly occupied.",
  },
  "lightning-whelk": {
    collectorRarity: "special",
    confusionNote:
      "Check the opening direction first. Lightning whelks are the famous left-hand spirals, unlike knobbed whelks.",
  },
  "moon-snail": {
    collectorRarity: "special",
    confusionNote:
      "Moon snails and shark eyes can feel very close, so compare the roundness and opening details before you label it too quickly.",
  },
  "coquina-clam": {
    collectorRarity: "special",
    collectorNote:
      "A handful of colorful coquinas can feel like collecting tiny pastel confetti from the surf line.",
    stewardshipTip:
      "Live coquinas are usually right in the active wash, so leave the busy little burrowers alone and collect only empty shells.",
  },
  "scotch-bonnet": {
    collectorRarity: "dream",
    collectorNote:
      "A pretty, patterned scotch bonnet can feel like a true shell-table showpiece.",
  },
  "florida-fighting-conch": {
    collectorRarity: "special",
    confusionNote:
      "Check the flared opening and overall heft before mixing it up with tulips or other warm-toned spiral shells.",
  },
  "kittens-paw": {
    collectorRarity: "special",
  },
  "jingle-shell": {
    collectorRarity: "special",
    collectorNote:
      "Jingle shells feel magical because they are so thin and glowing compared with sturdier beach shells.",
  },
};

const sharkOverrides: Record<string, Partial<SharkStoryFields>> = {
  megalodon: {
    collectorRarity: "dream",
    collectorNote:
      "Megalodon teeth are instant centerpiece finds, even when they are worn or chipped.",
  },
  "great-white": {
    collectorRarity: "dream",
    collectorNote:
      "Even smaller great white teeth feel dramatic because the broad triangle is so instantly recognizable in a tray.",
    confusionNote:
      "Bull, tiger, and great white teeth can all feel bold, so compare notch shape, width, and how even the serrations look.",
  },
  "sand-tiger": {
    collectorRarity: "special",
    collectorNote:
      "Sand tiger teeth are collector favorites because the side cusplets give them that classic fossil-tooth silhouette.",
  },
  "tiger-shark": {
    collectorRarity: "dream",
    confusionNote:
      "Tiger teeth usually look more notched and dramatic than bull or lemon shark teeth, so let that deep hooked feel guide you.",
  },
  "snaggletooth-shark": {
    collectorRarity: "dream",
    confusionNote:
      "Look for uneven drama and that slashing silhouette. It should feel stranger than a tidy tiger or bull shark tooth.",
  },
  bonnethead: {
    collectorRarity: "special",
  },
  "great-hammerhead": {
    collectorRarity: "special",
    collectorNote:
      "Hammerhead teeth feel fun to compare because they often look broad and tidy without the deep theatrical notch of a tiger tooth.",
  },
};

function defaultShellFields(entry: ShellSpecies): EntryStoryFields {
  const typeCollectorNotes: Record<ShellSpecies["shellType"], string> = {
    spiral:
      "Collectors usually notice the silhouette first, then double-check the pattern and opening shape.",
    scallop:
      "Fan shells are fun to browse side by side because rib count and color patches change the whole vibe.",
    clam:
      "With clams, hinge shape and overall outline matter more than tiny decorative details.",
    whelk:
      "Whelks feel most satisfying when you compare heft, knobs, canal length, and opening direction together.",
    olive:
      "Glossy olives reward a slow look at pattern, polish, and how the long opening sits on the shell.",
    conch:
      "Conchs often feel dramatic in-hand, so size and the color inside the opening are huge clues.",
    bonnet:
      "Bonnets are the kind of shell that look delicate from afar but reveal lots of structure up close.",
    ark:
      "Ark shells can look plain at first, but hinge shape and ribs quickly separate them from smoother clams.",
  };

  return {
    collectorRarity: "everyday",
    collectorNote: typeCollectorNotes[entry.shellType],
    confusionNote: `Start by comparing it with ${entry.lookalikes
      .slice(0, 2)
      .join(" and ")} before you settle on a name.`,
    stewardshipTip:
      "If the shell is still occupied or freshly alive, admire it, take a photo, and leave it as part of the beach ecosystem.",
  };
}

function defaultSharkFields(entry: SharkSpecies): SharkStoryFields {
  const serrationNote: Record<SharkSpecies["toothProfile"]["serration"], string> = {
    smooth:
      "Smooth-edged teeth are easier to overcall, so compare side cusps, lean, and thickness before deciding.",
    fine:
      "Fine-serrated teeth live in the tricky middle ground, which is why compare-mode detective work matters.",
    strong:
      "Big serrations are exciting, but crown width and notches still matter before you claim a dramatic species.",
  };

  return {
    collectorRarity: "everyday",
    collectorNote:
      "Tooth collecting gets easier when you compare the crown, root, and lean together instead of chasing one clue.",
    confusionNote: serrationNote[entry.toothProfile.serration],
    stewardshipTip:
      "Respect local collecting rules, leave anything modern or freshly biological alone when in doubt, and favor already weathered fossil finds.",
  };
}

export function enrichShellSpecies(items: ShellSpecies[]): ShellSpecies[] {
  return items.map((entry) => ({
    ...entry,
    ...defaultShellFields(entry),
    ...(shellOverrides[entry.id] ?? {}),
  }));
}

export function enrichSharkSpecies(items: SharkSpecies[]): SharkSpecies[] {
  return items.map((entry) => ({
    ...entry,
    ...defaultSharkFields(entry),
    ...(sharkOverrides[entry.id] ?? {}),
  }));
}
