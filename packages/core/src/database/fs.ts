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

import {
  FileEncryptionMetadataWithOutputType,
  IFileStorage
} from "../interfaces.js";
import { DataFormat, SerializedKey } from "@notesnook/crypto";
import { EVENTS } from "../common.js";
import { logger } from "../logger.js";
import EventManager from "../utils/event-manager.js";

export type FileStorageAccessor = () => FileStorage;
export type DownloadableFile = {
  filename: string;
  chunkSize: number;
};
export type QueueItem = DownloadableFile & {
  cancel?: (reason?: string) => Promise<void>;
  operation?: Promise<boolean>;
};

export class FileStorage {
  id = Date.now();
  downloads = new Map<string, QueueItem>();
  uploads = new Map<string, QueueItem>();
  groups = {
    downloads: new Map<string, Set<string>>(),
    uploads: new Map<string, Set<string>>()
  };

  constructor(
    private readonly fs: IFileStorage,
    private readonly eventManager: EventManager
  ) {}

  /**
   * Files are only ever on this device, so "downloading" them means checking
   * that the local copy is there. There is no server to fetch them from.
   */
  async queueDownloads(
    files: DownloadableFile[],
    groupId: string,
    eventData?: Record<string, unknown>
  ) {
    try {
      let current = 0;
      const total = files.length;

      if (this.groups.downloads.has(groupId)) {
        logger.debug("[queueDownloads] group already exists", {
          groupId
        });
        return this.groups.downloads.get(groupId);
      }

      const group = new Set<string>();

      files.forEach((f) => group.add(f.filename));
      this.groups.downloads.set(groupId, group);

      for (const file of files as QueueItem[]) {
        current++;
        if (!group.has(file.filename)) continue;

        this.eventManager.publish(EVENTS.fileDownload, {
          total,
          current,
          groupId,
          filename: file.filename
        });

        const exists = await this.exists(file.filename);
        this.eventManager.publish(EVENTS.fileDownloaded, {
          success: exists,
          total,
          current,
          groupId,
          filename: file.filename,
          eventData
        });
      }
    } finally {
      this.groups.downloads.delete(groupId);
    }
  }

  /**
   * Uploading is a server-only operation. Files stay on this device, so
   * there is nothing to upload and nothing to report.
   */
  async queueUploads(files: DownloadableFile[], groupId: string) {
    logger.debug("[queueUploads] ignored, this build never uploads", {
      groupId,
      total: files.length
    });
    return undefined;
  }

  async cancel(groupId: string) {
    const queues = [
      {
        type: "download",
        ids: this.groups.downloads.get(groupId),
        files: this.downloads
      },
      {
        type: "upload",
        ids: this.groups.uploads.get(groupId),
        files: this.uploads
      }
    ].filter((a) => !!a.ids);

    for (const queue of queues) {
      if (!queue.ids) continue;

      for (const filename of queue.ids) {
        const file = queue.files.get(filename);
        if (file?.cancel) await file.cancel("Operation canceled.");
        queue.ids.delete(filename);
      }

      if (queue.type === "download") {
        this.groups.downloads.delete(groupId);
        this.eventManager.publish(EVENTS.downloadCanceled, {
          groupId,
          canceled: true
        });
      } else if (queue.type === "upload") {
        this.groups.uploads.delete(groupId);
        this.eventManager.publish(EVENTS.uploadCanceled, {
          groupId,
          canceled: true
        });
      }
    }
  }

  readEncrypted<TOutputFormat extends DataFormat>(
    filename: string,
    encryptionKey: SerializedKey,
    cipherData: FileEncryptionMetadataWithOutputType<TOutputFormat>
  ) {
    return this.fs.readEncrypted(filename, encryptionKey, cipherData);
  }

  writeEncryptedBase64(
    data: string,
    encryptionKey: SerializedKey,
    mimeType: string
  ) {
    return this.fs.writeEncryptedBase64(data, encryptionKey, mimeType);
  }

  async deleteFile(filename: string, localOnly = false) {
    // Files only ever exist on this device, so deleting the local copy is
    // the whole of it. The flag is kept because callers still pass it.
    logger.debug("[deleteFile] deleting local file", { filename, localOnly });
    return await this.fs.deleteFile(filename);
  }

  async bulkDeleteFiles(filenames: string[], localOnly = false) {
    if (filenames.length === 0) return true;

    logger.debug("[bulkDeleteFiles] deleting local files", {
      total: filenames.length,
      localOnly
    });
    return await this.fs.bulkDeleteFiles(filenames);
  }

  exists(filename: string) {
    return this.fs.exists(filename);
  }

  /**
   * There is nothing to download, the file either is on this device or it
   * does not exist anywhere.
   */
  async downloadFile(groupId: string, filename: string, chunkSize: number) {
    logger.debug("[downloadFile] checking local file", { filename, groupId });
    return await this.exists(filename);
  }

  clear() {
    return this.fs.clearFileStorage();
  }

  hashBase64(data: string) {
    return this.fs.hashBase64(data);
  }

  getUploadedFileSize(filename: string) {
    return this.fs.getUploadedFileSize(filename);
  }
}
