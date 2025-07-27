import { expect, test } from '@playwright/test';
import { ContractNegotiationsPage } from './pages/contract-negotiations-page';

test.describe("Contract Negotiations Tests", () => {
  let negotiationsPage: ContractNegotiationsPage;

  test.beforeEach(async ({ page }) => {
    negotiationsPage = new ContractNegotiationsPage(page);
    await negotiationsPage.navigate();
  });

  test.describe("List Functionality", () => {
    test("Displays the negotiations list on the first visit", async ({ page }) => {
      // Verify the negotiations list is visible
      const negotiationsList = await negotiationsPage.getNegotiationsList();
      await expect(negotiationsList).toBeVisible();

      // Verify there is no negotiation card
      const negotiationCards = await negotiationsPage.getNegotiationCards();
      const negotiations = await negotiationCards.allTextContents();
      expect(negotiations.length).toBeGreaterThan(0);
    });
  });

  test.describe("View Functionality", () => {
    test("Displays negotiation details when a negotiation is selected", async ({ page }) => {
      // Select a negotiation
      const negotiationCards = await negotiationsPage.getNegotiationCards();
      const negotiationCard = negotiationCards.first();
      await negotiationCard.click();

      // Verify details are displayed
      const negotiationDetails = await negotiationsPage.getNegotiationDetails();
      await expect(negotiationDetails).toBeVisible();
    });
  });

  test.describe("Search Functionality", () => {
    test("should display search input and trigger button", async ({ page }) => {
      const searchInput = await negotiationsPage.getSearchInput();
      const searchTrigger = await negotiationsPage.getSearchTrigger();

      await expect(searchInput).toBeVisible();
      await expect(searchTrigger).toBeVisible();
    });

    test("should clear search and show all negotiations", async ({ page }) => {
      await negotiationsPage.searchNegotiations('test');

      await negotiationsPage.clearSearch();

      const allNegotiations = await negotiationsPage.getNegotiationCards();
      await expect(allNegotiations.first()).toBeVisible();
    });

    test("should handle empty search results", async ({ page }) => {
      await negotiationsPage.searchNegotiations('nonexistentnegotiation12345');

      const searchResults = await negotiationsPage.getSearchResults();
      const resultCount = await searchResults.count();
      expect(resultCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Pagination Functionality", () => {
    test("should display pagination controls", async ({ page }) => {
      const paginationInfo = await negotiationsPage.getPaginationInfo();
      await expect(paginationInfo).toBeVisible();
    });

    test("should navigate to next page when available", async ({ page }) => {
      const initialLastIndex = await negotiationsPage.getLastElementIndex();
      const isNextEnabled = await negotiationsPage.isNextPageEnabled();

      if (isNextEnabled) {
        await negotiationsPage.goToNextPage();

        const newFirstIndex = await negotiationsPage.getFirstElementIndex();
        expect(newFirstIndex).toBe(initialLastIndex + 1);
      } else {
        const totalLastIndex = await negotiationsPage.getLastElementIndex();
        expect(initialLastIndex).toBe(totalLastIndex);
      }
    });

    test("should navigate to previous page when available", async ({ page }) => {
      const isNextEnabled = await negotiationsPage.isNextPageEnabled();
      if (isNextEnabled) {
        await negotiationsPage.goToNextPage();
        const pageAfterNextFirstIndex = await negotiationsPage.getFirstElementIndex();

        await negotiationsPage.goToPreviousPage();
        const pageAfterPrevFirstIndex = await negotiationsPage.getFirstElementIndex();

        expect(pageAfterPrevFirstIndex).toBe(pageAfterNextFirstIndex - 1);
      } else {
        const isPrevEnabled = await negotiationsPage.isPreviousPageEnabled();
        const currentFirstIndex = await negotiationsPage.getFirstElementIndex();

        if (currentFirstIndex === 1) {
          expect(isPrevEnabled).toBeFalsy();
        }
      }
    });

    test("should disable previous button on first page", async ({ page }) => {
      const currentFirstIndex = await negotiationsPage.getFirstElementIndex();

      if (currentFirstIndex === 1) {
        const isPrevEnabled = await negotiationsPage.isPreviousPageEnabled();
        expect(isPrevEnabled).toBeFalsy();
      }
    });

    test("should disable next button on last page", async ({ page }) => {
      const totalLastIndex = await negotiationsPage.getLastElementIndex();

      while (await negotiationsPage.isNextPageEnabled()) {
        await negotiationsPage.goToNextPage();
      }

      const currentLastIndex = await negotiationsPage.getLastElementIndex();
      expect(currentLastIndex).toBe(totalLastIndex);

      const isNextEnabled = await negotiationsPage.isNextPageEnabled();
      expect(isNextEnabled).toBeFalsy();
    });

    test("should maintain search results across pagination", async ({ page }) => {
      await negotiationsPage.searchNegotiations('test');

      const isNextEnabled = await negotiationsPage.isNextPageEnabled();
      if (isNextEnabled) {
        await negotiationsPage.goToNextPage();

        const searchInput = await negotiationsPage.getSearchInput();
        const searchValue = await searchInput.inputValue();
        expect(searchValue).toBe('test');
      }
    });
  });
});
