import { defineConfig, devices } from '@playwright/test';
import { participantConfig as UiConfig } from './tests/utils/tests-config';

export default defineConfig({
  workers: '80%',
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: !process.env.CI,
  forbidOnly: !!process.env.CI,
  retries: 1,
  reporter: 'html',
  timeout: 60 * 1000, // 60 seconds timeout for E2E tests with Docker services
  maxFailures: 7,
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry'
  },
  globalSetup: './tests/utils/global-setup.ts',
  globalTeardown: './tests/utils/global-teardown.ts',

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],

  webServer: process.env.CI ?
    [{
      name: "MDS EDC UI Server",
      command: 'yarn dev',
      url: 'http://127.0.0.1:3000',
      env: UiConfig,
      reuseExistingServer: false,
    }] : [{
      name: "MDS EDC UI Server",
      command: 'yarn dev',
      url: 'http://127.0.0.1:3000',
      env: UiConfig,
      reuseExistingServer: false,
    },
    {
      name: "MDS EDC E2E Services",
      command: 'docker compose -f ./docker-compose.e2e.yml up -d'
    }]
});
