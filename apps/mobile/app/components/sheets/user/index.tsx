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

import { strings } from "@notesnook/intl";
import { useThemeColors } from "@notesnook/theme";
import React from "react";
import { View } from "react-native";
import { useSheetRef } from "react-native-actions-sheet";
import { presentSheet } from "../../../services/event-manager";
import Navigation from "../../../services/navigation";
import { AppFontSize } from "../../../utils/size";
import { DefaultAppStyles } from "../../../utils/styles";
import AppIcon from "../../ui/AppIcon";
import { Pressable } from "../../ui/pressable";
import Paragraph from "../../ui/typography/paragraph";

/**
 * Everything account-shaped used to live here: profile picture, email, last
 * sync, manual sync and logout. There is no account and no sync any more, so
 * what is left is just the way in to the app's own settings.
 */
export const UserSheet = () => {
  const ref = useSheetRef();
  const { colors } = useThemeColors();

  return (
    <View
      style={{
        width: "100%",
        justifyContent: "center"
      }}
    >
      <View>
        {[
          {
            icon: "cog-outline",
            title: strings.settings(),
            onPress: () => {
              ref.current?.hide();
              Navigation.navigate("Settings");
            }
          },
          {
            icon: "information-outline",
            title: strings.about(),
            onPress: async () => {
              Navigation.navigate("Settings");
            }
          }
        ].map((item) => (
          <Pressable
            key={item.title}
            style={{
              paddingVertical: DefaultAppStyles.GAP_VERTICAL,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: DefaultAppStyles.GAP_SMALL,
              borderRadius: 0,
              paddingHorizontal: DefaultAppStyles.GAP
            }}
            onPress={() => {
              item.onPress();
            }}
          >
            <AppIcon
              color={colors.secondary.icon}
              name={item.icon}
              size={AppFontSize.xl}
            />
            <Paragraph>{item.title}</Paragraph>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

UserSheet.present = () => {
  presentSheet({
    component: <UserSheet />
  });
};
