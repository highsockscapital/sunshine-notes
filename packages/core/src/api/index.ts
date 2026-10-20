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

import { Notes } from "../collections/notes.js";
import { Crypto, CryptoAccessor } from "../utils/crypto.js";
import { FileStorage, FileStorageAccessor } from "../database/fs.js";
import { Notebooks } from "../collections/notebooks.js";
import Trash from "../collections/trash.js";
import { Tags } from "../collections/tags.js";
import { Colors } from "../collections/colors.js";
import Vault from "./vault.js";
import Lookup from "./lookup.js";
import { Content } from "../collections/content.js";
import Backup from "../database/backup.js";
import { EVENTS } from "../common.js";
import { LegacySettings } from "../collections/legacy-settings.js";
import Migrations from "./migrations.js";
import UserManager from "./user-manager.js";
import { Attachments } from "../collections/attachments.js";
import { NoteHistory } from "../collections/note-history.js";
import EventManager from "../utils/event-manager.js";
import { logger } from "../logger.js";
import { Shortcuts } from "../collections/shortcuts.js";
import { Reminders } from "../collections/reminders.js";
import { Relations } from "../collections/relations.js";
import {
  CompressorAccessor,
  ConfigStorageAccessor,
  ICompressor,
  IFileStorage,
  IStorage,
  KVStorageAccessor,
  StorageAccessor
} from "../interfaces.js";
import { Attachment } from "../types.js";
import { Settings } from "../collections/settings.js";
import {
  DatabaseAccessor,
  DatabaseSchema,
  RawDatabaseSchema,
  SQLiteOptions,
  changeDatabasePassword,
  createDatabase,
  initializeDatabase
} from "../database/index.js";
import { Kysely, Transaction, sql } from "@streetwriters/kysely";
import { CachedCollection } from "../database/cached-collection.js";
import { Vaults } from "../collections/vaults.js";
import { KVStorage } from "../database/kv.js";
import { QueueValue } from "../utils/queue-value.js";
import { Sanitizer } from "../database/sanitizer.js";
import { createTriggers, dropTriggers } from "../database/triggers.js";
import { NNMigrationProvider } from "../database/migrations.js";
import { ConfigStorage } from "../database/config.js";
import { LazyPromise } from "../utils/lazy-promise.js";
import { Wrapped } from "./wrapped.js";

type Options = {
  sqliteOptions: SQLiteOptions;
  storage: IStorage;
  fs: IFileStorage;
  compressor: () => Promise<ICompressor>;
  maxNoteVersions: () => Promise<number | undefined>;
  batchSize: number;
};

// const DIFFERENCE_THRESHOLD = 20 * 1000;
// const MAX_TIME_ERROR_FAILURES = 5;
class Database {
  isInitialized = false;
  eventManager = new EventManager();
  _fs?: FileStorage;
  _compressor?: Promise<ICompressor>;
  private databaseReady = new LazyPromise<
    Kysely<DatabaseSchema> | Transaction<DatabaseSchema>
  >();

  storage: StorageAccessor = () => {
    if (!this.options?.storage)
      throw new Error(
        "Database not initialized. Did you forget to call db.setup()?"
      );
    return this.options.storage;
  };

  fs: FileStorageAccessor = () => {
    if (!this.options?.fs)
      throw new Error(
        "Database not initialized. Did you forget to call db.setup()?"
      );
    return (
      this._fs ||
      (this._fs = new FileStorage(this.options.fs, this.eventManager))
    );
  };

  crypto: CryptoAccessor = () => {
    if (!this.options)
      throw new Error(
        "Database not initialized. Did you forget to call db.setup()?"
      );
    return new Crypto(this.storage);
  };

  compressor: CompressorAccessor = () => {
    if (!this.options?.compressor)
      throw new Error(
        "Database not initialized. Did you forget to call db.setup()?"
      );
    return this._compressor || (this._compressor = this.options.compressor());
  };

  private _sql?: Kysely<DatabaseSchema>;
  sql: DatabaseAccessor = () => {
    // if (this._transaction) return this._transaction.value;

    if (!this._sql)
      throw new Error(
        "Database not initialized. Did you forget to call db.init()?"
      );
    return this._sql;
  };

  private _kv = new KVStorage(this.databaseReady.promise);
  kv: KVStorageAccessor = () => this._kv;
  private _config: ConfigStorage = new ConfigStorage(
    this.databaseReady.promise
  );
  config: ConfigStorageAccessor = () => this._config;

