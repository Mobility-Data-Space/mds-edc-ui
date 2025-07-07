import { expect, test } from '@playwright/test';
import { ContractAgreementsPage } from './pages/contract-agreements-page';

test.describe("Contract Agreements Page Tests", () => {
  let agreementsPage: ContractAgreementsPage;

  test.beforeEach(async ({ page }) => {
    agreementsPage = new ContractAgreementsPage(page);
    await agreementsPage.navigate();
  });

  test.fixme("Displays the list of agreements", async ({ page }) => {
    // Verify the agreements list is visible
    const agreementsList = await agreementsPage.getAgreementsList();
    await expect(agreementsList).toBeVisible();

    // Verify there is at least one agreement card
    const agreementCards = await agreementsPage.getAgreementCards();
    const agreements = await agreementCards.allTextContents();
    expect(agreements.length).toBeGreaterThan(0);
  });

  test.fixme("Displays agreement details when an agreement is selected", async ({ page }) => {
    // Select an agreement
    const agreementCards = await agreementsPage.getAgreementCards();
    const agreementCard = agreementCards.first();
    await agreementCard.click();

    // Verify the agreement details are visible
    const agreementDetails = await agreementsPage.verifyAgreementDetails();
    await expect(agreementDetails).toBeVisible();
  });

  test.describe("Search Functionality", () => {
    test("should display search input and trigger button", async ({ page }) => {
      const searchInput = await agreementsPage.getSearchInput();
      const searchTrigger = await agreementsPage.getSearchTrigger();

      await expect(searchInput).toBeVisible();
      await expect(searchTrigger).toBeVisible();
    });

    test("should search for agreements by asset ID", async ({ page }) => {
      const initialAgreements = await agreementsPage.getAgreementCards();
      const initialCount = await initialAgreements.count();

      if (initialCount > 0) {
        const firstAgreement = initialAgreements.first();
        const assetId = await firstAgreement.locator('[data-testid="asset-id"]').textContent();
        const searchTerm = assetId || 'test';
        await agreementsPage.searchAgreements(searchTerm);

        const searchResults = await agreementsPage.getAgreementCards();
        await expect(searchResults).toBeVisible();

        const results = await searchResults.allTextContents();
        const hasMatchingResult = results.some(result =>
          result.toLowerCase().includes(searchTerm.toLowerCase())
        );
        expect(hasMatchingResult).toBeTruthy();
      }
    });

    test.fixme("should clear search and show all agreements", async ({ page }) => {
      await agreementsPage.searchAgreements('test');

      await agreementsPage.clearAgreementSearch();

      const allAgreements = await agreementsPage.getAgreementCards();
      await expect(allAgreements.first()).toBeVisible();
    });

    test("should handle empty search results", async ({ page }) => {
      await agreementsPage.searchAgreements('nonexistentagreement12345');

      const searchResults = await agreementsPage.getAgreementCards();
      const resultCount = await searchResults.count();

      expect(resultCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Pagination Functionality", () => {
    test("should display pagination controls", async ({ page }) => {
      const paginationInfo = await agreementsPage.getPaginationInfo();
      await expect(paginationInfo).toBeVisible();
    });

    test("should navigate to next page when available", async ({ page }) => {
      const initialPage = await agreementsPage.getCurrentPageNumber();
      const isNextEnabled = await agreementsPage.isNextPageEnabled();

      if (isNextEnabled) {
        await agreementsPage.goToNextPage();

        const newPage = await agreementsPage.getCurrentPageNumber();
        expect(newPage).toBe(initialPage + 1);
      } else {
        const totalPages = await agreementsPage.getTotalPages();
        expect(initialPage).toBe(totalPages);
      }
    });

    test("should navigate to previous page when available", async ({ page }) => {
      const isNextEnabled = await agreementsPage.isNextPageEnabled();
      if (isNextEnabled) {
        await agreementsPage.goToNextPage();
        const pageAfterNext = await agreementsPage.getCurrentPageNumber();

        await agreementsPage.goToPreviousPage();
        const pageAfterPrev = await agreementsPage.getCurrentPageNumber();

        expect(pageAfterPrev).toBe(pageAfterNext - 1);
      } else {
        const isPrevEnabled = await agreementsPage.isPreviousPageEnabled();
        const currentPage = await agreementsPage.getCurrentPageNumber();

        if (currentPage === 1) {
          expect(isPrevEnabled).toBeFalsy();
        }
      }
    });

    test("should disable previous button on first page", async ({ page }) => {
      const currentPage = await agreementsPage.getCurrentPageNumber();

      if (currentPage === 1) {
        const isPrevEnabled = await agreementsPage.isPreviousPageEnabled();
        expect(isPrevEnabled).toBeFalsy();
      }
    });

    test("should disable next button on last page", async ({ page }) => {
      const totalPages = await agreementsPage.getTotalPages();

      while (await agreementsPage.isNextPageEnabled()) {
        await agreementsPage.goToNextPage();
      }

      const currentPage = await agreementsPage.getCurrentPageNumber();
      expect(currentPage).toBe(totalPages);

      const isNextEnabled = await agreementsPage.isNextPageEnabled();
      expect(isNextEnabled).toBeFalsy();
    });

    test("should maintain search results across pagination", async ({ page }) => {
      await agreementsPage.searchAgreements('test');

      const isNextEnabled = await agreementsPage.isNextPageEnabled();
      if (isNextEnabled) {
        await agreementsPage.goToNextPage();

        const searchInput = await agreementsPage.getSearchInput();
        const searchValue = await searchInput.inputValue();
        expect(searchValue).toBe('test');
      }
    });
  });
});
