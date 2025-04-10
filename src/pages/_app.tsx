import "@/styles/globals.css";
import { TranslatorProvider } from "@/i18n";
import type { AppProps } from "next/app";
import { JsonLdContextProvider } from "@think-it-labs/edc-connector-ui/json-ld-context-provider";
import ThemeProvider from "@/theme/ThemeProvider.tsx";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TranslatorProvider>
      <JsonLdContextProvider
        additionalJsonLdContext={{
          "purl": "http://purl.org/dc/terms/",
          "dcat": "http://www.w3.org/ns/dcat#",
        }}
      >
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </JsonLdContextProvider>
    </TranslatorProvider>
  );
}
