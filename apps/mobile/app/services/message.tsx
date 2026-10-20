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
import React from "react";
import { strings } from "@notesnook/intl";
import { Message, useMessageStore } from "../stores/use-message-store";
import { presentSheet } from "./event-manager";
import { Update } from "../components/sheets/update";
import { GithubVersionInfo } from "../utils/github-version";

export function clearMessage() {
  useMessageStore.getState().setMessage({
    ...useMessageStore.getState().message,
    visible: false
  });
}

const updateAvailableMessage = (
  version: GithubVersionInfo
) =>
  ({
    visible: true,
    message: strings.newUpdateMessage(),
    actionText: strings.newUpdateActionText(),
    onPress: () => {
      presentSheet({
        component: (ref) => <Update version={version} fwdRef={ref} />
      });
    },
    data: {},
    icon: "update",
    type: "normal",
    id: "app-update"
  }) as Message;

export function setUpdateAvailableMessage(
  version: GithubVersionInfo
) {
  useMessageStore.getState().setMessage(updateAvailableMessage(version));
}
