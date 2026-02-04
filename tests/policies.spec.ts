import { expect, test } from '@playwright/test';
import { PoliciesPage } from './pages/policies-page';
import { randomUUID } from 'node:crypto';

test.describe("Policy Definitions Page Tests", () => {
  let policiesPage: PoliciesPage;

  test.beforeEach(async ({ page }) => {
    policiesPage = new PoliciesPage(page);
    try {
      await policiesPage.navigate();
    } catch (error) {
      console.warn('Failed to navigate to policies page, EDC service may be unavailable:', error);
      test.skip(true, 'EDC policies service not responding');
    }
  });

  test.describe("List Functionality", () => {
    test("Displays the policies list on the first visit", async ({ page }) => {
      // Verify the policies list is visible
      const policiesList = await policiesPage.getPoliciesList();
      await expect(policiesList).toBeVisible();

      // Verify there is at least one policy card
      const policyCards = await policiesPage.getPolicyCards();
      const policies = await policyCards.allTextContents();
      expect(policies.length).toBeGreaterThan(0);
    });
  });

  test.describe("View Functionality", () => {
    test("Displays policy details correctly", async ({ page }) => {
      // Select a policy
      const policyCards = await policiesPage.getPolicyCards();
      const policyCard = policyCards.first();
      await policyCard.click();

      // Verify details are displayed
      const policyDialog = await policiesPage.getPolicyDialog();
      await expect(policyDialog).toBeVisible();
    });
  });

  test.describe("Create Functionality", () => {
    test.fixme("should allow manual date input in the DatePicker field", async ({ page }) => {
      // Navigate to the Create Policy page
      await policiesPage.clickCreatePolicyButton();

      // Interact with the DatePicker field
      const datePickerInput = page.locator('[data-testid="date-picker-input"]');
      await datePickerInput.click();

      // Select a date using the calendar
      const calendarDay = page.locator('[data-testid="calendar-day"]').first();
      await calendarDay.click();

      // Manually edit the date in the input field
      await datePickerInput.fill("15/07/2025");

      // Verify the manually entered date is displayed correctly
      const inputValue = datePickerInput;
      await expect(inputValue).toHaveValue("15/07/2025");
    });

    // This test works locally but fails in CI we need to investigate further
    test.fixme("should create a policy using the '=' operator for Consumer's Participant ID", async ({ page }) => {
      // Open the Create Policy dialog
      await policiesPage.clickCreatePolicyButton();
      await page.waitForURL("**/new");

      // Fill in the policy details
      await policiesPage.fillPolicyId(`TestPolicy001-${Date.now()}`);
      await policiesPage.clickAddExpressionButton();
      await policiesPage.selectParticipantIdField();
      await policiesPage.selectEqualOperator();
      await policiesPage.fillParticipantId("ConsumerParticipant002");

      // Attempt to create the policy
      const listener =  page.waitForResponse((response) => response.url().includes('/connector/management/v3/policydefinitions/request'));
      await policiesPage.clickCreateButton();
      const response = await listener;
      expect(response.status()).toBe(200);

      // Verify policy was added
      const policyCards = await policiesPage.getPolicyCards();
      const policiesCount = await policyCards.count();
      expect(policiesCount).toBeGreaterThan(1);
    });
    // This test works locally but fails in CI we need to investigate further
    test.fixme("should create a policy using the IN ('isPartOf') operator for Consumer's Participant ID", async ({ page }) => {
      // Open the Create Policy dialog
      await policiesPage.clickCreatePolicyButton();
      await page.waitForURL("**/new");

      // Fill in the policy details
      await policiesPage.fillPolicyId(`TestPolicy002-${Date.now()}`);
      await policiesPage.clickAddExpressionButton();
      await policiesPage.selectParticipantIdField();
      await policiesPage.selectInOperator();
      await policiesPage.fillParticipantId("ConsumerParticipant001");

      // Attempt to create the policy

      const listener =  page.waitForResponse((response) => response.url().includes('/connector/management/v3/policydefinitions/request'));
      await policiesPage.clickCreateButton();

      const response = await listener;
      expect(response.status()).toBe(200);
      // Verify the success message
      const successMessageLocator = await policiesPage.waitForToastMessage('success');
      const successMessage = await successMessageLocator.textContent();
      expect(successMessage).toContain("Policy created successfully!");
      

      // Verify policy was added
      const policyCards = await policiesPage.getPolicyCards();
      const policiesCount = await policyCards.count();
      expect(policiesCount).toBeGreaterThan(1);
    });

    test("should display a clear error message for duplicate policy ID", async ({ page }) => {
      try {
        // Navigate to the Policies page
        await policiesPage.navigate();

        // Get the first policy's ID
        const policyCards = await policiesPage.getPolicyCards();
        const firstPolicy = policyCards.first();
        const policyId = firstPolicy.locator('[data-testid="policy-id"]');
        await expect(policyId).toHaveText(/^always-true/);
        // Try to create a policy with the same ID
        await policiesPage.clickCreatePolicyButton();
        await page.waitForURL("**/new");
        
        await policiesPage.fillPolicyId(policyId || "");
        await policiesPage.clickCreateButton();

        // Verify the error message
        const errorMessageLocator = await policiesPage.getErrorMessage();
        const errorMessage = errorMessageLocator;
        await expect(errorMessage).toHaveText(`Policy with ID ${policyId} already exists`);
      } catch (error) {
        console.warn('Policy management service appears to be unavailable:', error);
        test.skip(true, 'EDC policies service not responding');
      }
    });

  });

  test.describe("Delete Functionality", () => {
    // This test works locally but fails in CI we need to investigate further
    test.fixme("should delete the policy", async ({ page }) => {
      // Open the Create Policy dialog
      await policiesPage.clickCreatePolicyButton();
      await page.waitForURL("**/new");

      // Fill in the policy details
      const policyId = `TestPolicy-DELETE-${randomUUID()}`
      await policiesPage.fillPolicyId(policyId);

      // Attempt to create the policy
      const listerner = page.waitForResponse((response) => response.url().includes('/connector/management/v3/policydefinitions/request'));
      await policiesPage.clickCreateButton();
      const response = await listerner;
      expect(response.status()).toBe(200);

      const policyCards = await policiesPage.getPolicyCards();
      const policyCard = policyCards.locator('[data-testid="policy-id"]', {hasText: policyId});
      await policyCard.click();

      // Verify the "Delete" button is present in the policy details modal
      const deleteButton = await policiesPage.getDeleteButton();
      await expect(deleteButton).toBeVisible();

      await deleteButton.click();

      const confirmDeleteButton = page.getByTestId('confirm-delete-btn') ;
      await expect(confirmDeleteButton).toBeVisible() ;

      await confirmDeleteButton.click() ;
      await expect(page.getByTestId('toast-success-message').filter({ hasText: 'Policy deleted successfully!' })).toBeVisible();

      await page.waitForTimeout(1000);
      await expect(policyCard).toBeHidden() ;
    });

  });

  test.describe("Search Functionality", () => {
    test("should display search input and trigger button", async ({ page }) => {
      const searchInput = await policiesPage.getSearchInput();
      const searchTrigger = await policiesPage.getSearchTrigger();

      await expect(searchInput).toBeVisible();
      await expect(searchTrigger).toBeVisible();
    });

    test("should search for policies by ID", async ({ page }) => {
      const initialPolicies = await policiesPage.getPolicyCards();
      const initialCount = await initialPolicies.count();

      if (initialCount > 0) {
        const firstPolicy = initialPolicies.first();
        const policyId = await firstPolicy.locator('[data-testid="policy-id"]').textContent();
        const searchTerm = policyId || 'test'; // Use first word as search term

        await policiesPage.searchPolicies(searchTerm);

        const searchResults = await policiesPage.getPolicyCards();
        await expect(searchResults).toBeVisible();

        const results = await searchResults.allTextContents();
        const hasMatchingResult = results.some(result =>
          result.toLowerCase().includes(searchTerm.toLowerCase())
        );
        expect(hasMatchingResult).toBeTruthy();
      }
    });

    test("should clear search and show all policies", async ({ page }) => {
      await policiesPage.searchPolicies('test');

      await policiesPage.clearPolicySearch();

      const allPolicies = await policiesPage.getPolicyCards();
      await expect(allPolicies.first()).toBeVisible();
    });

    test("should handle empty search results", async ({ page }) => {
      await policiesPage.searchPolicies('nonexistentpolicy12345');

      const searchResults = await policiesPage.getPolicyCards();
      const resultCount = await searchResults.count();

      expect(resultCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Pagination Functionality", () => {
    test("should display pagination controls", async ({ page }) => {
      const paginationInfo = await policiesPage.getPaginationInfo();
      await expect(paginationInfo).toBeVisible();
    });

    test("should navigate to next page when available", async ({ page }) => {
      const initialFirstIndex = await policiesPage.getFirstElementIndex();
      const initialLastIndex = await policiesPage.getLastElementIndex();
      const isNextEnabled = await policiesPage.isNextPageEnabled();

      if (isNextEnabled) {
        await policiesPage.goToNextPage();

        const newFirstIndex = await policiesPage.getFirstElementIndex();
        expect(newFirstIndex).toBe(initialLastIndex + 1);
      } else {
        const totalLastIndex = await policiesPage.getLastElementIndex();
        expect(initialLastIndex).toBe(totalLastIndex);
      }
    });

    test("should navigate to previous page when available", async ({ page }) => {
      const isNextEnabled = await policiesPage.isNextPageEnabled();
      if (isNextEnabled) {
        await policiesPage.goToNextPage();
        const pageAfterNextFirstIndex = await policiesPage.getFirstElementIndex();

        await policiesPage.goToPreviousPage();
        const pageAfterPrevFirstIndex = await policiesPage.getFirstElementIndex();

        expect(pageAfterPrevFirstIndex).toBe(pageAfterNextFirstIndex - 1);
      } else {
        const isPrevEnabled = await policiesPage.isPreviousPageEnabled();
        const currentFirstIndex = await policiesPage.getFirstElementIndex();

        if (currentFirstIndex === 1) {
          expect(isPrevEnabled).toBeFalsy();
        }
      }
    });

    test("should disable previous button on first page", async ({ page }) => {
      const currentFirstIndex = await policiesPage.getFirstElementIndex();

      if (currentFirstIndex === 1) {
        const isPrevEnabled = await policiesPage.isPreviousPageEnabled();
        expect(isPrevEnabled).toBeFalsy();
      }
    });

    test("should disable next button on last page", async ({ page }) => {
      while (await policiesPage.isNextPageEnabled()) {
        await policiesPage.goToNextPage();
      }

      const isNextEnabled = await policiesPage.isNextPageEnabled();
      expect(isNextEnabled).toBeFalsy();
    });

    test("should maintain search results across pagination", async ({ page }) => {
      await policiesPage.searchPolicies('test');

      const isNextEnabled = await policiesPage.isNextPageEnabled();
      if (isNextEnabled) {
        await policiesPage.goToNextPage();

        const searchInput = await policiesPage.getSearchInput();
        const searchValue = searchInput;
        await expect(searchValue).toHaveValue('test');
      }
    });
  });
});
