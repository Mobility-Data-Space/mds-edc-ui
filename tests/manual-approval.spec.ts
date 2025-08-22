import { expect, test } from '@playwright/test';
import { ManualApprovalPage } from './pages/manual-approval-page';

test.describe("Manual Approval Tests", () => {
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

  test.fixme("should approve an item successfully", async ({ page }) => {
    // Approve an item
    const itemName = "Test Approval Item";
    await manualApprovalPage.approveItem(itemName);

    // Verify success message
    const successMessageLocator = await manualApprovalPage.getSuccessMessage();
    const successMessage = await successMessageLocator.textContent();
    expect(successMessage).toBe("Approval successful");
  });

  test.fixme("should reject an item successfully", async ({ page }) => {
    // Reject an item
    const itemName = "Test Approval Item";
    await manualApprovalPage.rejectItem(itemName);

    // Verify success message
    const successMessage = await manualApprovalPage.getSuccessMessage();
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toHaveText("Rejection successful");
  });

  test.fixme("should display an error message for invalid actions", async ({ page }) => {
    // Attempt to approve a non-existent item
    const itemName = "Non-existent Item";
    await manualApprovalPage.approveItem(itemName);

    // Verify error message
    const errorMessage = await manualApprovalPage.getErrorMessage();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText("An error has occurred");
  });
});
