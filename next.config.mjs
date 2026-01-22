/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  output: "standalone",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  reactStrictMode: true,
  transpilePackages: ["mui-chips-input"],
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
