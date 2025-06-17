import { test, expect } from '@playwright/test';

test.describe("Policies Tests", () => {

  test("On first visit, I can see the list", async ({ page }) => {
    await page.goto("http://localhost:3000/policy-definitions");
    // Placeholder: Verify the list is visible on the first visit
    const policyList = page.getByTestId("policy-list");
    await expect(policyList).toBeVisible();
    const policies = await policyList.locator(".policy-item").allTextContents();
    expect(policies.length).toBeGreaterThan(0);
  });
});
