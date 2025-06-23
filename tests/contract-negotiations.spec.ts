import { test, expect } from '@playwright/test';
import { ContractNegotiationsPage } from './pages/contract-negotiations-page';

test.describe("Contract Negotiations Tests", () => {
  let negotiationsPage: ContractNegotiationsPage;

  test.beforeEach(async ({ page }) => {
    negotiationsPage = new ContractNegotiationsPage(page);
    await negotiationsPage.navigate();
  });
  
  test.fixme("Displays the list of negotiations", async ({ page }) => {
    // Verify the negotiations list is visible
    const negotiationsList = await negotiationsPage.getNegotiationsList();
    await expect(negotiationsList).toBeVisible();
  });

  test.fixme("Displays negotiation details when a negotiation is selected", async ({ page }) => {
    // Select a negotiation
    await negotiationsPage.selectNegotiation('Test Negotiation');

    // Verify the negotiation details are visible
    const negotiationDetails = await negotiationsPage.verifyNegotiationDetails();
    await expect(negotiationDetails).toBeVisible();
  });
});
