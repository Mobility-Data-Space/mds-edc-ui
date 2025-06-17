import { test, expect } from '@playwright/test';

test.describe("Catalog Browser Tests", () => {

  test("On first visit, the browser is empty", async ({ page }) => {
    await page.goto("http://localhost:3000/catalog-browser");
    
    // Placeholder: Verify the browser is empty on the first visit
    const emptyState = page.getByTestId("empty-state");
    await expect(emptyState).toBeVisible();
  });

  test("When I type the 2nd connector endpoint, I see the page loading and then see all 7 offers", async ({ page }) => {
    await page.goto("http://localhost:3000/catalog-browser");
    // Placeholder: Simulate typing the 2nd connector endpoint and verify loading state and offers
    const endpointInput = page.getByTestId("connector-endpoint-input");
    await endpointInput.fill("http://example.com/endpoint2");
    const loadingIndicator = page.getByTestId("loading-indicator");
    await expect(loadingIndicator).toBeVisible();
    await loadingIndicator.waitFor({ state: "hidden" });
    const offers = page.getByTestId("offer-item");
    await expect(offers).toHaveCount(7);
  });

  test("When I click on a specific asset card, I can see its details and negotiate the available offers", async ({ page }) => {
    await page.goto("http://localhost:3000/catalog-browser");
    // Placeholder: Click on an asset card and verify details and negotiation options
    const assetCard = page.getByTestId("asset-card").first();
    await assetCard.click();
    const assetDetails = page.getByTestId("asset-details");
    await expect(assetDetails).toBeVisible();
    const negotiateButton = assetDetails.getByTestId("negotiate-button");
    await expect(negotiateButton).toBeVisible();
  });
});
