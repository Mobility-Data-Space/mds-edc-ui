import { test, expect } from '@playwright/test';

const CATALOG_BROWSER_ROUTE = "/catalog-browser";
const CATALOG_EDC_PATH = "/api/management/v3/catalog";
const EMPTY_STATE_LOCATOR = "empty-state";
const CONNECTOR_ENDPOINT_INPUT_LOCATOR = "connector-endpoint-input";
const LOADING_INDICATOR_LOCATOR = "loading-indicator";
const OFFER_ITEM_LOCATOR = ".offer-item";
const ASSET_CARD_LOCATOR = ".asset-card";
const ASSET_DETAILS_LOCATOR = ".asset-details";
const NEGOTIATE_BUTTON_LOCATOR = "negotiate-button";

test.describe("Catalog Browser Tests", () => {

  test("Displays an empty state on the first visit", async ({ page }) => {
    await page.goto(CATALOG_BROWSER_ROUTE);
    const response = await page.waitForResponse((response) => response.url().includes(CATALOG_EDC_PATH));

    await expect(response.body.length).toBe(0);
  });

  test.fixme("Displays loading indicator and offers after entering a valid endpoint", async ({ page }) => {
    await page.goto(CATALOG_BROWSER_ROUTE);
    await page.waitForResponse((response) => response.url().includes(CATALOG_EDC_PATH));
    
    // Simulate typing the 2nd connector endpoint
    const endpointInput = page.getByRole('textbox', { name: 'Connector Endpoints' });
    await endpointInput.fill("http://edc-2:8183/api/dsp");

    // Verify the loading indicator is visible and then hidden
    const loadingIndicator = page.getByRole('status', { name: 'loading' });
    await expect(loadingIndicator).toBeVisible();
    await loadingIndicator.waitFor({ state: "hidden" });

    // Verify the correct number of offers is displayed
    const offers = page.locator(OFFER_ITEM_LOCATOR);
    await expect(offers).toHaveCount(5);
  });

  test.fixme("Displays asset details and negotiation options when an asset card is clicked", async ({ page }) => {
    await page.goto(CATALOG_BROWSER_ROUTE);
    const endpointInput = page.getByRole('textbox', { name: 'Connector Endpoints' });
    await endpointInput.fill("http://edc-2:8183/api/dsp");
    await page.waitForResponse((response) => response.url().includes(CATALOG_EDC_PATH));

    // Click on the first asset card
    const assetCard = page.locator(ASSET_CARD_LOCATOR).first();
    await assetCard.click();

    // Verify the asset details are visible
    const assetDetails = page.getByTestId(ASSET_DETAILS_LOCATOR);
    await expect(assetDetails).toBeVisible();

    // Verify the negotiate button is visible
    const negotiateButton = assetDetails.getByTestId(NEGOTIATE_BUTTON_LOCATOR);
    await expect(negotiateButton).toBeVisible();
  });

});
