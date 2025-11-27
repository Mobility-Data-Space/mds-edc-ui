import { Page } from '@playwright/test';
import { BaseListPage } from './base-list-page';

export class ContractAgreementsPage extends BaseListPage {
  readonly agreementsListLocator = 'contract-agreements-list';
  readonly agreementCardLocator = '.contract-agreement-card';
  readonly agreementDialogLocator = '.contract-agreement-dialog';

  constructor(page: Page) {
    super(page);
  }

  async fillHttpURL() {
    await this.page.getByRole('textbox', { name: 'Base URL' }).fill("https://google.com");
  }

  async selectS3Type() {
    await this.page.getByRole('combobox', { name: 'Type' }).click();
    await this.page.getByRole('option', { name: 'Amazon S3' }).click();
  }

  async fillRequiredS3DataDestination(type: string) {
    await this.page.getByRole('textbox', { name: 'Bucket Name' }).fill("mys3bucket");
    await this.page.getByRole('textbox', { name: 'Region' }).fill("eu-west-1");
    await this.page.getByRole('textbox', { name: 'Folder Name' }).fill("s3foldername");
    if (type === "single") {
      await this.page.getByRole('textbox', { name: 'Object Name' }).fill("mys3objectname");
    } else if (type === "multiple") {
      await this.page.getByRole("checkbox", {name: "Multiple S3 Objects"}).click();
      await this.page.getByRole('textbox', { name: 'Object Prefix' }).fill("mys3objectprefix");
    }
  }

  async selectAzureType() {
    await this.page.getByRole('combobox', { name: 'Type' }).click();
    await this.page.getByRole('option', { name: 'Azure Blob Storage' }).click();
  }

  async fillRequiredAzureDataDestination(type: string) {
    await this.page.getByRole('textbox', { name: 'Container' }).fill("myazurecontainer");
    await this.page.getByRole('textbox', { name: 'Account' }).fill("myazureaccount");
    await this.page.getByRole('textbox', { name: 'Keyname' }).fill("myazurekeyname");
    await this.page.getByRole('textbox', { name: 'Folder Name' }).fill("azurefoldername");
    if (type === "single") {
      await this.page.getByRole('textbox', { name: 'Blob Name' }).fill("myazureblob");
    } else if (type === "multiple") {
      await this.page.getByRole("checkbox", {name: "Multiple Azure Blobs"}).click();
      await this.page.getByRole('textbox', { name: 'Blob Prefix' }).fill("myazureprefix");
    }
  }

  async selectCustomJsonType() {
    await this.page.getByRole('combobox', { name: 'Type' }).click();
    await this.page.getByRole('option', { name: 'Custom JSON' }).click();
  }

  async fillCustomJsonDataDestination() {
    await this.page.getByRole('textbox', { name: 'Custom Data Destination Config' }).fill('{"type": "HttpData", "baseUrl": "https://example.com"}');
  }

  async initiateTransfer() {
    await this.page.getByTestId('transfer-process-submit').click();
  }

  async submitTransfer() {
    await this.page.getByRole('button', { name: 'Initiate Transfer' }).click();
  }

  async navigate() {
    await this.page.goto('/contract-agreements');
    await this.waitForApiResponse('/connector/management/v3/contractagreements');
  }

  async getAgreementsList() {
    return this.page.getByTestId(this.agreementsListLocator);
  }

  async getAgreementCards() {
    return this.page.locator(this.agreementCardLocator);
  }

  async getLoadedAgreementCards() {
    // Wait for cards with actual content (not loading skeletons)
    // The loaded card contains [data-testid="asset-id"] which the skeleton doesn't have
    return this.page.locator(`${this.agreementCardLocator}:has([data-testid="asset-id"])`);
  }

  async waitForAgreementCardsLoaded() {
    // Wait for at least one card to be fully loaded (not skeleton)
    await this.page.locator(`${this.agreementCardLocator}:has([data-testid="asset-id"])`).first().waitFor({ state: 'visible' });
  }

  async selectAgreement(agreementName: string) {
    await this.page.locator(this.agreementCardLocator).filter({ hasText: agreementName }).click();
  }

  async getAgreementDialog() {
    return this.page.locator(this.agreementDialogLocator);
  }

  async searchAgreements(searchTerm: string) {
    await this.searchItems(searchTerm, '/connector/management/v3/contractagreements');
  }

  async clearAgreementSearch() {
    await this.clearSearch('/connector/management/v3/contractagreements');
  }

  async goToNextPage() {
    await super.goToNextPage('/connector/management/v3/contractagreements');
  }

  async goToPreviousPage() {
    await super.goToPreviousPage('/connector/management/v3/contractagreements');
  }
}
