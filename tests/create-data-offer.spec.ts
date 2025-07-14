import { expect, test } from '@playwright/test';
import { CreateDataOfferPage } from './pages/create-data-offer-page';

const unrestrictedSuccessMsg = 'Data offer was published successfully!';
const assetOnlySuccessMsg = 'Asset was created successfully!';

test.describe('Create Data Offer Tests', () => {
  let createDataOfferPage: CreateDataOfferPage;

  test.beforeEach(async ({ page }) => {
    createDataOfferPage = new CreateDataOfferPage(page);
    await createDataOfferPage.navigate();
  });

  test('should successfully create a data offer with unrestricted policy', async ({ page }) => {
    const title = `Test Data Offer ${Date.now()}`;
    const assetId = `this-is-a-test-data-offer-${Date.now()}`;
    await createDataOfferPage.fillCreateDataOfferForm(title, assetId, "https://google.com")

    await createDataOfferPage.getDataOfferPublishMode("PUBLISH_UNRESTRICTED").check()
    await createDataOfferPage.submitButton().click();

    const toast = createDataOfferPage.getSuccessMessage();
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(unrestrictedSuccessMsg);

    await page.waitForURL('/data-offers', { timeout: 10000 });
  });

  test('should successfully create a data offer with restricted policy', async ({ page }) => {
    const title = `Test Restricted Data Offer ${Date.now()}`;
    const assetId = `this-is-a-restricted-test-data-offer-${Date.now()}`;
    await createDataOfferPage.fillCreateDataOfferForm(title, assetId, "https://google.com")
    await createDataOfferPage.getDataOfferPublishMode("PUBLISH_RESTRICTED").check()

    await page.click('text=Publish restricted');

    await page.click('[data-testid="add-expression-button"]');
    await page.click('[data-testid="participant-id-expression"]');
    await createDataOfferPage.fillParticipantId('test-participant')

    await createDataOfferPage.submitButton().click();

    const toast = createDataOfferPage.getSuccessMessage()
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(unrestrictedSuccessMsg); // The same message as unrestricted

    await page.waitForURL('/data-offers', { timeout: 10000 });
  });

  test('should successfully create an asset only', async ({ page }) => {
    const title = `Test Asset Only ${Date.now()}`;
    const assetId = `this-is-a-test-asset-only-${Date.now()}`;
    await createDataOfferPage.fillCreateDataOfferForm(title, assetId, "https://google.com")
    await createDataOfferPage.getDataOfferPublishMode("DO_NOT_PUBLISH").check()

    await page.click('text=Create asset only (without data offer)');

    await createDataOfferPage.submitButton().click();

    const toast = createDataOfferPage.getSuccessMessage()
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(assetOnlySuccessMsg);

    await page.waitForURL('/assets', { timeout: 10000 });
  });

  test('should keep submit button disabled until all required fields are filled', async ({ page }) => {
    const createDataOfferPage = new CreateDataOfferPage(page);
    await createDataOfferPage.navigate();

    const title = `Test Disabled Submit ${Date.now()}`;
    const assetId = `disabled-submit-test-${Date.now()}`;
    const dataAddressUrl = "https://google.com";
    const submitButton = createDataOfferPage.submitButton();

    await expect(submitButton).toBeDisabled();

    await createDataOfferPage.dataAddressUrlInput().fill(dataAddressUrl);
    await expect(submitButton).toBeDisabled();

    await createDataOfferPage.titleInput().fill(title);
    await expect(submitButton).toBeDisabled();

    await createDataOfferPage.assetIdInput().fill(assetId);
    await expect(submitButton).toBeDisabled();

    await page.getByRole('combobox').filter({ hasText: 'Select data category' }).click();
    await page.locator('ul[role="listbox"] li[role="option"]').first().click();
    await expect(submitButton).toBeEnabled();

    await createDataOfferPage.getDataOfferPublishMode("PUBLISH_RESTRICTED").check();

    page.click('[data-testid="add-expression-button"]');
    await page.click('[data-testid="participant-id-expression"]');

    await expect(submitButton).toBeDisabled();
    await createDataOfferPage.fillParticipantId('test-participant')

    await expect(submitButton).toBeEnabled();
  });
});
