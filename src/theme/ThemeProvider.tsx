import * as React from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, ThemeOptions } from '@mui/material/styles';
import {PropsWithChildren} from "react";

export const backgroundColor = "#fafafa";

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
    },
    info: {
      50: "#e0e0e0",
      100: "#e0e0e0",
      200: "#e0e0e0",
      300: "#e0e0e0",
      400: "#e0e0e0",
      500: "#e0e0e0",
      600: "#e0e0e0",
      700: "#e0e0e0",
      800: "#e0e0e0",
      900: "#e0e0e0",
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
