import { test, expect } from '@playwright/test';
import { TRAFFIC_INFORMATION } from "@/constants/data-category";

const CREATE_DATA_OFFER_ROUTE = "/create-data-offer";
const ASSETS_ROUTE = "/assets";
const DATA_OFFER_CONTACT_EMAIL_LOCATOR = "data-offer-contact-email";
const DATA_OFFER_CONTACT_PREFERRED_EMAIL_LOCATOR = "data-offer-contact-preferred-email-subject";
const PROPERTIES_TITLE_LOCATOR = "properties-title";
const PROPERTIES_ID_LOCATOR = "properties-id";
const ADVANCED_INFO_DATA_CATEGORY_LOCATOR = "advanced-info-data-category";
const DATA_OFFER_CREATE_SUBMIT_LOCATOR = "data-offer-create-submit";

test.describe("Create Data Offer Tests", () => {

  test.fixme("Creates an asset only and verifies its visibility in the assets page", async ({ page }) => {
    await page.goto(CREATE_DATA_OFFER_ROUTE);

    // Generate unique data for the test
    const randomNumber = `${Math.random()}`.replace("0.", "");
    const uniqueAssetTitle = `Data offer title ${randomNumber}`;
    const uniqueAssetId = `data-offer-id-${randomNumber}`;

    // Fill in the title and ID fields
    const titleField = page.getByTestId(PROPERTIES_TITLE_LOCATOR).locator("input").first();
    await titleField.fill(uniqueAssetTitle);

    const idField = page.getByTestId(PROPERTIES_ID_LOCATOR).locator("input").first();
    await idField.fill(uniqueAssetId);

    // Submit the form
    const dataOfferCreateSubmit = page.getByTestId(DATA_OFFER_CREATE_SUBMIT_LOCATOR);
    await dataOfferCreateSubmit.scrollIntoViewIfNeeded();
    await expect(dataOfferCreateSubmit).toBeEnabled();
    await dataOfferCreateSubmit.click();

    // Verify the new asset is visible in the assets page
    await page.goto(ASSETS_ROUTE);
    await page.waitForResponse(resp => resp.url().includes("/management"));
    await expect(page.getByText(uniqueAssetTitle)).toBeVisible();
  });

  test.fixme("Creates an asset with a restricted policy and contract definition", async ({ page }) => {
    await page.goto(CREATE_DATA_OFFER_ROUTE);

    // Generate unique data for the test
    const randomNumber = `${Math.random()}`.replace("0.", "");
    const uniqueAssetTitle = `Restricted Asset ${randomNumber}`;
    const uniqueAssetId = `restricted-asset-id-${randomNumber}`;

    // Fill in the title and ID fields
    const titleField = page.getByTestId(PROPERTIES_TITLE_LOCATOR).locator("input").first();
    await titleField.fill(uniqueAssetTitle);

    const idField = page.getByTestId(PROPERTIES_ID_LOCATOR).locator("input").first();
    await idField.fill(uniqueAssetId);

    // Select the data category
    const dataCategorySelect = page.getByTestId(ADVANCED_INFO_DATA_CATEGORY_LOCATOR);
    await dataCategorySelect.fill(TRAFFIC_INFORMATION);

    // Configure restricted policy
    const policyField = page.getByTestId("policy-restricted");
    await policyField.fill("Restricted Policy");

    // Submit the form
    const dataOfferCreateSubmit = page.getByTestId(DATA_OFFER_CREATE_SUBMIT_LOCATOR);
    await dataOfferCreateSubmit.scrollIntoViewIfNeeded();
    await expect(dataOfferCreateSubmit).toBeEnabled();
    await dataOfferCreateSubmit.click();

    // Verify the new asset, policy, and contract definition are visible
    await page.goto(ASSETS_ROUTE);
    await page.waitForResponse(resp => resp.url().includes("/management"));
    await expect(page.getByText(uniqueAssetTitle)).toBeVisible();
    await expect(page.getByText("Restricted Policy")).toBeVisible();
  });

  test.fixme("Creates an asset with an unrestricted policy and contract definition", async ({ page }) => {
    await page.goto(CREATE_DATA_OFFER_ROUTE);

    // Generate unique data for the test
    const randomNumber = `${Math.random()}`.replace("0.", "");
    const uniqueAssetTitle = `Unrestricted Asset ${randomNumber}`;
    const uniqueAssetId = `unrestricted-asset-id-${randomNumber}`;

    // Fill in the title and ID fields
    const titleField = page.getByTestId(PROPERTIES_TITLE_LOCATOR).locator("input").first();
    await titleField.fill(uniqueAssetTitle);

    const idField = page.getByTestId(PROPERTIES_ID_LOCATOR).locator("input").first();
    await idField.fill(uniqueAssetId);

    // Select the data category
    const dataCategorySelect = page.getByTestId(ADVANCED_INFO_DATA_CATEGORY_LOCATOR);
    await dataCategorySelect.fill(TRAFFIC_INFORMATION);

    // Configure unrestricted policy
    const policyField = page.getByTestId("policy-unrestricted");
    await policyField.fill("Unrestricted Policy");

    // Submit the form
    const dataOfferCreateSubmit = page.getByTestId(DATA_OFFER_CREATE_SUBMIT_LOCATOR);
    await dataOfferCreateSubmit.scrollIntoViewIfNeeded();
    await expect(dataOfferCreateSubmit).toBeEnabled();
    await dataOfferCreateSubmit.click();

    // Verify the new asset, policy, and contract definition are visible
    await page.goto(ASSETS_ROUTE);
    await page.waitForResponse(resp => resp.url().includes("/management"));
    await expect(page.getByText(uniqueAssetTitle)).toBeVisible();
    await expect(page.getByText("Unrestricted Policy")).toBeVisible();
  });

});
