import { Page } from '@playwright/test';

export class ManualApprovalPage {
  private readonly page: Page;

  private readonly approvalListLocator = '[data-testid="approval-list"]';
  private readonly approvalItemLocator = '[data-testid="approval-item"]';

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/negotiation-manual-approval');
    await this.page.waitForResponse(
      (response) => response.url().includes('/connector/management/v3/contractnegotiations')
    );
  }

  async getApprovalList() {
    return this.page.locator(this.approvalListLocator);
  }

  async getApprovalItems() {
    return this.page.locator(this.approvalItemLocator);
  }
}
