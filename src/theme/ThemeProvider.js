import React, { useState, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { themeCreator } from "./base";

export const ThemeContext = React.createContext({
  themeName: "",
  setThemeName: (themeName) => {},
});

const CustomThemeProvider = function (props) {
  const [themeName, setThemeName] = useState("LightTheme");
  const value = useMemo(() => ({ themeName, setThemeName }), [themeName]);
  const theme = themeCreator(value.themeName);

  return (
    <ThemeContext.Provider value={{ setThemeName, themeName }}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default CustomThemeProvider;
