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
import { LegendList } from "@legendapp/list";
import { strings } from "@notesnook/intl";
import {
  PreviewColors,
  ThemeDefinition,
  getPreviewColors,
  useThemeColors,
  validateTheme
} from "@notesnook/theme";
import { keepLocalCopy, pick } from "@react-native-documents/picker";
import React from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DatabaseLogger, db } from "../../common/database";
import { santizeUri } from "../../common/filesystem/utils";
import SheetProvider from "../../components/sheet-provider";
import { Button } from "../../components/ui/button";
import { IconButton } from "../../components/ui/icon-button";
import { Pressable } from "../../components/ui/pressable";
import Heading from "../../components/ui/typography/heading";
import Paragraph from "../../components/ui/typography/paragraph";
import { ToastManager, presentSheet } from "../../services/event-manager";
import { useThemeStore } from "../../stores/use-theme-store";
import { getColorLinearShade } from "../../utils/colors";
import { getElevationStyle } from "../../utils/elevation";
import { MenuItemsList } from "../../utils/menu-items";
import { AppFontSize, defaultBorderRadius } from "../../utils/size";
import { DefaultAppStyles } from "../../utils/styles";
import Clipboard from "@react-native-clipboard/clipboard";

// Local copies of the theme-catalogue types. They used to live in the deleted
// @notesnook/themes-server package; offline there is no catalogue any more, but
// the shapes are still what the selector and theme setter work with.
type CompiledThemeDefinition = ThemeDefinition & {
  sourceURL?: string;
  totalInstalls?: number;
  previewColors: PreviewColors;
};

type ThemeMetadata = Omit<
  CompiledThemeDefinition,
  "scopes" | "codeBlockCSS"
>;

