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

/**
 * Offline personal build: there is no account, no subscription and no paywall,
 * so every feature is always allowed. The plan/limit table that used to live in
 * this file (34 features x free/essential/pro/believer/legacyPro) is gone.
 *
 * The public API is deliberately unchanged so the ~35 call sites across the app
 * keep compiling; their `if (!result.isAllowed)` branches simply never fire.
 */

export type FeatureId =
  | "fileSize"
  | "fullQualityImages"
  | "blockLinking"
  | "taskList"
  | "outlineList"
  | "callout"
  | "colors"
  | "tags"
  | "notebooks"
  | "activeReminders"
  | "shortcuts"
  | "defaultNotebookAndTag"
  | "recurringReminders"
  | "pinNoteInNotification"
  | "createNoteFromNotificationDrawer"
  | "defaultSidebarTab"
  | "customHomepage"
  | "markdownShortcuts"
  | "fontLigatures"
  | "customToolbarPreset"
  | "customizableSidebar"
  | "disableTrashCleanup"
  | "appLock"
  | "maxNoteVersions"
  | "androidLauncherShortcuts"
  | "expiringNotes"
  | "exportTableAsCsv"
  | "importCsvToTable";

type CaptionValue = string | number | boolean;

export type Feature<TId extends FeatureId = FeatureId> = {
  id: TId;
  title: string;
};

export type Limit = {
  caption: CaptionValue;
  isAllowed: (value?: number) => boolean;
};

export type FeatureResult<TId extends FeatureId = FeatureId> = {
  id: TId;
  isAllowed: boolean;
  availableOn: undefined;
  caption: CaptionValue;
  error: string;
};

const TITLES: Record<FeatureId, string> = {
  fileSize: "Maximum file size",
  fullQualityImages: "Full quality images",
  blockLinking: "Block-level note links",
  taskList: "Task list",
  outlineList: "Outline list",
  callout: "Callouts",
  colors: "Colors",
  tags: "Tags",
  notebooks: "Notebooks",
  activeReminders: "Active reminders",
  shortcuts: "Shortcuts",
  defaultNotebookAndTag: "Default notebook & tag",
  recurringReminders: "Recurring reminders",
  pinNoteInNotification: "Pin note in notification",
  createNoteFromNotificationDrawer: "Create note from notification drawer",
  defaultSidebarTab: "Default sidebar tab",
  customHomepage: "Custom homepage",
  markdownShortcuts: "Markdown shortcuts",
  fontLigatures: "Font ligatures",
  customToolbarPreset: "Custom toolbar preset",
  customizableSidebar: "Customizable sidebar",
  disableTrashCleanup: "Disable trash cleanup",
  appLock: "App lock",
  maxNoteVersions: "Maximum note versions",
  androidLauncherShortcuts: "Android Launcher Shortcuts",
  expiringNotes: "Expiring notes",
  exportTableAsCsv: "Export table as CSV",
  importCsvToTable: "Import CSV to table",
};

// Note history is the one place a number still matters: it caps how many
// versions of a note we retain. Upstream gated this behind the paid plans and
// gave them "infinity". 1000 is our number, change it freely.
const LIMITS: Partial<Record<FeatureId, number>> = {
  maxNoteVersions: 1000
};

export function getFeature<TId extends FeatureId>(id: TId): Feature<TId> {
  return { id, title: TITLES[id] } as Feature<TId>;
}

export async function getFeatureLimit<TId extends FeatureId>(
  feature: Feature<TId>
): Promise<Limit> {
  return {
    caption: LIMITS[feature.id] ?? "unlimited",
    isAllowed: () => true
  };
}

// `value` is ignored here (no per-plan caps anymore) but is kept so existing
// call sites like isFeatureAvailable("fileSize", file.size) keep compiling.
export async function isFeatureAvailable<TId extends FeatureId>(
  id: TId,
  _value?: number
): Promise<FeatureResult<TId>> {
  return {
    id,
    isAllowed: true,
    availableOn: undefined,
    caption: LIMITS[id] ?? "unlimited",
    error: ""
  };
}

export async function areFeaturesAvailable<TIds extends FeatureId[]>(
  ids: TIds
): Promise<{ [K in TIds[number]]: FeatureResult<K> }> {
  const results = {} as { [K in TIds[number]]: FeatureResult<K> };
  for (const id of ids) {
    results[id as TIds[number]] = {
      id: id as TIds[number],
      isAllowed: true,
      availableOn: undefined,
      caption: LIMITS[id] ?? "unlimited",
      error: ""
    };
  }
  return results;
}
