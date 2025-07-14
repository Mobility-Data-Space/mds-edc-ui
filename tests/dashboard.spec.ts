import { expect, test } from '@playwright/test';
import { DashboardPage } from './pages/dashboard-page';
import { config } from "./utils/ui-config.ts";

test.describe("Dashboard Tests", () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test.fixme("Displays the dashboard header", async ({ page }) => {
    // Verify the dashboard header is visible
    const dashboardHeader = await dashboardPage.getDashboardHeader();
    await expect(dashboardHeader).toBeVisible();
  });

  test("Displays widgets on the dashboard", async ({ page }) => {
    const propertiesText = ((await page.getByTestId('dashboard-edc-properties').first().allTextContents()) || [""])[0];
    expect(propertiesText).toContain(config.EDC_PROTOCOL_URL)
    expect(propertiesText).toContain(config.EDC_ID)
    expect(propertiesText).toContain(config.EDC_NAME)
    expect(propertiesText).toContain(config.EDC_DESCRIPTION)

    await expect(Number(await page.getByTestId('dashboard-your-data-offers').locator('h2').textContent())).toBeGreaterThanOrEqual(1);
    await expect(Number(await page.getByTestId('dashboard-your-assets').locator('h2').textContent())).toBeGreaterThanOrEqual(7);
    await expect(Number(await page.getByTestId('dashboard-your-policies').locator('h2').textContent())).toBeGreaterThanOrEqual(1);

    expect(await page.getByTestId('dashboard-connector-endpoint').first().locator('input').inputValue()).toBe(config.EDC_PROTOCOL_URL);
    expect(await page.getByTestId('dashboard-management-api-url').first().locator('input').inputValue()).toBe(config.EDC_MANAGEMENT_URL);
  });
});
