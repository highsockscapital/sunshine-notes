/*
This file is part of the Notesnook project (https://notesnook.com/)

Copyright (C) 2023 Streetwriters (Private) Limited

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { formatBytes } from "@notesnook/common";
import { strings } from "@notesnook/intl";
import notifee from "@notifee/react-native";

import React from "react";
import { Appearance, Platform } from "react-native";
import { getVersion } from "react-native-device-info";

import { db } from "../../common/database";
import { MMKV } from "../../common/database/mmkv";
import filesystem from "../../common/filesystem";
import { presentDialog } from "../../components/dialog/functions";
import { AppLockPassword } from "../../components/dialogs/applock-password";
import ExportNotesSheet from "../../components/sheets/export-notes";
import { Issue } from "../../components/sheets/github/issue";
import { Update } from "../../components/sheets/update";

import { VaultStatusType, useVaultStatus } from "../../hooks/use-vault-status";
import BackupService from "../../services/backup";
import {
  clearBackupPassword,
  getBackupPassword,
  setBackupPassword
} from "../../services/backup-password";
import BiometricService from "../../services/biometrics";
import { ToastManager, VaultRequestType, eSendEvent, eSubscribeEvent, openVault, presentSheet } from "../../services/event-manager";
import Navigation from "../../services/navigation";
import Notifications from "../../services/notifications";
import SettingsService from "../../services/settings";
import { clearAllStores } from "../../stores";
import { refreshAllStores } from "../../stores/create-db-collection-store";
import { useThemeStore } from "../../stores/use-theme-store";
import { EDITOR_LINE_HEIGHT } from "../../utils/constants";
import { eDataRefresh } from "../../utils/events";
import { resetTabStore } from "../editor/tiptap/use-tab-store";
import { useDragState } from "./editor/state";
import { verifyUserWithApplock } from "./functions";
import { SettingSection } from "./types";

export const settingsGroups: SettingSection[] = [
  {
    // was "account", but with no account left it is purely local data control
    id: "data",
    name: strings.storage(),
    sections: [
      {
        id: "delete-data",
        name: strings.deleteData(),
        icon: "delete",
        description: strings.deleteAccountDesc(),
        modifer: () => {
          presentDialog({
            title: strings.deleteData(),
            paragraph: strings.irreverisibleAction(),
            positiveType: "errorShade",
            positiveText: "Delete data",
            positivePress: async () => {
              await BiometricService.resetCredentials();
              MMKV.clearStore();
              resetTabStore();
              clearAllStores();
              Navigation.queueRoutesForUpdate();
              SettingsService.resetSettings();
              db.reset();

              setImmediate(() => {
                refreshAllStores();
                eSendEvent(eDataRefresh);
              });
              return true;
            }
          });
        }
      }
    ]
  },

  {
    id: "customize",
    name: strings.customization(),
    sections: [
      {
        id: "personalization",
        type: "screen",
        name: strings.appearance(),
        description: strings.appearanceDesc(),
        icon: "shape",
        sections: [
          {
            id: "theme-picker",
            type: "screen",
            name: strings.themes(),
            description: strings.themesDesc(),
            component: "theme-selector",
            icon: "shape"
          },
          {
            id: "use-system-theme",
            type: "switch",
            name: strings.useSystemTheme(),
            description: strings.useSystemThemeDesc(),
            property: "useSystemTheme",
            icon: "circle-half",
            modifer: () => {
              const current = SettingsService.get().useSystemTheme;
              SettingsService.set({
                useSystemTheme: !current
              });
              if (!current) {
                useThemeStore
                  .getState()
                  .setColorScheme(Appearance.getColorScheme() as any);
              }
            }
          },
          {
            id: "enable-dark-mode",
            type: "switch",
            name: strings.darkMode(),
            description: strings.darkModeDesc(),
            property: "colorScheme",
            icon: "brightness-6",
            modifer: () => {
              useThemeStore.getState().setColorScheme();
            },
            getter: () => useThemeStore.getState().colorScheme === "dark"
          }
        ]
      },
      {
        id: "behaviour",
        type: "screen",
        icon: "brain",
        name: strings.behavior(),
        description: strings.behaviorDesc(),
        sections: [
          {
            id: "default-sidebar-view",
            type: "component",
            name: strings.defaultSidebarTab(),
            description: strings.defaultSidebarTabDesc(),
            component: "sidebar-tab-selector"
          },
          {
            id: "date-format",
            name: strings.dateFormat(),
            description: strings.dateFormatDesc(),
            type: "component",
            component: "date-format-selector",
            icon: "calendar-blank"
          },
          {
            id: "day-format",
            name: strings.dayFormat(),
            description: strings.dayFormatDesc(),
            type: "component",
            component: "day-format-selector",
            icon: "calendar-today"
          },
          {
            id: "week-format",
            name: strings.weekFormat(),
            description: strings.weekFormatDesc(),
            type: "component",
            component: "week-format-selector",
            icon: "calendar"
          },
          {
            id: "time-format",
            name: strings.timeFormat(),
            description: strings.timeFormatDesc(),
            type: "component",
            component: "time-format-selector",
            icon: "clock-digital"
          },
          {
            id: "clear-trash-interval",
            type: "component",
            name: strings.clearTrashInterval(),
            description: strings.clearTrashIntervalDesc(),
            component: "trash-interval-selector",
            icon: "delete"
          },
          {
            id: "default-notebook",
            name: strings.clearDefaultNotebook(),
            description: strings.clearDefaultNotebookDesc(),
            modifer: () => {
              db.settings.setDefaultNotebook(undefined);
              ToastManager.show({
                heading: strings.defaultNotebookCleared(),
                type: "success"
              });
            },
            disabled: () => !db.settings.getDefaultNotebook(),
            icon: "notebook-minus"
          },
          {
            id: "disable-update-check",
            type: "switch",
            name: strings.autoUpdateCheck(),
            description: strings.autoUpdateCheckDesc(),
            property: "checkForUpdates",
            icon: "update"
          },
          {
            id: "keep-screen-on",
            type: "switch",
            name: strings.keepScreenOn(),
            description: strings.keepScreenOnDesc(),
            property: "keepScreenOn",
            icon: "cellphone-screenshot"
          },
          {
            id: "image-compression",
            type: "component",
            name: strings.imageCompression(),
            description: strings.imageCompressionDesc(),
            component: "image-compression-picker",
            icon: "image-area"
          }
        ]
      },
      {
        id: "editor",
        name: strings.editor(),
        type: "screen",
        icon: "note-edit-outline",
        description: strings.editorDesc(),
        sections: [
          {
            id: "configure-toolbar",
            type: "screen",
            name: strings.customizeToolbar(),
            description: strings.customizeToolbarDesc(),
            component: "configuretoolbar"
          },
          {
            id: "reset-toolbar",
            name: strings.resetToolbar(),
            description: strings.resetToolbarDesc(),
            modifer: () => {
              useDragState.getState().setPreset("default");
              ToastManager.show({
                heading: strings.toolbarReset(),
                type: "success"
              });
            }
          },
          {
            id: "double-spaced-lines",
            name: strings.doubleSpacedLines(),
            description: strings.doubleSpacedLinesDesc(),
            type: "switch",
            property: "doubleSpacedLines",
            icon: "format-line-spacing",
            onChange: () => {
              ToastManager.show({
                heading: strings.lineSpacingChanged(),
                type: "success"
              });
            }
          },
          {
            id: "default-font-size",
            name: strings.defaultFontSize(),
            description: strings.defaultFontSizeDesc(),
            type: "input-selector",
            minInputValue: 8,
            maxInputValue: 120,
            icon: "format-size",
            property: "defaultFontSize"
          },
          {
            id: "default-font-family",
            name: strings.defaultFontFamily(),
            description: strings.defaultFontFamilyDesc(),
            type: "component",
            icon: "format-font",
            property: "defaultFontFamily",
            component: "font-selector"
          },
          {
            id: "default-line-height",
            name: strings.lineHeight(),
            description: strings.lineHeightDesc(),
            type: "input-selector",
            property: "defaultLineHeight",
            icon: "format-line-spacing",
            minInputValue: EDITOR_LINE_HEIGHT.MIN,
            maxInputValue: EDITOR_LINE_HEIGHT.MAX
          },
          {
            id: "title-format",
            name: strings.titleFormat(),
            component: "title-format",
            description: strings.titleFormatDesc(),
            type: "component"
          },
          {
            id: "toggle-markdown",
            name: strings.mardownShortcuts(),
            property: "markdownShortcuts",
            description: strings.mardownShortcutsDesc(),
            type: "switch",
            featureId: "markdownShortcuts"
          }
        ]
      }
    ]
  },
  {
    id: "privacy-security",
    name: strings.privacyAndSecurity(),
    sections: [
      {
        id: "manage-attachments",
        name: strings.manageAttachments(),
        icon: "attachment",
        type: "screen",
        component: "attachments-manager",
        description: strings.manageAttachmentsDesc(),
        hideHeader: true
      },

      {
        id: "clear-cache",
        name: strings.clearCache(),
        icon: "delete",
        modifer: async () => {
          presentDialog({
            title: strings.clearCacheConfirm(),
            paragraph: strings.clearCacheConfirmDesc(),
            positiveText: strings.clear(),
            positivePress: async () => {
              filesystem.clearCache();
              ToastManager.show({
                heading: strings.cacheCleared(),
                message: strings.cacheClearedDesc(),
                type: "success"
              });
            }
          });
        },
        description(current) {
          return strings.clearCacheDesc(current as number);
        },
        useHook: () => {
          const [cacheSize, setCacheSize] = React.useState(0);
          React.useEffect(() => {
            filesystem
              .getCacheSize()
              .then(setCacheSize)
              .catch(() => {
                /* empty */
              });
            const sub = eSubscribeEvent("cache-cleared", () => {
              setCacheSize(0);
            });
            return () => {
              sub?.unsubscribe();
            };
          }, []);
          return formatBytes(cacheSize);
        }
      },
      {
        id: "cors-bypass",
        type: "input",
        name: strings.corsBypass(),
        description: strings.corsBypassDesc(),
        inputProperties: {
          defaultValue: "",
          autoCorrect: false,
          keyboardType: "url"
        },
        property: "corsProxy",
        icon: "arrow-decision-outline"
      },

      {
        id: "vault",
        type: "screen",
        name: strings.vault(),
        description: strings.vaultDesc(),
        icon: "key",
        sections: [
          {
            id: "create-vault",
            name: strings.createVault(),
            description: strings.createVaultDesc(),
            icon: "key",
            useHook: useVaultStatus,
            hidden: (current) => (current as VaultStatusType)?.exists,
            modifer: () => {
              openVault({
                requestType: VaultRequestType.CreateVault,
                title: strings.createVault(),
                buttonTitle: strings.create()
              });
            }
          },
          {
            id: "lock-vault-after",
            type: "component",
            useHook: useVaultStatus,
            name: strings.lockVaultAfter(),
            description: strings.lockVaultAfterDesc(),
            hidden: (current) => !(current as VaultStatusType)?.exists,
            component: "vault-lock-timer",
            icon: "clock-outline"
          },
          {
            id: "change-vault-password",
            useHook: useVaultStatus,
            name: strings.changeVaultPassword(),
            description: strings.changeVaultPasswordDesc(),
            hidden: (current) => !(current as VaultStatusType)?.exists,
            modifer: () =>
              openVault({
                requestType: VaultRequestType.ChangePassword,
                title: strings.changeVaultPassword(),
                buttonTitle: strings.change()
              })
          },
          {
            id: "clear-vault",
            useHook: useVaultStatus,
            description: strings.clearVaultDesc(),
            name: strings.clearVault(),
            hidden: (current) => !(current as VaultStatusType)?.exists,
            modifer: () => {
              openVault({
                requestType: VaultRequestType.ClearVault,
                title: strings.clearVault() + "?",
                buttonTitle: strings.clear(),
                positiveButtonType: "errorShade"
              });
            }
          },
          {
            id: "delete-vault",
            name: strings.deleteVault(),
            description: strings.deleteVaultDesc(),
            useHook: useVaultStatus,
            hidden: (current) => !(current as VaultStatusType)?.exists,
            modifer: () => {
              openVault({
                requestType: VaultRequestType.DeleteVault,
                title: strings.deleteVault() + "?",
                buttonTitle: strings.delete(),
                positiveButtonType: "errorShade"
              });
            }
          },
          {
            id: "biometric-unlock",
            type: "switch",
            name: strings.biometricUnlock(),
            icon: "fingerprint",
            useHook: useVaultStatus,
            description: strings.biometricUnlockDesc(),
            hidden: (current) => {
              const _current = current as VaultStatusType;
              return !_current?.exists || !_current?.isBiometryAvailable;
            },
            getter: (current) => (current as VaultStatusType)?.biometryEnrolled,
            modifer: (current) => {
              const _current = current as VaultStatusType;
              const isRevoking = _current.biometryEnrolled;
              openVault({
                requestType: isRevoking
                  ? VaultRequestType.RevokeFingerprint
                  : VaultRequestType.EnableFingerprint,
                title: isRevoking
                  ? strings.revokeBiometricUnlock()
                  : strings.vaultEnableBiometrics(),
                buttonTitle: isRevoking ? strings.revoke() : strings.enable()
              });
            }
          }
        ]
      },
      {
        id: "privacy-mode",
        type: "switch",
        icon: "eye-off-outline",
        name: strings.privacyMode(),
        description: strings.privacyModeDesc(),
        modifer: () => {
          const settings = SettingsService.get();
          SettingsService.setPrivacyScreen(!settings.privacyScreen);
          SettingsService.set({ privacyScreen: !settings.privacyScreen });
        },
        property: "privacyScreen"
      },
      {
        id: "app-lock",
        name: strings.appLock(),
        type: "screen",
        description: strings.appLockDesc(),
        icon: "lock",
        featureId: "appLock",
        sections: [
          {
            id: "app-lock-mode",
            name: strings.enableAppLock(),
            description: strings.appLockDesc(),
            icon: "lock",
            type: "switch",
            property: "appLockEnabled",
            featureId: "appLock",
            onChange: (property) => {
              if (property) {
                SettingsService.set({
                  privacyScreen: true
                });
                SettingsService.setPrivacyScreen(true);
              }
            },
            onVerify: async () => {
              const verified = await verifyUserWithApplock();
              if (!verified) return false;

              if (!SettingsService.getProperty("appLockEnabled")) {
                if (
                  !SettingsService.getProperty("appLockHasPasswordSecurity") &&
                  (await BiometricService.isBiometryAvailable())
                ) {
                  SettingsService.setProperty("biometricsAuthEnabled", true);
                }

                if (
                  !(await BiometricService.isBiometryAvailable()) &&
                  !SettingsService.getProperty("appLockHasPasswordSecurity")
                ) {
                  ToastManager.show({
                    heading: strings.biometricsNotEnrolled(),
                    type: "error",
                    message: strings.biometricsNotEnrolledDesc()
                  });
                  return false;
                }
              }

              return verified;
            }
          },
          {
            id: "app-lock-timer",
            name: strings.appLockTimeout(),
            description: strings.appLockTimeoutDesc(),
            type: "component",
            component: "applock-timer"
          },
          {
            id: "app-lock-pin",
            name: () =>
              SettingsService.getProperty("applockKeyboardType") === "numeric"
                ? strings.setupAppLockPin()
                : strings.setupAppLockPassword(),

            description: () =>
              SettingsService.getProperty("applockKeyboardType") === "numeric"
                ? strings.setupAppLockPinDesc()
                : strings.setupAppLockPasswordDesc(),
            hidden: () => {
              return !!SettingsService.getProperty(
                "appLockHasPasswordSecurity"
              );
            },
            onVerify: () => {
              return verifyUserWithApplock();
            },
            property: "appLockHasPasswordSecurity",
            modifer: () => {
              AppLockPassword.present("create");
            }
          },
          {
            id: "app-lock-pin-change",
            name: () =>
              SettingsService.getProperty("applockKeyboardType") === "numeric"
                ? strings.changeAppLockPin()
                : strings.changeAppLockPassword(),
            description: () =>
              SettingsService.getProperty("applockKeyboardType") === "numeric"
                ? strings.changeAppLockPinDesc()
                : strings.changeAppLockPasswordDesc(),
            hidden: () => {
              return !SettingsService.getProperty("appLockHasPasswordSecurity");
            },
            property: "appLockHasPasswordSecurity",
            modifer: () => {
              AppLockPassword.present("change");
            }
          },
          {
            id: "app-lock-pin-remove",
            name: () =>
              SettingsService.getProperty("applockKeyboardType") === "numeric"
                ? strings.removeAppLockPin()
                : strings.removeAppLockPassword(),
            description: () =>
              SettingsService.getProperty("applockKeyboardType") === "numeric"
                ? strings.removeAppLockPinDesc()
                : strings.removeAppLockPasswordDesc(),
            hidden: () => {
              return !SettingsService.getProperty("appLockHasPasswordSecurity");
            },
            property: "appLockHasPasswordSecurity",
            modifer: () => {
              AppLockPassword.present("remove");
            }
          },
          {
            id: "app-lock-fingerprint",
            name: strings.unlockWithBiometrics(),
            description: strings.unlockWithBiometricsDesc(),
            type: "switch",
            property: "biometricsAuthEnabled",
            onVerify: async () => {
              const verified = await verifyUserWithApplock();
              if (!verified) return false;

              if (SettingsService.getProperty("biometricsAuthEnabled")) {
                if (
                  !SettingsService.getProperty("appLockHasPasswordSecurity")
                ) {
                  SettingsService.setProperty("appLockEnabled", false);
                  ToastManager.show({
                    heading: strings.appLockDisabled(),
                    type: "success"
                  });
                }
              }

              return verified;
            },
            icon: "fingerprint"
          }
        ]
      }
    ]
  },
  {
    id: "back-restore",
    name: strings.backupRestore(),
    sections: [
      {
        id: "backups",
        type: "screen",
        name: strings.backups(),
        icon: "backup-restore",
        description: strings.backupsDesc(),
        sections: [
          {
            id: "backup-now",
            name: strings.backupNow(),
            description: strings.backupNowDesc(),
            modifer: async () => {
              await BackupService.run(
                true,
                undefined,
                "partial",
                SettingsService.get().encryptedBackup
                  ? await getBackupPassword()
                  : undefined
              );
            }
          },
          {
            id: "backup-now-with-attachments",
            name: strings.backupNowWithAttachments(),
            description: strings.backupNowWithAttachmentsDesc(),
            modifer: async () => {
              await BackupService.run(
                true,
                undefined,
                "full",
                SettingsService.get().encryptedBackup
                  ? await getBackupPassword()
                  : undefined
              );
            }
          },
          {
            id: "auto-backups",
            type: "component",
            name: strings.automaticBackups(),
            description: strings.automaticBackupsDesc(),
            component: "autobackups"
          },
          {
            id: "auto-backups-with-attachments",
            type: "component",
            name: strings.automaticBackupsWithAttachments(),
            description: [
              ...strings.automaticBackupsWithAttachmentsDesc()
            ].join("\n"),
            component: "autobackupsattachments"
          },
          {
            id: "backup-encryption",
            name: strings.backupEncryption(),
            description: () =>
              SettingsService.get().encryptedBackup
                ? strings.backupPasswordSet()
                : strings.backupEncryptionDesc(),
            icon: "lock-closed",
            modifer: () => {
              if (SettingsService.get().encryptedBackup) {
                presentDialog({
                  title: strings.backupPasswordCleared(),
                  paragraph: strings.backupPasswordClearedDesc(),
                  positiveType: "errorShade",
                  positiveText: strings.remove(),
                  positivePress: async () => {
                    clearBackupPassword();
                    SettingsService.set({ encryptedBackup: false });
                    return true;
                  }
                });
                return;
              }

              presentDialog({
                context: "backup-encryption",
                title: strings.backupPasswordSet(),
                paragraph: strings.backupPasswordDesc(),
                input: true,
                secureTextEntry: true,
                inputPlaceholder: strings.password(),
                positiveText: strings.save(),
                positivePress: async (password) => {
                  if (!password || password.length < 4) {
                    ToastManager.error(
                      new Error(strings.passwordNotEntered()),
                      strings.backupPasswordRequired(),
                      "backup-encryption"
                    );
                    return false;
                  }
                  try {
                    await setBackupPassword(password);
                    SettingsService.set({ encryptedBackup: true });
                    return true;
                  } catch (e) {
                    ToastManager.error(
                      e as Error,
                      strings.backupPasswordRequired(),
                      "backup-encryption"
                    );
                    return false;
                  }
                }
              });
            }
          },
          {
            id: "select-backup-dir",
            name: strings.selectBackupDir(),
            description: () => {
              const desc = strings.selectBackupDirDesc(
                SettingsService.get().backupDirectoryAndroid?.path || ""
              );
              return desc[0] + " " + desc[1];
            },
            icon: "folder",
            hidden: () =>
              !!SettingsService.get().backupDirectoryAndroid ||
              Platform.OS !== "android",
            property: "backupDirectoryAndroid",
            modifer: async () => {
              let dir;
              try {
                dir = await BackupService.checkBackupDirExists(true);
              } catch (e) {
                console.error(e);
              } finally {
                if (!dir) {
                  ToastManager.show({
                    heading: strings.noDirectorySelected(),
                    type: "error"
                  });
                }
              }
            }
          },
          {
            id: "change-backup-dir",
            name: strings.changeBackupDir(),
            description: () =>
              SettingsService.get().backupDirectoryAndroid?.name || "",
            icon: "folder",
            hidden: () =>
              !SettingsService.get().backupDirectoryAndroid ||
              Platform.OS !== "android",
            property: "backupDirectoryAndroid",
            modifer: async () => {
              let dir;
              try {
                dir = await BackupService.checkBackupDirExists(true);
              } catch (e) {
                console.error(e);
              } finally {
                if (!dir) {
                  ToastManager.show({
                    heading: strings.noDirectorySelected(),
                    type: "error"
                  });
                }
              }
            }
          },
        ]
      },
      {
        id: "restore-backup",
        name: strings.restoreBackup(),
        description: strings.restoreBackupDesc(),
        icon: "restore",
        type: "screen",
        component: "backuprestore"
      },
      {
        id: "export-notes",
        name: strings.exportAllNotes(),
        icon: "export",
        description: strings.exportAllNotesDesc(),
        modifer: () => {
          ExportNotesSheet.present(undefined, true);
        }
      }
    ]
  },
  {
    id: "productivity",
    name: strings.productivity(),
    sections: [
      {
        id: "notification-notes",
        type: "switch",
        name: strings.quickNoteNotification(),
        description: strings.quickNoteNotificationDesc(),
        property: "notifNotes",
        icon: "form-textbox",
        modifer: async () => {
          const settings = SettingsService.get();
          if (settings.notifNotes) {
            Notifications.unpinQuickNote();
          } else {
            Notifications.pinQuickNote();
          }
          SettingsService.set({
            notifNotes: !settings.notifNotes
          });
        },
        hidden: () => Platform.OS !== "android",
        featureId: "createNoteFromNotificationDrawer"
      },
      {
        id: "reminders",
        type: "screen",
        name: strings.reminders(),
        icon: "bell",
        description: strings.remindersDesc(),
        sections: [
          {
            id: "enable-reminders",
            property: "reminderNotifications",
            type: "switch",
            name: strings.reminderNotification(),
            icon: "bell-outline",
            onChange: (property) => {
              if (property) {
                Notifications.setupReminders();
              } else {
                Notifications.clearAllTriggers();
              }
            },
            description: strings.reminderNotificationDesc()
          },
          {
            id: "snooze-time",
            property: "defaultSnoozeTime",
            type: "input",
            name: strings.defaultSnoozeTime(),
            description: strings.defaultSnoozeTimeDesc(),
            inputProperties: {
              keyboardType: "decimal-pad",
              defaultValue: 5 + "",
              placeholder: strings.setSnoozeTimePlaceholder(),
              onSubmitEditing: () => {
                Notifications.setupReminders();
              }
            }
          },
          {
            id: "reminder-sound-ios",
            type: "screen",
            name: strings.changeNotificationSound(),
            description: strings.changeNotificationSoundDesc(),
            component: "sound-picker",
            icon: "bell-ring",
            hidden: () =>
              Platform.OS === "ios" ||
              (Platform.OS === "android" && Platform.Version > 25)
          },
          {
            id: "reminder-sound-android",
            name: strings.changeNotificationSound(),
            description: strings.changeNotificationSoundDesc(),
            icon: "bell-ring",
            hidden: () =>
              Platform.OS === "ios" ||
              (Platform.OS === "android" && Platform.Version < 26),
            modifer: async () => {
              const id = await Notifications.getChannelId("urgent");
              if (id) {
                await notifee.openNotificationSettings(id);
              }
            }
          }
        ]
      }
    ]
  },
  {
    id: "help-support",
    name: strings.helpAndSupport(),
    sections: [
      {
        id: "report-issue",
        name: strings.reportAnIssue(),
        icon: "bug",
        modifer: () => {
          presentSheet({
            //@ts-ignore Migrate to TS
            component: <Issue />
          });
        },
        description: strings.reportAnIssueDesc()
      },
      {
        id: "debugging",
        name: strings.debugging(),
        description: strings.debuggingDesc(),
        type: "screen",
        icon: "bug",
        sections: [
          {
            id: "debug-logs",
            type: "screen",
            name: strings.debugLogs(),
            description: strings.debugLogsDesc(),
            component: "debug-logs"
          }
        ]
      }
    ]
  },
  {
    id: "legal",
    name: strings.legal(),
    sections: [
      {
        id: "licenses",
        name: strings.licenses(),
        type: "screen",
        component: "licenses",
        description: strings.ossLibs(),
        icon: "open-source-initiative"
      }
    ]
  },
  {
    id: "about",
    name: strings.about(),
    sections: [
      {
        id: "check-for-updates",
        name: strings.checkForUpdates(),
        icon: "cellphone-arrow-down",
        description: strings.checkForUpdatesDesc(),
        modifer: async () => {
          presentSheet({
            //@ts-ignore // Migrate to ts
            component: (ref) => <Update fwdRef={ref} />
          });
        }
      },
      {
        id: "app-version",
        name: strings.appVersion(),
        icon: "alpha-v",
        description: getVersion()
      }
    ]
  }
];
