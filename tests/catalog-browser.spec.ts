import { test, expect } from '@playwright/test';
import { CatalogBrowserPage } from './pages/catalog-browser-page';

test.describe("Catalog Browser Tests", () => {
  let catalogPage: CatalogBrowserPage;

  test.beforeEach(async ({ page }) => {
    catalogPage = new CatalogBrowserPage(page);
    await catalogPage.navigate();
  });
  
  test("Displays an empty state on the first visit", async ({ page }) => {
    // Verify the catalog list is empty
    const catalogList = await catalogPage.getCatalogList();
    await expect(catalogList).toHaveCount(0);
  });

  test.fixme("Searches for an item in the catalog", async ({ page }) => {
    // Search for an item
    await catalogPage.searchCatalogItem('Test Item');

    // Verify the item is visible
    const catalogItem = catalogPage.page.locator(catalogPage.catalogItemLocator).filter({ hasText: 'Test Item' });
    await expect(catalogItem).toBeVisible();
  });

  test.fixme("Selects an item from the catalog", async ({ page }) => {
    // Select an item
    await catalogPage.selectCatalogItem('Test Item');

    // Verify the item details are visible
    const itemDetails = catalogPage.page.locator('#item-details');
    await expect(itemDetails).toBeVisible();
  });
});
