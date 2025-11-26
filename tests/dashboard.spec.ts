import { expect, test } from '@playwright/test';
import { DashboardPage } from './pages/dashboard-page';
import { participantConfig as config } from "./utils/tests-config.ts";

test.describe("Dashboard Tests", () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
  });

  test("Displays the correct number of EDC resources in the connector", async ({ page }) => {
    // Wait for dashboard data to load
    await dashboardPage.waitForDataLoaded();

    const dataOffersCount = await dashboardPage.getDataOffersCount();
    const assetsCount = await dashboardPage.getAssetsCount();
    const policiesCount = await dashboardPage.getPoliciesCount();
    const catalogsCount = await dashboardPage.getCatalogsCount();
    const contractAgreementsCount = await dashboardPage.getContractAgreementsCount();

    expect(dataOffersCount).toBeGreaterThanOrEqual(1);
    expect(assetsCount).toBeGreaterThanOrEqual(7);
    expect(policiesCount).toBeGreaterThanOrEqual(1);
    expect(catalogsCount).toBeGreaterThanOrEqual(0);
    expect(contractAgreementsCount).toBeGreaterThanOrEqual(0);
  });
  
  test("Displays the connector management and protocol endpoints", async ({ page }) => {
    // Wait for connector endpoint to be loaded
    await dashboardPage.waitForConnectorEndpointLoaded();

    const connectorEndpoint = await dashboardPage.getConnectorEndpoint();
    const managementApiUrl = await dashboardPage.getManagementApiUrl();

    expect(connectorEndpoint).toBe(config.EDC_PROTOCOL_URL);
    expect(managementApiUrl).toBe(config.EDC_MANAGEMENT_URL);
  });

  test("Displays the connector properties on the dashboard", async ({ page }) => {
    // Wait for properties to be loaded
    await dashboardPage.waitForPropertiesLoaded();

    const propertiesText = ((await page.getByTestId('dashboard-edc-properties').first().allTextContents()) || [""])[0];
    expect(propertiesText).toContain(config.EDC_PROTOCOL_URL)
    expect(propertiesText).toContain(config.EDC_ID)
    expect(propertiesText).toContain(config.EDC_NAME)
    expect(propertiesText).toContain(config.EDC_DESCRIPTION);
    expect(propertiesText).toContain(config.EDC_CURATOR_ORGANIZATION);
    expect(propertiesText).toContain(config.EDC_CURATOR_URL);
    expect(propertiesText).toContain(config.EDC_MAINTAINER_ORGANIZATION);
    expect(propertiesText).toContain(config.EDC_MAINTAINER_URL);
    expect(propertiesText).toContain(config.MDS_DAPS_URL);
    expect(propertiesText).toContain(config.MDS_DAPS_JWKS_URL);
  });
});
