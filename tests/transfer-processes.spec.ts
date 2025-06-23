import { test, expect } from '@playwright/test';
import { TransferProcessesPage } from './pages/transfer-processes-page';

test.describe("Transfer Processes Tests", () => {
  let transferProcessesPage: TransferProcessesPage;

  test.beforeEach(async ({ page }) => {
    transferProcessesPage = new TransferProcessesPage(page);
    await transferProcessesPage.navigate();
  });

  test.fixme("Displays an empty transfer processes list on the first visit", async ({ page }) => {
    const response = await transferProcessesPage.page.waitForResponse((response) => response.url().includes('/api/management/v3/transferprocesses'));
    expect(response.status()).toBe(200);

    // Verify the transfer processes list is visible
    const transferList = await transferProcessesPage.getTransferList();
    await expect(transferList).toBeVisible();

    // Verify there is at least one transfer item
    const transfers = await transferList.locator(transferProcessesPage.transferItemLocator).allTextContents();
    expect(transfers.length).toBe(0);
  });

  test.fixme("Supports pagination and search functionality", async ({ page }) => {
    // Test search functionality
    await transferProcessesPage.searchTransfer("test-transfer");
    await expect(transferProcessesPage.page.locator(transferProcessesPage.transferListLocator).locator(transferProcessesPage.transferItemLocator).filter({ hasText: "test-transfer" })).toBeVisible();

    // Test pagination
    await transferProcessesPage.goToNextPage();
    const transferList = await transferProcessesPage.getTransferList();
    await expect(transferList).toBeVisible();
  });

  test.fixme("Displays transfer process details correctly", async ({ page }) => {
    // Select a transfer process
    await transferProcessesPage.selectTransferItem(0);

    // Verify details are displayed
    const transferDetails = await transferProcessesPage.verifyTransferDetails();
    await expect(transferDetails.locator('text=Process ID')).toBeVisible();
    await expect(transferDetails.locator('text=Status')).toBeVisible();
    await expect(transferDetails.locator('text=Associated Assets')).toBeVisible();
  });

});
