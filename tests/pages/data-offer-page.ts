import { Page } from '@playwright/test';
import { BaseListPage } from './base-list-page';

export class DataOfferPage extends BaseListPage {
  
  // List page selectors
  readonly dataOffersListLocator = '[data-testid="data-offers-list"]';
  readonly dataOfferCardLocator = '.data-offer-card';
  readonly createDataOfferDialogLocator = '[data-testid="create-data-offer-dialog"]';
  readonly dataOfferDialogLocator = '[data-testid="data-offer-dialog"]';
  readonly createDataOfferButtonLocator = 'button:has-text("Publish Data Offer")';

  constructor(page: Page) {
    super(page);
  }

  async openCreateDataOfferDialog() {
    await this.page.click(this.createDataOfferButtonLocator);
    await this.page.waitForSelector(this.createDataOfferDialogLocator);
  }

  async fillContractId(contractId: string) {
    await this.page.getByRole('textbox', { name: 'ID' }).fill(contractId);
  }

  async pickContractPolicy() {
    await this.page.getByRole('combobox', { name: 'Contract Policy' }).click();
    await this.page.getByRole('option', { name: 'always-true' }).click();
  }

  async pickAccessPolicy() {
    await this.page.getByRole('combobox', { name: 'Access Policy' }).click();
    await this.page.getByRole('option', { name: 'always-true' }).click();
  }

  async selectAsset(multiple: boolean = false) {
    await this.page.getByRole('combobox', { name: 'Assets' }).click();
    await this.page.getByRole('option', { name: 'asset-1-id' }).click();

    if (multiple) {
      await this.page.getByRole('option', { name: 'asset-2-id' }).click();
    }
  }

  async closeAssetSelector() {
    await this.page.locator('body').click({
        position: {
          x: 0,
          y: 0
        }
      });
  }

  async submitCreateDataOfferForm() {
    await this.page.click('[data-testid="create-button"]');
  }

  // List page navigation
  async navigate() {
    await this.page.goto('/data-offers');
    await this.page.waitForResponse((response) => response.url().includes('/connector/management/v3/contractdefinitions'));
  }

  async getDataOffersList() {
    return this.page.locator(this.dataOffersListLocator);
  }

  async getDataOfferCards() {
    return this.page.locator(this.dataOfferCardLocator);
  }

  async getCreateDataOfferDialog() {
    return this.page.locator(this.createDataOfferDialogLocator);
  }

  async getDataOfferDialog() {
    return this.page.locator(this.dataOfferDialogLocator) ;
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
