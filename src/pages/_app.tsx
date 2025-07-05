import "@/styles/globals.css";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { TranslatorProvider } from "@/i18n";
import type { AppProps } from "next/app";
import { JsonLdContextProvider } from "@think-it-labs/edc-connector-ui/json-ld-context-provider";
import ThemeProvider from "@/theme/ThemeProvider";
import { SnackbarProvider } from 'notistack';

export default function App({ Component, pageProps }: AppProps) {

  TimeAgo.addDefaultLocale(en);
  
  return (
    <TranslatorProvider>
      <JsonLdContextProvider
        additionalJsonLdContext={{
          "dct": "http://purl.org/dc/terms/",
          "dcat": "http://www.w3.org/ns/dcat#",
        }}
      >
        <ThemeProvider>
          <SnackbarProvider autoHideDuration={5000} anchorOrigin={{ vertical: "top", horizontal: "center" }} >
            <Component {...pageProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </JsonLdContextProvider>
    </TranslatorProvider>
  );
}
