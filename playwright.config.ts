import { defineConfig, devices } from '@playwright/test';
import { config as UiConfig } from './tests/utils/ui-config' ;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, 
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 10 : 10,
  reporter: 'html',
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
    },
    /*{
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    }*/
  ],

  // Run your local dev server before starting the tests.
  webServer: [{
      command: 'yarn dev',
      url: 'http://127.0.0.1:3000',
      env: UiConfig,
      reuseExistingServer: false,
    },
    {
      command: 'docker compose -f ./docker-compose.e2e.yml up -d'
    }
  ]
});