  private _transaction?: QueueValue<Transaction<DatabaseSchema>>;
  transaction = async (
    executor: (tr: Kysely<DatabaseSchema>) => Promise<void>
  ) => {
    await executor(this.sql());
    // if (this._transaction) {
    //   await executor(this._transaction.use()).finally(() =>
    //     this._transaction?.discard()
    //   );
    //   return;
    // }

    // return this.sql()
    //   .transaction()
    //   .execute(async (tr) => {
    //     this._transaction = new QueueValue(
    //       tr,
    //       () => (this._transaction = undefined)
    //     );
    //     await executor(this._transaction.use());
    //   })
    //   .finally(() => this._transaction?.discard());
  };

  options!: Options;

  user = new UserManager(this);
  vault = new Vault(this);
  lookup = new Lookup(this);
  backup = new Backup(this);
  migrations = new Migrations(this);
  trash = new Trash(this);
  sanitizer = new Sanitizer(this.sql);

  notebooks = new Notebooks(this);
  tags = new Tags(this);
  colors = new Colors(this);
  content = new Content(this);
  attachments = new Attachments(this);
  noteHistory = new NoteHistory(this);
  shortcuts = new Shortcuts(this);
  reminders = new Reminders(this);
  relations = new Relations(this);
  notes = new Notes(this);
  vaults = new Vaults(this);
  settings = new Settings(this);

  wrapped = new Wrapped(this);

  /**
   * @deprecated only kept here for migration purposes
   */
  legacyTags = new CachedCollection(this.storage, "tags");
  /**
   * @deprecated only kept here for migration purposes
   */
  legacyColors = new CachedCollection(this.storage, "colors");
  /**
   * @deprecated only kept here for migration purposes
   */
  legacyNotes = new CachedCollection(this.storage, "notes");
  /**
   * @deprecated only kept here for migration purposes
   */
  legacySettings = new LegacySettings(this);
  // constructor() {
  //   this.sseMutex = new Mutex();
  //   // this.lastHeartbeat = undefined; // { local: 0, server: 0 };
  //   // this.timeErrorFailures = 0;
  // }

  setup(options: Options) {
    this.options = options;
  }

  async reset() {
    await this.storage().clear();

    await dropTriggers(this.sql());
    for (const statement of [
      "PRAGMA writable_schema = 1",
      "DELETE FROM sqlite_master",
      "PRAGMA writable_schema = 0",
      "VACUUM",
      "PRAGMA integrity_check"
    ]) {
      await sql.raw(statement).execute(this.sql());
    }

    await initializeDatabase(
      this.sql().withTables(),
      new NNMigrationProvider(),
      "sunshinenotes"
    );
    await this.onInit(this.sql() as unknown as Kysely<RawDatabaseSchema>);
    await this.initCollections();
    return true;
  }

  async changePassword(password?: string) {
    if (!this._sql) return;
    await changeDatabasePassword(this._sql, password);
  }

  async init() {
    if (!this.options)
      throw new Error(
        "options not specified. Did you forget to call db.setup()?"
      );

    this.eventManager.subscribe(
      EVENTS.attachmentDeleted,
      async (attachment: Attachment) => {
        await this.fs().cancel(attachment.hash);
      }
    );

    this._sql = (await createDatabase<RawDatabaseSchema>("sunshinenotes", {
      ...this.options.sqliteOptions,
      migrationProvider: new NNMigrationProvider(),
      onInit: (db) => this.onInit(db)
    })) as unknown as Kysely<DatabaseSchema>;
    this.databaseReady.resolve(this._sql);

    await this.sanitizer.init();

    await this.initCollections();

    await this.migrations.init();
    this.isInitialized = true;
    if (this.migrations.required()) {
      logger.warn("Database migration is required.");
    }
  }

  private async onInit(db: Kysely<RawDatabaseSchema>) {
    await createTriggers(db);
  }

  async initCollections() {
    await this.legacySettings.init();
    // collections

    await this.settings.init();
    await this.notebooks.init();
    await this.tags.init();
    await this.colors.init();
    await this.content.init();
    await this.attachments.init();
    await this.noteHistory.init();
    await this.shortcuts.init();
    await this.reminders.init();
    await this.relations.init();
    await this.notes.init();
    await this.vaults.init();

    await this.trash.init();

    // legacy collections
    await this.legacyTags.init();
    await this.legacyColors.init();
    await this.legacyNotes.init();

  }

  /**
   * Announcements used to be fetched from the upstream servers, filtered by
   * the user id of the logged in account. There is no server and no account,
   * so there is nothing to fetch and nobody to fetch it for.
   */
  async announcements(): Promise<never[]> {
    return [];
  }
}

export default Database;
