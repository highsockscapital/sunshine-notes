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
  SubscriptionPlan,
  SubscriptionProvider,
  SubscriptionStatus,
  User
} from "../types.js";
import Database from "./index.js";
import { SerializedKeyPair, SerializedKey, Cipher } from "@notesnook/crypto";
import { logger } from "../logger.js";
import {
  KeyId,
  KeyManager,
  KeyTypeFromId,
  UnwrapKeyReturnType
} from "./key-manager.js";

/**
 * Version of the key that encrypts a piece of data. The DEK (version 1) is
 * what this build uses, the legacy key (version 0) is kept around so old
 * data can still be read.
 */
export const KEY_VERSION = {
  LEGACY: 0,
  DEK: 1
} as const;

export type KeyVersion = (typeof KEY_VERSION)[keyof typeof KEY_VERSION];

/**
 * Id of the synthetic, device-local user. Never leaves the device.
 */
export const LOCAL_USER_ID = "local";

class UserManager {
  private keyManager: KeyManager;
  constructor(private readonly db: Database) {
    this.keyManager = new KeyManager(db);
    // There is no session to expire in this build: no account means no
    // token, so there is nothing to refresh and nothing to log out of. The
    // userUnauthorized handler of the upstream build is deliberately absent.
  }

  async init() {
    // Nothing to do. The local user is created by the app once the database
    // is open, see createLocalUser.
  }

  setUser(user: User) {
    return this.db.kv().write("user", user);
  }

  getUser() {
    return this.db.kv().read("user");
  }

  /**
   * Creates the single synthetic user this build runs on. It is not an
   * account: it has no password, no token and no server behind it. It exists
   * so the local key hierarchy has a record to hang the master key, the
   * attachments key and encrypted backups from.
   *
   * The `salt` must match the salt the crypto key was derived with, otherwise
   * keys that get re-derived later would not agree with the ones already on
   * disk.
   */
  async createLocalUser(salt: string): Promise<User> {
    const existing = await this.getUser();
    if (existing) return existing;
    if (!salt) throw new Error("A salt is required to create a local user.");

    const user: User = {
      id: LOCAL_USER_ID,
      email: `${LOCAL_USER_ID}@localhost`,
      isEmailConfirmed: true,
      isLocal: true,
      salt,
      mfa: {
        isEnabled: false,
        primaryMethod: "app",
        remainingValidCodes: 0
      },
      subscription: {
        appId: 0,
        cancelURL: null,
        expiry: 0,
        productId: null,
        provider: SubscriptionProvider.GOOGLE,
        start: 0,
        plan: SubscriptionPlan.FREE,
        status: SubscriptionStatus.ACTIVE,
        updateURL: null,
        googlePurchaseToken: null
      }
    };
    await this.setUser(user);
    return user;
  }

  /**
   * @deprecated
   */
  getLegacyUser() {
    return this.db.storage().read<User>("user");
  }

  private async updateUser(partial: Partial<User>) {
    const user = await this.getUser();
    if (!user) return;

    // The user record only ever exists on this device, so the record is the
    // source of truth. There is nothing to PATCH.
    await this.setUser({ ...user, ...partial });
  }

  async fetchUser(): Promise<User | undefined> {
    // There is no server to fetch the user from. The record on disk is the
    // only user this build knows about.
    return this.getUser();
  }

  async getDataEncryptionKeys(): Promise<
    { version: KeyVersion; key: SerializedKey }[] | undefined
  > {
    const masterKey = await this.getMasterKey();
    logger.info("master key exists: ", { masterKey: !!masterKey });
    if (!masterKey) return;

    const dataEncryptionKey = await this.keyManager.get("dataEncryptionKey", {
      refetchUser: false
    });
    logger.info("DEK exists: ", { dataEncryptionKey: !!dataEncryptionKey });
    if (!dataEncryptionKey)
      return [
        {
          key: masterKey,
          version: KEY_VERSION.LEGACY
        }
      ];
    const keys: { version: KeyVersion; key: SerializedKey }[] = [];

    const legacyDataEncryptionKey = await this.keyManager.get(
      "legacyDataEncryptionKey",
      {
        refetchUser: false
      }
    );
    logger.info("legacy DEK exists: ", {
      legacyDataEncryptionKey: !!legacyDataEncryptionKey
    });
    if (legacyDataEncryptionKey)
      keys.push({
        key: await this.keyManager.unwrapKey(
          legacyDataEncryptionKey,
          masterKey
        ),
        version: KEY_VERSION.LEGACY
      });
    keys.push({
      key: await this.keyManager.unwrapKey(dataEncryptionKey, masterKey),
      version: KEY_VERSION.DEK
    });
    logger.info("Keys:", {
      keys: keys.length,
      keyVersions: keys.map((k) => k.version)
    });
    return keys;
  }

  async getMasterKey(): Promise<SerializedKey | undefined> {
    const user = await this.getUser();
    if (!user) return;
    const key = await this.db.storage().getCryptoKey();
    if (!key) return;
    return { key, salt: user.salt };
  }

  /**
   * @deprecated
   */
  async getLegacyEncryptionKey(): Promise<SerializedKey | undefined> {
    const user = await this.getLegacyUser();
    if (!user) return;
    const key = await this.db.storage().getCryptoKey();
    if (!key) return;
    return { key, salt: user.salt };
  }

  private async getUserKey<TId extends KeyId>(
    id: TId,
    config: {
      generateKey: () => Promise<SerializedKey | SerializedKeyPair>;
      errorContext: string;
    }
  ): Promise<UnwrapKeyReturnType<KeyTypeFromId<TId>> | undefined> {
    try {
      const masterKey = await this.getMasterKey();
      if (!masterKey) return;

      const wrappedKey = await this.keyManager.get(id);

      if (!wrappedKey) {
        const key = await config.generateKey();
        await this.updateUser({
          [id]: await this.keyManager.wrapKey(key, masterKey)
        });
        return key as UnwrapKeyReturnType<KeyTypeFromId<TId>>;
      }

      return (await this.keyManager.unwrapKey(
        wrappedKey,
        masterKey
      )) as UnwrapKeyReturnType<KeyTypeFromId<TId>>;
    } catch (e) {
      logger.error(e, `Could not get ${config.errorContext}.`);
      if (e instanceof Error)
        throw new Error(
          `Could not get ${config.errorContext}. Error: ${e.message}`
        );
    }
  }

  async getAttachmentsKey() {
    return this.getUserKey("attachmentsKey", {
      generateKey: () => this.db.crypto().generateRandomKey(),
      errorContext: "attachments encryption key"
    });
  }

  async verifyEncryptionKey(key: SerializedKey) {
    const user = await this.getUser();
    if (!user) throw new Error("User not found.");

    const verifiers = [
      user.attachmentsKey,
      user.legacyDataEncryptionKey,
      user.dataEncryptionKey
    ].filter((v): v is Cipher<"base64"> => !!v);

    if (verifiers.length === 0) {
      // The local user has no remote verifier to fetch. Its keys are the
      // only ones that exist, so there is nothing left to verify against.
      return;
    }

    for (const verifier of verifiers) {
      const decryptedData = await this.db
        .storage()
        .decrypt(key, verifier)
        .then(() => true)
        .catch(() => false);
      if (!decryptedData)
        throw new Error(
          "Your data cannot be decrypted using the provided encryption key."
        );
    }
  }

}

export default UserManager;
