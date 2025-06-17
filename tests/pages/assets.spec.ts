import { test, expect } from '@playwright/test';

test.describe("Assets Tests", () => {
  
  test("On first visit, I see my own assets", async ({ page }) => {
    await page.goto("http://localhost:3000/assets");

    // Placeholder: Verify own assets are visible on the first visit
    const assetList = page.getByTestId("asset-list");
    await expect(assetList).toBeVisible();
    const assets = await assetList.locator(".asset-item").allTextContents();
    expect(assets.length).toBeGreaterThan(0);
  });

  test("When I click on a specific asset card, I can see its details", async ({ page }) => {
    await page.goto("http://localhost:3000/assets");

    // Placeholder: Click on an asset card and verify its details
    const assetCard = page.getByTestId("asset-card").first();
    await assetCard.click();
    const assetDetails = page.getByTestId("asset-details");
    await expect(assetDetails).toBeVisible();
  });

  test("I can delete a chosen asset", async ({ page }) => {
    await page.goto("http://localhost:3000/assets");

    // Placeholder: Delete an asset and verify it is removed
    const assetItem = page.getByTestId("asset-item").first();
    const assetTitle = (await assetItem.textContent()) ?? "Unknown Asset";

    const deleteButton = assetItem.getByTestId("delete-asset-button");
    await deleteButton.click();

    const confirmDeleteButton = page.getByTestId("confirm-delete-button");
    await confirmDeleteButton.click();

    await page.waitForResponse(resp => resp.url().includes('/management'));
    await expect(page.getByText(assetTitle)).toBeHidden();
  });

  test("I can use the form to create new assets with HttpData", async ({ page }) => {
    await page.goto("http://localhost:3000/assets");

    // Placeholder: Use the form to create a new asset with HttpData
    const assetCreateModalOpenButton = page.getByTestId("create-asset-modal-opener");
    await assetCreateModalOpenButton.click();

    const assetCreateModal = page.getByTestId("asset-create-modal-title");
    await expect(assetCreateModal).toBeVisible();

    const titleField = page.getByTestId("properties-title").locator("input").first();
    await titleField.fill("HttpData Asset");

    const idField = page.getByTestId("properties-id").locator("input").first();
    await idField.fill("httpdata-asset-id");

    const assetCreateSubmit = page.getByTestId("asset-create-submit");
    await expect(assetCreateSubmit).toBeEnabled();
    await assetCreateSubmit.click();

    await page.waitForResponse(resp => resp.url().includes('/management'));
    await expect(assetCreateModal).toBeHidden();
    await expect(page.getByText("HttpData Asset")).toBeVisible();
  });

  test("I can use the form to create new assets with S3", async ({ page }) => {
    await page.goto("http://localhost:3000/assets");

    // Placeholder: Use the form to create a new asset with S3
    const assetCreateModalOpenButton = page.getByTestId("create-asset-modal-opener");
    await assetCreateModalOpenButton.click();

    const assetCreateModal = page.getByTestId("asset-create-modal-title");
    await expect(assetCreateModal).toBeVisible();

    const titleField = page.getByTestId("properties-title").locator("input").first();
    await titleField.fill("S3 Asset");

    const idField = page.getByTestId("properties-id").locator("input").first();
    await idField.fill("s3-asset-id");

    const assetCreateSubmit = page.getByTestId("asset-create-submit");
    await expect(assetCreateSubmit).toBeEnabled();
    await assetCreateSubmit.click();

    await page.waitForResponse(resp => resp.url().includes('/management'));
    await expect(assetCreateModal).toBeHidden();
    await expect(page.getByText("S3 Asset")).toBeVisible();
  });

  test("I can use the form to create new assets with Azure Blob", async ({ page }) => {
    await page.goto("http://localhost:3000/assets");

    // Placeholder: Use the form to create a new asset with Azure Blob
    const assetCreateModalOpenButton = page.getByTestId("create-asset-modal-opener");
    await assetCreateModalOpenButton.click();

    const assetCreateModal = page.getByTestId("asset-create-modal-title");
    await expect(assetCreateModal).toBeVisible();

    const titleField = page.getByTestId("properties-title").locator("input").first();
    await titleField.fill("Azure Blob Asset");

    const idField = page.getByTestId("properties-id").locator("input").first();
    await idField.fill("azure-blob-asset-id");

    const assetCreateSubmit = page.getByTestId("asset-create-submit");
    await expect(assetCreateSubmit).toBeEnabled();
    await assetCreateSubmit.click();

    await page.waitForResponse(resp => resp.url().includes('/management'));
    await expect(assetCreateModal).toBeHidden();
    await expect(page.getByText("Azure Blob Asset")).toBeVisible();
  });

  test("I can use the form to create new assets with On Request", async ({ page }) => {
    await page.goto("http://localhost:3000/assets");
    
    // Placeholder: Use the form to create a new asset with On Request
    const assetCreateModalOpenButton = page.getByTestId("create-asset-modal-opener");
    await assetCreateModalOpenButton.click();

    const assetCreateModal = page.getByTestId("asset-create-modal-title");
    await expect(assetCreateModal).toBeVisible();

    const titleField = page.getByTestId("properties-title").locator("input").first();
    await titleField.fill("On Request Asset");

    const idField = page.getByTestId("properties-id").locator("input").first();
    await idField.fill("on-request-asset-id");

    const assetCreateSubmit = page.getByTestId("asset-create-submit");
    await expect(assetCreateSubmit).toBeEnabled();
    await assetCreateSubmit.click();

    await page.waitForResponse(resp => resp.url().includes('/management'));
    await expect(assetCreateModal).toBeHidden();
    await expect(page.getByText("On Request Asset")).toBeVisible();
  });
});
