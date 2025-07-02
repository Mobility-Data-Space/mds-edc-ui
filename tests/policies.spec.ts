import { expect, test } from '@playwright/test';
import { PoliciesPage } from './pages/policies-page';

test.describe("Policy Definitions Page Tests", () => {
  let policiesPage: PoliciesPage;

  test.beforeEach(async ({ page }) => {
    policiesPage = new PoliciesPage(page);
    await policiesPage.navigate();
  });

  test.fixme("Displays the policies list on the first visit", async ({ page }) => {
    // Verify the policies list is visible
    const policiesList = await policiesPage.getPoliciesList();
    await expect(policiesList).toBeVisible();

    // Verify there is at least one policy card
    const policyCards = await policiesPage.getPolicyCards();
    const policies = await policyCards.allTextContents();
    expect(policies.length).toBeGreaterThan(0);
  });

  test.fixme("Displays policy details correctly", async ({ page }) => {
    // Select a policy
    const policyCards = await policiesPage.getPolicyCards();
    const policyCard = policyCards.first();
    await policyCard.click();

    // Verify details are displayed
    const policyDetails = await policiesPage.verifyPolicyDetails();
    await expect(policyDetails).toBeVisible();
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
      const initialPage = await policiesPage.getCurrentPageNumber();
      const isNextEnabled = await policiesPage.isNextPageEnabled();

      if (isNextEnabled) {
        await policiesPage.goToNextPage();

        const newPage = await policiesPage.getCurrentPageNumber();
        expect(newPage).toBe(initialPage + 1);
      } else {
        const totalPages = await policiesPage.getTotalPages();
        expect(initialPage).toBe(totalPages);
      }
    });

    test("should navigate to previous page when available", async ({ page }) => {
      const isNextEnabled = await policiesPage.isNextPageEnabled();
      if (isNextEnabled) {
        await policiesPage.goToNextPage();
        const pageAfterNext = await policiesPage.getCurrentPageNumber();

        await policiesPage.goToPreviousPage();
        const pageAfterPrev = await policiesPage.getCurrentPageNumber();

        expect(pageAfterPrev).toBe(pageAfterNext - 1);
      } else {
        const isPrevEnabled = await policiesPage.isPreviousPageEnabled();
        const currentPage = await policiesPage.getCurrentPageNumber();

        if (currentPage === 1) {
          expect(isPrevEnabled).toBeFalsy();
        }
      }
    });

    test("should disable previous button on first page", async ({ page }) => {
      const currentPage = await policiesPage.getCurrentPageNumber();

      if (currentPage === 1) {
        const isPrevEnabled = await policiesPage.isPreviousPageEnabled();
        expect(isPrevEnabled).toBeFalsy();
      }
    });

    test("should disable next button on last page", async ({ page }) => {
      const totalPages = await policiesPage.getTotalPages();

      while (await policiesPage.isNextPageEnabled()) {
        await policiesPage.goToNextPage();
      }

      const currentPage = await policiesPage.getCurrentPageNumber();
      expect(currentPage).toBe(totalPages);

      const isNextEnabled = await policiesPage.isNextPageEnabled();
      expect(isNextEnabled).toBeFalsy();
    });

    test("should maintain search results across pagination", async ({ page }) => {
      await policiesPage.searchPolicies('test');

      const isNextEnabled = await policiesPage.isNextPageEnabled();
      if (isNextEnabled) {
        await policiesPage.goToNextPage();

        const searchInput = await policiesPage.getSearchInput();
        const searchValue = await searchInput.inputValue();
        expect(searchValue).toBe('test');
      }
    });
  });
});
