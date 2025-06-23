import { Page } from '@playwright/test';

export class PoliciesPage {
  readonly page: Page;
  readonly policiesListLocator = '#policies-list';
  readonly policyItemLocator = '.policy-item';
  readonly policyDetailsLocator = '#policy-details';

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/policies');
    await this.page.waitForLoadState('networkidle');
  }

  async getPoliciesList() {
    return this.page.locator(this.policiesListLocator);
  }

  async selectPolicy(policyName: string) {
    const policyItem = this.page.locator(this.policyItemLocator).filter({ hasText: policyName });
    await policyItem.click();
  }

  async verifyPolicyDetails() {
    const policyDetails = this.page.locator(this.policyDetailsLocator);
    await policyDetails.waitFor();
    return policyDetails;
  }
}
