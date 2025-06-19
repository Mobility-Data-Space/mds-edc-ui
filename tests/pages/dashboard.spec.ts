import { test, expect } from '@playwright/test';

const DASHBOARD_ROUTE = "/";
const ASSETS_ROUTE = "/assets";

test.describe("Dashboard Tests", () => {

  test.fixme("Displays statistics correctly", async ({ page }) => {
    await page.goto(DASHBOARD_ROUTE);

    // Verify statistics are displayed
    const statsSection = page.locator('.statistics-section');
    await expect(statsSection).toBeVisible();

    // Verify individual statistics
    await expect(statsSection.locator('text=Consumed Transfer Processes')).toBeVisible();
    await expect(statsSection.locator('text=Provided Transfer Processes')).toBeVisible();
    await expect(statsSection.locator('text=Number of Data Offers')).toBeVisible();
    await expect(statsSection.locator('text=Number of Assets')).toBeVisible();
    await expect(statsSection.locator('text=Policies')).toBeVisible();
    await expect(statsSection.locator('text=Agreements')).toBeVisible();
  });

  test.fixme("Displays connector properties correctly", async ({ page }) => {
    await page.goto(DASHBOARD_ROUTE);

    // Verify connector properties are displayed
    const connectorPropertiesSection = page.locator('.connector-properties-section');
    await expect(connectorPropertiesSection).toBeVisible();

    // Verify individual properties
    await expect(connectorPropertiesSection.locator('text=Connector ID')).toBeVisible();
    await expect(connectorPropertiesSection.locator('text=Endpoint')).toBeVisible();
  });

  test("Redirects to assets page temporarily", async ({ page }) => {
    await page.goto(DASHBOARD_ROUTE);

    // Verify the redirection to the assets page
    await expect(page).toHaveURL(ASSETS_ROUTE);
  });

});
