import { Page } from '@playwright/test';
import { BaseListPage } from './base-list-page';

export class PoliciesPage extends BaseListPage {
  readonly policiesListLocator = '.policies-list';
  readonly policyCardLocator = '.policy-card';
  readonly policyDialogLocator = '.policy-dialog';
  readonly createPolicyButtonLocator = 'button:has-text("Create Policy")';
  readonly policyIdInputLocator = '[data-testid="policy-id-input"]';
  readonly createButtonLocator = 'button:has-text("Create")';
  readonly errorMessageLocator = '[data-testid="error-message"]';
  readonly deleteButtonLocator = '[data-testid="delete-policy-button"]';
  readonly addExpressionButtonLocator = '[data-testid="add-expression-button"]';
  readonly participantIdFieldLocator = '[data-testid="participant-id-field"]';
  readonly operatorDropdownLocator = '[data-testid="operator-dropdown"]';
  readonly inOperatorOptionLocator = '[data-testid="operator-in-option"]';
  readonly equalOperatorOptionLocator = '[data-testid="operator-equal-option"]';

  constructor(page: Page) {
    super(page);
  }

  async getDeleteButton() {
    return this.page.locator(this.deleteButtonLocator);
  }

  async clickAddExpressionButton() {
    await this.page.locator(this.addExpressionButtonLocator).click();
  }

  async selectParticipantIdField() {
    await this.page.locator(this.participantIdFieldLocator).click();
  }

  async selectInOperator() {
    await this.page.locator(this.operatorDropdownLocator).click();
    await this.page.locator(this.inOperatorOptionLocator).click();
  }

  async selectEqualOperator() {
    await this.page.locator(this.operatorDropdownLocator).click();
    await this.page.locator(this.equalOperatorOptionLocator).click();
  }

  async fillParticipantId(participantId: string) {
    await this.page.locator(this.participantIdFieldLocator).fill(participantId);
  }

  async fillPolicyId(policyId: string) {
    await this.page.locator(this.policyIdInputLocator).fill(policyId);
  }

  async clickCreateButton() {
    await this.page.locator(this.createButtonLocator).click();
  }

  async getErrorMessage() {
    return this.page.locator(this.errorMessageLocator);
  }

  async clickCreatePolicyButton() {
    await this.page.locator(this.createPolicyButtonLocator).click();
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

  async getPolicyDialog() {
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
