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

import { db } from "../database";
import { exists } from "./io";

/**
 * There is no server copy of an attachment anymore, so the only thing worth
 * checking is whether the encrypted file is still on this device and intact.
 */
export async function checkAttachment(hash: string) {
  const attachment = await db.attachments.attachment(hash);
  if (!attachment) return { failed: "Attachment not found." };

  try {
    if (await exists(hash)) return { success: true };

    return {
      failed: `This file is missing from this device. Please add it again from the attachment manager. (File hash: ${hash})`
    };
  } catch (e) {
    return { failed: (e as Error)?.message };
  }
}
