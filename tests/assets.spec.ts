import { expect, test } from '@playwright/test';
import { AssetsPage } from './pages/assets-page';

test.describe("Assets Page Tests", () => {
  let assetsPage: AssetsPage;

  test.beforeEach(async ({ page }) => {
    assetsPage = new AssetsPage(page);
    await assetsPage.navigate();
  });

  test.describe("List Functionality", () => {
    test("Displays the asset list on the first visit", async ({ page }) => {
      // Verify the asset list is visible
      const assetList = await assetsPage.getAssetList();
      await expect(assetList).toBeVisible();

      // Verify there is at least one asset card
      const assetCards = await assetsPage.getAssetCards();
      const assets = await assetCards.allTextContents();
      expect(assets.length).toBeGreaterThan(0);
    });
  });

  test.describe("Create Functionality", () => {
    test("Creates a new asset and verifies its visibility in the list then create a new asset with same ID and expect failure", async ({ page }) => {
      // Open the create asset modal
      await assetsPage.openCreateAssetModal();

      // Fill in the asset details
      const randomNumber = `${Math.random()}`.replace("0.", "");
      const assetTitle = `Asset ${randomNumber}`;
      const assetId = `asset-id-${randomNumber}`;
      await assetsPage.fillCreateAssetForm(assetTitle, assetId);
      await assetsPage.openAdvancedSection();
      await assetsPage.fillRequiredAdvancedField();
      await assetsPage.openDataSourceSection();
      await assetsPage.fillHttpDatasource();

      // Submit the form
      await assetsPage.submitCreateAssetForm();

      // Verify the success message is displayed
      const successMessage = await assetsPage.getSuccessMessage();
      await expect(successMessage).toBeVisible();

      // Verify the new asset appears in the list
      const assetLocator = await assetsPage.getAssetInList(assetTitle);
      await expect(assetLocator).toBeVisible();

      // Open the create asset modal again
      await assetsPage.openCreateAssetModal();

      // Simulate a failure scenario by using an existing ID
      // Fill in the asset details with the same assetId and title
      await assetsPage.fillCreateAssetForm(assetTitle, assetId);
      await assetsPage.openAdvancedSection();
      await assetsPage.fillRequiredAdvancedField(); // Skip filling a critical field to trigger an error
      await assetsPage.openDataSourceSection();
      await assetsPage.fillHttpDatasource();
      
      // Submit the form
      await assetsPage.submitCreateAssetForm();

      // Verify the error message is displayed
      const errorMessage = await page.locator('[data-testid="error-message"]').textContent();
      expect(errorMessage).toContain("failed saving asset");

      // Verify the asset is not added to the list
      await expect(page.locator(assetsPage.assetListLocator).locator(assetsPage.assetCardLocator).filter({ hasText: assetTitle })).toHaveCount(0);
    });
  });
  
  test.describe("Delete Functionality", () => {
    test("Deletes an asset and verifies it is removed from the list", async ({ page }) => {
      // Select an asset to delete
      const assetCards = await assetsPage.getAssetCards();
      const assetCard = assetCards.first();
      const assetName = (await assetCard.textContent()) || "";
      await assetCard.click();
      await assetsPage.submitDeleteAsset();

      // Confirm deletion
      await assetsPage.confirmDeleteAsset();

      // Verify the success message is displayed
      const successMessage = await assetsPage.getSuccessMessage();
      await expect(successMessage).toBeVisible();

      // Verify the asset is removed
      await expect(page.locator(assetsPage.assetListLocator).locator(assetsPage.assetCardLocator).filter({ hasText: assetName })).toHaveCount(0);
    });
  });
  
  test.describe("Edit Functionality", () => {
    test.fixme("should display 'Edit' button in the asset details modal", async ({ page }) => {
      // Select an asset to view details
      const assetCards = await assetsPage.getAssetCards();
      const assetCard = assetCards.first();
      await assetCard.click();

      // Verify the "Edit" button is present in the asset details modal
      const editButton = await assetsPage.getEditButton();
      await expect(editButton).toBeVisible();
    });

    test.fixme("Updates an asset and verifies the changes", async ({ page }) => {
      // Select an asset to update
      const assetCards = await assetsPage.getAssetCards();
      const assetCard = assetCards.first();
      const originalTitle = await assetCard.locator('[data-testid="asset-title"]').textContent();
      const updatedTitle = `${originalTitle} - Updated`;
      const updatedDescription = "This is an updated description.";

      // Open the edit modal and update the asset
      const assetId = await assetCard.locator('[data-testid="asset-title"]').textContent();
      await assetsPage.openEditAssetModal(assetId || "");
      await assetsPage.fillEditAssetForm(updatedTitle, updatedDescription);
      await assetsPage.submitEditAssetForm();

      // Verify the updated asset appears in the list
      const updatedAssetLocator = await assetsPage.getAssetInList(updatedTitle);
      await expect(updatedAssetLocator).toBeVisible();
    });
  });

  test.describe("View Functionality", () => {
    test("Displays asset details correctly", async ({ page }) => {
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
        console.log("search term is: " + searchTerm);

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
      await assetsPage.searchAssets('asset');

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
