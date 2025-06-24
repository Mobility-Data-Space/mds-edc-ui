import { Page } from '@playwright/test';

export class ContractAgreementsPage {
  readonly page: Page;
  readonly agreementsListLocator = '#agreements-list';
  readonly agreementItemLocator = '.agreement-item';
  readonly agreementDetailsLocator = '#agreement-details';

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/contract-agreements');
    await this.page.waitForLoadState('networkidle');
  }

  async getAgreementsList() {
    return this.page.locator(this.agreementsListLocator);
  }

  async selectAgreement(agreementName: string) {
    const agreementItem = this.page.locator(this.agreementItemLocator).filter({ hasText: agreementName });
    await agreementItem.click();
  }

  async verifyAgreementDetails() {
    const agreementDetails = this.page.locator(this.agreementDetailsLocator);
    await agreementDetails.waitFor();
    return agreementDetails;
  }
}
