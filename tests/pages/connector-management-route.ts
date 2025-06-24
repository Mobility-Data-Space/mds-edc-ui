import { Page, expect } from '@playwright/test';

export class ConnectorManagementPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo() {
    await this.page.goto('/connector/management');
  }

  async verifyPageTitle(expectedTitle: string) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async verifyElementVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }
}
