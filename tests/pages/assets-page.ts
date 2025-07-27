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
  
  readonly assetsAdvancedSectionLocator = '[data-testid=asset-create-advanced-info-step-title]'
  readonly assetsDataSourceSectionLocator = '[data-testid=asset-create-data-address-step-title]';

  constructor(page: Page) {
    super(page);
  }

  async getEditButton() {
    return this.page.locator(this.editButtonLocator);
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

  async fillAssetTitle(title: string) {
    await this.page.getByRole('textbox', { name: 'Title' }).fill(title);
  }

  async fillAssetId(id: string) {
    await this.page.getByRole('textbox', { name: 'Asset ID' }).fill(id);
  }

  async openAdvancedSection() {
    await this.page.locator(this.assetsAdvancedSectionLocator).click();
  }

  async fillRequiredAssetFields() {
    await this.page.getByRole('combobox').filter({ hasText: 'Select data category' }).click();
    await this.page.getByRole('option', { name: 'Traffic Information' }).click();
  }

  async openDataSourceSection() {
    await this.page.locator(this.assetsDataSourceSectionLocator).click();
  }

  async fillHttpURL() {
    await this.page.getByRole('textbox', { name: 'URL' }).fill("https://google.com");
  }

  async selectHttpMethod(method: string = "GET") {
    await this.page.getByRole('combobox', { name: 'Method' }).click() ;
    await this.page.getByRole('option', { name: method }).click();
  }

  async selectHttpType() {
    await this.page.getByRole('combobox').filter({ hasText: 'REST-API Endpoint' }).click();
    await this.page.getByRole('option', { name: 'REST-API Endpoint' }).click();
  }

  async selectAzureType() {
    await this.page.getByRole('combobox').filter({ hasText: 'REST-API Endpoint' }).click();
    await this.page.getByRole('option', { name: 'Azure Blob Storage' }).click();
  }

  async fillRequiredAzureDatasource(type: string) {
    await this.page.getByRole('textbox', { name: 'Container' }).fill("myazurecontainer");
    await this.page.getByRole('textbox', { name: 'Account' }).fill("myazureaccount");
    await this.page.getByRole('textbox', { name: 'Keyname' }).fill("myazurekeyname");
    if (type === "single") {
      await this.page.getByRole('textbox', { name: 'Blob Name' }).fill("myazureblob");
    } else if (type === "multiple") {
      await this.page.getByRole("checkbox", {name: "Multiple Azure Blobs"}).click() ;
      await this.page.getByRole('textbox', { name: 'Blob Prefix' }).fill("myazureprefix");
    }
  }

  async selectCustomJsonType() {
    await this.page.getByRole('combobox').filter({ hasText: 'REST-API Endpoint' }).click();
    await this.page.getByRole('option', { name: 'Custom JSON' }).click();
  }

  async fillCustomJsonDatasource() {
    await this.page.getByRole('textbox', { name: 'Custom Datasource Config' }).fill('{"type": "HttpData", "baseUrl": "https://example.com"}');
  }

  async selectOnRequestType() {
    await this.page.getByRole('combobox').filter({ hasText: 'REST-API Endpoint' }).click();
    await this.page.getByRole('option', { name: 'On Request' }).click();
  }

  async fillOnRequestDatasource() {
    await this.page.getByRole('textbox', { name: 'Contact E-mail' }).fill("test@email.com");
    await this.page.getByRole('textbox', { name: 'Preferred E-mail subject' }).fill('Subject for test');
  }

  async selectS3Type() {
    await this.page.getByRole('combobox').filter({ hasText: 'REST-API Endpoint' }).click();
    await this.page.getByRole('option', { name: 'Amazon S3' }).click();
  }

  async fillRequiredS3Datasource(type: string) {
    await this.page.getByRole('textbox', { name: 'Bucket Name' }).fill("mys3bucket");
    await this.page.getByRole('textbox', { name: 'Region' }).fill("eu-west-1");
    if (type === "single") {
      await this.page.getByRole('textbox', { name: 'Object Name' }).fill("mys3objectname");
    } else if (type === "multiple") {
      await this.page.getByRole("checkbox", {name: "Multiple S3 Objects"}).click() ;
      await this.page.getByRole('textbox', { name: 'Object Prefix' }).fill("mys3objectprefix");
    }
    
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
    await this.page.getByRole('button', { name: 'Delete' }).click();
  }

  async submitCreateAssetForm() {
    await this.page.getByTestId('asset-create-submit').click();
  }

  async getAssetInList(assetId: string) {
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
