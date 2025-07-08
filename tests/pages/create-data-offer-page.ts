import { Page } from '@playwright/test';

export class CreateDataOfferPage {
  private readonly page: Page;

  // Locators
  private readonly formLocator = '[data-testid="create-data-offer-form"]';
  private readonly titleInputLocator = '[data-testid="data-offer-title-input"]';
  private readonly descriptionInputLocator = '[data-testid="data-offer-description-input"]';
  private readonly submitButtonLocator = '[data-testid="submit-data-offer-button"]';
  private readonly successMessageLocator = '[data-testid="success-message"]';
  private readonly errorMessageLocator = '[data-testid="error-message"]';

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to the create data offer page
  async navigate() {
    await this.page.goto('/create-data-offer');
    await this.page.waitForLoadState('networkidle');
  }

  // Fill in the create data offer form
  async fillCreateDataOfferForm(title: string, description: string) {
    await this.page.fill(this.titleInputLocator, title);
    await this.page.fill(this.descriptionInputLocator, description);
  }

  // Submit the form
  async submitForm() {
    await this.page.click(this.submitButtonLocator);
  }

  getSuccessMessage() {
    return this.page.locator(this.successMessageLocator);
  }

  getErrorMessage() {
    return this.page.locator(this.errorMessageLocator);
  }
}
