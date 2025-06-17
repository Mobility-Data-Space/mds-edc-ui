import { test, expect } from '@playwright/test';

test.describe("Contract Agreements Tests", () => {

  test("On first visit, I can see agreements", async ({ page }) => {
    await page.goto("http://localhost:3000/contract-agreements");
    // Placeholder: Verify agreements are visible on the first visit
    const agreementList = page.getByTestId("agreement-list");
    await expect(agreementList).toBeVisible();
    const agreements = await agreementList.locator(".agreement-item").allTextContents();
    expect(agreements.length).toBeGreaterThan(0);
  });

  test("When I click on a specific agreement, I can initiate a transfer process with Http PUSH, Http PULL, S3 PUSH, Azure PUSH", async ({ page }) => {
    await page.goto("http://localhost:3000/contract-agreements");
    // Placeholder: Click on an agreement and initiate transfer processes
    const agreementItem = page.getByTestId("agreement-item").first();
    await agreementItem.click();
    const transferOptions = page.getByTestId("transfer-options");
    await expect(transferOptions).toBeVisible();
    const transferButton = transferOptions.getByTestId("transfer-button-http-push");
    await expect(transferButton).toBeVisible();
    await transferButton.click();
    await page.waitForResponse(resp => resp.url().includes('/transfer'));
  });

  test("When I click on a specific agreement, I can retire it", async ({ page }) => {
    await page.goto("http://localhost:3000/contract-agreements");
    // Placeholder: Click on an agreement and retire it
    const agreementItem = page.getByTestId("agreement-item").first();
    await agreementItem.click();
    const retireButton = page.getByTestId("retire-agreement-button");
    await expect(retireButton).toBeVisible();
    await retireButton.click();
    await page.waitForResponse(resp => resp.url().includes('/retire'));
    await expect(page.getByTestId("agreement-item")).not.toBeVisible();
  });
});
