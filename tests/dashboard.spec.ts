import { test, expect } from '@playwright/test';

test('dashboard redirects to assets page', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // TODO: remove after implementing dashboard
  // Expect the redirection to assets page
  await expect(page).toHaveURL('http://localhost:3000/assets');
});

