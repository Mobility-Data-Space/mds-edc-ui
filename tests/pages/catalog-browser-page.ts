import { Page } from '@playwright/test';

export class CatalogBrowserPage {
  readonly page: Page;
  readonly catalogListLocator = '#catalog-list';
  readonly catalogItemLocator = '.catalog-item';
  readonly searchBoxLocator = '#search-box';

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/catalog-browser');
    await this.page.waitForLoadState('networkidle');
  }

  async getCatalogList() {
    return this.page.locator(this.catalogListLocator);
  }

  async searchCatalogItem(itemName: string) {
    const searchBox = this.page.locator(this.searchBoxLocator);
    await searchBox.fill(itemName);
    await searchBox.press('Enter');
  }

  async selectCatalogItem(itemName: string) {
    const catalogItem = this.page.locator(this.catalogItemLocator).filter({ hasText: itemName });
    await catalogItem.click();
  }
}
