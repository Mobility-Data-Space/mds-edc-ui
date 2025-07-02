import { Page } from '@playwright/test';
import { BaseListPage } from './base-list-page';

export class ContractNegotiationsPage extends BaseListPage {
  readonly negotiationsListLocator = '[data-testid="negotiations-list"]';
  readonly negotiationItemLocator = '[data-testid="negotiation-item"]';
  readonly negotiationDetailsLocator = '#negotiation-details';

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.page.goto('/contract-negotiations');
    await this.page.waitForLoadState('networkidle');
  }

  async getNegotiationsList() {
    return this.page.locator(this.negotiationsListLocator);
  }

  async getNegotiationCards() {
    return this.page.locator(this.negotiationsListLocator).locator(this.negotiationItemLocator);
  }

  async selectNegotiation(negotiationName: string) {
    const negotiationItem = this.page.locator(this.negotiationItemLocator).filter({ hasText: negotiationName });
    await negotiationItem.click();
  }

  async searchNegotiations(searchTerm: string) {
    await this.searchItems(searchTerm, '/connector/management/v3/contractnegotiations');
  }

  async clearSearch() {
    await super.clearSearch('/connector/management/v3/contractnegotiations');
  }

  async goToNextPage() {
    await super.goToNextPage('/connector/management/v3/contractnegotiations');
  }

  async goToPreviousPage() {
    await super.goToPreviousPage('/connector/management/v3/contractnegotiations');
  }

  async getSearchResults() {
    return this.page.locator(this.negotiationsListLocator).locator(this.negotiationItemLocator);
  }


  async verifyNegotiationDetails() {
    return this.page.locator(this.negotiationDetailsLocator);
  }
}
