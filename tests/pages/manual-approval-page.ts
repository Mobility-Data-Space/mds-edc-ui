import { Page } from '@playwright/test';

export class ManualApprovalPage {
  private readonly page: Page;

  // Locators
  private readonly approvalListLocator = '[data-testid="approval-list"]';
  private readonly approvalItemLocator = '[data-testid="approval-item"]';
  private readonly approveButtonLocator = '[data-testid="approve-button"]';
  private readonly rejectButtonLocator = '[data-testid="reject-button"]';
  private readonly successMessageLocator = '[data-testid="success-message"]';
  private readonly errorMessageLocator = '[data-testid="error-message"]';

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to the manual approval page
  async navigate() {
    await this.page.goto('/negotiation-manual-approval');
    await this.page.waitForLoadState('networkidle');
  }

  // Get the list of approvals
  async getApprovalList() {
    return this.page.locator(this.approvalListLocator);
  }

  // Approve an item
  async approveItem(itemName: string) {
    const item = this.page.locator(this.approvalItemLocator).filter({ hasText: itemName });
    await item.locator(this.approveButtonLocator).click();
  }

  // Reject an item
  async rejectItem(itemName: string) {
    const item = this.page.locator(this.approvalItemLocator).filter({ hasText: itemName });
    await item.locator(this.rejectButtonLocator).click();
  }

  // Verify success message
  async getSuccessMessage() {
    return this.page.locator(this.successMessageLocator);
  }

  // Verify error message
  async getErrorMessage() {
    return this.page.locator(this.errorMessageLocator);
  }
}
