import { test, expect } from '@playwright/test';

const ASSETS_ROUTE = "/assets";
const ASSETS_EDC_PATH = "/api/management/v3/assets";
const ASSET_LIST_LOCATOR = "#asset-list";
const ASSET_CARD_LOCATOR = ".asset-card";
const ASSET_DIALOG_LOCATOR = ".asset-dialog";

const SEARCH_BOX_LOCATOR = "#search-box";
const PAGINATION_NEXT_LOCATOR = "#pagination-next";

const CREATE_ASSET_MODAL_LOCATOR = ".create-asset-form";
const CREATE_ASSET_BUTTON_LOCATOR = "data-testid=create-asset-modal-opener";
const TITLE_INPUT_LOCATOR = "Title";
const ID_INPUT_LOCATOR = "Asset ID";

test.describe("Assets Page Tests", () => {
  test.slow();

  test("Displays the asset list on the first visit", async ({ page }) => {
    await page.goto(ASSETS_ROUTE);
    const response = await page.waitForResponse((response) => response.url().includes(ASSETS_EDC_PATH));
    expect(response.status()).toBe(200);
    const responseBody = await response.body() ;
    expect(responseBody.length).toBeGreaterThan(0);

    // Verify the asset list is visible
    const assetList = page.locator(ASSET_LIST_LOCATOR);
    await expect(assetList).toBeVisible();

    // Verify there is at least one asset card
    const assets = await assetList.locator(ASSET_CARD_LOCATOR).allTextContents();
    expect(assets.length).toBeGreaterThan(0);
  });

  test.fixme("Supports pagination and search functionality", async ({ page }) => {
    await page.goto(ASSETS_ROUTE);
    await page.waitForResponse((response) => response.url().includes(ASSETS_EDC_PATH));

    // Test search functionality
    const searchBox = page.locator(SEARCH_BOX_LOCATOR);
    await expect(searchBox).toBeVisible();
    await searchBox.fill("test-asset");
    await expect(page.locator(ASSET_LIST_LOCATOR).locator(`.${ASSET_CARD_LOCATOR}`).filter({ hasText: "test-asset" })).toBeVisible();

    // Test pagination
    const nextPageButton = page.locator(PAGINATION_NEXT_LOCATOR);
    await expect(nextPageButton).toBeVisible();
    await nextPageButton.click();
    await expect(page.locator(ASSET_LIST_LOCATOR)).toBeVisible();
  });

  test("Displays asset details correctly", async ({ page }) => {
    await page.goto(ASSETS_ROUTE);
    await page.waitForResponse((response) => response.url().includes(ASSETS_EDC_PATH));

    // Select an asset
    const assetCard = page.locator(ASSET_LIST_LOCATOR).locator(ASSET_CARD_LOCATOR).first();
    await assetCard.click();

    // Verify details are displayed
    const assetDetails = page.locator(ASSET_DIALOG_LOCATOR);
    await expect(assetDetails).toBeVisible();
    await expect(assetDetails.locator('text=Asset ID')).toBeVisible();
    await expect(assetDetails.locator('text=Participant ID')).toBeVisible();
  });

  test("Deletes an asset and verifies it is removed from the list", async ({ page }) => {
    await page.goto(ASSETS_ROUTE);
    await page.waitForResponse((response) => response.url().includes(ASSETS_EDC_PATH));

    // Select an asset to delete
    const assetCard = page.locator(ASSET_LIST_LOCATOR).locator(ASSET_CARD_LOCATOR).first();
    const assetName = (await assetCard.textContent()) || "";
    await assetCard.click();
    const deleteButton = page.getByRole('heading', { name: 'Asset 3 asset-3-id' }).getByRole('button');
    await deleteButton.click();

    // Confirm deletion
    const confirmDelete = page.getByRole('button', { name: 'Delete' });
    await confirmDelete.click();

    // Verify the asset is removed
    await expect(page.locator(ASSET_LIST_LOCATOR).locator(ASSET_CARD_LOCATOR).filter({ hasText: assetName })).toHaveCount(0);
  });

  test("Creates a new asset and verifies its visibility in the list", async ({ page }) => {
    await page.goto(ASSETS_ROUTE);
    await page.waitForResponse((response) => response.url().includes(ASSETS_EDC_PATH));

    // Open the create asset modal
    const createAssetButton = page.locator(CREATE_ASSET_BUTTON_LOCATOR);
    await createAssetButton.click();

    const createAssetModal = page.locator(CREATE_ASSET_MODAL_LOCATOR);
    await expect(createAssetModal).toBeVisible();

    // Fill in the asset details
    const randomNumber = `${Math.random()}`.replace("0.", "");
    const assetTitle = `Asset ${randomNumber}`;
    const assetId = `asset-id-${randomNumber}`;

    const titleInput = page.getByRole('textbox', { name: TITLE_INPUT_LOCATOR });
    await titleInput.fill(assetTitle);

    const idInput = page.getByRole('textbox', { name: ID_INPUT_LOCATOR });
    await idInput.fill(assetId);

    await page.getByRole('button', { name: 'Advanced Information' }).click();

    const dataCategorySelect = page.getByRole('combobox', { name: 'Select data category' }) ;
    await dataCategorySelect.click() ;
    await page.getByRole('option', { name: 'Traffic Information' }).click() ;

    await page.getByRole('button', { name: 'Datasource Information' }).click();

    await page.getByRole('textbox', { name: 'URL URL' }).fill("https://www.think-it.io")

    // Submit the form
    const submitButton = page.getByRole('button', { name: 'Create' });
    await submitButton.click();

    // Verify the new asset appears in the list
    await expect(page.locator(ASSET_LIST_LOCATOR).locator(ASSET_CARD_LOCATOR).filter({ hasText: assetId })).toBeVisible();
  });

});
