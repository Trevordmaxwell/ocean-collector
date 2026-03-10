import * as Clipboard from "expo-clipboard";
import { useMemo } from "react";
import {
  Pressable,
  Share,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import { OceanCard } from "../components/OceanCard";
import { ScreenShell } from "../components/ScreenShell";
import { SectionTitle } from "../components/SectionTitle";
import { serializeUserDataExport } from "../services/dataPortability";
import { useOceanStore } from "../store/useOceanStore";
import { palette, radius, spacing, typography } from "../theme";
import { formatFriendlyTime } from "../utils/format";

export function SettingsScreen() {
  const preferences = useOceanStore((state) => state.preferences);
  const journalMeta = useOceanStore((state) => state.journalMeta);
  const collection = useOceanStore((state) => state.collection);
  const seaGlassEntries = useOceanStore((state) => state.seaGlassEntries);
  const trashEntries = useOceanStore((state) => state.trashEntries);
  const findLogs = useOceanStore((state) => state.findLogs);
  const points = useOceanStore((state) => state.points);
  const unlockedBadgeIds = useOceanStore((state) => state.unlockedBadgeIds);
  const claimedQuestIds = useOceanStore((state) => state.claimedQuestIds);
  const purchasedShopItemIds = useOceanStore((state) => state.purchasedShopItemIds);
  const equippedThemeId = useOceanStore((state) => state.equippedThemeId);
  const hasSeenWelcome = useOceanStore((state) => state.hasSeenWelcome);
  const updatePreferences = useOceanStore((state) => state.updatePreferences);
  const markDataExported = useOceanStore((state) => state.markDataExported);
  const showNotice = useOceanStore((state) => state.showNotice);

  const exportText = useMemo(
    () =>
      serializeUserDataExport({
        ...useOceanStore.getState(),
        preferences,
        journalMeta,
        collection,
        seaGlassEntries,
        trashEntries,
        findLogs,
        points,
        unlockedBadgeIds,
        claimedQuestIds,
        purchasedShopItemIds,
        equippedThemeId,
        hasSeenWelcome,
      }),
    [
    preferences,
    journalMeta,
    collection,
    seaGlassEntries,
    trashEntries,
    findLogs,
    points,
    unlockedBadgeIds,
    claimedQuestIds,
    purchasedShopItemIds,
    equippedThemeId,
    hasSeenWelcome,
  ]);
  const exportPreview = exportText.split("\n").slice(0, 10).join("\n");

  async function copyExport() {
    await Clipboard.setStringAsync(exportText);
    markDataExported();
  }

  async function shareExport() {
    try {
      await Share.share({
        message: exportText,
      });
      markDataExported();
    } catch {
      await Clipboard.setStringAsync(exportText);
      showNotice({
        title: "Shared copy fallback",
        message:
          "Your device could not open a share sheet, so the export JSON was copied instead.",
        tone: "info",
      });
      markDataExported();
    }
  }

  return (
    <ScreenShell>
      <View style={styles.topSpacing} />
      <SectionTitle
        title="Settings & Journal Care"
        subtitle="A calm little control room for trust, preferences, and release prep."
      />

      <OceanCard
        title="Collector profile"
        subtitle="These save locally as you type, so the journal feels a little more personal."
        icon="🪪"
      >
        <Text style={styles.label}>Collector name</Text>
        <TextInput
          style={styles.input}
          value={preferences.collectorName}
          onChangeText={(value) => updatePreferences({ collectorName: value || "tide explorer" })}
          placeholder="tide explorer"
          placeholderTextColor={palette.mist}
        />

        <Text style={styles.label}>Favorite beach or usual walk</Text>
        <TextInput
          style={styles.input}
          value={preferences.favoriteBeach}
          onChangeText={(value) => updatePreferences({ favoriteBeach: value })}
          placeholder="Sanibel shell line, family beach, pier south..."
          placeholderTextColor={palette.mist}
        />

        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <Text style={styles.label}>Show scientific names</Text>
            <Text style={styles.helper}>
              Useful in the album and guide shelves, but still tucked behind the cozy tone.
            </Text>
          </View>
          <Switch
            value={preferences.showScientificNames}
            onValueChange={(value) => updatePreferences({ showScientificNames: value })}
            trackColor={{ false: "rgba(100,128,141,0.24)", true: "rgba(95,165,201,0.36)" }}
            thumbColor={preferences.showScientificNames ? palette.deep : palette.pearl}
          />
        </View>
      </OceanCard>

      <OceanCard
        title="Local save trust"
        subtitle="Ocean Collector is local-first right now, which keeps the app honest and simple."
        icon="💾"
      >
        <Text style={styles.body}>
          Last journal save: {formatFriendlyTime(journalMeta.lastSavedAt)}
        </Text>
        <Text style={styles.body}>
          Last export prepared: {formatFriendlyTime(journalMeta.lastExportedAt)}
        </Text>
        <Text style={styles.helper}>
          No account or cloud sync is built in yet, so export is the best backup path until sync exists.
        </Text>
      </OceanCard>

      <SectionTitle
        title="Export journal data"
        subtitle="A clean JSON snapshot now, so later import/sync will not need a painful refactor."
      />
      <OceanCard
        title="Journal snapshot"
        subtitle="Copy or share this export whenever you want a manual backup."
        icon="📦"
      >
        <View style={styles.buttonRow}>
          <Pressable onPress={copyExport} style={[styles.primaryButton, styles.flexButton]}>
            <Text style={styles.primaryButtonLabel}>Copy export JSON</Text>
          </Pressable>
          <Pressable onPress={shareExport} style={[styles.secondaryButton, styles.flexButton]}>
            <Text style={styles.secondaryButtonLabel}>Share export</Text>
          </Pressable>
        </View>
        <Text style={styles.previewLabel}>Preview</Text>
        <Text style={styles.exportPreview}>{exportPreview}</Text>
      </OceanCard>

      <SectionTitle
        title="Privacy & permissions prep"
        subtitle="Light scaffolding now so App Store prep later is calmer."
      />
      <OceanCard
        title="Current privacy stance"
        subtitle="Friendly, minimal, and honest."
        icon="🔐"
      >
        <Text style={styles.body}>
          Photos are only used for your private journal entry and optional AI-assist prompt workflow.
        </Text>
        <Text style={styles.body}>
          The app does not currently require accounts, cloud sync, or background data collection.
        </Text>
        <Text style={styles.body}>
          Next store step: write a simple privacy policy that mirrors the current local-first behavior.
        </Text>
      </OceanCard>

      <OceanCard
        title="Build readiness"
        subtitle="Tiny bits of store plumbing are in place without dragging the product sideways."
        icon="🧰"
      >
        <Text style={styles.body}>
          Bundle/package IDs and image-picker permission copy are being prepared in app config.
        </Text>
        <Text style={styles.body}>
          Biggest missing pieces before shipping: real store assets, final privacy policy, QA on native devices, and a production backup/sync story.
        </Text>
      </OceanCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topSpacing: {
    height: spacing.sm,
  },
  label: {
    fontFamily: typography.bodyBold,
    fontSize: 14,
    color: palette.ink,
  },
  helper: {
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 18,
    color: palette.mist,
  },
  body: {
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: palette.deep,
  },
  input: {
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.74)",
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: typography.body,
    fontSize: 15,
    color: palette.ink,
  },
  switchRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  switchCopy: {
    flex: 1,
    gap: 4,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
  primaryButton: {
    borderRadius: radius.pill,
    backgroundColor: palette.deep,
    paddingVertical: spacing.sm + 2,
    alignItems: "center",
  },
  primaryButtonLabel: {
    fontFamily: typography.headingSoft,
    fontSize: 15,
    color: palette.pearl,
    textAlign: "center",
  },
  secondaryButton: {
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.78)",
    paddingVertical: spacing.sm + 2,
    alignItems: "center",
    borderWidth: 1,
    borderColor: palette.border,
  },
  secondaryButtonLabel: {
    fontFamily: typography.bodyBold,
    fontSize: 15,
    color: palette.deep,
    textAlign: "center",
  },
  previewLabel: {
    fontFamily: typography.bodyBold,
    color: palette.ink,
    fontSize: 14,
  },
  exportPreview: {
    fontFamily: "Menlo",
    fontSize: 11,
    lineHeight: 16,
    color: palette.deep,
    backgroundColor: "rgba(255,255,255,0.68)",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.sm,
  },
});
