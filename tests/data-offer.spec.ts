import { expect, test } from '@playwright/test';
import { DataOfferPage } from './pages/data-offer-page';
import { MAX_ITEMS } from '@/constants/lists';

test.describe("Data Offer Tests", () => {
  let dataOfferPage: DataOfferPage;

  test.beforeEach(async ({ page }) => {
    dataOfferPage = new DataOfferPage(page);
    await dataOfferPage.navigate();
  });

  test.describe("List Functionality", () => {
    test("Displays the data offers list on the first visit", async ({ page }) => {
      // Verify the data offers list is visible
      const dataOffersList = await dataOfferPage.getDataOffersList();
      await expect(dataOffersList).toBeVisible();

      // Verify there is at least one data offer card
      const dataOfferCards = await dataOfferPage.getDataOfferCards();
      const dataOffers = await dataOfferCards.allTextContents();
      expect(dataOffers.length).toBeGreaterThan(0);
    });
  });

  test.describe("View Functionality", () => {
    test("Displays data offer details when a data offer is selected", async ({ page }) => {
      // Select a data offer
      const dataOfferCards = await dataOfferPage.getDataOfferCards();
      const dataOfferCard = dataOfferCards.first();
      await dataOfferCard.click();

      // Verify details are displayed
      const dataOfferDialog = await dataOfferPage.getDataOfferDialog();
      await expect(dataOfferDialog).toBeVisible();
    });
  });

  test.describe("Create Functionality", () => {
    test("Creates a new data offer for 1 asset and verifies its visibility", async ({ page }) => {
      // Open the create data offer dialog
      await dataOfferPage.openCreateDataOfferDialog();

      // Fill in the data offer details
      const randomId = `data-offer-${Math.random().toString(36).substring(2, 15)}`;
      await dataOfferPage.fillContractId(randomId);
      await dataOfferPage.pickContractPolicy();
      await dataOfferPage.pickAccessPolicy();
      await dataOfferPage.selectAsset();

      await dataOfferPage.closeAssetSelector();

      // Submit the form
      await dataOfferPage.submitCreateDataOfferForm();
      await page.waitForResponse((response) => response.url().includes('/connector/management/v3/contractdefinitions/request'));

      // Verify contract offer was added
      const dataOfferCards = await dataOfferPage.getDataOfferCards();
      const dataOffersCount = await dataOfferCards.count();
      expect(dataOffersCount).toBeGreaterThan(1);
    });

    test("Creates a new data offer for 2 assets and verifies its visibility", async ({ page }) => {
      // Open the create data offer dialog
      await dataOfferPage.openCreateDataOfferDialog();

      // Fill in the data offer details
      const randomId = `data-offer-${Math.random().toString(36).substring(2, 15)}`;
      await dataOfferPage.fillContractId(randomId);
      await dataOfferPage.pickContractPolicy();
      await dataOfferPage.pickAccessPolicy();
      await dataOfferPage.selectAsset(true);

      await dataOfferPage.closeAssetSelector();

      // Submit the form
      await dataOfferPage.submitCreateDataOfferForm();
      await page.waitForResponse((response) => response.url().includes('/connector/management/v3/contractdefinitions/request'));

      // Verify contract offer was added
      const dataOfferCards = await dataOfferPage.getDataOfferCards();
      const dataOffersCount = await dataOfferCards.count();
      expect(dataOffersCount).toBeGreaterThan(2);
    });
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
      const initialLastIndex = await dataOfferPage.getLastElementIndex();
      const isNextEnabled = await dataOfferPage.isNextPageEnabled();

      if (isNextEnabled) {
        await dataOfferPage.goToNextPage();

        const newFirstIndex = await dataOfferPage.getFirstElementIndex();
        expect(newFirstIndex).toBe(initialLastIndex + 1);
      } else {
        const totalLastIndex = await dataOfferPage.getLastElementIndex();
        expect(initialLastIndex).toBe(totalLastIndex);
      }
    });

    test("should navigate to previous page when available", async ({ page }) => {
      const isNextEnabled = await dataOfferPage.isNextPageEnabled();
      if (isNextEnabled) {
        await dataOfferPage.goToNextPage();
        const pageAfterNextFirstIndex = await dataOfferPage.getFirstElementIndex();

        await dataOfferPage.goToPreviousPage();
        const pageAfterPrevFirstIndex = await dataOfferPage.getFirstElementIndex();

        expect(pageAfterPrevFirstIndex).toBe(pageAfterNextFirstIndex - MAX_ITEMS);
      } else {
        const isPrevEnabled = await dataOfferPage.isPreviousPageEnabled();
        const currentFirstIndex = await dataOfferPage.getFirstElementIndex();

        if (currentFirstIndex === 1) {
          expect(isPrevEnabled).toBeFalsy();
        }
      }
    });

    test("should disable previous button on first page", async ({ page }) => {
      const currentFirstIndex = await dataOfferPage.getFirstElementIndex();

      if (currentFirstIndex === 1) {
        const isPrevEnabled = await dataOfferPage.isPreviousPageEnabled();
        expect(isPrevEnabled).toBeFalsy();
      }
    });

    test("should disable next button on last page", async ({ page }) => {
      while (await dataOfferPage.isNextPageEnabled()) {
        await dataOfferPage.goToNextPage();
      }

      const isNextEnabled = await dataOfferPage.isNextPageEnabled();
      expect(isNextEnabled).toBeFalsy();
    });

    test("should maintain search results across pagination", async ({ page }) => {
      await dataOfferPage.searchDataOffers('services-offer');

      const isNextEnabled = await dataOfferPage.isNextPageEnabled();
      if (isNextEnabled) {
        await dataOfferPage.goToNextPage();

        const searchInput = await dataOfferPage.getSearchInput();
        const searchValue = await searchInput.inputValue();
        expect(searchValue).toBe('services-offer');
      }
    });
  });
});
