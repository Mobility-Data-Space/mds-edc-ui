import { expect, test } from '@playwright/test';
import { CreateDataOfferPage } from './pages/create-data-offer-page';

test.describe("Create Data Offer Tests", () => {
  let createDataOfferPage: CreateDataOfferPage;

  test.beforeEach(async ({ page }) => {
    createDataOfferPage = new CreateDataOfferPage(page);
    await createDataOfferPage.navigate();
  });

  test("should successfully create a data offer with unrestricted policy", async ({ page }) => {
    // Fill in the form
    const title = `Test Data Offer ${Date.now()}`;
    const description = "This is a test data offer.";
    await createDataOfferPage.fillCreateDataOfferForm(title, description);

    // Submit the form
    await createDataOfferPage.submitForm();

    // Verify success message
    const successMessageLocator = await createDataOfferPage.getSuccessMessage();
    const successMessage = await successMessageLocator.textContent();
    await expect(successMessage).toBe("Data offer created successfully");

    // Verify navigation to the data offers list page
    await expect(page).toHaveURL('/data-offers');
  });

  test("should successfully create a data offer with restricted policy", async ({ page }) => {
    // Submit the form without filling in required fields
    await createDataOfferPage.submitForm();

    // Verify success message
    const successMessage = await createDataOfferPage.getSuccessMessage();
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toHaveText("Data offer created successfully");

    // Verify navigation to the data offers list page
    await expect(page).toHaveURL('/data-offers');
  });

  test("should successfully create an asset only", async ({ page }) => {
    // Submit the form without filling in required fields
    await createDataOfferPage.submitForm();

    // Verify success message
    const successMessage = await createDataOfferPage.getSuccessMessage();
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toHaveText("Data offer created successfully");

    // Verify navigation to the data offers list page
    await expect(page).toHaveURL('/data-offers');
  });
});
