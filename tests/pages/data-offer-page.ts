import { Page } from '@playwright/test';

export class DataOfferPage {
  readonly page: Page;
  readonly dataOfferListLocator = '#data-offer-list';
  readonly dataOfferItemLocator = '.data-offer-item';
  readonly dataOfferDetailsLocator = '#data-offer-details';

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/data-offer');
    await this.page.waitForLoadState('networkidle');
  }

  async getDataOfferList() {
    return this.page.locator(this.dataOfferListLocator);
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
