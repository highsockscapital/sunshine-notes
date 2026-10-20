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

import { Platform } from "react-native";
import RNFetchBlob from "react-native-blob-util";
import * as ScopedStorage from "react-native-scoped-storage";
import { db } from "../database";

export const ABYTES = 17;
export const cacheDirOld = RNFetchBlob.fs.dirs.CacheDir;

export const cacheDir =
  Platform.OS == "ios"
    ? RNFetchBlob.fs.dirs.LibraryDir + "/.cache"
    : RNFetchBlob.fs.dirs.DocumentDir + "/.cache";

export function getRandomId(prefix: string) {
  return Math.random()
    .toString(36)
    .replace("0.", prefix || "");
}

export function copyFileAsync(source: string, dest: string) {
  return new Promise((resolve, reject) => {
    //@ts-ignore
    ScopedStorage.copyFile(source, dest, (e: any, r: any) => {
      if (e) {
        reject(e);
        return;
      }
      resolve(true);
    });
  });
}

export async function releasePermissions(path: string) {
  if (Platform.OS === "ios") return;
  const uris = await ScopedStorage.getPersistedUriPermissions();
  for (const uri of uris) {
    if (path.startsWith(uri)) {
      await ScopedStorage.releasePersistableUriPermission(uri);
    }
  }
}

export const FileSizeResult = {
  Empty: 0,
  Error: -1
};

/**
 * Every file lives on this device, so the size of an attachment is the size
 * of the record that describes it.
 */
export async function getUploadedFileSize(hash: string): Promise<number> {
  const attachment = await db.attachments.attachment(hash);
  if (!attachment) return FileSizeResult.Empty;
  return attachment.size;
}

export async function requestPermission() {
  if (Platform.OS === "ios") return true;
  return true;
}
export async function checkAndCreateDir(path: string) {
  const dir =
    Platform.OS === "ios"
      ? RNFetchBlob.fs.dirs.DocumentDir + path
      : RNFetchBlob.fs.dirs.SDCardDir + "/Sunshine Notes/" + path;

  try {
    const exists = await RNFetchBlob.fs.exists(dir);
    const isDir = await RNFetchBlob.fs.isDir(dir);
    if (!exists || !isDir) {
      await RNFetchBlob.fs.mkdir(dir);
    }
  } catch (e) {
    await RNFetchBlob.fs.mkdir(dir);
  }
  return dir;
}

export const santizeUri = (uri: string) => {
  const decoded = decodeURI(uri);
  return Platform.OS === "ios" ? decoded.replace("file:///", "/") : decoded;
};

