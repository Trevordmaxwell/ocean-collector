# Ocean Collector

Ocean Collector is a cozy ocean treasure journal for people who collect things at
the beach. It helps users compare shells and shark teeth honestly, save finds
into a personal scrapbook-like collection, log sea glass and cleanup moments,
and learn a little while they explore.

The current direction is trust-first and local-first:

- journal data persists on-device
- saved finds are clearly separated from suggestions
- AI is framed as optional outside help, not fake certainty
- the UI aims for warm, collectible, beach-walk energy instead of a dry field guide

## Chosen Stack

- Expo + React Native + TypeScript
- React Navigation for scalable screen flow
- Zustand + AsyncStorage for local-first persistent state
- Expo Image Picker for photo selection
- Local seed data with enrichment layers for richer detail cards
- AI-assist export/import scaffolding for honest external-model workflows

Why this stack:

- Fastest path to a polished iOS-friendly prototype
- Clean upgrade path to real AI APIs, cloud sync, accounts, and monetization
- Reusable component architecture without locking the MVP into native-only complexity

## MVP Included

- Splash / welcome experience
- Journal-style home screen
- Shell identification flow with honest AI-assist export
- Shark tooth identification flow with honest AI-assist export
- Manual shell and shark tooth libraries
- Item detail / fact screens with richer collector notes and stewardship tips
- Sea glass logging
- Trash cleanup logging with stewardship rewards
- Persisted collection journal and scrapbook-style collection browsing
- Points and badge framework
- Local sample data for shells, shark teeth, sea glass, and trash categories
- Manual export backup foundation

## Folder Structure

```text
ocean-collector/
├── App.tsx
├── app.json
├── assets/
├── src/
│   ├── components/
│   ├── data/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   ├── store/
│   ├── theme/
│   ├── types/
│   └── utils/
├── package.json
└── tsconfig.json
```

## Key Architecture Notes

### `src/screens`

Feature-first screen layer for:

- `WelcomeScreen`
- `HomeScreen`
- `IdentifyScreen`
- `LibraryScreen`
- `ItemDetailScreen`
- `AddSeaGlassScreen`
- `AddTrashScreen`
- `CollectionScreen`
- `CollectionItemScreen`
- `RewardsScreen`
- `FactsScreen`
- `SettingsScreen`

### `src/data`

Local seed content for:

- shell species
- shark tooth species / tooth profiles
- sea glass presets
- trash categories
- fun fact cards

### `src/services`

- `aiAssist.ts`
  - generates an AI-assist prompt and response template for an external LLM
  - parses structured replies back into suggestion sessions
- `dataPortability.ts`
  - creates export snapshots of local journal data
- `rewardEngine.ts`
  - point values
  - badge definitions
  - unlock logic
  - level calculation

### `src/store`

`useOceanStore.ts` handles:

- versioned persisted collection journal
- sea glass entries
- trash logs
- reward transactions
- badge unlock state
- collector preferences
- journal metadata such as last save and last export
- welcome/onboarding state

## Trust Model

Ocean Collector now treats identification with more care. Collection entries can
be saved as:

- user-confirmed from the guide cards
- AI-assisted suggestion
- unknown / not sure
- logged memory types like sea glass or cleanup

This keeps the app useful without pretending it can confidently identify every
photo on its own.

## Data Model Coverage

The codebase includes clean model types for:

- `ShellSpecies`
- `SharkSpecies`
- `ToothProfile`
- `SeaGlassEntry`
- `TrashEntry`
- `UserCollectionItem`
- `RewardBadge`
- `UserPoints`
- `FindLog`
- `FactCard`

## Running The Project

1. Install dependencies:

```bash
npm install
```

2. Start Expo:

```bash
npm start
```

3. Open it on:

- iPhone via Expo Go
- iOS simulator with `npm run ios`
- Android emulator with `npm run android`

4. Typecheck:

```bash
npm run typecheck
```

5. Refresh the GitHub Pages build in `docs/`:

```bash
npm run publish:pages
```

The repo is configured to serve GitHub Pages from `main /docs`, so publishing that folder updates:

- [trevordmaxwell.github.io/ocean-collector](https://trevordmaxwell.github.io/ocean-collector/)

## Current Product Decisions

- The app is intentionally playful and beginner-friendly, not dry or overly scientific.
- Shells and shark teeth are the primary experience.
- Sea glass is treated as a lightweight collectible bonus loop.
- Trash cleanup is rewarded heavily and framed positively.
- The AI/photo flow is scaffolded as an export/import assist flow rather than a fake built-in scanner.
- The app uses local seed data first so the prototype feels real immediately.

## What To Build Next

### Highest value next steps

- Add native import for exported journal snapshots
- Add more original or licensed specimen art for top entries
- Refine collection completion views and trip-log storytelling
- Replace the external AI-assist handoff with a well-scoped real service only when the trust story is strong
- Add licensed or original illustrated specimen art / photos per guide entry
- Add richer compare tools like side-by-side overlays, silhouette comparison, and saved recent searches
- Add account sync and cloud backup
- Add family profiles and shared collection mode
- Add streaks, seasonal badges, quests, and location-based collecting events

### Product polish next

- Onboarding tips and first-find tutorial
- Better collection filtering and sorting
- Maps / beach location memory
- Camera capture flow instead of library-only upload
- Accessibility pass with larger type and better contrast tuning

## Verification

- `npm run typecheck` passes

## Release Prep

- Store and privacy groundwork lives in [RELEASE_PREP.md](./RELEASE_PREP.md)

## Repo Status

This repo now contains the first-pass Ocean Collector foundation rather than an empty placeholder README.
