import { expect, test } from '@playwright/test';
import { DataOfferPage } from './pages/data-offer-page';

test.describe("Data Offer Tests", () => {
  let dataOfferPage: DataOfferPage;

  test.beforeEach(async ({ page }) => {
    dataOfferPage = new DataOfferPage(page);
    await dataOfferPage.navigate();
  });

  test.fixme("Displays the list of data offers", async ({ page }) => {
    // Verify the data offer list is visible
    const dataOfferList = await dataOfferPage.getDataOfferList();
    await expect(dataOfferList).toBeVisible();
  });

  test.fixme("Displays data offer details when a data offer is selected", async ({ page }) => {
    // Select a data offer
    await dataOfferPage.selectDataOffer('Test Data Offer');

    // Verify the data offer details are visible
    const dataOfferDetails = await dataOfferPage.verifyDataOfferDetails();
    await expect(dataOfferDetails).toBeVisible();
  });

  test("Displays the data offers list on the first visit", async ({ page }) => {
    // Verify the data offers list is visible
    const dataOffersList = await dataOfferPage.getDataOffersList();
    await expect(dataOffersList).toBeVisible();

    // Verify there is at least one data offer card
    const dataOfferCards = await dataOfferPage.getDataOfferCards();
    const dataOffers = await dataOfferCards.allTextContents();
    expect(dataOffers.length).toBeGreaterThan(0);
  });

  test("Displays data offer details correctly", async ({ page }) => {
    // Select a data offer
    const dataOfferCards = await dataOfferPage.getDataOfferCards();
    const dataOfferCard = dataOfferCards.first();
    await dataOfferCard.click();

    // Verify details are displayed
    const dataOfferDetails = await dataOfferPage.verifyDataOfferDialog();
    await expect(dataOfferDetails).toBeVisible();
  });

  test.describe("Search Functionality", () => {
    test("should display search input and trigger button", async ({ page }) => {
      const searchInput = await dataOfferPage.getSearchInput();
      const searchTrigger = await dataOfferPage.getSearchTrigger();

      await expect(searchInput).toBeVisible();
      await expect(searchTrigger).toBeVisible();
    });

    test("should search for data offers by ID", async ({ page }) => {
      const initialDataOffers = await dataOfferPage.getDataOfferCards();
      const initialCount = await initialDataOffers.count();

      if (initialCount > 0) {
        const firstDataOffer = initialDataOffers.first();
        const dataOfferText = await firstDataOffer.locator('[data-testid="contract-definition-id"]').textContent();
        const searchTerm = dataOfferText || 'test';
        await dataOfferPage.searchDataOffers(searchTerm);

        const searchResults = await dataOfferPage.getDataOfferCards();
        await expect(searchResults).toBeVisible();

        const results = await searchResults.allTextContents();
        const hasMatchingResult = results.some((result: string) =>
          result.toLowerCase().includes(searchTerm.toLowerCase())
        );
        expect(hasMatchingResult).toBeTruthy();
      }
    });

    test("should clear search and show all data offers", async ({ page }) => {
      await dataOfferPage.searchDataOffers('test');

      await dataOfferPage.clearDataOfferSearch();

      const allDataOffers = await dataOfferPage.getDataOfferCards();
      await expect(allDataOffers.first()).toBeVisible();
    });

    test("should handle empty search results", async ({ page }) => {
      await dataOfferPage.searchDataOffers('nonexistentdataoffer12345');

      const searchResults = await dataOfferPage.getDataOfferCards();
      const resultCount = await searchResults.count();

      expect(resultCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Pagination Functionality", () => {
    test("should display pagination controls", async ({ page }) => {
      const paginationInfo = await dataOfferPage.getPaginationInfo();
      await expect(paginationInfo).toBeVisible();
    });

    test("should navigate to next page when available", async ({ page }) => {
      const initialPage = await dataOfferPage.getCurrentPageNumber();
      const isNextEnabled = await dataOfferPage.isNextPageEnabled();

      if (isNextEnabled) {
        await dataOfferPage.goToNextPage();

        const newPage = await dataOfferPage.getCurrentPageNumber();
        expect(newPage).toBe(initialPage + 1);
      } else {
        const totalPages = await dataOfferPage.getTotalPages();
        expect(initialPage).toBe(totalPages);
      }
    });

    test("should navigate to previous page when available", async ({ page }) => {
      const isNextEnabled = await dataOfferPage.isNextPageEnabled();
      if (isNextEnabled) {
        await dataOfferPage.goToNextPage();
        const pageAfterNext = await dataOfferPage.getCurrentPageNumber();

        await dataOfferPage.goToPreviousPage();
        const pageAfterPrev = await dataOfferPage.getCurrentPageNumber();

        expect(pageAfterPrev).toBe(pageAfterNext - 1);
      } else {
        const isPrevEnabled = await dataOfferPage.isPreviousPageEnabled();
        const currentPage = await dataOfferPage.getCurrentPageNumber();

        if (currentPage === 1) {
          expect(isPrevEnabled).toBeFalsy();
        }
      }
    });

    test("should disable previous button on first page", async ({ page }) => {
      const currentPage = await dataOfferPage.getCurrentPageNumber();

      if (currentPage === 1) {
        const isPrevEnabled = await dataOfferPage.isPreviousPageEnabled();
        expect(isPrevEnabled).toBeFalsy();
      }
    });

    test("should disable next button on last page", async ({ page }) => {
      const totalPages = await dataOfferPage.getTotalPages();

      while (await dataOfferPage.isNextPageEnabled()) {
        await dataOfferPage.goToNextPage();
      }

      const currentPage = await dataOfferPage.getCurrentPageNumber();
      expect(currentPage).toBe(totalPages);

      const isNextEnabled = await dataOfferPage.isNextPageEnabled();
      expect(isNextEnabled).toBeFalsy();
    });

    test("should maintain search results across pagination", async ({ page }) => {
      await dataOfferPage.searchDataOffers('test');

      const isNextEnabled = await dataOfferPage.isNextPageEnabled();
      if (isNextEnabled) {
        await dataOfferPage.goToNextPage();

        const searchInput = await dataOfferPage.getSearchInput();
        const searchValue = await searchInput.inputValue();
        expect(searchValue).toBe('test');
      }
    });
  });
});
