import { Page } from '@playwright/test';
import { PUBLISH_MODES } from '../../src/constants/data-address-types';

export class CreateDataOfferPage {
  private readonly page: Page;

  // Locators as properties
  private readonly formLocatorStr = '[data-testid="create-data-offer-form"]';
  private readonly titleInputLocatorStr = '#properties-title';
  private readonly assetIdInputLocatorStr = '#properties-id';
  private readonly dataAdressUrlInputStr = '#data-address-base-url';
  private readonly dataCategoryInputStr = '#advanced-info-data-category';
  private readonly offerPublishModeGroupStr = '[data-testid="offer-publish-mode-group"]';
  private readonly submitButtonLocatorStr = '[data-testid="data-offer-create-submit"]';
  private readonly successMessageLocatorStr = '[data-testid="toast-success-message"]';
  private readonly errorMessageLocatorStr = '[data-testid="toast-error-message"]';
  readonly participantIdFieldLocator = '[data-testid="participant-id-field"]';

  constructor(page: Page) {
    this.page = page;
  }

  // Locator methods
  form() {
    return this.page.locator(this.formLocatorStr);
  }
  titleInput() {
    return this.page.locator(this.titleInputLocatorStr);
  }
  assetIdInput() {
    return this.page.locator(this.assetIdInputLocatorStr);
  }
  dataAddressUrlInput() {
    return this.page.locator(this.dataAdressUrlInputStr);
  }
  dataCategoryInput() {
    return this.page.locator(this.dataCategoryInputStr);
  }
  offerPublishModeGroup() {
    return this.page.locator(this.offerPublishModeGroupStr);
  }
  submitButton() {
    return this.page.locator(this.submitButtonLocatorStr);
  }
  successMessage() {
    return this.page.locator(this.successMessageLocatorStr);
  }
  errorMessage() {
    return this.page.locator(this.errorMessageLocatorStr);
  }

  // Navigate to the create data offer page
  async navigate() {
    await this.page.goto('/create-data-offer');
    await this.form().waitFor({ state: 'visible' });
  }

  // Fill in the create data offer form
  async fillCreateDataOfferForm(title: string, assetId: string, dataAddressUrl: string) {
    await this.dataAddressUrlInput().fill(dataAddressUrl);
    await this.titleInput().fill(title);
    await this.assetIdInput().fill(assetId);
    await this.page.getByRole('combobox').filter({ hasText: 'Select data category' }).click();
    const firstOption = this.page.locator('ul[role="listbox"] li[role="option"]').first();
    await firstOption.click();
  }

  // Submit the form
  async submitForm() {
    await this.submitButton().click();
  }

  getSuccessMessage() {
    return this.successMessage();
  }

  getErrorMessage() {
    return this.errorMessage();
  }

  getDataOfferPublishMode(mode: typeof PUBLISH_MODES[number]["value"]) {
    return this.page.locator(`[data-testid="offer-publish-mode-${mode}"]`);
  }

  async fillParticipantId(participantId: string) {
    await this.page.locator(this.participantIdFieldLocator).locator('input').fill(participantId);
  }

}
