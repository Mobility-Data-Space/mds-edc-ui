import {configureRuntimeEnv} from "next-runtime-env/build/configure.js";

configureRuntimeEnv();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "cn"],
  },
  reactStrictMode: true,
  transpilePackages: ["@think-it-labs/edc-connector-ui"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/assets",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
