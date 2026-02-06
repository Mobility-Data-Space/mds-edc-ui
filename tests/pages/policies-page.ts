import { Page } from '@playwright/test';
import { BaseListPage } from './base-list-page';

export class PoliciesPage extends BaseListPage {
  readonly policiesListLocator = '[data-testid="policies-list"]';
  readonly policyCardLocator = '.policy-card';
  readonly policyDialogLocator = '[data-testid="policy-dialog"]';
  readonly createPolicyButtonLocator = 'button:has-text("Create Policy")';
  readonly policyIdInputLocator = '[data-testid="policy-id-input"]';
  readonly createButtonLocator = 'button:has-text("Create")';
  readonly errorMessageLocator = '[data-testid="toast-error-message"]';
  readonly deleteButtonLocator = '[data-testid="delete-policy-modal-btn"]';
  readonly addExpressionButtonLocator = '[data-testid="add-expression-button"]';
  readonly participantIdExpressionLocator = '[data-testid="participant-id-expression"]';
  readonly participantIdFieldLocator = '[data-testid="participant-id-field"]';
  readonly operatorDropdownLocator = '[data-testid="ArrowDropDownIcon"]';
  readonly inOperatorOptionLocator = '[data-testid="referring-connector-operator-in-option"]';
  readonly equalOperatorOptionLocator = '[data-testid="referring-connector-operator-equal-option"]';

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
    await this.page.locator(this.participantIdExpressionLocator).click();
  }

  async selectInOperator() {
    await this.page.getByRole('combobox').click();
    await this.page.getByRole('option', { name: "IN" }).click();
  }

  async selectEqualOperator() {
    await this.page.getByRole('combobox').click();
    await this.page.getByRole('option', { name: "=" }).click();
  }

  async fillParticipantId(participantId: string) {
    await this.page.locator(this.participantIdFieldLocator).locator('input').fill(participantId);
  }

  async fillPolicyId(policyId: string) {
    await this.page.getByRole('textbox', { name: 'Policy ID' }).fill(policyId);
  }

  async clickCreateButton(expectedStatus?: number) {
    await this.page.locator(this.createButtonLocator).click();
    await this.waitForApiResponse('/connector/management/v3/policydefinitions', {
      expectedStatus,
    });
  }

  async clickCreateButtonAndWaitForCreateResponse(expectedStatus?: number) {
    const createEndpoint = '/connector/management/v3/policydefinitions';
    const responsePromise = this.page.waitForResponse(
      (response) => {
        const statusCheck = expectedStatus ? response.status() === expectedStatus : response.status() < 400;
        return response.url().includes(createEndpoint) && response.request().method() === 'POST' && statusCheck;
      },
    );
    await this.page.locator(this.createButtonLocator).click();
    return responsePromise;
  }
  async getErrorMessage() {
    return this.page.getByRole('alert').filter({ hasText: 'Policy with ID' });
  }

  async clickCreatePolicyButton() {
    await this.page.locator(this.createPolicyButtonLocator).click();
    // eslint-disable-next-line playwright/no-wait-for-selector
    await this.page.waitForSelector('button:has-text("Cancel")');
  }

  async waitForURL(url:string){
     await this.page.waitForURL(url);
  }

  async navigate() {
    await this.page.goto('/policy-definitions');
    const apiAvailable = await this.waitForApiResponse('/connector/management/v3/policydefinitions');
    if (!apiAvailable) {
      console.warn('Policy definitions API not responding, tests may be unreliable');
    }
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
