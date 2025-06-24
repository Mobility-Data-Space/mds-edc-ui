import { Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardHeaderLocator = '#dashboard-header';
  readonly widgetLocator = '.dashboard-widget';

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async getDashboardHeader() {
    return this.page.locator(this.dashboardHeaderLocator);
  }

  async getWidgets() {
    return this.page.locator(this.widgetLocator);
  }
}
