/** @type {import('next').NextConfig} */
const nextConfig = {
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
