# Ocean Collector

Ocean Collector is a cute, ocean-themed mobile app for beachcombers who want to identify finds, save them into a digital collection, and earn rewards for both discovery and beach cleanup.

This first pass is built as a polished MVP foundation with a cozy, cartoon-collectible vibe inspired by Animal Crossing, soft beach palettes, and playful journal mechanics.

## Chosen Stack

- Expo + React Native + TypeScript
- React Navigation for scalable screen flow
- Zustand + AsyncStorage for local-first persistent state
- Expo Image Picker for photo selection
- Local seed data and a placeholder identification service for future AI

Why this stack:

- Fastest path to a polished iOS-friendly prototype
- Clean upgrade path to real AI APIs, cloud sync, accounts, and monetization
- Reusable component architecture without locking the MVP into native-only complexity

## MVP Included

- Splash / welcome experience
- Beautiful home screen with main actions
- Shell identification flow
- Shark tooth identification flow
- Manual shell and shark tooth libraries
- Item detail / fact screens
- Sea glass logging
- Trash cleanup logging with stewardship rewards
- My Collection journal
- Points and badge framework
- Local sample data for shells, shark teeth, sea glass, and trash categories
- Placeholder AI identification pipeline with a future-ready service boundary

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

- `identification.ts`
  - placeholder AI-style matching pipeline
  - clean seam for future vision API or classifier integration
- `rewardEngine.ts`
  - point values
  - badge definitions
  - unlock logic
  - level calculation

### `src/store`

`useOceanStore.ts` handles:

- persisted collection journal
- sea glass entries
- trash logs
- reward transactions
- badge unlock state
- welcome/onboarding state

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
- The AI/photo flow is scaffolded now and designed to accept a real model later.
- The app uses local seed data first so the prototype feels real immediately.

## What To Build Next

### Highest value next steps

- Replace placeholder identification with a real vision service or fine-tuned classifier
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

## Repo Status

This repo now contains the first-pass Ocean Collector foundation rather than an empty placeholder README.
