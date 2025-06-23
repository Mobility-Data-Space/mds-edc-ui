import { Page } from '@playwright/test';

export class DataOffersPage {
  readonly page: Page;
  readonly dataOffersListLocator = '#data-offers-list';
  readonly dataOfferItemLocator = '.data-offer-item';
  readonly dataOfferDetailsLocator = '#data-offer-details';

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/data-offers');
    await this.page.waitForLoadState('networkidle');
  }

  async getDataOffersList() {
    return this.page.locator(this.dataOffersListLocator);
  }

  async selectDataOffer(dataOfferName: string) {
    const dataOfferItem = this.page.locator(this.dataOfferItemLocator).filter({ hasText: dataOfferName });
    await dataOfferItem.click();
  }

  async verifyDataOfferDetails() {
    const dataOfferDetails = this.page.locator(this.dataOfferDetailsLocator);
    await dataOfferDetails.waitFor();
    return dataOfferDetails;
  }
}
