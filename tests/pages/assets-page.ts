import { Page } from '@playwright/test';
import { BaseListPage } from './base-list-page';

export class AssetsPage extends BaseListPage {
  readonly assetListLocator = '#asset-list';
  readonly assetCardLocator = '.asset-card';
  readonly assetDialogLocator = '.asset-dialog';
  readonly createAssetButtonLocator = '[data-testid=create-asset-modal-opener]';
  readonly createAssetModalLocator = '.create-asset-form';

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.page.goto('/assets');
    await this.page.waitForResponse((response) => response.url().includes('/connector/management/v3/assets'));
  }

  async getAssetList() {
    return this.page.locator(this.assetListLocator);
  }

  async getAssetCards() {
    return this.page.locator(this.assetListLocator).locator(this.assetCardLocator);
  }

  async openCreateAssetModal() {
    await this.page.locator(this.createAssetButtonLocator).click();
    await this.page.locator(this.createAssetModalLocator).waitFor();
  }

  async fillCreateAssetForm(title: string, id: string) {
    await this.page.getByRole('textbox', { name: 'Title' }).fill(title);
    await this.page.getByRole('textbox', { name: 'Asset ID' }).fill(id);
  }

  async submitCreateAssetForm() {
    await this.page.getByRole('button', { name: 'Create' }).click();
  }

  async verifyAssetInList(assetId: string) {
    await this.page.locator(this.assetListLocator).locator(this.assetCardLocator).filter({ hasText: assetId }).waitFor();
  }

  async searchAssets(searchTerm: string) {
    await this.searchItems(searchTerm, '/connector/management/v3/assets');
  }

  async clearSearch() {
    await super.clearSearch('/connector/management/v3/assets');
  }

  async goToNextPage() {
    await super.goToNextPage('/connector/management/v3/assets');
  }

  async goToPreviousPage() {
    await super.goToPreviousPage('/connector/management/v3/assets');
  }

  async getSearchResults() {
    return this.page.locator(this.assetListLocator).locator(this.assetCardLocator);
  }
}
