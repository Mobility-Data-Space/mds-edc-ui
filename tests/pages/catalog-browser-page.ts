import { Page } from '@playwright/test';
import { BaseListPage } from './base-list-page';

export class CatalogBrowserPage extends BaseListPage {
  readonly catalogListLocator = '[data-testid="catalog-list"]';
  readonly catalogItemLocator = '[data-testid="catalog-item"]';
  readonly catalogDialogLocator = '[data-testid="data-offer-dialog"]';
  readonly catalogUrlInputLocator = '#catalog-url';
  readonly searchInputLocator = 'input[placeholder*="Search"]';
  readonly searchTriggerLocator = 'button:has-text("Search")';

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.page.goto('/catalog-browser');
    await this.page.waitForLoadState('domcontentloaded');
    // Wait for the page to be interactive
    await this.page.locator(this.catalogUrlInputLocator).waitFor({ state: 'visible', timeout: 10000 });
  }

  async fillCatalogUrlInput(url: string) {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/connector/management/v3/catalog') &&
        response.status() < 400,
      { timeout: 60000 },
    );
    await this.page.fill(this.catalogUrlInputLocator, url);
    await responsePromise;
    // Wait for items to actually render (handles HMR/Fast Refresh re-mounts)
    await this.page.locator(`${this.catalogListLocator} ${this.catalogItemLocator}`).first().waitFor({ state: 'visible', timeout: 30000 });
  }

  async getCatalogList() {
    return this.page.locator(this.catalogListLocator);
  }

  async getCatalogCards() {
    return this.page.locator(this.catalogListLocator).locator(this.catalogItemLocator);
  }

  async selectCatalogItem(itemName: string) {
    const catalogItem = this.page.locator(this.catalogItemLocator).filter({ hasText: itemName });
    await catalogItem.click();
  }

  async searchCatalog(searchTerm: string) {
    await this.searchItems(searchTerm, '/connector/management/v3/catalog');
  }

  async clearSearch() {
    await super.clearSearch('/connector/management/v3/catalog');
  }

  async goToNextPage() {
    await super.goToNextPage('/connector/management/v3/catalog');
  }

  async goToPreviousPage() {
    await super.goToPreviousPage('/connector/management/v3/catalog');
  }

  async getSearchResults() {
    return this.page.locator(this.catalogListLocator).locator(this.catalogItemLocator);
  }
}
