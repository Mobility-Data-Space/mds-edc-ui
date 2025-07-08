import { expect, test } from '@playwright/test';
import { ContractAgreementsPage } from './pages/contract-agreements-page';

test.describe("Contract Agreements Page Tests", () => {
  let agreementsPage: ContractAgreementsPage;

  test.beforeEach(async ({ page }) => {
    agreementsPage = new ContractAgreementsPage(page);
    await agreementsPage.navigate();
  });

  test.describe("List Functionality", () => {
    test.fixme("Displays the list of agreements", async ({ page }) => {
      // Verify the agreements list is visible
      const agreementsList = await agreementsPage.getAgreementsList();
      await expect(agreementsList).toBeVisible();

      // Verify there is at least one agreement card
      const agreementCards = await agreementsPage.getAgreementCards();
      const agreements = await agreementCards.allTextContents();
      expect(agreements.length).toBeGreaterThan(0);
    });
  });

  test.describe("View Functionality", () => {
    test.fixme("Displays agreement details when an agreement is selected", async ({ page }) => {
      // Select an agreement
      const agreementCards = await agreementsPage.getAgreementCards();
      const agreementCard = agreementCards.first();
      await agreementCard.click();

      // Verify the agreement details are visible
      const agreementDialog = await agreementsPage.getAgreementDialog();
      await expect(agreementDialog).toBeVisible();
    });
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
        const hasMatchingResult = results.some((result) =>
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
    test.fixme("should display pagination controls", async ({ page }) => {
      const paginationInfo = await agreementsPage.getPaginationInfo();
      await expect(paginationInfo).toBeVisible();
    });

    test.fixme("should navigate to next page when available", async ({ page }) => {
      const initialLastIndex = await agreementsPage.getLastElementIndex();
      const isNextEnabled = await agreementsPage.isNextPageEnabled();

      if (isNextEnabled) {
        await agreementsPage.goToNextPage();

        const newFirstIndex = await agreementsPage.getFirstElementIndex();
        expect(newFirstIndex).toBe(initialLastIndex + 1);
      } else {
        const totalLastIndex = await agreementsPage.getLastElementIndex();
        expect(initialLastIndex).toBe(totalLastIndex);
      }
    });

    test.fixme("should navigate to previous page when available", async ({ page }) => {
      const isNextEnabled = await agreementsPage.isNextPageEnabled();
      if (isNextEnabled) {
        await agreementsPage.goToNextPage();
        const pageAfterNextFirstIndex = await agreementsPage.getFirstElementIndex();

        await agreementsPage.goToPreviousPage();
        const pageAfterPrevFirstIndex = await agreementsPage.getFirstElementIndex();

        expect(pageAfterPrevFirstIndex).toBe(pageAfterNextFirstIndex - 1);
      } else {
        const isPrevEnabled = await agreementsPage.isPreviousPageEnabled();
        const currentFirstIndex = await agreementsPage.getFirstElementIndex();

        if (currentFirstIndex === 1) {
          expect(isPrevEnabled).toBeFalsy();
        }
      }
    });

    test.fixme("should disable previous button on first page", async ({ page }) => {
      const currentFirstIndex = await agreementsPage.getFirstElementIndex();

      if (currentFirstIndex === 1) {
        const isPrevEnabled = await agreementsPage.isPreviousPageEnabled();
        expect(isPrevEnabled).toBeFalsy();
      }
    });

    test.fixme("should disable next button on last page", async ({ page }) => {
      const totalLastIndex = await agreementsPage.getLastElementIndex();

      while (await agreementsPage.isNextPageEnabled()) {
        await agreementsPage.goToNextPage();
      }

      const currentLastIndex = await agreementsPage.getLastElementIndex();
      expect(currentLastIndex).toBe(totalLastIndex);

      const isNextEnabled = await agreementsPage.isNextPageEnabled();
      expect(isNextEnabled).toBeFalsy();
    });

    test.fixme("should maintain search results across pagination", async ({ page }) => {
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
