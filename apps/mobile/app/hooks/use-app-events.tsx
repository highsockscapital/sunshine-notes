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

import { isFeatureAvailable } from "@notesnook/common";
import { EV, EVENTS, EventManagerSubscription, isInternalLink, parseInternalLink } from "@notesnook/core";
import { strings } from "@notesnook/intl";
import notifee from "@notifee/react-native";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useRef } from "react";
import { AppState, AppStateStatus, Keyboard, Linking, NativeEventEmitter, NativeEventSubscription, NativeModules, Platform } from "react-native";
import Config from "react-native-config";
import { DatabaseLogger, db, initDatabase } from "../common/database";
import { initializeLogger } from "../common/database/logger";
import { MMKV } from "../common/database/mmkv";
import { deleteDCacheFiles } from "../common/filesystem/io";
import { endProgress, startProgress } from "../components/dialogs/progress";
import Migrate from "../components/sheets/migrate";
import NewFeature from "../components/sheets/new-feature";
import AddReminder from "../screens/add-reminder";
import { useTabStore } from "../screens/editor/tiptap/use-tab-store";
import { editorController, editorState } from "../screens/editor/tiptap/utils";
import { useDragState } from "../screens/settings/editor/state";
import BackupService from "../services/backup";
import { getBackupPassword } from "../services/backup-password";
import { ToastManager, eSendEvent, presentSheet } from "../services/event-manager";
import { setUpdateAvailableMessage } from "../services/message";
import Navigation from "../services/navigation";
import { NotePreviewWidget } from "../services/note-preview-widget";
import Notifications from "../services/notifications";
import SettingsService from "../services/settings";
import { refreshStores } from "../stores";
import { useAttachmentStore } from "../stores/use-attachment-store";
import { useMessageStore } from "../stores/use-message-store";
import { useRelationStore } from "../stores/use-relation-store";
import { useSettingStore } from "../stores/use-setting-store";
import { useUserStore } from "../stores/use-user-store";
import { updateStatusBarColor } from "../utils/colors";
import { BETA } from "../utils/constants";
import {
  eEditorReset,
  eOnLoadNote,
  eOpenAnnouncementDialog,
  refreshNotesPage
} from "../utils/events";
import { getGithubVersion } from "../utils/github-version";
import { fluidTabsRef } from "../utils/global-refs";
import { sleep } from "../utils/time";

const onFileEncryptionProgress = ({
  total,
  progress
}: {
  total: number;
  progress: number;
}) => {
  useAttachmentStore
    .getState()
    .setEncryptionProgress(Math.round(progress / total));
};

const onDownloadingAttachmentProgress = (data: any) => {
  useAttachmentStore.getState().setDownloading(data);
};

const onDownloadedAttachmentProgress = (data: any) => {
  useAttachmentStore.getState().setDownloading(data);
};

const onAppOpenedFromURL = async (event: {
  url: string;
  isInitialUrl?: boolean;
}) => {
  const url = event.url;

  const parsedLink = isInternalLink(url) ? parseInternalLink(url) : undefined;

  try {
    if (url.startsWith("ShareMedia://QuickNoteWidget")) {
      editorState().movedAway = false;
      eSendEvent(eOnLoadNote, { newNote: true });
      fluidTabsRef.current?.goToPage("editor", false);
      return;
    } else if (
      parsedLink?.type === "note" ||
      url.startsWith("https://app.sunshinenotes.com/open_note?")
    ) {
      const id = parsedLink?.id || new URL(url).searchParams.get("id");

      if (id) {
        const note = await db.notes.note(id);
        if (note) {
          editorState().initialLoadCalled = true;
          eSendEvent(eOnLoadNote, {
            item: note
          });
          fluidTabsRef.current?.goToPage("editor", false);
        }
      }
    } else if (
      (parsedLink?.type === "notebook" ||
        url.startsWith("https://app.sunshinenotes.com/open_notebook?")) &&
      !event.isInitialUrl
    ) {
      const id = parsedLink?.id || new URL(url).searchParams.get("id");
      if (id) {
        const notebook = await db.notebooks.notebook(id);
        if (notebook) {
          fluidTabsRef.current?.goToPage("home");
          Navigation.navigate("Notebook", {
            id: notebook.id,
            canGoBack: true,
            item: notebook
          });
        }
      }
    } else if (
      (parsedLink?.type === "tag" ||
        url.startsWith("https://app.sunshinenotes.com/open_tag?")) &&
      !event.isInitialUrl
    ) {
      const id = parsedLink?.id || new URL(url).searchParams.get("id");
      if (id) {
        const tag = await db.tags.tag(id);
        if (tag) {
          fluidTabsRef.current?.goToPage("home");
          Navigation.navigate("TaggedNotes", {
            type: "tag",
            id: tag.id,
            item: tag,
            canGoBack: true
          });
        }
      }
    } else if (
      (parsedLink?.type === "color" ||
        url.startsWith("https://app.sunshinenotes.com/open_color?")) &&
      !event.isInitialUrl
    ) {
      const id = parsedLink?.id || new URL(url).searchParams.get("id");
      if (id) {
        const color = await db.colors.color(id);
        if (color) {
          fluidTabsRef.current?.goToPage("home");
          Navigation.navigate("ColoredNotes", {
            type: "color",
            id: color.id,
            item: color,
            canGoBack: true
          });
        }
      }
    } else if (url.startsWith("https://app.sunshinenotes.com/open_reminder")) {
      const id = new URL(url).searchParams.get("id");
      if (id) {
        const reminder = await db.reminders.reminder(id);
        if (reminder) AddReminder.present(reminder);
      }
    } else if (url.startsWith("https://app.sunshinenotes.com/new_reminder")) {
      const reminderFeature = await isFeatureAvailable("activeReminders");
      AddReminder.present();
    }
  } catch (e) {
    console.error(e);
  }
};

