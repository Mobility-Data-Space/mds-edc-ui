import { Page } from '@playwright/test';

export class TransferProcessesPage {
  readonly page: Page;
  readonly transferListLocator = '[data-testid="transfer-list"]';
  readonly transferItemLocator = '.transfer-item';
  readonly transferDetailsLocator = '[data-testid="transfer-details"]';
  readonly searchBoxLocator = '[data-testid="search-box"]';
  readonly paginationNextLocator = '[data-testid="pagination-next"]';

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/transfer-processes');
    await this.page.waitForLoadState('networkidle');
  }

  async getTransferList() {
    return this.page.locator(this.transferListLocator);
  }

  async searchTransfer(transferName: string) {
    const searchBox = this.page.locator(this.searchBoxLocator);
    await searchBox.fill(transferName);
  }

  async selectTransferItem(index: number) {
    const transferItem = this.page.locator(this.transferListLocator).locator(this.transferItemLocator).nth(index);
    await transferItem.click();
  }

  async verifyTransferDetails() {
    const transferDetails = this.page.locator(this.transferDetailsLocator);
    await transferDetails.waitFor();
    return transferDetails;
  }

  async goToNextPage() {
    const nextPageButton = this.page.locator(this.paginationNextLocator);
    await nextPageButton.click();
  }
}
