import { Page } from '@playwright/test';
import { BaseListPage } from './base-list-page';

const DATA_FLOWS_ENDPOINT = '/connector/management/v4/dataflows/request';

export class DataFlowsPage extends BaseListPage {
  readonly dataFlowsListLocator = '[data-testid="data-flows-list"]';
  readonly dataFlowRowLocator = '.data-flow-row';
  readonly dataAddressButtonLocator = '[data-testid="show-data-address"]';
  readonly detailsButtonLocator = '[data-testid="show-data-flow-details"]';
  readonly jsonLdDialogLocator = '[data-testid="jsonld-dialog"]';

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.page.goto('/data-flows');
    await this.page.waitForResponse((response) =>
      response.url().includes(DATA_FLOWS_ENDPOINT),
    );
  }

  async getDataFlowsList() {
    return this.page.locator(this.dataFlowsListLocator);
  }

  async getDataFlowRows() {
    return this.page.locator(this.dataFlowRowLocator);
  }

  async getDetailsDialog() {
    return this.page.locator(this.jsonLdDialogLocator);
  }

  async searchDataFlows(searchTerm: string) {
    await this.searchItems(searchTerm, DATA_FLOWS_ENDPOINT);
  }

  async clearDataFlowSearch() {
    await this.clearSearch(DATA_FLOWS_ENDPOINT);
  }

  async goToNextPage() {
    await super.goToNextPage(DATA_FLOWS_ENDPOINT);
  }

  async goToPreviousPage() {
    await super.goToPreviousPage(DATA_FLOWS_ENDPOINT);
  }
}
