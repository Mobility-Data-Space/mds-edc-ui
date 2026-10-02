import SideDrawer from "@/components/templates/side-drawer";
import { T, TranslatorProvider } from "@/i18n";
import "@/styles/globals.css";
import ThemeProvider from "@/theme/theme-provider";
import type { TitledPage } from "@/types/page";
import { JsonLdContextProvider } from "@think-it-labs/edc-connector-ui/json-ld-context-provider";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import type { AppProps } from "next/app";
import { SnackbarProvider } from 'notistack';
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const { titleKey } = Component as TitledPage;

  useEffect(() => {
    TimeAgo.addDefaultLocale(en);
  }, []);

  return (
    <TranslatorProvider>
      <JsonLdContextProvider
        additionalJsonLdContext={{
          "dct": "http://purl.org/dc/terms/",
          "dcat": "http://www.w3.org/ns/dcat#",
        }}
      >
        <ThemeProvider>
          <SnackbarProvider autoHideDuration={5000} anchorOrigin={{ vertical: "top", horizontal: "right" }} >
            <SideDrawer title={titleKey && <T string={titleKey} />}>
              <Component {...pageProps} />
            </SideDrawer>
          </SnackbarProvider>
        </ThemeProvider>
      </JsonLdContextProvider>
    </TranslatorProvider>
  );
}
