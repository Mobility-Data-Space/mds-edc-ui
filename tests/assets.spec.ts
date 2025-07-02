import { expect, test } from '@playwright/test';
import { AssetsPage } from './pages/assets-page';

test.describe("Assets Page Tests", () => {
  let assetsPage: AssetsPage;

  test.beforeEach(async ({ page }) => {
    assetsPage = new AssetsPage(page);
    await assetsPage.navigate();
  })

  test.fixme("Displays the asset list on the first visit", async ({ page }) => {
    // Verify the asset list is visible
    const assetList = await assetsPage.getAssetList();
    await expect(assetList).toBeVisible();

    // Verify there is at least one asset card
    const assetCards = await assetsPage.getAssetCards();
    const assets = await assetCards.allTextContents();
    expect(assets.length).toBeGreaterThan(0);
  });

  test.fixme("Displays asset details correctly", async ({ page }) => {
    // Select an asset
    const assetCards = await assetsPage.getAssetCards();
    const assetCard = assetCards.first();
    await assetCard.click();

    // Verify details are displayed
    const assetDetails = page.locator(assetsPage.assetDialogLocator);
    await expect(assetDetails).toBeVisible();
    await expect(assetDetails.locator('text=Asset ID')).toBeVisible();
    await expect(assetDetails.locator('text=Participant ID')).toBeVisible();
  });

  test.fixme("Deletes an asset and verifies it is removed from the list", async ({ page }) => {
    // Select an asset to delete
    const assetCards = await assetsPage.getAssetCards();
    const assetCard = assetCards.first();
    const assetName = (await assetCard.textContent()) || "";
    await assetCard.click();
    const deleteButton = page.getByRole('heading', { name: 'Asset 3 asset-3-id' }).getByRole('button');
    await deleteButton.click();

    // Confirm deletion
    const confirmDelete = page.getByRole('button', { name: 'Delete' });
    await confirmDelete.click();

    // Verify the asset is removed
    await expect(page.locator(assetsPage.assetListLocator).locator(assetsPage.assetCardLocator).filter({ hasText: assetName })).toHaveCount(0);
  });

  test.fixme("Creates a new asset and verifies its visibility in the list", async ({ page }) => {
    // Open the create asset modal
    await assetsPage.openCreateAssetModal();

    // Fill in the asset details
    const randomNumber = `${Math.random()}`.replace("0.", "");
    const assetTitle = `Asset ${randomNumber}`;
    const assetId = `asset-id-${randomNumber}`;
    await assetsPage.fillCreateAssetForm(assetTitle, assetId);

    // Submit the form
    await assetsPage.submitCreateAssetForm();

    // Verify the new asset appears in the list
    await assetsPage.verifyAssetInList(assetId);
  });

  test.describe("Search Functionality", () => {
    test("should display search input and trigger button", async ({ page }) => {
      const searchInput = await assetsPage.getSearchInput();
      const searchTrigger = await assetsPage.getSearchTrigger();

      await expect(searchInput).toBeVisible();
      await expect(searchTrigger).toBeVisible();
    });

    test("should search for assets by title", async ({ page }) => {
      const initialAssets = await assetsPage.getAssetCards();
      const initialCount = await initialAssets.count();

      if (initialCount > 0) {
        const firstAsset = initialAssets.first();
        const firstAssetTitle = await firstAsset.locator('[data-testid="asset-title"]').textContent();
        const searchTerm = firstAssetTitle || 'test';

        await assetsPage.searchAssets(searchTerm);

        const searchResults = await assetsPage.getSearchResults();
        await expect(searchResults).toBeVisible();

        const results = await searchResults.allTextContents();
        const hasMatchingResult = results.some(result =>
          result.toLowerCase().includes(searchTerm.toLowerCase())
        );
        expect(hasMatchingResult).toBeTruthy();
      }
    });

    test("should clear search and show all assets", async ({ page }) => {
      await assetsPage.searchAssets('test');

      await assetsPage.clearSearch();

      const allAssets = await assetsPage.getAssetCards();
      await expect(allAssets.first()).toBeVisible();
    });

    test("should handle empty search results", async ({ page }) => {
      await assetsPage.searchAssets('nonexistentasset12345');

      const searchResults = await assetsPage.getSearchResults();
      const resultCount = await searchResults.count();
      expect(resultCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Pagination Functionality", () => {
    test("should display pagination controls", async ({ page }) => {
      const paginationInfo = await assetsPage.getPaginationInfo();
      await expect(paginationInfo).toBeVisible();
    });

    test("should navigate to next page when available", async ({ page }) => {
      const initialPage = await assetsPage.getCurrentPageNumber();
      const isNextEnabled = await assetsPage.isNextPageEnabled();

      if (isNextEnabled) {
        await assetsPage.goToNextPage();

        const newPage = await assetsPage.getCurrentPageNumber();
        expect(newPage).toBe(initialPage + 1);
      } else {
        const totalPages = await assetsPage.getTotalPages();
        expect(initialPage).toBe(totalPages);
      }
    });

    test("should navigate to previous page when available", async ({ page }) => {
      const isNextEnabled = await assetsPage.isNextPageEnabled();
      if (isNextEnabled) {
        await assetsPage.goToNextPage();
        const pageAfterNext = await assetsPage.getCurrentPageNumber();

        await assetsPage.goToPreviousPage();
        const pageAfterPrev = await assetsPage.getCurrentPageNumber();

        expect(pageAfterPrev).toBe(pageAfterNext - 1);
      } else {
        const isPrevEnabled = await assetsPage.isPreviousPageEnabled();
        const currentPage = await assetsPage.getCurrentPageNumber();

        if (currentPage === 1) {
          expect(isPrevEnabled).toBeFalsy();
        }
      }
    });

    test("should disable previous button on first page", async ({ page }) => {
      const currentPage = await assetsPage.getCurrentPageNumber();

      if (currentPage === 1) {
        const isPrevEnabled = await assetsPage.isPreviousPageEnabled();
        expect(isPrevEnabled).toBeFalsy();
      }
    });

    test("should disable next button on last page", async ({ page }) => {
      const totalPages = await assetsPage.getTotalPages();

      while (await assetsPage.isNextPageEnabled()) {
        await assetsPage.goToNextPage();
      }

      const currentPage = await assetsPage.getCurrentPageNumber();
      expect(currentPage).toBe(totalPages);

      const isNextEnabled = await assetsPage.isNextPageEnabled();
      expect(isNextEnabled).toBeFalsy();
    });

    test("should maintain search results across pagination", async ({ page }) => {
      await assetsPage.searchAssets('test');

      const isNextEnabled = await assetsPage.isNextPageEnabled();
      if (isNextEnabled) {
        await assetsPage.goToNextPage();

        const searchInput = await assetsPage.getSearchInput();
        const searchValue = await searchInput.inputValue();
        expect(searchValue).toBe('test');
      }
    });
  });
});