async function checkForShareExtensionLaunchedInBackground() {
  try {
    const notesAddedFromIntent = MMKV.getString("notesAddedFromIntent");
    const shareExtensionOpened = MMKV.getString("shareExtensionOpened");
    if (notesAddedFromIntent) {
      if (Platform.OS === "ios") {
        await db.initCollections();
        await db.notes.init();
      }
      eSendEvent(refreshNotesPage);
      MMKV.removeItem("notesAddedFromIntent");
      refreshStores();
      eSendEvent(refreshNotesPage);
    }

    if (notesAddedFromIntent || shareExtensionOpened) {
      const id = useTabStore.getState().getCurrentNoteId();
      const note = id && (await db.notes.note(id));
      eSendEvent(eEditorReset);
      if (note) setTimeout(() => eSendEvent("loadingNote", note), 1);
      MMKV.removeItem("shareExtensionOpened");
    }
  } catch (e) {
    /**
    empty */
  }
}

const SodiumEventEmitter = new NativeEventEmitter(NativeModules.Sodium);

const setAppMessage = async () => {
  // There is no account to nag about any more, so this is down to the two
  // things that still make sense on a device-local build.
  useMessageStore.getState().setAnnouncement();
  checkAppUpdateAvailable();
};

const doAppLoadActions = async () => {
  notifee.setBadgeCount(0);
  if (NewFeature.present()) return;
  useMessageStore.subscribe((state) => {
    const dialogs = state.dialogs;
    if (dialogs.length > 0) {
      eSendEvent(eOpenAnnouncementDialog, dialogs[0]);
    }
  });
};

const checkAppUpdateAvailable = async () => {
  if (
    __DEV__ ||
    Config.isTesting === "true" ||
    Config.FDROID_BUILD ||
    BETA ||
    !SettingsService.getProperty("checkForUpdates")
  )
    return;

  try {
    const version = await getGithubVersion();
    if (!version || !version?.needsUpdate) return false;

    setUpdateAvailableMessage(version);
    return true;
  } catch (e) {
    return false;
  }
};

const IsDatabaseMigrationRequired = () => {
  if (!db.migrations.required() || useUserStore.getState().appLocked)
    return false;

  presentSheet({
    component: <Migrate />,
    onClose: () => {
      if (!db.migrations.required()) {
        initializeDatabase();
      }
    },
    disableClosing: true
  });
  return true;
};

let timer: NodeJS.Timeout | null = null;
let initialDate = -1;
async function expiringNotesTimer() {
  if (timer != null) clearInterval(timer);

  if (initialDate === -1) {
    DatabaseLogger.info("Deleting expired notes at startup");
    db.notes.deleteExpiredNotes();
    initialDate = dayjs().date();
  }

  timer = setInterval(() => {
    if (dayjs().date() != initialDate) {
      DatabaseLogger.info("Deleting expired notes");
      db.notes.deleteExpiredNotes();
      Navigation.queueRoutesForUpdate();
      useRelationStore.getState().update();
      initialDate = dayjs().date();
    }
  }, 1000 * 60);
}

