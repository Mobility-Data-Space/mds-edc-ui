import { test, expect } from '@playwright/test';

const TRANSFER_PROCESSES_ROUTE = "/transfer-processes";
const TRANSFER_PROCESSES_EDC_PATH = "/api/management/v3/transferprocesses";

const TRANSFER_LIST_LOCATOR = "transfer-list";
const TRANSFER_ITEM_LOCATOR = "transfer-item";
const TRANSFER_DETAILS_LOCATOR = "transfer-details";
const SEARCH_BOX_LOCATOR = "search-box";
const PAGINATION_NEXT_LOCATOR = "pagination-next";

test.describe("Transfer Processes Tests", () => {

  test("Displays an empty transfer processes list on the first visit", async ({ page }) => {
    await page.goto(TRANSFER_PROCESSES_ROUTE);
    const response = await page.waitForResponse((response) => response.url().includes(TRANSFER_PROCESSES_EDC_PATH));
    expect(response.status()).toBe(200);

    // Verify the transfer processes list is visible
    const transferList = page.locator('div').filter({ hasText: /^#StateContract agreementAsset$/ });
    await expect(transferList).toBeVisible();

    // Verify there is at least one transfer item
    const transfers = await transferList.locator(`.${TRANSFER_ITEM_LOCATOR}`).allTextContents();
    expect(transfers.length).toBe(0);
  });

  test.fixme("Supports pagination and search functionality", async ({ page }) => {
    await page.goto(TRANSFER_PROCESSES_ROUTE);

    // Test search functionality
    const searchBox = page.getByTestId(SEARCH_BOX_LOCATOR);
    await expect(searchBox).toBeVisible();
    await searchBox.fill("test-transfer");
    await expect(page.getByTestId(TRANSFER_LIST_LOCATOR).locator(`.${TRANSFER_ITEM_LOCATOR}`).filter({ hasText: "test-transfer" })).toBeVisible();

    // Test pagination
    const nextPageButton = page.getByTestId(PAGINATION_NEXT_LOCATOR);
    await expect(nextPageButton).toBeVisible();
    await nextPageButton.click();
    await expect(page.getByTestId(TRANSFER_LIST_LOCATOR)).toBeVisible();
  });

  test.fixme("Displays transfer process details correctly", async ({ page }) => {
    await page.goto(TRANSFER_PROCESSES_ROUTE);

    // Select a transfer process
    const transferItem = page.getByTestId(TRANSFER_LIST_LOCATOR).locator(`.${TRANSFER_ITEM_LOCATOR}`).first();
    await transferItem.click();

    // Verify details are displayed
    const transferDetails = page.getByTestId(TRANSFER_DETAILS_LOCATOR);
    await expect(transferDetails).toBeVisible();
    await expect(transferDetails.locator('text=Process ID')).toBeVisible();
    await expect(transferDetails.locator('text=Status')).toBeVisible();
    await expect(transferDetails.locator('text=Associated Assets')).toBeVisible();
  });

});
