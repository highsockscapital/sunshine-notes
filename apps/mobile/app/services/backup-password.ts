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

import { Cipher } from "@notesnook/crypto";
import { DatabaseLogger, db } from "../common/database";
import { MMKV } from "../common/database/mmkv";

const BACKUP_PASSWORD_CIPHER = "backupPasswordCipher";

/**
 * An encrypted backup has to be restorable on a phone that has never seen this
 * one, so the key cannot be the device-local crypto key. The user picks a
 * password, the backup is encrypted with a key derived from it, and the
 * password itself is what they will need years later.
 *
 * Automatic backups run with no UI and no way to ask, so the password is kept
 * on the device, wrapped by the local master key. Losing the phone means losing
 * the stored copy, which is fine: the exported files are still restorable with
 * the password the user chose.
 */
export async function setBackupPassword(password: string) {
  const masterKey = await db.user.getMasterKey();
  if (!masterKey)
    throw new Error(
      "No local master key available. Cannot store the backup password."
    );

  const cipher = await db.storage().encrypt(masterKey, password);
  MMKV.setMap(BACKUP_PASSWORD_CIPHER, cipher);
}

export async function getBackupPassword(): Promise<string | undefined> {
  const cipher = MMKV.getMap(BACKUP_PASSWORD_CIPHER) as
    | Cipher<"base64">
    | undefined;
  if (!cipher) return;

  try {
    const masterKey = await db.user.getMasterKey();
    if (!masterKey) return;
    return await db.storage().decrypt(masterKey, cipher);
  } catch (e) {
    DatabaseLogger.error(e, "Failed to read the stored backup password");
    return;
  }
}

export function hasBackupPassword() {
  return !!MMKV.getMap(BACKUP_PASSWORD_CIPHER);
}

export function clearBackupPassword() {
  MMKV.removeItem(BACKUP_PASSWORD_CIPHER);
}
