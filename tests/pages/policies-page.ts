import { Page } from '@playwright/test';
import { BaseListPage } from './base-list-page';

export class PoliciesPage extends BaseListPage {
  readonly policiesListLocator = '.policies-list';
  readonly policyCardLocator = '.policy-card';
  readonly policyDialogLocator = '.policy-dialog';
  readonly createPolicyButtonLocator = 'button:has-text("Create Policy")';

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.page.goto('/policy-definitions');
    await this.page.waitForResponse((response) => response.url().includes('/connector/management/v3/policydefinitions'));
  }

  async getPoliciesList() {
    return this.page.locator(this.policiesListLocator);
  }

  async getPolicyCards() {
    return this.page.locator(this.policyCardLocator);
  }

  async selectPolicy(policyName: string) {
    await this.page.locator(this.policyCardLocator).filter({ hasText: policyName }).click();
  }

  async verifyPolicyDetails() {
    return this.page.locator(this.policyDialogLocator);
  }

  async searchPolicies(searchTerm: string) {
    await this.searchItems(searchTerm, '/connector/management/v3/policydefinitions');
  }

  async clearPolicySearch() {
    await this.clearSearch('/connector/management/v3/policydefinitions');
  }

  async goToNextPage() {
    await super.goToNextPage('/connector/management/v3/policydefinitions');
  }

  async goToPreviousPage() {
    await super.goToPreviousPage('/connector/management/v3/policydefinitions');
  }
}
