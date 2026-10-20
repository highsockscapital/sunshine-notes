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

import EventManager from "./utils/event-manager.js";

export const EV = new EventManager();

export function sendMigrationProgressEvent(
  eventManager: EventManager,
  collection: string,
  total: number,
  current?: number
) {
  eventManager.publish(EVENTS.migrationProgress, {
    collection,
    total,
    current: current === undefined ? total : current
  });
}

export const CLIENT_ID = "sunshinenotes";

export const EVENTS = {
  databaseUpdated: "db:updated",
  databaseCollectionInitiated: "db:collectionInitiated",
  appRefreshRequested: "app:refreshRequested",
  migrationProgress: "migration:progress",
  migrationStarted: "migration:start",
  migrationFinished: "migration:finished",
  noteRemoved: "note:removed",
  userUnauthorized: "user:unauthorized",
  downloadCanceled: "file:downloadCanceled",
  uploadCanceled: "file:uploadCanceled",
  fileDownload: "file:download",
  fileUpload: "file:upload",
  fileDownloaded: "file:downloaded",
  fileUploaded: "file:uploaded",
  attachmentDeleted: "attachment:deleted",
  mediaAttachmentDownloaded: "attachments:mediaDownloaded",
  vaultLocked: "vault:locked",
  vaultUnlocked: "vault:unlocked",
  systemTimeInvalid: "system:invalidTime",
  vaultAutoLocked: "vault:autoLocked"
};

const separators = ["-", "/", "."];
const DD = "DD";
const MM = "MM";
const YYYY = "YYYY";
export const DATE_FORMATS = [
  ...[
    [DD, MM, YYYY],
    [MM, DD, YYYY],
    [YYYY, MM, DD]
  ]
    .map((item) => separators.map((sep) => item.join(sep)))
    .flat(),
  "MMM D, YYYY"
];

export const TIME_FORMATS = ["12-hour", "24-hour"];

export const CURRENT_DATABASE_VERSION = 6.1;

export const FREE_NOTEBOOKS_LIMIT = 20;
