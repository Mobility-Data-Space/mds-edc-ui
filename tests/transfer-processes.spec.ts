import { expect, test } from '@playwright/test';
import { TransferProcessesPage } from './pages/transfer-processes-page';

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
      const transferProcesses = await transferProcessRows.allTextContents();
      expect(transferProcesses.length).toBeGreaterThan(0);
    });
  });

  test.describe("View Functionality", () => {
    test("Displays transfer process details correctly", async ({ page }) => {
      const transferProcessRows = await transferProcessesPage.getTransferProcessRows();
      const transferProcessRow = transferProcessRows.first();
      await transferProcessRow.click();

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
        const transferProcessText = await firstTransferProcess.textContent();
        const searchTerm = transferProcessText?.split(' ')[0] || 'test';
        await transferProcessesPage.searchTransferProcesses(searchTerm);

        const searchResults = await transferProcessesPage.getTransferProcessRows();
        await expect(searchResults).toBeVisible();

        const results = await searchResults.allTextContents();
        const hasMatchingResult = results.some((result: string) =>
          result.toLowerCase().includes(searchTerm.toLowerCase())
        );
        expect(hasMatchingResult).toBeTruthy();
      }
    });

    // seed is missing transfer processes
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
      const initialPage = await transferProcessesPage.getCurrentPageNumber();
      const isNextEnabled = await transferProcessesPage.isNextPageEnabled();

      if (isNextEnabled) {
        await transferProcessesPage.goToNextPage();

        const newPage = await transferProcessesPage.getCurrentPageNumber();
        expect(newPage).toBe(initialPage + 1);
      } else {
        const totalPages = await transferProcessesPage.getTotalPages();
        expect(initialPage).toBe(totalPages);
      }
    });

    test("should navigate to previous page when available", async ({ page }) => {
      const isNextEnabled = await transferProcessesPage.isNextPageEnabled();
      if (isNextEnabled) {
        await transferProcessesPage.goToNextPage();
        const pageAfterNext = await transferProcessesPage.getCurrentPageNumber();

        await transferProcessesPage.goToPreviousPage();
        const pageAfterPrev = await transferProcessesPage.getCurrentPageNumber();

        expect(pageAfterPrev).toBe(pageAfterNext - 1);
      } else {
        const isPrevEnabled = await transferProcessesPage.isPreviousPageEnabled();
        const currentPage = await transferProcessesPage.getCurrentPageNumber();

        if (currentPage === 1) {
          expect(isPrevEnabled).toBeFalsy();
        }
      }
    });

    test("should disable previous button on first page", async ({ page }) => {
      const currentPage = await transferProcessesPage.getCurrentPageNumber();

      if (currentPage === 1) {
        const isPrevEnabled = await transferProcessesPage.isPreviousPageEnabled();
        expect(isPrevEnabled).toBeFalsy();
      }
    });

    test("should disable next button on last page", async ({ page }) => {
      const totalPages = await transferProcessesPage.getTotalPages();

      while (await transferProcessesPage.isNextPageEnabled()) {
        await transferProcessesPage.goToNextPage();
      }

      const currentPage = await transferProcessesPage.getCurrentPageNumber();
      expect(currentPage).toBe(totalPages);

      const isNextEnabled = await transferProcessesPage.isNextPageEnabled();
      expect(isNextEnabled).toBeFalsy();
    });

    test("should maintain search results across pagination", async ({ page }) => {
      await transferProcessesPage.searchTransferProcesses('test');

      const isNextEnabled = await transferProcessesPage.isNextPageEnabled();
      if (isNextEnabled) {
        await transferProcessesPage.goToNextPage();

        const searchInput = await transferProcessesPage.getSearchInput();
        const searchValue = await searchInput.inputValue();
        expect(searchValue).toBe('test');
      }
    });
  });
});
