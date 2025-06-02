import { test, expect, } from '@playwright/test';
import {TRAFFIC_INFORMATION} from "@/constants/data-category";

test("assets modal creates asset", async ({ page }) => {
  await page.goto("http://localhost:3000/assets");

  const randomNumber = `${Math.random()}`.replace("0.", "");
  const uniqueAssetTitle = `Asset title ${randomNumber}`;
  const uniqueAssetId = `asset-id-${randomNumber}`;
  const uniqueAssetUrl = `https://url${randomNumber}.com`;

  const assetCreateModalOpenButton = page.getByTestId("create-asset-modal-opener");
  await assetCreateModalOpenButton.click();

  const assetCreateModal = page.getByTestId("asset-create-modal-title");
  await expect(assetCreateModal).toBeVisible();

  const advancedInfoStepTitle = page.getByTestId("asset-create-advanced-info-step-title");
  const dataAddressStepTitle = page.getByTestId("asset-create-data-address-step-title");
  const advancedInfoStepContent = page.getByTestId("asset-create-advanced-info-step-content");
  const dataAddressStepContent = page.getByTestId("asset-create-data-address-step-content");
  const assetCreateSubmit = page.getByTestId("asset-create-submit");

  // Next steps should not be accessible unless required fields in general info are filled
  await advancedInfoStepTitle.click();
  await expect(advancedInfoStepContent).toBeHidden();
  await dataAddressStepTitle.click();
  await expect(dataAddressStepContent).toBeHidden();
  await expect(assetCreateSubmit).toBeDisabled();

  const titleField = page.getByTestId("properties-title").locator("input").first();
  await titleField.fill('Test asset 1');

  // id takes the new value of title only if they are similar
  const idField = page.getByTestId("properties-id").locator("input").first();
  await expect(idField).toHaveValue('test-asset-1');
  await idField.fill('Test asset 2');
  await titleField.fill(uniqueAssetTitle);
  await expect(idField).toHaveValue('Test asset 2');
  await idField.fill(uniqueAssetId);

  await advancedInfoStepTitle.click();
  await expect(advancedInfoStepContent).toBeVisible();
  // Data address step can't be accessed unless required fields in advance info are filled
  await dataAddressStepTitle.click();
  await expect(dataAddressStepContent).toBeHidden();
  await expect(assetCreateSubmit).toBeDisabled();

  const dataCategorySelect = page.getByTestId("advanced-info-data-category");
  await dataCategorySelect.fill(TRAFFIC_INFORMATION);

  await dataAddressStepTitle.click();
  await expect(dataAddressStepContent).toBeVisible();

  const urlField = page.getByTestId("data-address-base-url").locator("input").first();
  await urlField.fill(uniqueAssetUrl)
  await expect(assetCreateSubmit).toBeEnabled();

  await assetCreateSubmit.click();

  await page.waitForResponse(resp => resp.url().includes('/management'));
  await expect(assetCreateModal).toBeHidden();
  await expect(page.getByText(uniqueAssetTitle)).toBeVisible();
  await expect(page.getByText(uniqueAssetUrl)).toBeVisible();
});
