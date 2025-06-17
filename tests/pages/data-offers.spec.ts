import { test, expect } from '@playwright/test';

test.describe("Data Offers Tests", () => {
  test("On first visit, I can see the list", async ({ page }) => {
    await page.goto("http://localhost:3000/data-offers");
    // Placeholder: Verify the list is visible on the first visit
    const offerList = page.getByTestId("offer-list");
    await expect(offerList).toBeVisible();
    const offers = await offerList.locator(".offer-item").allTextContents();
    expect(offers.length).toBeGreaterThan(0);
  });
});