const initializeDatabase = async (password?: string) => {
  if (useUserStore.getState().appLocked) return;
  if (!db.isInitialized) {
    DatabaseLogger.info("Initializing database");
    try {
      await initDatabase(password);
    } catch (e) {
      DatabaseLogger.error(e as Error);
      ToastManager.error(e as Error, "Error initializing database", "global");
    }
  }

  if (IsDatabaseMigrationRequired()) return;

  if (db.isInitialized) {
    await setAppMessage();
    useSettingStore.getState().setAppLoading(false);
    useSettingStore.getState().refresh();
    Notifications.setupReminders(true);
    DatabaseLogger.info("Database initialized");
    Notifications.restorePinnedNotes();
    expiringNotesTimer();
    deleteDCacheFiles();
  }
};

export const useAppEvents = () => {
  const [isAppLoading, initialUrl] = useSettingStore((state) => [
    state.isAppLoading,
    state.initialUrl
  ]);
  const [appLocked] = useUserStore((state) => [state.appLocked]);
  const refValues = useRef<
    Partial<{
      prevState: AppStateStatus;
      initialUrl: string;
      backupDidWait: boolean;
      attachmentsCachedOfflineMode: boolean;
    }>
  >({});

  const onDataRefresh = useCallback(async () => {
    refreshStores();
  }, []);

  useEffect(() => {
    if (isAppLoading) return;

    // Widgets outlive the app process, so they can be left showing content the app no longer has
    // (most obviously after the user clears app data). Nothing can run at that moment, so the
    // first launch afterwards is the earliest chance to put them right.
    NotePreviewWidget.updateNotes();

    let subscriptions: EventManagerSubscription[] = [];
    const eventManager = db.eventManager;
    subscriptions = [
      eventManager?.subscribe(EVENTS.appRefreshRequested, onDataRefresh)
    ];

    return () => {
      subscriptions.forEach((sub) => sub?.unsubscribe?.());
    };
  }, [isAppLoading, onDataRefresh]);

  useEffect(() => {
    if (initialUrl && !isAppLoading) {
      onAppOpenedFromURL({
        url: initialUrl!,
        isInitialUrl: true
      });
    }
  }, [initialUrl, isAppLoading]);

  const checkAutoBackup = useCallback(async () => {
    const { appLocked } = useUserStore.getState();

    if (appLocked) {
      refValues.current.backupDidWait = true;
      return;
    }
    const user = await db.user.getUser();
    if (user) {
      if (
        SettingsService.get().backupDirectoryAndroid ||
        Platform.OS !== "android"
      ) {
        const partialBackup = await BackupService.checkBackupRequired(
          SettingsService.get().reminder,
          "lastBackupDate"
        );
        const fullBackup = await BackupService.checkBackupRequired(
          SettingsService.get().fullBackupReminder,
          "lastFullBackupDate"
        );

        await sleep(2000);

        // automatic backups cannot prompt, so the password the user chose at
        // setup time is unwrapped here. If encryption is on and there is none,
        // the backup is skipped rather than silently written in the clear.
        const password = SettingsService.get().encryptedBackup
          ? await getBackupPassword()
          : undefined;
        if (SettingsService.get().encryptedBackup && !password) {
          DatabaseLogger.error(
            new Error(
              "Encrypted backups are on but no backup password is stored. Skipping this automatic backup."
            )
          );
          return;
        }

        if (partialBackup) {
          await BackupService.run(false, undefined, "partial", password);
        }

        if (fullBackup) {
          await BackupService.run(false, undefined, "full", password);
        }
      }

      if (
        SettingsService.getProperty("offlineMode") &&
        !refValues.current.attachmentsCachedOfflineMode
      ) {
        refValues.current.attachmentsCachedOfflineMode = true;
        db.attachments.cacheAttachments().catch(() => {
          /* empty */
        });
      }
    }
  }, []);

  /**
   * Used to reconcile the account after a login. There is no account, so all
   * that is left is the bookkeeping the editor and the backups care about.
   */
  const onUserUpdated = useCallback(
    async (isLogin?: boolean) => {
      try {
        await useDragState.getState().init();
      } catch (e) {
        ToastManager.error(e as Error, "Error updating user", "global");
      }

      if (!isLogin) {
        checkAutoBackup();
      }
    },
    [checkAutoBackup]
  );

  useEffect(() => {
    const subscriptions = [
      db.eventManager.subscribe(
        EVENTS.fileDownload,
        onDownloadingAttachmentProgress
      ),
      db.eventManager.subscribe(
        EVENTS.fileDownloaded,
        onDownloadedAttachmentProgress
      ),
      db.eventManager.subscribe(EVENTS.downloadCanceled, (data) => {
        useAttachmentStore.getState().setDownloading(data);
      }),
      db.eventManager.subscribeMulti(
        [EVENTS.vaultAutoLocked, EVENTS.vaultLocked],
        () => {
          setTimeout(() => {
            ToastManager.show({
              message: strings.vaultLocked(),
              type: "info"
            });
          }, 300);
        },
        undefined
      ),
      db.eventManager.subscribe(EVENTS.vaultUnlocked, () => {
        setTimeout(() => {
          ToastManager.show({
            message: strings.vaultUnlocked(),
            type: "info"
          });
        }, 300);
      }),
      EV.subscribe(EVENTS.migrationStarted, (name) => {
        if (name !== "sunshinenotes" || Config.isTesting === "true") return;
        startProgress({
          title: "Migrating Data",
          paragraph: "Please wait while we migrate your data",
          canHideProgress: false,
          fillBackground: true
        });
      }),
      EV.subscribe(EVENTS.migrationFinished, (name) => {
        if (name !== "sunshinenotes" || Config.isTesting === "true") return;
        endProgress();
      }),
      db.eventManager.subscribe(EVENTS.vaultLocked, async () => {
        // Lock all notes in all tabs...
        for (const tab of useTabStore.getState().tabs) {
          const noteId = useTabStore.getState().getTab(tab.id)?.session?.noteId;
          if (!noteId) continue;
          const note = await db.notes.note(noteId);
          const locked = note && (await db.vaults.itemExists(note));
          if (locked) {
            useTabStore.getState().updateTab(tab.id, {
              session: {
                locked: true,
                noteLocked: true
              }
            });
          }
        }
      }),
    ];

    const emitterSubscriptions = [
      Linking.addEventListener("url", onAppOpenedFromURL),

      SodiumEventEmitter.addListener(
        "onSodiumProgress",
        onFileEncryptionProgress
      )
    ];

    return () => {
      emitterSubscriptions.forEach((sub) => sub?.remove?.());
      subscriptions.forEach((sub) => {
        if (Array.isArray(sub)) {
          sub.forEach((s) => s.unsubscribe());
        } else {
          sub?.unsubscribe?.();
        }
      });
    };
  }, [onUserUpdated]);

  useEffect(() => {
    const onAppStateChanged = async (state: AppStateStatus) => {
      if (state === "active") {
        notifee.setBadgeCount(0);
        updateStatusBarColor();
        expiringNotesTimer();
        checkAutoBackup();
        await checkForShareExtensionLaunchedInBackground();
        //@ts-ignore
        globalThis["IS_SHARE_EXTENSION"] = false;

        if (
          SettingsService.getBackgroundEnterTime() + 60 * 1000 * 10 <
          Date.now()
        ) {
          // Reset the editor if the app has been in background for more than 10 minutes.
          eSendEvent(eEditorReset);
        }
      } else {
        if (
          SettingsService.canLockAppInBackground() &&
          !useSettingStore.getState().requestBiometrics &&
          !useUserStore.getState().appLocked &&
          !useUserStore.getState().disableAppLockRequests &&
          !useSettingStore.getState().appDidEnterBackgroundForAction
        ) {
          if (SettingsService.shouldLockAppOnEnterForeground()) {
            DatabaseLogger.log(`AppEvents: Locking app on enter background`);
            useUserStore.getState().lockApp(true);
          }

          if (Platform.OS === "ios") {
            editorController.current?.commands.blur(
              useTabStore.getState().currentTab
            );
            Keyboard.dismiss();
          }
        }
      }
    };

    let sub: NativeEventSubscription;
    if (!isAppLoading && !appLocked) {
      setTimeout(() => {
        sub = AppState.addEventListener("change", onAppStateChanged);
      }, 1000);

    }
    return () => {
      sub?.remove();
    };
  }, [isAppLoading, appLocked, checkAutoBackup]);

  useEffect(() => {
    if (!appLocked && refValues.current.backupDidWait) {
      refValues.current.backupDidWait = false;
      checkAutoBackup();
    }
  }, [appLocked, checkAutoBackup]);

  useEffect(() => {
    if (!isAppLoading) {
      onUserUpdated();
      doAppLoadActions();
    }
  }, [isAppLoading, onUserUpdated]);

  useEffect(() => {
    if (!appLocked && isAppLoading) {
      initializeLogger()
        .catch((e) => {})
        .finally(() => {
          //@ts-ignore
          initializeDatabase();
        });
    }
  }, [appLocked, isAppLoading]);
};
