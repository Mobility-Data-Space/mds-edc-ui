import { test, expect } from '@playwright/test';
import { DashboardPage } from './pages/dashboard-page';

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

  test.fixme("Displays widgets on the dashboard", async ({ page }) => {
    // Verify the widgets are visible
    const widgets = await dashboardPage.getWidgets();
    await expect(widgets.count()).toBeGreaterThan(0);
  });
});
