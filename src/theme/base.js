import { LightTheme } from "./schemes/LightTheme";
import { DarkTheme } from "./schemes/DarkTheme";

export function themeCreator(theme) {
  return themeMap[theme];
}

const themeMap = {
  LightTheme,
  DarkTheme,
};
