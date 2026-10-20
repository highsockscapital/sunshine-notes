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
import { Image, View } from "react-native";
import { AppFontSize } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";
import { UserSheet } from "../sheets/user";
import AppIcon from "../ui/AppIcon";
import { IconButton, IconButtonProps } from "../ui/icon-button";
import { Pressable } from "../ui/pressable";
import Heading from "../ui/typography/heading";
import { useSideBarDraggingStore } from "./dragging-store";

/**
 * The paper the logo is painted on. The artwork is a line drawing on cream
 * paper, so the app shows it on the very same paper.
 */
const LOGO_PAPER = "#F6F3E7";
const LOGO_SIZE = 34;
const LOGO = require("../../assets/logo/sunshine-notes-logo.png");

const SettingsIcon = () => {
  const { colors } = useThemeColors();

  return (
    <Pressable
      onPress={() => {
        if (useSideBarDraggingStore.getState().dragging) return;
        UserSheet.present();
      }}
      testID="sidemenu-settings-icon"
      style={{
        width: 40,
        height: 40
      }}
    >
      {/* There is no account, so there is no profile picture to show. */}
      <AppIcon
        name="cog-outline"
        color={colors.primary.icon}
        size={AppFontSize.lg}
      />
    </Pressable>
  );
};

export const SideMenuHeader = (props: { rightButtons?: IconButtonProps[] }) => {
  const { colors, isDark } = useThemeColors();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: colors.primary.border,
        paddingBottom: DefaultAppStyles.GAP,
        paddingHorizontal: DefaultAppStyles.GAP
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: DefaultAppStyles.GAP_SMALL,
          alignItems: "center"
        }}
      >
        <View
          style={{
            backgroundColor: LOGO_PAPER,
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            borderRadius: 10,
            overflow: "hidden"
          }}
        >
          <Image
            source={LOGO}
            style={{
              width: LOGO_SIZE,
              height: LOGO_SIZE
            }}
            resizeMode="cover"
          />
        </View>

        <Heading size={AppFontSize.lg}>Sunshine Notes</Heading>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: DefaultAppStyles.GAP_SMALL
        }}
      >
        {props.rightButtons?.map((button, index) => (
          <IconButton
            key={index}
            {...button}
            style={{
              width: 28,
              height: 28
            }}
            color={colors.primary.icon}
            size={AppFontSize.lg}
          />
        ))}
        <SettingsIcon />
      </View>
    </View>
  );
};
