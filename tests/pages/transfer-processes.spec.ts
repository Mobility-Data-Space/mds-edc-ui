import { test, expect } from '@playwright/test';

test.describe("Transfer Processes Tests", () => {
  test("On first visit, I can see the list", async ({ page }) => {
    await page.goto("http://localhost:3000/transfer-processes");
    // Placeholder: Verify the list is visible on the first visit
    const transferList = page.getByTestId("transfer-list");
    await expect(transferList).toBeVisible();
    const transfers = await transferList.locator(".transfer-item").allTextContents();
    expect(transfers.length).toBeGreaterThan(0);
  });
});
