import { Head, Html, Main, NextScript } from "next/document";
import Script from 'next/script'
import {backgroundColor} from "@/theme/ThemeProvider.tsx";

export default function Document() {
  return (
    <Html lang="en" className="h-full">
      <Head />
      <body className="flex h-full flex-col leading-relaxed antialiased" style={{ backgroundColor }}>
        <Main/>
        <NextScript/>
        <Script src="/__ENV.js" />
      </body>
    </Html>
  );
}
