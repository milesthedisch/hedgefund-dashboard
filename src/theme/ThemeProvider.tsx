import { FC, useState, createContext, useEffect } from "react";
import { ThemeProvider } from "@mui/material";
import { themeCreator } from "./base";
import { StylesProvider } from "@mui/styles";

export const ThemeContext = createContext((_themeName: string): void => {});

type Props = {
  children: React.ReactNode;
  theme: Object;
};

const CustomThemeProvider: FC = ({ children }: Props) => {
  const [themeName, _setThemeName] = useState("LightTheme");

  useEffect(() => {
    const curThemeName =
      window.localStorage.getItem("appTheme") || "LightTheme";
    _setThemeName(curThemeName);
  }, []);

  const theme = themeCreator(themeName);

  const setThemeName = (themeName: string): void => {
    window.localStorage.setItem("appTheme", themeName);
    _setThemeName(themeName);
  };

  return (
    <StylesProvider injectFirst>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeContext.Provider>
    </StylesProvider>
  );
};

export default CustomThemeProvider;
