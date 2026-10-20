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

import { useThemeColors } from "@notesnook/theme";
import React from "react";
import { AnnouncementDialog } from "../announcements";
import { Dialog } from "../dialog";
import { AppLockPassword } from "../dialogs/applock-password";
import JumpToSectionDialog from "../dialogs/jump-to-section";
import { LoadingDialog } from "../dialogs/loading";
import PDFPreview from "../dialogs/pdf-preview";
import { VaultDialog } from "../dialogs/vault";
import ImagePreview from "../image-preview";
import SheetProvider from "../sheet-provider";
import Progress from "../dialogs/progress";
import { useSettingStore } from "../../stores/use-setting-store";

const DialogProvider = () => {
  const { colors } = useThemeColors();
  const isAppLoading = useSettingStore((state) => state.isAppLoading);

  return (
    <>
      <AppLockPassword />
      <LoadingDialog />
      <SheetProvider />
      <Dialog context="global" />
      <Progress />

      {isAppLoading ? null : (
        <>
          <VaultDialog colors={colors} />
          <ImagePreview />
          <AnnouncementDialog />
          <PDFPreview />
          <JumpToSectionDialog />
        </>
      )}
    </>
  );
};

export default React.memo(DialogProvider, () => true);