function ThemeSelector() {
  const [darkTheme, lightTheme] = useThemeStore((state) => [
    state.darkTheme,
    state.lightTheme
  ]);

  const { colors } = useThemeColors();
  const themeColors = colors;
  const select = (item: Partial<ThemeMetadata>, fromFile?: boolean) => {
    presentSheet({
      context: "theme-details",
      component: (ref, close) => (
        <ThemeSetter close={close} theme={item} fromFile={fromFile} />
      )
    });
  };

  const renderItem = React.useCallback(
    ({ item, index }: { item: ThemeMetadata; index: number }) => {
      const colors =
        item.previewColors ||
        getPreviewColors(item as unknown as ThemeDefinition);

      return (
        <>
          <TouchableOpacity
            activeOpacity={0.9}
            style={{
              borderRadius: 10,
              padding: DefaultAppStyles.GAP_SMALL,
              marginBottom: DefaultAppStyles.GAP_VERTICAL,
              flexShrink: 1,
              marginHorizontal: 10
            }}
            onPress={() => select(item)}
          >
            <View
              style={{
                backgroundColor: colors?.background,
                height: 200,
                width: "100%",
                borderRadius: 10,
                marginBottom: DefaultAppStyles.GAP_VERTICAL,
                overflow: "hidden",
                flexDirection: "row",
                justifyContent: "space-between",
                ...getElevationStyle(3)
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "49.5%",
                  backgroundColor: colors.navigationMenu.background,
                  padding: DefaultAppStyles.GAP_SMALL,
                  paddingVertical: 3,
                  borderRadius: defaultBorderRadius
                }}
              >
                {MenuItemsList.map((item, index) => (
                  <View
                    key={item.id}
                    style={{
                      height: 12,
                      width: "100%",
                      backgroundColor:
                        index === 0
                          ? colors.navigationMenu.accent + 40
                          : colors.navigationMenu.background,
                      borderRadius: 2,
                      paddingHorizontal: 3,
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4
                    }}
                  >
                    <Icon
                      size={8}
                      name={item.icon}
                      color={
                        index === 0
                          ? colors.navigationMenu.accent
                          : colors.navigationMenu.icon
                      }
                    />

                    <View
                      style={{
                        height: 3,
                        width: "40%",
                        backgroundColor:
                          index === 0
                            ? colors.navigationMenu.accent
                            : colors.paragraph,
                        borderRadius: 2,
                        marginLeft: 3
                      }}
                    ></View>
                  </View>
                ))}
              </View>

              <View
                style={{
                  height: "100%",
                  width: "49.5%",
                  backgroundColor: colors.list.background,
                  borderRadius: defaultBorderRadius,
                  paddingHorizontal: 2,
                  paddingRight: 6
                }}
              >
                <View
                  style={{
                    height: 12,
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 3
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <Icon size={8} color={colors.list.heading} name="menu" />
                    <Heading
                      style={{
                        marginLeft: 3
                      }}
                      color={colors.list.heading}
                      size={7}
                    >
                      {strings.dataTypesPluralCamelCase.note()}
                    </Heading>
                  </View>

                  <Icon name="magnify" color={colors.list.heading} size={7} />
                </View>
              </View>

              <View
                style={{
                  width: "100%",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  marginTop: DefaultAppStyles.GAP_VERTICAL_SMALL,
                  position: "absolute",
                  bottom: 6,
                  right: 6,
                  flexDirection: "row",
                  gap: 10
                }}
              >
                {darkTheme.id === item.id || lightTheme.id === item.id ? (
                  <IconButton
                    name="check"
                    type="plain"
                    style={{
                      borderRadius: 100,
                      paddingHorizontal: 6,
                      alignSelf: "flex-end",
                      width: 25,
                      height: 25
                    }}
                    color={colors.accent}
                    size={16}
                  />
                ) : null}

                <Button
                  title={
                    item.colorScheme === "dark"
                      ? strings.dark()
                      : strings.light()
                  }
                  type="secondaryAccented"
                  height={25}
                  buttonType={{
                    color: item.colorScheme === "dark" ? "black" : "#f0f0f060",
                    text: colors.accent
                  }}
                  style={{
                    borderRadius: 100,
                    paddingHorizontal: DefaultAppStyles.GAP,
                    alignSelf: "flex-end",
                    borderColor:
                      item.colorScheme === "dark"
                        ? getColorLinearShade("#000000", 0.1, true)
                        : getColorLinearShade("#f0f0f0", 0.1, true)
                  }}
                  fontSize={AppFontSize.xxs}
                />
              </View>
            </View>

            <Heading size={AppFontSize.sm} color={themeColors.primary.heading}>
              {item.name}
            </Heading>
            <Paragraph
              size={AppFontSize.xs}
              color={themeColors.secondary?.paragraph}
            >
              {strings.by()} {item.authors?.[0].name}
            </Paragraph>
          </TouchableOpacity>
        </>
      );
    },
    [
      darkTheme.id,
      lightTheme.id,
      themeColors.primary.heading,
      themeColors.secondary?.paragraph
    ]
  );

  return (
    <>
      <SheetProvider context="theme-details" />
      <View
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            paddingHorizontal: DefaultAppStyles.GAP,
            marginBottom: DefaultAppStyles.GAP_VERTICAL,
            paddingTop: DefaultAppStyles.GAP_VERTICAL
          }}
        >
            <Button
              title={strings.loadFromFile()}
              style={{
                paddingVertical: DefaultAppStyles.GAP_VERTICAL_SMALL,
                paddingHorizontal: DefaultAppStyles.GAP_SMALL
              }}
              type={"secondaryAccented"}
              icon="folder"
              fontSize={AppFontSize.xs}
              onPress={async () => {
                try {
                  const pickResponse = await pick({
                    allowMultiSelection: false
                  });
                  const copiedFile = await keepLocalCopy({
                    destination: "cachesDirectory",
                    files: [
                      {
                        uri: pickResponse[0].uri,
                        fileName: pickResponse[0].name || "theme.json"
                      }
                    ]
                  });
                  if (copiedFile[0].status !== "success") return;

                  const themeJsonCopiedPath = santizeUri(
                    copiedFile[0].localUri
                  );

                  const themeJson = await ReactNativeBlobUtil.fs.readFile(
                    themeJsonCopiedPath,
                    "utf8"
                  );
                  ReactNativeBlobUtil.fs
                    .unlink(themeJsonCopiedPath)
                    .catch(() => {});
                  let json;
                  try {
                    json = JSON.parse(themeJson);
                  } catch (e) {
                    ToastManager.show({
                      heading: strings.invalidThemeFileFormat(),
                      type: "error",
                      context: "global"
                    });
                    return;
                  }
                  const result = validateTheme(json);

                  if (result.error) {
                    if (
                      typeof result.error === "string" &&
                      result.error.includes("missing from the theme")
                    ) {
                      ToastManager.show({
                        heading: strings.themeMissingRequiredFields(),
                        type: "error",
                        context: "global",
                        actionText: strings.copyLogs(),
                        func: () => {
                          Clipboard.setString(result.error || "");
                          ToastManager.show({
                            heading: strings.logsCopied(),
                            type: "success",
                            context: "global"
                          });
                        }
                      });
                    } else {
                      ToastManager.error(new Error(result.error));
                    }

                    return;
                  }
                  select(json, true);
                } catch (e) {
                  if ((e as Error).message.includes("Code=3072")) {
                    return;
                  }
                  ToastManager.error(e as Error);
                }
              }}
            />
          </View>
        </View>

        <LegendList
          numColumns={2}
          data={[
            lightTheme as unknown as ThemeMetadata,
            darkTheme as unknown as ThemeMetadata
          ]}
          estimatedItemSize={200}
          renderItem={renderItem}
        />
      </View>
    </>
  );
}

