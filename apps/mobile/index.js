/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react";
import { AppRegistry, LogBox } from "react-native";
import Config from "react-native-config";
import "react-native-get-random-values";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableFreeze } from "react-native-screens";
import Notifications from "./app/services/notifications";
import appJson from "./app.json";
import "./globals.js";

Notifications.init();

enableFreeze(true);

const appName = appJson.name;
if (Config.isTesting) {
  Date.prototype.toLocaleString = () => "XX-XX-XX";
}

if (__DEV__) {
  console.warn = () => null;
  LogBox.ignoreAllLogs();
}

const AppProvider = () => {
  const App = require("./app/app").default;
  return <App />;
};

AppRegistry.registerComponent(appName, () => AppProvider);

const NotePreviewConfigureProvider = () => {
  const App = require("./app/app").default;
  return <App configureMode="note-preview" />;
};

AppRegistry.registerComponent(
  "NotePreviewConfigure",
  () => NotePreviewConfigureProvider
);

const ShareProvider = () => {
  const ShareApp = require("./app/share/index").default;
  return (
    <SafeAreaProvider>
      <ShareApp />
    </SafeAreaProvider>
  );
};

AppRegistry.registerComponent("SunshineNotesShare", () => ShareProvider);
