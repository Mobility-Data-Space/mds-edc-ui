import { test, expect, } from '@playwright/test';
import {TRAFFIC_INFORMATION} from "@/constants/data-category.ts";

test("data offer creates asset", async ({ page }) => {
  await page.goto("http://localhost:3000/create-asset");

  const randomNumber = `${Math.random()}`.replace("0.", "");
  const uniqueAssetTitle = `Data offer title ${randomNumber}`;
  const uniqueAssetId = `data-offer-id-${randomNumber}`;
  const contactEmail = `email${randomNumber}@email.com`;
  const contactEmailPreferredEmail = `subject ${randomNumber}`;

  const contactEmailField = page.getByTestId("data-offer-contact-email").locator("input").first();
  await contactEmailField.fill(contactEmail);
  const contactEmailPreferredEmailField = page.getByTestId("data-offer-contact-preferred-email-subject").locator("input").first();
  await contactEmailPreferredEmailField.fill(contactEmailPreferredEmail);

  const titleField = page.getByTestId("properties-title").locator("input").first();
  await titleField.fill('Test data offer 1');

  // id takes the new value of title only if they are similar
  const idField = page.getByTestId("properties-id").locator("input").first();
  await expect(idField).toHaveValue('Test data offer 1');
  await idField.fill('Test data offer 2');
  await titleField.fill(uniqueAssetTitle);
  await expect(idField).toHaveValue('Test data offer 2');
  await idField.fill(uniqueAssetId);

  const dataCategorySelect = page.getByTestId("advanced-info-data-category");
  await dataCategorySelect.fill(TRAFFIC_INFORMATION);

  const dataOfferCreateSubmit = page.getByTestId("data-offer-create-submit");
  await dataOfferCreateSubmit.scrollIntoViewIfNeeded();

  await expect(dataOfferCreateSubmit).toBeEnabled();
  await dataOfferCreateSubmit.click();

  await page.goto("http://localhost:3000/assets");
  await page.waitForResponse(resp => resp.url().includes('/management'));

  await expect(page.getByText(uniqueAssetTitle)).toBeVisible();
});

