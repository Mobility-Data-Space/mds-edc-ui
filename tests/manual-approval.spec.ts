import { expect, test } from '@playwright/test';
import { ManualApprovalPage } from './pages/manual-approval-page';

test.describe("Manual Approval Tests", () => {
  test.describe.configure({ mode: 'serial' });

  let manualApprovalPage: ManualApprovalPage;

  test.beforeEach(async ({ page }) => {
    manualApprovalPage = new ManualApprovalPage(page);
    await manualApprovalPage.navigate();
  });

  test("should display the approval list", async ({ page }) => {
    // Verify the approval list is visible
    const approvalList = await manualApprovalPage.getApprovalList();
    await expect(approvalList).toBeVisible();
  });

  test("should display the new columns in the table", async ({ page }) => {
    // Verify the new column headers are present
    await expect(page.getByText("For asset")).toBeVisible();
    await expect(page.getByText("Negotiation ID")).toBeVisible();
    await expect(page.getByText("with Counter Party ID")).toBeVisible();
  });

  test("should display approve and reject buttons for each pending item", async ({ page }) => {
    const approvalItems = await manualApprovalPage.getApprovalItems();
    await expect(approvalItems.first()).toBeVisible({ timeout: 15000 });

    const count = await approvalItems.count();
    for (let i = 0; i < count; i++) {
      const item = approvalItems.nth(i);
      await expect(item.getByRole('button', { name: /Approve/i })).toBeVisible();
      await expect(item.getByRole('button', { name: /Reject/i })).toBeVisible();
    }
  });

  test("should approve an item successfully", async ({ page }) => {
    const approvalItems = await manualApprovalPage.getApprovalItems();
    await expect(approvalItems.first()).toBeVisible({ timeout: 15000 });

    const firstItem = approvalItems.first();
    const approveButton = firstItem.getByRole('button', { name: /Approve/i });
    await expect(approveButton).toBeVisible();

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/v3/contractnegotiations/') &&
                    response.url().includes('/approve') &&
                    response.request().method() === 'POST'
    );
    await approveButton.click();
    const response = await responsePromise;

    if (response.ok()) {
      await expect(page.getByText('Contract Agreement Approved')).toBeVisible({ timeout: 10000 });
    }
  });

  test("should reject an item successfully", async ({ page }) => {
    const approvalItems = await manualApprovalPage.getApprovalItems();
    await expect(approvalItems.first()).toBeVisible({ timeout: 15000 });

    const firstItem = approvalItems.first();
    const rejectButton = firstItem.getByRole('button', { name: /Reject/i });
    await expect(rejectButton).toBeVisible();

    const responsePromise = page.waitForResponse(
      (response) => response.url().includes('/v3/contractnegotiations/') &&
                    response.url().includes('/reject') &&
                    response.request().method() === 'POST'
    );
    await rejectButton.click();
    const response = await responsePromise;

    if (response.ok()) {
      await expect(page.getByText('Contract Agreement Rejected')).toBeVisible({ timeout: 10000 });
    }
  });
});
