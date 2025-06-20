import { test, expect } from '@playwright/test';
import { AssetsPage } from './pages/assets-page';

test.describe("Assets Page Tests", () => {
  let assetsPage: AssetsPage ;

  test.beforeEach(async ({ page }) => {
    assetsPage = new AssetsPage(page);
    await assetsPage.navigate();
  })

  test("Displays the asset list on the first visit", async ({ page }) => {
    // Verify the asset list is visible
    const assetList = await assetsPage.getAssetList();
    await expect(assetList).toBeVisible();

    // Verify there is at least one asset card
    const assetCards = await assetsPage.getAssetCards();
    const assets = await assetCards.allTextContents();
    expect(assets.length).toBeGreaterThan(0);
  });

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
});
