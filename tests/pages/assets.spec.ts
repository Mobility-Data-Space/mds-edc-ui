import { test, expect } from '@playwright/test';
import { TRAFFIC_INFORMATION } from "../../src/constants/data-category";

test.describe("Assets Tests", () => {
  test.beforeAll(async ({ page }) => {
    console.log("Setting up before all tests...");
    await page.goto("http://localhost:3000/assets");
  });

  test.afterAll(async () => {
    console.log("Cleaning up after all tests...");
    // Add any teardown logic here if needed
  });

  test("View all assets on the connector", async ({ page }) => {
    const assetList = page.getByTestId("asset-list");
    await expect(assetList).toBeVisible();
    const assets = await assetList.locator(".asset-item").allTextContents();
    expect(assets.length).toBeGreaterThan(0);
  });

  test("Create a new asset with required fields", async ({ page }) => {
    const randomNumber = `${Math.random()}`.replace("0.", "");
    const uniqueAssetTitle = `Asset title ${randomNumber}`;
    const uniqueAssetId = `asset-id-${randomNumber}`;

    const assetCreateModalOpenButton = page.getByTestId("create-asset-modal-opener");
    await assetCreateModalOpenButton.click();

    const assetCreateModal = page.getByTestId("asset-create-modal-title");
    await expect(assetCreateModal).toBeVisible();

    const titleField = page.getByTestId("properties-title").locator("input").first();
    await titleField.fill(uniqueAssetTitle);

    const idField = page.getByTestId("properties-id").locator("input").first();
    await idField.fill(uniqueAssetId);

    const assetCreateSubmit = page.getByTestId("asset-create-submit");
    await expect(assetCreateSubmit).toBeEnabled();
    await assetCreateSubmit.click();

    await page.waitForResponse(resp => resp.url().includes('/management'));
    await expect(assetCreateModal).toBeHidden();
    await expect(page.getByText(uniqueAssetTitle)).toBeVisible();
  });

  test("Create a new asset with all fields", async ({ page }) => {
    const randomNumber = `${Math.random()}`.replace("0.", "");
    const uniqueAssetTitle = `Asset title ${randomNumber}`;
    const uniqueAssetId = `asset-id-${randomNumber}`;
    const uniqueAssetUrl = `https://url${randomNumber}.com`;

    const assetCreateModalOpenButton = page.getByTestId("create-asset-modal-opener");
    await assetCreateModalOpenButton.click();

    const assetCreateModal = page.getByTestId("asset-create-modal-title");
    await expect(assetCreateModal).toBeVisible();

    const titleField = page.getByTestId("properties-title").locator("input").first();
    await titleField.fill(uniqueAssetTitle);

    const idField = page.getByTestId("properties-id").locator("input").first();
    await idField.fill(uniqueAssetId);

    const advancedInfoStepTitle = page.getByTestId("asset-create-advanced-info-step-title");
    await advancedInfoStepTitle.click();

    const dataCategorySelect = page.getByTestId("advanced-info-data-category");
    await dataCategorySelect.fill(TRAFFIC_INFORMATION);

    const dataAddressStepTitle = page.getByTestId("asset-create-data-address-step-title");
    await dataAddressStepTitle.click();

    const urlField = page.getByTestId("data-address-base-url").locator("input").first();
    await urlField.fill(uniqueAssetUrl);

    const assetCreateSubmit = page.getByTestId("asset-create-submit");
    await expect(assetCreateSubmit).toBeEnabled();
    await assetCreateSubmit.click();

    await page.waitForResponse(resp => resp.url().includes('/management'));
    await expect(assetCreateModal).toBeHidden();
    await expect(page.getByText(uniqueAssetTitle)).toBeVisible();
    await expect(page.getByText(uniqueAssetUrl)).toBeVisible();
  });

  test("Delete an existing asset", async ({ page }) => {
    const assetItem = page.getByTestId("asset-item").first();
    const assetTitle = (await assetItem.textContent()) ?? "Unknown Asset";

    const deleteButton = assetItem.getByTestId("delete-asset-button");
    await deleteButton.click();

    const confirmDeleteButton = page.getByTestId("confirm-delete-button");
    await confirmDeleteButton.click();

    await page.waitForResponse(resp => resp.url().includes('/management'));
    await expect(page.getByText(assetTitle)).toBeHidden();
  });

  test("Select one asset and view its details", async ({ page }) => {
    const assetItem = page.getByTestId("asset-item").first();
    const assetTitle = (await assetItem.textContent()) ?? "Unknown Asset";

    await assetItem.click();

    const assetDetails = page.getByTestId("asset-details");
    await expect(assetDetails).toBeVisible();
    await expect(assetDetails.getByText(assetTitle)).toBeVisible();
  });
});
