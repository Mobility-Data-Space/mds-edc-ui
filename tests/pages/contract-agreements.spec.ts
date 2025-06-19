import { test, expect } from '@playwright/test';

const CONTRACT_AGREEMENTS_ROUTE = "/contract-agreements";
const AGREEMENT_LIST_LOCATOR = "agreement-list";
const AGREEMENT_ITEM_LOCATOR = "agreement-item";
const TRANSFER_OPTIONS_LOCATOR = "transfer-options";
const TRANSFER_BUTTON_HTTP_PUSH_LOCATOR = "transfer-button-http-push";
const RETIRE_AGREEMENT_BUTTON_LOCATOR = "retire-agreement-button";

test.describe("Contract Agreements Tests", () => {

  test.fixme("Displays agreements on the first visit", async ({ page }) => {
    await page.goto(CONTRACT_AGREEMENTS_ROUTE);

    // Verify the agreement list is visible
    const agreementList = page.getByTestId(AGREEMENT_LIST_LOCATOR);
    await expect(agreementList).toBeVisible();

    // Verify there is at least one agreement
    const agreements = await agreementList.locator(`.${AGREEMENT_ITEM_LOCATOR}`).allTextContents();
    expect(agreements.length).toBeGreaterThan(0);
  });

  test.fixme("Allows initiating a transfer process for a specific agreement", async ({ page }) => {
    await page.goto(CONTRACT_AGREEMENTS_ROUTE);

    // Click on the first agreement item
    const agreementItem = page.getByTestId(AGREEMENT_ITEM_LOCATOR).first();
    await agreementItem.click();

    // Verify transfer options are visible
    const transferOptions = page.getByTestId(TRANSFER_OPTIONS_LOCATOR);
    await expect(transferOptions).toBeVisible();

    // Initiate a transfer process using HTTP PUSH
    const transferButton = transferOptions.getByTestId(TRANSFER_BUTTON_HTTP_PUSH_LOCATOR);
    await expect(transferButton).toBeVisible();
    await transferButton.click();

    // Verify the transfer process is initiated
    await page.waitForResponse(resp => resp.url().includes('/transfer'));
  });

  test.fixme("Allows retiring a specific agreement", async ({ page }) => {
    await page.goto(CONTRACT_AGREEMENTS_ROUTE);

    // Click on the first agreement item
    const agreementItem = page.getByTestId(AGREEMENT_ITEM_LOCATOR).first();
    await agreementItem.click();

    // Verify the retire button is visible
    const retireButton = page.getByTestId(RETIRE_AGREEMENT_BUTTON_LOCATOR);
    await expect(retireButton).toBeVisible();

    // Retire the agreement
    await retireButton.click();

    // Verify the agreement is retired
    await page.waitForResponse(resp => resp.url().includes('/retire'));
    await expect(page.getByTestId(AGREEMENT_ITEM_LOCATOR)).not.toBeVisible();
  });

});
