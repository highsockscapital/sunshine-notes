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

import { getVersion } from "react-native-device-info";

export const IOS_APPGROUPID = "group.org.sunshine.notes";
export const FILE_SIZE_LIMIT = 500 * 1024 * 1024;
export const IMAGE_SIZE_LIMIT = 50 * 1024 * 1024;

export const BETA = getVersion().includes("beta");

export const GROUP = {
  default: "default",
  none: "none",
  abc: "abc",
  year: "year",
  week: "week",
  month: "month"
};

export const SORT = {
  dateModified: "Date modified",
  dateEdited: "Date edited",
  dateCreated: "Date created",
  title: "Title",
  dueDate: "Due date",
  relevance: "Relevance",
  dateDeleted: "Date deleted"
};

export const EDITOR_LINE_HEIGHT = {
  DEFAULT: 1.2,
  MAX: 10,
  MIN: 1
};
