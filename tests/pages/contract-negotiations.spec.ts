import { test, expect } from '@playwright/test';

const CONTRACT_NEGOTIATIONS_ROUTE = "/contract-negotiations";
const NEGOTIATION_LIST_LOCATOR = "negotiation-list";
const NEGOTIATION_ITEM_LOCATOR = "negotiation-item";
const NEW_DATA_OFFER_ROUTE = "/data-offers/new";
const MANUAL_APPROVAL_ROUTE = "/contract-negotiations/manual-approval";
const MANUAL_APPROVAL_LOCATOR = "Manual Approval";
const ID_TEXTBOX_LOCATOR = "ID";
const ASSETS_COMBOBOX_LOCATOR = "Assets";
const CONTRACT_POLICY_COMBOBOX_LOCATOR = "Contract Policy";
const ACCESS_POLICY_COMBOBOX_LOCATOR = "Access Policy";
const CREATE_BUTTON_LOCATOR = "Create";
const APPROVE_COLUMN_HEADER_LOCATOR = "Approve";
const REJECT_COLUMN_HEADER_LOCATOR = "Reject";

test.describe("Contract Negotiations Tests", () => {

  test.fixme("Displays the negotiation list on the first visit", async ({ page }) => {
    await page.goto(CONTRACT_NEGOTIATIONS_ROUTE);

    // Verify the negotiation list is visible
    const negotiationList = page.getByTestId(NEGOTIATION_LIST_LOCATOR);
    await expect(negotiationList).toBeVisible();

    // Verify there is at least one negotiation item
    const negotiations = await negotiationList.locator(`.${NEGOTIATION_ITEM_LOCATOR}`).allTextContents();
    expect(negotiations.length).toBe(0);
  });

  test.fixme("Displays negotiation details correctly", async ({ page }) => {
    await page.goto(MANUAL_APPROVAL_ROUTE);

    // Select a negotiation
    const negotiationRow = page.locator('tr').filter({ hasText: 'test-negotiation' });
    await negotiationRow.click();

    // Verify details are displayed
    const detailsPanel = page.locator('.details-panel');
    await expect(detailsPanel).toBeVisible();
    await expect(detailsPanel.locator('text=Negotiation ID')).toBeVisible();
    await expect(detailsPanel.locator('text=Status')).toBeVisible();
    await expect(detailsPanel.locator('text=Associated Contracts')).toBeVisible();
  });

  test.fixme("Lists negotiations pending manual approval with pagination and search", async ({ page }) => {
    await page.goto(MANUAL_APPROVAL_ROUTE);

    // Verify negotiations are listed
    const negotiationsTable = page.locator('table');
    await expect(negotiationsTable).toBeVisible();

    // Test pagination
    const nextPageButton = page.getByRole('button', { name: 'Next Page' });
    await expect(nextPageButton).toBeVisible();
    await nextPageButton.click();
    await expect(negotiationsTable).toBeVisible();

    // Test search functionality
    const searchBox = page.getByRole('textbox', { name: 'Search' });
    await expect(searchBox).toBeVisible();
    await searchBox.fill('test-negotiation');
    await expect(negotiationsTable.locator('tr').filter({ hasText: 'test-negotiation' })).toBeVisible();
  });

  test.fixme("Approves and rejects negotiations with confirmation dialogs", async ({ page }) => {
    await page.goto(MANUAL_APPROVAL_ROUTE);

    // Approve a negotiation
    const approveButton = page.getByRole('button', { name: 'Approve' });
    await approveButton.click();
    const approveDialog = page.locator('.confirmation-dialog');
    await expect(approveDialog).toBeVisible();
    await approveDialog.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.locator('tr').filter({ hasText: 'Approved' })).toBeVisible();

    // Reject a negotiation
    const rejectButton = page.getByRole('button', { name: 'Reject' });
    await rejectButton.click();
    const rejectDialog = page.locator('.confirmation-dialog');
    await expect(rejectDialog).toBeVisible();
    await rejectDialog.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.locator('tr').filter({ hasText: 'Rejected' })).toBeVisible();
  });

});
