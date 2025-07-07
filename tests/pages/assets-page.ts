import { Page } from '@playwright/test';
import { BaseListPage } from './base-list-page';

export class AssetsPage extends BaseListPage {
  readonly assetListLocator = '#asset-list';
  readonly assetCardLocator = '.asset-card';
  readonly assetDialogLocator = '.asset-dialog';
  readonly createAssetButtonLocator = '[data-testid=create-asset-modal-opener]';
  readonly createAssetModalLocator = '.create-asset-form';
  readonly editButtonLocator = '[data-testid="edit-asset-button"]';
  readonly deleteAssetButtonLocator = '[data-testid=delete-asset-modal-btn]';
  readonly successMessageLocator = '[data-testid="toast-success-message"]';
  readonly assetsAdvancedSectionLocator = '[data-testid=asset-create-advanced-info-step-title]'
  readonly assetsDataSourceSectionLocator = '[data-testid=asset-create-data-address-step-title]';
  readonly createAssetOnlyOptionLocator = '[data-testid="create-asset-only-option"]';
  readonly myAssetsPageLocator = '[data-testid="my-assets-page"]';

  constructor(page: Page) {
    super(page);
  }

  async getSuccessMessage() {
    return this.page.locator(this.successMessageLocator);
  }

  async getEditButton() {
    return this.page.locator(this.editButtonLocator);
  }

  async selectCreateAssetOnlyOption() {
    await this.page.locator(this.createAssetOnlyOptionLocator).click();
  }

  async getMyAssetsPage() {
    return this.page.locator(this.myAssetsPageLocator);
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

  async openAdvancedSection() {
    await this.page.locator(this.assetsAdvancedSectionLocator).click() ;
  }

  async fillRequiredAdvancedField() {
    await this.page.getByRole('combobox').filter({ hasText: 'Select data category' }).click() ;
    await this.page.getByRole('option', { name: 'Traffic Information' }).click() ;
  }
  async openDataSourceSection() {
    await this.page.locator(this.assetsDataSourceSectionLocator).click() ;
  }
  async fillHttpDatasource() {
    await this.page.getByRole('textbox', { name: 'URL URL' }).fill("https://google.com") ;
  }

  async submitDeleteAsset() {
    await this.page.locator(this.deleteAssetButtonLocator).click();
  }

  async openEditAssetModal(assetId: string) {
    const assetCard = this.page.locator(this.assetListLocator).locator(this.assetCardLocator).filter({ hasText: assetId });
    await assetCard.click();
    await this.page.getByTestId('edit-asset-modal-opener').click();
    await this.page.locator('.edit-asset-form').waitFor();
  }

  async fillEditAssetForm(updatedTitle: string, updatedDescription: string) {
    await this.page.getByRole('textbox', { name: 'Title' }).fill(updatedTitle);
    await this.page.getByRole('textbox', { name: 'Description' }).fill(updatedDescription);
  }

  async submitEditAssetForm() {
    await this.page.getByTestId('asset-edit-submit').click();
  }

  async confirmDeleteAsset() {
    await this.page.getByRole('button', { name: 'Delete' }).click() ;
  }
  
  async submitCreateAssetForm() {
    await this.page.getByTestId('asset-create-submit').click();
  }

  getAssetInList(assetId: string) {
    return this.page.locator(this.assetListLocator).locator(this.assetCardLocator).filter({ hasText: assetId });
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
