# Ocean Collector Release Prep

This is the lightweight shipping-prep note for the current MVP. It is meant to
keep future App Store and Play Store work organized without dragging the
prototype into release bureaucracy too early.

## Current Product Stance

- Ocean Collector is local-first.
- User journal data is stored on-device through persisted Zustand state.
- There is no account system, no cloud sync, and no third-party analytics.
- Photo use is limited to the user's journal entry and the optional AI-assist
  export workflow.
- AI suggestions are framed as experimental help, not authoritative IDs.

## Config Added

- iOS bundle identifier: `com.trevormaxwell.oceancollector`
- Android package: `com.trevormaxwell.oceancollector`
- Image-picker permission copy is configured in `app.json`
- Android explicitly blocks `android.permission.RECORD_AUDIO` so store/privacy review stays aligned with the current feature set

## Current Permissions

- Photo library access
  - Purpose: attach a shell, tooth, sea glass, or cleanup photo to a journal
    entry and optionally include that photo in an AI-assist workflow.
- Camera access
  - Not fully wired into the MVP UI yet, but the permission copy is prepared so
    camera capture can be added cleanly.

## Privacy Checklist For Later

- Write a short public privacy policy matching the current local-first behavior.
- Confirm whether crash reporting or analytics will be added before store
  submission.
- If cloud sync is introduced later, update export/import language and privacy
  disclosures at the same time.
- Review Expo and any future backend vendors for App Store privacy labeling.

## Build / QA Checklist For Later

- Test persistence on iPhone and Android devices, not just web.
- Verify image-picker permissions and photo save flows on native hardware.
- Finalize app icon, splash, screenshots, and store listing copy.
- Add a real backup or sync story before calling the app production-ready.
- Do a focused accessibility pass for dynamic type, contrast, and touch targets.

## Local QA Notes (March 10, 2026)

- `npm run typecheck` passes after the backup-restore and journal updates.
- Real browser verification was run against the local Expo web build for:
  - home journal load
  - saving an unknown shell into the collection
  - beach-walk scrapbook grouping
  - collection item return-to-album flow
  - guide detail compare flow and return-to-library flow
  - settings restore/import section visibility
- On this Mac, native simulator/device QA is currently blocked by missing tooling:
  - `xcodebuild` is unavailable because full Xcode is not the active developer directory
  - `xcrun simctl` is unavailable
  - `adb` is not installed
- Next honest native QA step is a real iPhone/Android pass once Xcode + simulator support and Android platform tools are installed.

## Honest AI-Assist Checklist

- Keep AI-assist wording experimental and non-authoritative.
- Validate imported AI JSON against the app schema before saving.
- If a future built-in model is added, preserve the distinction between:
  - saved journal entry
  - suggested identification
  - user-confirmed identification
  - unknown / inconclusive find
