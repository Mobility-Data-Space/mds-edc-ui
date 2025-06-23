import { test, expect } from '@playwright/test';
import { DataOffersPage } from './pages/data-offers-page';

test.describe("Data Offers Tests", () => {
  let dataOffersPage: DataOffersPage;

  test.beforeEach(async ({ page }) => {
    dataOffersPage = new DataOffersPage(page);
    await dataOffersPage.navigate();
  });
  
  test.fixme("Displays the list of data offers", async ({ page }) => {
    // Verify the data offers list is visible
    const dataOffersList = await dataOffersPage.getDataOffersList();
    await expect(dataOffersList).toBeVisible();
  });

  test.fixme("Displays data offer details when a data offer is selected", async ({ page }) => {
    // Select a data offer
    await dataOffersPage.selectDataOffer('Test Data Offer');

    // Verify the data offer details are visible
    const dataOfferDetails = await dataOffersPage.verifyDataOfferDetails();
    await expect(dataOfferDetails).toBeVisible();
  });
});
