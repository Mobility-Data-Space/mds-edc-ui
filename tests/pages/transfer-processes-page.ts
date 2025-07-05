import { Page } from '@playwright/test';
import { BaseListPage } from './base-list-page';

export class TransferProcessesPage extends BaseListPage {
  readonly transferProcessesListLocator = '.transfer-processes-list';
  readonly transferProcessRowLocator = '.transfer-process-row';
  readonly transferProcessDialogLocator = '.transfer-process-dialog';

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.page.goto('/transfer-processes');
    await this.page.waitForResponse((response) => response.url().includes('/connector/management/v3/transferprocesses'));
  }

  async getTransferProcessesList() {
    return this.page.locator(this.transferProcessesListLocator);
  }

  async getTransferProcessRows() {
    return this.page.locator(this.transferProcessRowLocator);
  }

  async selectTransferProcess(transferProcessName: string) {
    await this.page.locator(this.transferProcessRowLocator).filter({ hasText: transferProcessName }).click();
  }

  async verifyTransferProcessDetails() {
    return this.page.locator(this.transferProcessDialogLocator);
  }

  async searchTransferProcesses(searchTerm: string) {
    await this.searchItems(searchTerm, '/connector/management/v3/transferprocesses');
  }

  async clearTransferProcessSearch() {
    await this.clearSearch('/connector/management/v3/transferprocesses');
  }

  async goToNextPage() {
    await super.goToNextPage('/connector/management/v3/transferprocesses');
  }

  async goToPreviousPage() {
    await super.goToPreviousPage('/connector/management/v3/transferprocesses');
  }
}
