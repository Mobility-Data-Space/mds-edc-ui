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
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
