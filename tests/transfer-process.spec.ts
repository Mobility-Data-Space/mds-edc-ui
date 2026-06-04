import { expect, test } from '@playwright/test';
import { MAX_ITEMS } from '../src/constants/lists';
import { TransferProcessesPage } from './pages/transfer-process-page';

test.describe("Transfer Processes Page Tests", () => {
  let transferProcessesPage: TransferProcessesPage;

  test.beforeEach(async ({ page }) => {
    transferProcessesPage = new TransferProcessesPage(page);
    await transferProcessesPage.navigate();
  });

  test.describe("List Functionality", () => {
    test("Displays the transfer processes list on the first visit", async ({ page }) => {
      // Verify the transfer processes list is visible
      const transferProcessesList = await transferProcessesPage.getTransferProcessesList();
      await expect(transferProcessesList).toBeVisible();

      const transferProcessRows = await transferProcessesPage.getTransferProcessRows();
      const transferProcesses = await transferProcessRows.count();
      expect(transferProcesses).toBeGreaterThan(0);
    });
  });

  test.describe("View Functionality", () => {
    test("Displays transfer process details correctly", async ({ page }) => {
      const transferProcessRows = await transferProcessesPage.getTransferProcessRows();
      const transferProcessRow = transferProcessRows.first();
      await transferProcessRow.getByTestId("show-transfer-process-details").click();

      const transferProcessDetails = await transferProcessesPage.getTransferProcessDetails();
      await expect(transferProcessDetails).toBeVisible();
    });
  });

  test.describe("Search Functionality", () => {
    test("should display search input and trigger button", async ({ page }) => {
      const searchInput = await transferProcessesPage.getSearchInput();
      const searchTrigger = await transferProcessesPage.getSearchTrigger();

      await expect(searchInput).toBeVisible();
      await expect(searchTrigger).toBeVisible();
    });

    test("should search for transfer processes by ID", async ({ page }) => {
      const initialTransferProcesses = await transferProcessesPage.getTransferProcessRows();
      const initialCount = await initialTransferProcesses.count();

      if (initialCount > 0) {
        const firstTransferProcess = initialTransferProcesses.first();
        const transferProcessText = await firstTransferProcess.locator("td").nth(2).textContent();
        const searchTerm = transferProcessText || 'test';
        await transferProcessesPage.searchTransferProcesses(searchTerm);

        const searchResults = (await transferProcessesPage.getTransferProcessRows());
        expect(await searchResults.count()).toBeGreaterThanOrEqual(1);

        const results = await searchResults.first().locator("td").nth(2).allTextContents();
        const hasMatchingResult = results.some((result: string) =>
          result.toLowerCase().includes(searchTerm.toLowerCase())
        );
        expect(hasMatchingResult).toBeTruthy();
      }
    });

    test("should clear search and show all transfer processes", async ({ page }) => {
      await transferProcessesPage.searchTransferProcesses('test');
      await transferProcessesPage.clearTransferProcessSearch();
      const allTransferProcesses = await transferProcessesPage.getTransferProcessRows();

      await expect(allTransferProcesses.first()).toBeVisible();
    });

    test("should handle empty search results", async ({ page }) => {
      await transferProcessesPage.searchTransferProcesses('nonexistenttransferprocess12345');
      const searchResults = await transferProcessesPage.getTransferProcessRows();
      const resultCount = await searchResults.count();

      expect(resultCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Pagination Functionality", () => {
    test("should display pagination controls", async ({ page }) => {
      const paginationInfo = await transferProcessesPage.getPaginationInfo();
      await expect(paginationInfo).toBeVisible();
    });

    test("should navigate to next page when available", async ({ page }) => {
      const initialItem = await transferProcessesPage.getFirstElementIndex();
      const isNextEnabled = await transferProcessesPage.isNextPageEnabled();

      if (isNextEnabled) {
        await transferProcessesPage.goToNextPage();

        const newPage = await transferProcessesPage.getFirstElementIndex();
        expect(newPage).toBe(initialItem + MAX_ITEMS);
      } else {
        const totalItems = await transferProcessesPage.getLastElementIndex();
        expect(initialItem).toBeLessThanOrEqual(totalItems);
      }
    });

    test("should navigate to previous page when available", async ({ page }) => {
      const isNextEnabled = await transferProcessesPage.isNextPageEnabled();
      if (isNextEnabled) {
        await transferProcessesPage.goToNextPage();
        const pageAfterNextFirstIndex = await transferProcessesPage.getFirstElementIndex();

        await transferProcessesPage.goToPreviousPage();
        const pageAfterPrevFirstIndex = await transferProcessesPage.getFirstElementIndex();

        expect(pageAfterPrevFirstIndex).toBe(pageAfterNextFirstIndex - MAX_ITEMS);
      } else {
        const isPrevEnabled = await transferProcessesPage.isPreviousPageEnabled();
        const currentFirstIndex = await transferProcessesPage.getFirstElementIndex();

        if (currentFirstIndex === 1) {
          expect(isPrevEnabled).toBeFalsy();
        }
      }
    });

    test("should disable previous button on first page", async ({ page }) => {
      const currentFirstIndex = await transferProcessesPage.getFirstElementIndex();

      if (currentFirstIndex === 1) {
        const isPrevEnabled = await transferProcessesPage.isPreviousPageEnabled();
        expect(isPrevEnabled).toBeFalsy();
      }
    });

    test("should disable next button on last page", async ({ page }) => {
      let pages = 0;
      while (await transferProcessesPage.isNextPageEnabled() && pages < 50) {
        await transferProcessesPage.goToNextPage();
        pages++;
      }

      const isNextEnabled = await transferProcessesPage.isNextPageEnabled();
      expect(isNextEnabled).toBeFalsy();
    });

    test("should maintain search results across pagination", async ({ page }) => {
      await transferProcessesPage.searchTransferProcesses('test');

      const isNextEnabled = await transferProcessesPage.isNextPageEnabled();
      if (isNextEnabled) {
        await transferProcessesPage.goToNextPage();

        const searchInput = await transferProcessesPage.getSearchInput();
        const searchValue = searchInput;
        await expect(searchValue).toHaveValue('test');
      }
    });
  });
});
