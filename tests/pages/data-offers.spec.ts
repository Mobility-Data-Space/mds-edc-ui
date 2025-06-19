import { test, expect } from '@playwright/test';

const DATA_OFFERS_ROUTE = "/data-offers";
const CONTRACT_DEFINITION_EDC_PATH = "/api/management/v3/contractdefinitions"
const OFFER_LIST_LOCATOR = "offer-list";
const OFFER_ITEM_LOCATOR = "offer-item";
const OFFER_DETAILS_LOCATOR = "offer-details";
const SEARCH_BOX_LOCATOR = "search-box";
const PAGINATION_NEXT_LOCATOR = "pagination-next";
const PUBLISH_BUTTON_LOCATOR = "publish-button";
const MANUAL_APPROVAL_CHECKBOX_LOCATOR = "manual-approval-checkbox";

test.describe("Data Offers Tests", () => {

  test.fixme("Displays the data offers list on the first visit", async ({ page }) => {
    await page.goto(DATA_OFFERS_ROUTE);
    const response = await page.waitForResponse((response) => response.url().includes(CONTRACT_DEFINITION_EDC_PATH));
    expect(response.status()).toBe(200);

    // Verify the data offers list is visible
    const offerList = page.locator(OFFER_LIST_LOCATOR);
    await expect(offerList).toBeVisible();

    // Verify there is at least one offer item
    const offers = await offerList.locator(`.${OFFER_ITEM_LOCATOR}`).allTextContents();
    expect(offers.length).toBeGreaterThan(0);
  });

  test.fixme("Supports pagination and search functionality", async ({ page }) => {
    await page.goto(DATA_OFFERS_ROUTE);
    const response = await page.waitForResponse((response) => response.url().includes(CONTRACT_DEFINITION_EDC_PATH));
    expect(response.status()).toBe(200);

    // Test search functionality
    const searchBox = page.getByTestId(SEARCH_BOX_LOCATOR);
    await expect(searchBox).toBeVisible();
    await searchBox.fill("test-offer");
    await expect(page.locator(OFFER_LIST_LOCATOR).locator(`.${OFFER_ITEM_LOCATOR}`).filter({ hasText: "test-offer" })).toBeVisible();

    // Test pagination
    const nextPageButton = page.locator(PAGINATION_NEXT_LOCATOR);
    await expect(nextPageButton).toBeVisible();
    await nextPageButton.click();
    await expect(page.getByTestId(OFFER_LIST_LOCATOR)).toBeVisible();
  });

  test.fixme("Displays data offer details correctly", async ({ page }) => {
    await page.goto(DATA_OFFERS_ROUTE);
    const response = await page.waitForResponse((response) => response.url().includes(CONTRACT_DEFINITION_EDC_PATH));
    expect(response.status()).toBe(200);

    // Select a data offer
    const offerItem = page.locator(OFFER_LIST_LOCATOR).locator(`.${OFFER_ITEM_LOCATOR}`).first();
    await offerItem.click();

    // Verify details are displayed
    const offerDetails = page.getByTestId(OFFER_DETAILS_LOCATOR);
    await expect(offerDetails).toBeVisible();
    await expect(offerDetails.locator('text=Offer ID')).toBeVisible();
    await expect(offerDetails.locator('text=Title')).toBeVisible();
    await expect(offerDetails.locator('text=Description')).toBeVisible();
    await expect(offerDetails.locator('text=Associated Policies')).toBeVisible();
  });

  test.fixme("Publishes a new data offer with manual approval", async ({ page }) => {
    await page.goto(DATA_OFFERS_ROUTE);
    const response = await page.waitForResponse((response) => response.url().includes(CONTRACT_DEFINITION_EDC_PATH));
    expect(response.status()).toBe(200);

    // Click the publish button
    const publishButton = page.getByRole('button', { name: 'Publish Data Offer' });
    await publishButton.click();

    // Enable manual approval
    const manualApprovalCheckbox = page.locator(MANUAL_APPROVAL_CHECKBOX_LOCATOR);
    await manualApprovalCheckbox.check();

    // Submit the form
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();

    // Verify the new data offer appears in the list
    await expect(page.locator(OFFER_LIST_LOCATOR).locator(`.${OFFER_ITEM_LOCATOR}`).filter({ hasText: "New Data Offer" })).toBeVisible();
  });

  test.fixme("Publishes a new data offer without manual approval", async ({ page }) => {
    await page.goto(DATA_OFFERS_ROUTE);

    // Click the publish button
    const publishButton = page.locator(PUBLISH_BUTTON_LOCATOR);
    await publishButton.click();

    // Ensure manual approval is not checked
    const manualApprovalCheckbox = page.locator(MANUAL_APPROVAL_CHECKBOX_LOCATOR);
    await manualApprovalCheckbox.uncheck();

    // Submit the form
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();

    // Verify the new data offer appears in the list
    await expect(page.locator(OFFER_LIST_LOCATOR).locator(`.${OFFER_ITEM_LOCATOR}`).filter({ hasText: "New Data Offer" })).toBeVisible();
  });

});
