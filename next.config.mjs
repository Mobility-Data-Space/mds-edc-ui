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
  transpilePackages: ["@think-it-labs/edc-connector-ui", "mui-chips-input"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/assets", // TODO: change to dashboard after it is implemented
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
