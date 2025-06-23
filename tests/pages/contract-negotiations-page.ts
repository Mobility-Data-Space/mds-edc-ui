import { Page } from '@playwright/test';

export class ContractNegotiationsPage {
  readonly page: Page;
  readonly negotiationsListLocator = '#negotiations-list';
  readonly negotiationItemLocator = '.negotiation-item';
  readonly negotiationDetailsLocator = '#negotiation-details';

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/contract-negotiations');
    await this.page.waitForLoadState('networkidle');
  }

  async getNegotiationsList() {
    return this.page.locator(this.negotiationsListLocator);
  }

  async selectNegotiation(negotiationName: string) {
    const negotiationItem = this.page.locator(this.negotiationItemLocator).filter({ hasText: negotiationName });
    await negotiationItem.click();
  }

  async verifyNegotiationDetails() {
    const negotiationDetails = this.page.locator(this.negotiationDetailsLocator);
    await negotiationDetails.waitFor();
    return negotiationDetails;
  }
}
