import { defineConfig, devices } from '@playwright/test';
import { config as UiConfig } from './tests/utils/ui-config' ;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, 
  forbidOnly: !!process.env.CI,
  retries: 1,
  reporter: 'html',
  timeout: 15 * 1000, // 15 seconds timeout
  maxFailures: 10,
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

  // Run your local dev server before starting the tests.
  webServer: [{
      name: "MDS EDC UI Server",
      command: 'yarn dev',
      url: 'http://127.0.0.1:3000',
      env: UiConfig,
      reuseExistingServer: false,
    },
    {
      name: "MDS EDC E2E Services",
      command: 'docker compose -f ./docker-compose.e2e.yml up -d'
    }
  ]
});
