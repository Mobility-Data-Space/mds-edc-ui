import { test, expect } from '@playwright/test';

const POLICY_DEFINITIONS_ROUTE = "/policy-definitions";
const POLICY_DEFINITION_EDC_PATH = "/api/management/v3/policydefinitions" ;
const POLICY_LIST_LOCATOR = "#policy-list";
const POLICY_ITEM_LOCATOR = ".policy-item";
const POLICY_DETAILS_LOCATOR = "policy-details";
const SEARCH_BOX_LOCATOR = "search-box";
const PAGINATION_NEXT_LOCATOR = "pagination-next";
const CREATE_POLICY_BUTTON_LOCATOR = "create-policy-button";
const POLICY_NAME_INPUT_LOCATOR = "policy-name-input";
const POLICY_RULES_INPUT_LOCATOR = "policy-rules-input";
const SUBMIT_BUTTON_LOCATOR = "policy-definition-create-submit";

test.describe("Policies Tests", () => {

  test.fixme("Displays the policy list on the first visit", async ({ page }) => {
    await page.goto(POLICY_DEFINITIONS_ROUTE);
    const response = await page.waitForResponse((response) => response.url().includes(POLICY_DEFINITION_EDC_PATH));
    expect(response.status()).toBe(200);

    // Verify the policy list is visible
    const policyList = page.locator(POLICY_LIST_LOCATOR);
    await expect(policyList).toBeVisible();

    // Verify there is at least one policy item
    const policies = await policyList.locator(POLICY_ITEM_LOCATOR).allTextContents();
    expect(policies.length).toBeGreaterThan(0);
  });

  test.fixme("Supports pagination and search functionality", async ({ page }) => {
    await page.goto(POLICY_DEFINITIONS_ROUTE);
    const response = await page.waitForResponse((response) => response.url().includes(POLICY_DEFINITION_EDC_PATH));
    expect(response.status()).toBe(200);

    // Test search functionality
    const searchBox = page.getByTestId(SEARCH_BOX_LOCATOR);
    await expect(searchBox).toBeVisible();
    await searchBox.fill("test-policy");
    await expect(page.locator(POLICY_LIST_LOCATOR).locator(POLICY_ITEM_LOCATOR).filter({ hasText: "test-policy" })).toBeVisible();

    // Test pagination
    const nextPageButton = page.getByTestId(PAGINATION_NEXT_LOCATOR);
    await expect(nextPageButton).toBeVisible();
    await nextPageButton.click();
    await expect(page.locator(POLICY_LIST_LOCATOR)).toBeVisible();
  });

  test.fixme("Displays policy details correctly", async ({ page }) => {
    await page.goto(POLICY_DEFINITIONS_ROUTE);
    const response = await page.waitForResponse((response) => response.url().includes(POLICY_DEFINITION_EDC_PATH));
    expect(response.status()).toBe(200);

    // Select a policy
    const policyItem = page.locator(POLICY_LIST_LOCATOR).locator(POLICY_ITEM_LOCATOR).first();
    await policyItem.click();

    // Verify details are displayed
    const policyDetails = page.getByTestId(POLICY_DETAILS_LOCATOR);
    await expect(policyDetails).toBeVisible();
    await expect(policyDetails.locator('text=Policy ID')).toBeVisible();
    await expect(policyDetails.locator('text=Description')).toBeVisible();
    await expect(policyDetails.locator('text=Associated Rules')).toBeVisible();
  });

  test("Creates a new policy and verifies its visibility in the list", async ({ page }) => {
    await page.goto(POLICY_DEFINITIONS_ROUTE);
    const response = await page.waitForResponse((response) => response.url().includes(POLICY_DEFINITION_EDC_PATH));
    expect(response.status()).toBe(200);

    // Click the create policy button
    const createPolicyButton = page.getByRole('button', { name: 'Create Policy' });
    await createPolicyButton.click();
    //await page.waitForURL("/policy-definitions/new");
    // Fill in the policy details
    const randomNumber = `${Math.random()}`.replace("0.", "");
    const policyName = `Policy ${randomNumber}`;

    const policyNameInput = page.getByRole('textbox', { name: 'Policy ID' });
    await policyNameInput.fill(policyName);

    await page.getByRole('button').filter({ hasText: /^$/ }).click() ;
    await page.getByRole('button', { name: 'Time at which the policy is' }).click() ;
    await page.getByRole('textbox', { name: 'Date' }).fill("22/09/2034") ;

    // Submit the form
    const submitButton = page.getByTestId(SUBMIT_BUTTON_LOCATOR);
    await submitButton.click();

    // Verify the new policy appears in the list
    await expect(page.getByRole('heading', { name: policyName })).toBeVisible();
  });

});
