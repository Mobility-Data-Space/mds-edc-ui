import { TranslatorProvider } from "@/i18n";
import "@/styles/globals.css";
import ThemeProvider from "@/theme/ThemeProvider";
import { JsonLdContextProvider } from "@think-it-labs/edc-connector-ui/json-ld-context-provider";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from 'notistack';
import { useEffect } from "react";
import AppAuthWrapper from "@/components/AppAuthWrapper";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    TimeAgo.addDefaultLocale(en);
  }, []);

  return (
    <SessionProvider session={session}>
      <AppAuthWrapper>
        <TranslatorProvider>
          <JsonLdContextProvider
            additionalJsonLdContext={{
              "dct": "http://purl.org/dc/terms/",
              "dcat": "http://www.w3.org/ns/dcat#",
            }}
          >
            <ThemeProvider>
              <SnackbarProvider autoHideDuration={5000} anchorOrigin={{ vertical: "top", horizontal: "right" }} >
                <Component {...pageProps} />
              </SnackbarProvider>
            </ThemeProvider>
          </JsonLdContextProvider>
        </TranslatorProvider>
      </AppAuthWrapper>
    </SessionProvider>
  );
}
