import { Page } from '@playwright/test';
import { BaseListPage } from './base-list-page';

export class ContractAgreementsPage extends BaseListPage {
  readonly agreementsListLocator = '.contract-agreements-list';
  readonly agreementCardLocator = '.contract-agreement-card';
  readonly agreementDialogLocator = '.contract-agreement-dialog';
  readonly errorMessageLocator = '[data-testid="error-message"]';

  constructor(page: Page) {
    super(page);
  }

  getErrorMessage() {
    return this.page.locator(this.errorMessageLocator);
  }

  async navigate() {
    await this.page.goto('/contract-agreements');
    await this.page.waitForResponse((response) => response.url().includes('/connector/management/v3/contractagreements'));
  }

  async getAgreementsList() {
    return this.page.locator(this.agreementsListLocator);
  }

  async getAgreementCards() {
    return this.page.locator(this.agreementCardLocator);
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
