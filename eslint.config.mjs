import nextConfig from "eslint-config-next/core-web-vitals";
import playwright from "eslint-plugin-playwright";

const config = [
  {
    ignores: ["playwright-report/**", ".next/**", "node_modules/**"],
  },
  ...nextConfig,
  {
    ...playwright.configs["flat/recommended"],
    files: ["e2e/**/*.ts", "tests/**/*.ts", "**/*.spec.ts", "**/*.test.ts"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "playwright/no-conditional-in-test": "off",
      "playwright/no-conditional-expect": "off",
      "playwright/no-skipped-test": "off",
      "playwright/no-wait-for-timeout": "warn",
      "playwright/no-wait-for-selector": "warn",
    },
  },
];

export default config;
