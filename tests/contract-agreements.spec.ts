import { test, expect } from '@playwright/test';
import { ContractAgreementsPage } from './pages/contract-agreements-page';

test.describe("Contract Agreements Tests", () => {
  let agreementsPage: ContractAgreementsPage;

  test.beforeEach(async ({ page }) => {
    agreementsPage = new ContractAgreementsPage(page);
    await agreementsPage.navigate();
  });
  
  test.fixme("Displays the list of agreements", async ({ page }) => {
    // Verify the agreements list is visible
    const agreementsList = await agreementsPage.getAgreementsList();
    await expect(agreementsList).toBeVisible();
  });

  test.fixme("Displays agreement details when an agreement is selected", async ({ page }) => {
    // Select an agreement
    await agreementsPage.selectAgreement('Test Agreement');

    // Verify the agreement details are visible
    const agreementDetails = await agreementsPage.verifyAgreementDetails();
    await expect(agreementDetails).toBeVisible();
  });
});