export default ThemeSelector;

const ThemeSetter = ({
  theme,
  close,
  fromFile
}: {
  theme: Partial<CompiledThemeDefinition>;
  close?: (ctx?: string) => void;
  fromFile?: boolean;
}) => {
  const [darkTheme, lightTheme] = useThemeStore((state) => [
    state.darkTheme,
    state.lightTheme
  ]);
  const themeColors = useThemeColors();

  const colors =
    theme?.previewColors ||
    getPreviewColors(theme as unknown as ThemeDefinition);

  const applyTheme = async () => {
    if (!theme.id) return;
    try {
      const user = await db.user?.getUser();
      const fullTheme = fromFile
        ? (theme as ThemeDefinition)
        : await themeTrpcClient.installTheme.query({
            compatibilityVersion: THEME_COMPATIBILITY_VERSION,
            id: theme.id,
            userId: user?.id
          });
      if (!fullTheme) return;
      theme.colorScheme === "dark"
        ? useThemeStore.getState().setDarkTheme(fullTheme)
        : useThemeStore.getState().setLightTheme(fullTheme);
      ToastManager.show({
        heading: `${theme.name} applied successfully`,
        type: "success",
        context: "global"
      });
    } catch (e) {
      DatabaseLogger.error(e);
    }

    setTimeout(() => {
      close?.();
    });
  };

  return (
    <>
      <View
        style={{
          paddingHorizontal: DefaultAppStyles.GAP
        }}
      >
        <View
          style={{
            borderRadius: 10,
            marginBottom: DefaultAppStyles.GAP_VERTICAL,
            paddingHorizontal: DefaultAppStyles.GAP,
            paddingVertical: DefaultAppStyles.GAP_VERTICAL
          }}
        >
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors?.accent + "20",
              padding: DefaultAppStyles.GAP,
              borderRadius: 15,
              marginBottom: DefaultAppStyles.GAP_VERTICAL
            }}
          >
            <View
              style={{
                backgroundColor: colors?.background,
                borderWidth: 0.5,
                borderColor: colors?.border,
                height: 200,
                width: "100%",
                borderRadius: 10,
                marginBottom: DefaultAppStyles.GAP_VERTICAL,
                overflow: "hidden",
                flexDirection: "row",
                justifyContent: "space-between",
                ...getElevationStyle(3),
                maxWidth: 200
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "49.5%",
                  backgroundColor: colors?.navigationMenu.background,
                  padding: DefaultAppStyles.GAP_SMALL,
                  paddingVertical: 3,
                  borderRadius: defaultBorderRadius
                }}
              >
                {MenuItemsList.map((item, index) => (
                  <View
                    key={item.id}
                    style={{
                      height: 12,
                      width: "100%",
                      backgroundColor:
                        index === 0
                          ? //@ts-ignore
                            colors?.navigationMenu?.accent + 40
                          : colors?.navigationMenu.background,
                      borderRadius: 2,
                      paddingHorizontal: 3,
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4
                    }}
                  >
                    <Icon
                      size={8}
                      name={item.icon}
                      color={
                        index === 0
                          ? colors?.navigationMenu.accent
                          : colors?.navigationMenu.icon
                      }
                    />

                    <View
                      style={{
                        height: 3,
                        width: "40%",
                        backgroundColor:
                          index === 0
                            ? colors?.navigationMenu.accent
                            : colors?.paragraph,
                        borderRadius: 2,
                        marginLeft: 3
                      }}
                    ></View>
                  </View>
                ))}
              </View>

              <View
                style={{
                  height: "100%",
                  width: "49.5%",
                  backgroundColor: colors?.list.background,
                  borderRadius: defaultBorderRadius,
                  paddingHorizontal: 2,
                  paddingRight: 6
                }}
              >
                <View
                  style={{
                    height: 12,
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 3
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <Icon size={8} color={colors?.list.heading} name="menu" />
                    <Heading
                      style={{
                        marginLeft: 3
                      }}
                      color={colors?.list.heading}
                      size={7}
                    >
                      {strings.dataTypesPluralCamelCase.note()}
                    </Heading>
                  </View>

                  <Icon name="magnify" color={colors?.list.heading} size={7} />
                </View>
              </View>
            </View>
          </View>

          <Heading
            size={AppFontSize.md}
            color={themeColors.colors.primary.heading}
          >
            {theme.name}
          </Heading>
          <Paragraph color={themeColors.colors.primary.paragraph}>
            {theme.description}
          </Paragraph>

          <Paragraph
            size={AppFontSize.xs}
            color={themeColors.colors.secondary.paragraph}
          >
            {strings.by()} {theme.authors?.[0]?.name}
          </Paragraph>
          <View
            style={{
              marginTop: DefaultAppStyles.GAP_VERTICAL_SMALL,
              flexDirection: "column",
              rowGap: 3
            }}
          >
            <Paragraph
              size={AppFontSize.xs}
              color={themeColors.colors.secondary.paragraph}
            >
              ${strings.version()} {theme.version}
            </Paragraph>

            <Paragraph
              size={AppFontSize.xs}
              color={themeColors.colors.secondary.paragraph}
            >
              {theme.license}
            </Paragraph>

            {theme.homepage ? (
              <View
                style={{
                  flexDirection: "row"
                }}
              >
                <Paragraph
                  size={AppFontSize.xs}
                  color={themeColors.colors.secondary.accent}
                  onPress={() => {
                    Linking.openURL(theme.homepage as string);
                  }}
                >
                  {strings.visitHomePage()}
                </Paragraph>
              </View>
            ) : null}
          </View>
        </View>

        {darkTheme.id === theme.id || lightTheme.id === theme.id ? (
          <Pressable
            onPress={applyTheme}
            type="accent"
            style={{
              paddingVertical: DefaultAppStyles.GAP_VERTICAL
            }}
          >
            <Heading color={colors.accentForeground} size={AppFontSize.md}>
              {darkTheme.id === theme.id
                ? strings.appliedDark()
                : strings.appliedLight()}
            </Heading>
            <Paragraph color={colors.accentForeground} size={AppFontSize.xs}>
              ({strings.tapToApplyAgain()})
            </Paragraph>
          </Pressable>
        ) : (
          <Button
            style={{
              width: "100%",
              marginBottom: DefaultAppStyles.GAP_VERTICAL
            }}
            onPress={applyTheme}
            title={
              theme.colorScheme === "dark"
                ? strings.setAsDarkTheme()
                : strings.setAsLightTheme()
            }
            type="secondaryAccented"
          />
        )}
      </View>
    </>
  );
};
