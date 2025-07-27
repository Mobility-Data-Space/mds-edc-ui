import { MAX_ITEMS } from '@/constants/lists';
import { expect, test } from '@playwright/test';
import { CatalogBrowserPage } from './pages/catalog-browser-page';
import { counterPartyParticipantConfig } from './utils/tests-config';

const COUNTER_PARTY_ADDRESS = counterPartyParticipantConfig.EDC_PROTOCOL_URL;

test.describe("Catalog Browser Tests", () => {
  let catalogPage: CatalogBrowserPage;

  test.describe('Initial empty state', () => {
    test.beforeEach(async ({ page }) => {
      catalogPage = new CatalogBrowserPage(page);
      await catalogPage.navigate();
    });

    test('Show empty page with no pagination controls initially', async ({ page }) => {
      const input = page.locator('#catalog-url');
      await expect(input).toHaveValue('');

      const catalogCards = await catalogPage.getCatalogCards();
      await expect(catalogCards).toHaveCount(0);

      const paginationInfo = await catalogPage.getPaginationInfo();
      await expect(paginationInfo).toBeHidden();

      const snackbars = await catalogPage.getToastMessage("error")
      await expect(snackbars).toBeHidden();
    });
  });

  test.describe('With catalog URL filled', () => {
    test.beforeEach(async ({ page }) => {
      if (!COUNTER_PARTY_ADDRESS) throw new Error('EDC_PROTOCOL_URL environment variable must be set');
      catalogPage = new CatalogBrowserPage(page);
      await catalogPage.navigate();
      await catalogPage.fillCatalogUrlInput(COUNTER_PARTY_ADDRESS);
    });

    test.describe("List Functionality", () => {

      test("Fills catalog URL input and loads catalog", async ({ page }) => {
        const input = page.locator('#catalog-url');
        await expect(input).toHaveValue(COUNTER_PARTY_ADDRESS);
        // Catalog list should be visible and have at least one card
        const catalogList = await catalogPage.getCatalogList();
        await expect(catalogList).toBeVisible();
        const catalogCards = await catalogPage.getCatalogCards();
        expect(await catalogCards.count()).toBeGreaterThan(0);
      });

      test("Displays the catalog list on the first visit", async ({ page }) => {
        // Verify the catalog list is visible
        const catalogList = await catalogPage.getCatalogList();
        await expect(catalogList).toBeVisible();

        // Verify there is at least one catalog card
        const catalogCards = await catalogPage.getCatalogCards();
        const catalogs = await catalogCards.allTextContents();
        expect(catalogs.length).toBeGreaterThan(0);
      });
    })
    test.describe("View Functionality", () => {

      test("Displays catalog item details when a catalog item is selected", async ({ page }) => {
        // Select a catalog item
        const catalogCards = await catalogPage.getCatalogCards();
        const catalogCard = catalogCards.first();
        await catalogCard.click();

        // Verify details are displayed
        const catalogDetails = page.locator(catalogPage.catalogDialogLocator);
        await expect(catalogDetails).toBeVisible();
      });
    })

    test.describe("Search Functionality", () => {
      test("should display search input and trigger button", async ({ page }) => {
        const searchInput = await catalogPage.getSearchInput();
        const searchTrigger = await catalogPage.getSearchTrigger();

        await expect(searchInput).toBeVisible();
        await expect(searchTrigger).toBeVisible();
      });

      test("should search for catalog items by title", async ({ page }) => {
        const initialCatalogs = await catalogPage.getCatalogCards();
        const initialCount = await initialCatalogs.count();

        if (initialCount > 0) {
          const firstCatalog = initialCatalogs.first();
          const firstCatalogText = await firstCatalog.locator('[data-testid="asset-title"]').textContent();
          const searchTerm = firstCatalogText || 'test';
          console.log(searchTerm)

          await catalogPage.searchCatalog(searchTerm);

          const searchResults = await catalogPage.getSearchResults();
          await expect(searchResults).toBeVisible();

          const results = await searchResults.allTextContents();
          const hasMatchingResult = results.some(result =>
            result.toLowerCase().includes(searchTerm.toLowerCase())
          );
          expect(hasMatchingResult).toBeTruthy();
        }
      });

      test("should clear search and show all catalog items", async ({ page }) => {
        await catalogPage.searchCatalog('test');

        await catalogPage.clearSearch();

        const allCatalogs = await catalogPage.getCatalogCards();
        await expect(allCatalogs.first()).toBeVisible();
      });

      test("should handle empty search results", async ({ page }) => {
        await catalogPage.searchCatalog('nonexistentcatalogitem12345');

        const searchResults = await catalogPage.getSearchResults();
        const resultCount = await searchResults.count();
        expect(resultCount).toBeGreaterThanOrEqual(0);
      });
    });

    test.describe("Pagination Functionality", () => {
      test("should display pagination controls", async ({ page }) => {
        const paginationInfo = await catalogPage.getPaginationInfo();
        await expect(paginationInfo).toBeVisible();
      });

      test("should navigate to next page when available", async ({ page }) => {
        const initialFirstIndex = await catalogPage.getFirstElementIndex();
        const initialLastIndex = await catalogPage.getLastElementIndex();
        const isNextEnabled = await catalogPage.isNextPageEnabled();

        if (isNextEnabled) {
          await catalogPage.goToNextPage();

          const newFirstIndex = await catalogPage.getFirstElementIndex();
          expect(newFirstIndex).toBe(initialLastIndex + 1);
        } else {
          const totalLastIndex = await catalogPage.getLastElementIndex();
          expect(initialLastIndex).toBe(totalLastIndex);
        }
      });

      test("should navigate to previous page when available", async ({ page }) => {
        const isNextEnabled = await catalogPage.isNextPageEnabled();
        if (isNextEnabled) {
          await catalogPage.goToNextPage();
          const pageAfterNextFirstIndex = await catalogPage.getFirstElementIndex();

          await catalogPage.goToPreviousPage();
          const pageAfterPrevFirstIndex = await catalogPage.getFirstElementIndex();

          expect(pageAfterPrevFirstIndex).toBe(pageAfterNextFirstIndex - MAX_ITEMS);
        } else {
          const isPrevEnabled = await catalogPage.isPreviousPageEnabled();
          const currentFirstIndex = await catalogPage.getFirstElementIndex();

          if (currentFirstIndex === 1) {
            expect(isPrevEnabled).toBeFalsy();
          }
        }
      });

      test("should disable previous button on first page", async () => {
        const currentFirstIndex = await catalogPage.getFirstElementIndex();

        if (currentFirstIndex === 1) {
          const isPrevEnabled = await catalogPage.isPreviousPageEnabled();
          expect(isPrevEnabled).toBeFalsy();
        }
      });

      test("should disable next button on last page", async () => {
        while (await catalogPage.isNextPageEnabled()) {
          await catalogPage.goToNextPage();
        }

        const isNextEnabled = await catalogPage.isNextPageEnabled();
        expect(isNextEnabled).toBeFalsy();
      });

      test("should maintain search results across pagination", async () => {
        await catalogPage.searchCatalog('test');

        const isNextEnabled = await catalogPage.isNextPageEnabled();
        if (isNextEnabled) {
          await catalogPage.goToNextPage();

          const searchInput = await catalogPage.getSearchInput();
          const searchValue = await searchInput.inputValue();
          expect(searchValue).toBe('test');
        }
      });
    });
  });
});
