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

import { useEffect } from "react";
import { AppState, BackHandler } from "react-native";
import { useScreenshotModeStore } from "../stores/use-screenshot-mode-store";
import { SunshineModule } from "../utils/sunshine-module";

/**
 * Keeps the system bars out of the way while screenshot mode is on and
 * makes the hardware back button leave screenshot mode instead of
 * navigating away.
 */
export function useScreenshotMode() {
  const enabled = useScreenshotModeStore((state) => state.enabled);
  const disable = useScreenshotModeStore((state) => state.disable);

  useEffect(() => {
    if (!enabled) return;

    SunshineModule.setImmersiveMode(true);

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        disable();
        return true;
      }
    );

    return () => {
      subscription.remove();
      SunshineModule.setImmersiveMode(false);
    };
  }, [enabled, disable]);

  useEffect(() => {
    // android brings the system bars back when the app is backgrounded, so
    // they have to be hidden again when the app comes back to the front
    const subscription = AppState.addEventListener("change", (state) => {
      if (state !== "active") return;
      if (!useScreenshotModeStore.getState().enabled) return;

      setTimeout(() => {
        SunshineModule.setImmersiveMode(true);
      }, 100);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return { enabled, disable };
}

export default useScreenshotMode;
