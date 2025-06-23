import { test, expect } from '@playwright/test';
import { PoliciesPage } from './pages/policies-page';

test.describe("Policies Tests", () => {
  let policiesPage: PoliciesPage;

  test.beforeEach(async ({ page }) => {
    policiesPage = new PoliciesPage(page);
    await policiesPage.navigate();
  });

  test.fixme("Displays the list of policies", async ({ page }) => {
    // Verify the policies list is visible
    const policiesList = await policiesPage.getPoliciesList();
    await expect(policiesList).toBeVisible();
  });

  test.fixme("Displays policy details when a policy is selected", async ({ page }) => {
    // Select a policy
    await policiesPage.selectPolicy('Test Policy');

    // Verify the policy details are visible
    const policyDetails = await policiesPage.verifyPolicyDetails();
    await expect(policyDetails).toBeVisible();
  });
});
