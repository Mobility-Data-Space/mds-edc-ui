import * as React from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, ThemeOptions } from '@mui/material/styles';
import {PropsWithChildren} from "react";

export const theme = createTheme({
  typography: {
    fontFamily: [
      '"Sans"',
      '"Roboto"',
      '"Helvetica"',
      '"Arial"',
      'sans-serif',
    ].join(','),
  },
  palette: {
    primary: {
      50: "#ffffe0",
      100: "#ffffb3",
      200: "#ffff80",
      300: "#ffff4d",
      400: "#ffff26",
      500: "#ffff00",
      600: "#ffff00",
      700: "#ffff00",
      800: "#ffff00",
      900: "#ffff00",
      A100: "#ffffff",
      A200: "#fffff2",
      A400: "#ffffbf",
      A700: "#ffffa6",
    },
    secondary: {
      main: "#000000",
      light: "#ffffff",
      50: "#ffffff",
      100: "#000000",
      200: "#000000",
      300: "#000000",
      400: "#000000",
      500: "#000000",
      600: "#000000",
      700: "#000000",
      800: "#000000",
      900: "#000000",
      A100: "#000000",
      A200: "#000000",
      A400: "#000000",
      A700: "#000000",
    }
  },
});

export default function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  );
}
