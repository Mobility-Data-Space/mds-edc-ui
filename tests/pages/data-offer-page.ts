import { Page } from '@playwright/test';
import { BaseListPage } from './base-list-page';

export class DataOfferPage extends BaseListPage {
  // Single data offer selectors
  readonly dataOfferListLocator = '#data-offer-list';
  readonly dataOfferItemLocator = '.data-offer-item';
  readonly dataOfferDetailsLocator = '#data-offer-details';

  // List page selectors
  readonly dataOffersListLocator = '[data-testid="data-offers-list"]';
  readonly dataOfferCardLocator = '.data-offer-card';
  readonly dataOfferDialogLocator = '[data-testid="data-offer-dialog"]';
  readonly createDataOfferButtonLocator = 'button:has-text("Publish Data Offer")';

  constructor(page: Page) {
    super(page);
  }

  // Single data offer page navigation
  async navigateToSingle() {
    await this.page.goto('/data-offer');
    await this.page.waitForLoadState('networkidle');
  }

  // List page navigation
  async navigate() {
    await this.page.goto('/data-offers');
    await this.page.waitForResponse((response) => response.url().includes('/connector/management/v3/contractdefinitions'));
  }

  // Single data offer methods
  async getDataOfferList() {
    return this.page.locator(this.dataOfferListLocator);
  }

  async selectDataOfferFromList(dataOfferName: string) {
    const dataOfferItem = this.page.locator(this.dataOfferItemLocator).filter({ hasText: dataOfferName });
    await dataOfferItem.click();
  }

  async getDataOfferDetails() {
    return this.page.locator(this.dataOfferDetailsLocator);
  }

  // List page methods
  async getDataOffersList() {
    return this.page.locator(this.dataOffersListLocator);
  }

  async getDataOfferCards() {
    return this.page.locator(this.dataOfferCardLocator);
  }

  async selectDataOffer(dataOfferName: string) {
    await this.page.locator(this.dataOfferCardLocator).filter({ hasText: dataOfferName }).click();
  }

  async getDataOfferDialog() {
    return this.page.locator(this.dataOfferDialogLocator);
  }

  async searchDataOffers(searchTerm: string) {
    await this.searchItems(searchTerm, '/connector/management/v3/contractdefinitions');
  }

  async clearDataOfferSearch() {
    await this.clearSearch('/connector/management/v3/contractdefinitions');
  }

  async goToNextPage() {
    await super.goToNextPage('/connector/management/v3/contractdefinitions');
  }

  async goToPreviousPage() {
    await super.goToPreviousPage('/connector/management/v3/contractdefinitions');
  }
}
