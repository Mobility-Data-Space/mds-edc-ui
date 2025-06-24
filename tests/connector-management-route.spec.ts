import { test } from '@playwright/test';
import { ConnectorManagementPage } from './pages/connector-management-page';

test.describe('Connector Management Route', () => {
  test('should navigate to the connector management page and verify elements', async ({ page }) => {
    const connectorManagementPage = new ConnectorManagementPage(page);

    // Navigate to the connector management route
    await connectorManagementPage.navigateTo();

    // Verify the page title
    await connectorManagementPage.verifyPageTitle('Connector Management');

    // Verify the visibility of a key element (replace with actual selector)
    await connectorManagementPage.verifyElementVisible('h1');
  });
});
