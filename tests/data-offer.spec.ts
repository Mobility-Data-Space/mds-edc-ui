import { test, expect } from '@playwright/test';
import { DataOfferPage } from './pages/data-offer-page';

test.describe("Data Offer Tests", () => {
  let dataOfferPage: DataOfferPage;

  test.beforeEach(async ({ page }) => {
    dataOfferPage = new DataOfferPage(page);
    await dataOfferPage.navigate();
  });
  
  test.fixme("Displays the list of data offers", async ({ page }) => {
    // Verify the data offer list is visible
    const dataOfferList = await dataOfferPage.getDataOfferList();
    await expect(dataOfferList).toBeVisible();
  });

  test.fixme("Displays data offer details when a data offer is selected", async ({ page }) => {
    // Select a data offer
    await dataOfferPage.selectDataOffer('Test Data Offer');

    // Verify the data offer details are visible
    const dataOfferDetails = await dataOfferPage.verifyDataOfferDetails();
    await expect(dataOfferDetails).toBeVisible();
  });
});
