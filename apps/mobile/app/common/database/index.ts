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
import { database } from "@notesnook/common";
import { logger as dbLogger, ICompressor } from "@notesnook/core";
import { strings } from "@notesnook/intl";
import {
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler
} from "@streetwriters/kysely";
import { Platform } from "react-native";
import * as Gzip from "react-native-gzip";
import { FileStorage } from "../filesystem";
import { getDatabaseKey, NOTESNOOK_DB_KEY_SALT } from "./encryption";
import "./logger";
import { RNSqliteDriver } from "./sqlite.kysely";
import { Storage } from "./storage";

// How many versions of a note the history keeps. There is no plan to look
// this up any more, it is simply a number this build uses.
const MAX_NOTE_VERSIONS = 1000;

export async function setupDatabase(password?: string) {
  const key = await getDatabaseKey(password);
  if (!key) throw new Error(strings.databaseSetupFailed());

  database.setup({
    storage: Storage,
    fs: FileStorage,
    compressor: async () =>
      ({
        compress: Gzip.deflate,
        decompress: Gzip.inflate
      }) as ICompressor,
    batchSize: 50,
    sqliteOptions: {
      dialect: (name) => ({
        createDriver: () => {
          return new RNSqliteDriver({ async: true, dbName: name });
        },
        createAdapter: () => new SqliteAdapter(),
        createIntrospector: (db) => new SqliteIntrospector(db),
        createQueryCompiler: () => new SqliteQueryCompiler()
      }),
      tempStore: "memory",
      journalMode: Platform.OS === "ios" ? "DELETE" : "WAL",
      password: key
    },
    // There is no plan to look up any more, so the note history limit is
    // just a number this build happens to use. Change it freely.
    maxNoteVersions: async () => MAX_NOTE_VERSIONS
  });
}

/**
 * Opens the database and makes sure the device-local user exists.
 *
 * The local user has to be created *after* `db.init()`, because the record
 * lives in the key/value table and that table does not exist until the
 * database is open. Creating it before the init would wait forever for a
 * database that is not open yet.
 */
export async function initDatabase(password?: string) {
  await setupDatabase(password);
  await database.init();

  // There are no accounts in this build, but the local key hierarchy hangs off
  // a user record: the master key comes from the user salt and the attachments
  // key is wrapped against the master key. Without a record, adding an
  // attachment or writing an encrypted backup throws. So create exactly one
  // synthetic, device-local user. It has no password, no token and never
  // leaves this phone.
  await database.user.createLocalUser(NOTESNOOK_DB_KEY_SALT);
}

export const db = database;
let DatabaseLogger = dbLogger.scope(Platform.OS);

const setLogger = () => {
  DatabaseLogger = dbLogger.scope(Platform.OS);
};

export { DatabaseLogger, setLogger };
