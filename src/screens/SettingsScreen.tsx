import * as Clipboard from "expo-clipboard";
import { useMemo, useState } from "react";
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
import {
  parseUserDataExport,
  serializeUserDataExport,
  summarizeUserDataExport,
} from "../services/dataPortability";
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
  const restoreImportedData = useOceanStore((state) => state.restoreImportedData);
  const showNotice = useOceanStore((state) => state.showNotice);
  const [importText, setImportText] = useState("");
  const [restoreArmed, setRestoreArmed] = useState(false);

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
    ],
  );
  const exportPreview = exportText.split("\n").slice(0, 10).join("\n");
  const importResult = useMemo(
    () => (importText.trim().length > 0 ? parseUserDataExport(importText) : null),
    [importText],
  );
  const importSummary = useMemo(
    () => (importResult?.ok ? summarizeUserDataExport(importResult.data) : null),
    [importResult],
  );

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

  async function pasteImport() {
    const clipboardText = await Clipboard.getStringAsync();

    if (!clipboardText.trim()) {
      showNotice({
        title: "Clipboard is empty",
        message: "Copy a journal snapshot first, then paste it in here.",
        tone: "info",
      });
      return;
    }

    setImportText(clipboardText);
    setRestoreArmed(false);
    showNotice({
      title: "Snapshot pasted",
      message: "Preview it below before replacing the journal on this device.",
      tone: "info",
    });
  }

  function previewImport() {
    if (!importText.trim()) {
      showNotice({
        title: "Nothing to preview",
        message: "Paste or type a journal snapshot first.",
        tone: "info",
      });
      return;
    }

    if (!importResult?.ok) {
      showNotice({
        title: "Snapshot needs a tweak",
        message: importResult?.message ?? "That snapshot could not be parsed yet.",
        tone: "error",
      });
      return;
    }

    setRestoreArmed(false);
    showNotice({
      title: "Snapshot looks valid",
      message: `${importSummary?.collectionCount ?? 0} saved memories are ready to preview below.`,
      tone: "success",
    });
  }

  function restoreSnapshot() {
    if (!importText.trim()) {
      showNotice({
        title: "Nothing to restore",
        message: "Paste a journal snapshot first.",
        tone: "info",
      });
      return;
    }

    if (!importResult?.ok) {
      showNotice({
        title: "Snapshot needs a tweak",
        message: importResult?.message ?? "That snapshot could not be parsed yet.",
        tone: "error",
      });
      return;
    }

    if (!restoreArmed) {
      setRestoreArmed(true);
      showNotice({
        title: "Restore is armed",
        message:
          "Tap restore again if you want this device to replace its current journal with the previewed snapshot.",
        tone: "info",
      });
      return;
    }

    restoreImportedData(importResult.data);
    setImportText("");
    setRestoreArmed(false);
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
        <Text style={styles.body}>
          Last restore on this device: {formatFriendlyTime(journalMeta.lastRestoredAt)}
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
        title="Restore from backup"
        subtitle="Preview a snapshot first, then restore it with one extra confirmation tap."
      />
      <OceanCard
        title="Journal restore"
        subtitle="Restoring replaces the local journal on this device, so it is best to make a fresh export first if you want a safety copy."
        icon="🧺"
      >
        <View style={styles.buttonRow}>
          <Pressable onPress={pasteImport} style={[styles.secondaryButton, styles.flexButton]}>
            <Text style={styles.secondaryButtonLabel}>Paste backup</Text>
          </Pressable>
          <Pressable onPress={previewImport} style={[styles.secondaryButton, styles.flexButton]}>
            <Text style={styles.secondaryButtonLabel}>Preview snapshot</Text>
          </Pressable>
        </View>
        <TextInput
          placeholder="Paste an Ocean Collector journal snapshot here..."
          placeholderTextColor={palette.mist}
          style={[styles.input, styles.importInput]}
          multiline
          value={importText}
          onChangeText={(value) => {
            setImportText(value);
            setRestoreArmed(false);
          }}
        />

        {importSummary ? (
          <View style={styles.restorePreviewCard}>
            <Text style={styles.previewLabel}>Snapshot summary</Text>
            <Text style={styles.body}>Collector: {importSummary.collectorName}</Text>
            <Text style={styles.body}>
              Exported: {formatFriendlyTime(importSummary.exportedAt)}
            </Text>
            <Text style={styles.body}>
              {importSummary.collectionCount} saved memories • {importSummary.tripCount} beach walks
            </Text>
            <Text style={styles.body}>
              {importSummary.favoritesCount} favorites • {importSummary.seaGlassCount} sea glass •{" "}
              {importSummary.trashCount} cleanup logs
            </Text>
            <Text style={styles.body}>
              {importSummary.totalPoints} total points • {importSummary.badgeCount} badges
            </Text>
          </View>
        ) : importText.trim().length > 0 && importResult && !importResult.ok ? (
          <View style={styles.restoreErrorCard}>
            <Text style={styles.restoreErrorTitle}>Snapshot could not be previewed</Text>
            <Text style={styles.helper}>{importResult.message}</Text>
          </View>
        ) : null}

        <Pressable
          onPress={restoreSnapshot}
          style={[
            styles.restoreButton,
            restoreArmed ? styles.restoreButtonArmed : styles.restoreButtonIdle,
          ]}
        >
          <Text style={styles.restoreButtonLabel}>
            {restoreArmed ? "Tap again to replace local journal" : "Restore this snapshot"}
          </Text>
        </Pressable>
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
  importInput: {
    minHeight: 144,
    textAlignVertical: "top",
  },
  restorePreviewCard: {
    gap: 4,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
  },
  restoreErrorCard: {
    gap: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,240,237,0.88)",
    borderWidth: 1,
    borderColor: "rgba(231,133,115,0.24)",
    padding: spacing.md,
  },
  restoreErrorTitle: {
    fontFamily: typography.bodyBold,
    fontSize: 14,
    color: palette.coral,
  },
  restoreButton: {
    borderRadius: radius.pill,
    paddingVertical: spacing.sm + 2,
    alignItems: "center",
  },
  restoreButtonIdle: {
    backgroundColor: palette.peach,
  },
  restoreButtonArmed: {
    backgroundColor: palette.coral,
  },
  restoreButtonLabel: {
    fontFamily: typography.headingSoft,
    fontSize: 15,
    color: palette.pearl,
    textAlign: "center",
  },
});
