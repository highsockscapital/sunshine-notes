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

import Clipboard from "@react-native-clipboard/clipboard";
import { useThemeColors } from "@notesnook/theme";
import React, { useRef } from "react";
import { Platform, TextInput, View } from "react-native";
import { getVersion, getModel, getBrand, getSystemVersion } from "react-native-device-info";
import { useStoredRef } from "../../../hooks/use-stored-ref";
import { ToastManager } from "../../../services/event-manager";
import { defaultBorderRadius, AppFontSize } from "../../../utils/size/index";
import DialogHeader from "../../dialog/dialog-header";
import { Button } from "../../ui/button";
import Seperator from "../../ui/seperator";
import Paragraph from "../../ui/typography/paragraph";
import { strings } from "@notesnook/intl";
import { DefaultAppStyles } from "../../../utils/styles";
import Config from "react-native-config";

export const Issue = ({
  defaultTitle,
  defaultBody,
  issueTitle
}: {
  defaultTitle?: string;
  defaultBody?: string;
  issueTitle?: string;
}) => {
  const { colors } = useThemeColors();
  const body = useStoredRef("issueBody", "");
  const title = useStoredRef("issueTitle", defaultTitle);
  const bodyRef = useRef<TextInput>(null);
  const initialLayout = useRef(false);

  const onPress = async () => {
    if (!title.current || !body.current) return;
    if (title.current?.trim() === "" || body.current?.trim().length === 0)
      return;

    try {
      /**
       * There is no bug tracker behind this build, so the report is not sent
       * anywhere. It is assembled locally and put on the clipboard, which is
       * exactly as useful for a personal build and keeps the notes on the
       * device.
       */
      const report =
        title.current +
        `\n_______________\n` +
        body.current +
        `\n${defaultBody || ""}` +
        `\n_______________
**Device information:**
App version: ${getVersion()}
Platform: ${Platform.OS}
Device: ${getBrand() || ""}-${getModel() || ""}-${getSystemVersion() || ""}
Github Release: ${Config.GITHUB_RELEASE === "true" ? "Yes" : "No"}`;

      await Clipboard.setString(report);
      body.reset();
      title.reset();
      ToastManager.show({
        heading: strings.issueReportCopied(),
        type: "success",
        icon: "content-copy"
      });
    } catch (e) {
      ToastManager.show({
        heading: (e as Error).message,
        type: "error"
      });
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: DefaultAppStyles.GAP,
        width: "100%"
      }}
    >
      <>
        <DialogHeader
          title={issueTitle || strings.issueTitle()}
          paragraph={issueTitle ? strings.issueDesc() : strings.issueDesc2()}
        />

        <Seperator half />

        <TextInput
          placeholder={strings.title()}
          onChangeText={(v) => (title.current = v)}
          defaultValue={title.current}
          style={{
            borderWidth: 1,
            borderColor: colors.primary.border,
            borderRadius: defaultBorderRadius,
            padding: DefaultAppStyles.GAP,
            fontFamily: "Inter-Regular",
            marginBottom: DefaultAppStyles.GAP_VERTICAL,
            fontSize: AppFontSize.md,
            color: colors.primary.heading
          }}
          placeholderTextColor={colors.primary.placeholder}
        />

        <TextInput
          ref={bodyRef}
          multiline
          placeholder={strings.issuePlaceholder()}
          numberOfLines={5}
          textAlignVertical="top"
          onChangeText={(v) => (body.current = v)}
          onLayout={() => {
            if (initialLayout.current) return;
            initialLayout.current = true;
            if (body.current) {
              bodyRef.current?.setNativeProps({
                text: body.current,
                selection: {
                  start: 0,
                  end: 0
                }
              });
            }
          }}
          style={{
            borderWidth: 1,
            borderColor: colors.primary.border,
            borderRadius: defaultBorderRadius,
            padding: DefaultAppStyles.GAP,
            fontFamily: "Inter-Regular",
            maxHeight: 200,
            fontSize: AppFontSize.sm,
            marginBottom: 2.5,
            color: colors.primary.paragraph
          }}
          placeholderTextColor={colors.primary.placeholder}
        />
        <Paragraph
          size={AppFontSize.xs}
          color={colors.secondary.paragraph}
        >{`App version: ${getVersion()} Platform: ${
          Platform.OS
        } Model: ${getBrand()}-${getModel()}-${getSystemVersion()}`}</Paragraph>

        <Seperator />
        <Button
          onPress={onPress}
          title={strings.submit()}
          width="100%"
          type="accent"
        />

        <Paragraph
          color={colors.secondary.paragraph}
          size={AppFontSize.xs}
          style={{
            marginTop: DefaultAppStyles.GAP_VERTICAL,
            textAlign: "center"
          }}
        >
          {strings.issueLocalNotice()}
        </Paragraph>
      </>
    </View>
  );
};
