import { Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardHeaderLocator = '#dashboard-header';
  readonly widgetLocator = 'dashboard-widget';
  readonly dataOffersCountLocator = '[data-testid="dashboard-your-data-offers"] h2';
  readonly assetsCountLocator = '[data-testid="dashboard-your-assets"] h2';
  readonly policiesCountLocator = '[data-testid="dashboard-your-policies"] h2';
  readonly connectorEndpointLocator = '[data-testid="dashboard-connector-endpoint"] input';
  readonly catalogsCountLocator = '[data-testid="dashboard-preconfigured-catalogs"] h2';
  readonly contractAgreementsCountLocator = '[data-testid="dashboard-contract-agreements"] h2';
  readonly edcDescriptionLocator = '[data-testid="dashboard-edc-description"]';
  readonly edcCuratorOrganizationLocator = '[data-testid="dashboard-edc-curator-organization"]';
  readonly edcCuratorUrlLocator = '[data-testid="dashboard-edc-curator-url"]';
  readonly edcMaintainerOrganizationLocator = '[data-testid="dashboard-edc-maintainer-organization"]';
  readonly edcMaintainerUrlLocator = '[data-testid="dashboard-edc-maintainer-url"]';
  readonly mdsDapsUrlLocator = '[data-testid="dashboard-mds-daps-url"]';
  readonly managementApiUrlLocator = '[data-testid="dashboard-management-api-url"] input';

  constructor(page: Page) {
    this.page = page;
  }

  async getDataOffersCount() {
    return Number(await this.page.locator(this.dataOffersCountLocator).textContent());
  }

  async getAssetsCount() {
    return Number(await this.page.locator(this.assetsCountLocator).textContent());
  }

  async getPoliciesCount() {
    return Number(await this.page.locator(this.policiesCountLocator).textContent());
  }

  async getConnectorEndpoint() {
    return this.page.locator(this.connectorEndpointLocator).inputValue();
  }

  async getManagementApiUrl() {
    return this.page.locator(this.managementApiUrlLocator).inputValue();
  }

  async getCatalogsCount() {
    return Number(await this.page.locator(this.catalogsCountLocator).textContent());
  }

  async getContractAgreementsCount() {
    return Number(await this.page.locator(this.contractAgreementsCountLocator).textContent());
  }

  async getEdcDescription() {
    return this.page.locator(this.edcDescriptionLocator).textContent();
  }

  async getEdcCuratorOrganization() {
    return this.page.locator(this.edcCuratorOrganizationLocator).textContent();
  }

  async getEdcCuratorUrl() {
    return this.page.locator(this.edcCuratorUrlLocator).textContent();
  }

  async getEdcMaintainerOrganization() {
    return this.page.locator(this.edcMaintainerOrganizationLocator).textContent();
  }

  async getEdcMaintainerUrl() {
    return this.page.locator(this.edcMaintainerUrlLocator).textContent();
  }

  async getMdsDapsUrl() {
    return this.page.locator(this.mdsDapsUrlLocator).textContent();
  }

  async navigate() {
    await this.page.goto('/dashboard');
    await this.page.locator(this.dataOffersCountLocator).waitFor({ state: 'visible' });
  }

  async getDashboardHeader() {
    return this.page.getByTestId(this.dashboardHeaderLocator);
  }

  async getWidgets() {
    return this.page.locator(this.widgetLocator);
  }
}
