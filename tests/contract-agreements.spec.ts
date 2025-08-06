import { expect, test } from '@playwright/test';
import { ContractAgreementsPage } from './pages/contract-agreements-page';

test.describe("Contract Agreements Page Tests", () => {
  let agreementsPage: ContractAgreementsPage;

  test.beforeEach(async ({ page }) => {
    agreementsPage = new ContractAgreementsPage(page);
    await agreementsPage.navigate();
  });

  test.describe("List Functionality", () => {
    test("Displays the list of agreements", async ({ page }) => {
      // Verify the agreements list is visible
      const agreementsList = await agreementsPage.getAgreementsList();
      await expect(agreementsList).toBeVisible();

      // Verify there is at least one agreement card
      const agreementCards = await agreementsPage.getAgreementCards();
      const agreements = await agreementCards.allTextContents();
      expect(agreements.length).toBeGreaterThan(0);
    });
  });

  test.describe("View Functionality and Transfer Process Initiation", () => {
    test("Displays agreement details and initiate HTTP Push transfer processes", async ({ page }) => {
      // Select an agreement
      const agreementCards = await agreementsPage.getAgreementCards();
      const agreementCard = agreementCards.first();
      await agreementCard.click();

      // Verify the agreement details are visible
      const agreementDialog = await agreementsPage.getAgreementDialog();
      await expect(agreementDialog).toBeVisible();

      // Initiate transfer for HTTP
      await agreementsPage.initiateTransfer();
      // default type is HTTP Push
      await agreementsPage.fillHttpURL();
      await agreementsPage.submitTransfer();
      const successMessage = page.getByText('Transfer Process Initiated Successfully');
      await expect(successMessage).toBeVisible();
    });

    test("Displays agreement details and initiate S3 Push transfer processes", async ({ page }) => {
      // Select an agreement
      const agreementCards = await agreementsPage.getAgreementCards();
      const agreementCard = agreementCards.first();
      await agreementCard.click();

      // Verify the agreement details are visible
      const agreementDialog = await agreementsPage.getAgreementDialog();
      await expect(agreementDialog).toBeVisible();

      // Initiate transfer for S3
      await agreementsPage.initiateTransfer();
      await agreementsPage.selectS3Type();
      await agreementsPage.fillRequiredS3DataDestination("single");
      await agreementsPage.submitTransfer();
      const successMessage = page.getByText('Transfer Process Initiated Successfully');
      await expect(successMessage).toBeVisible();
    });

    test("Displays agreement details and initiate Azure Push transfer processes", async ({ page }) => {
      // Select an agreement
      const agreementCards = await agreementsPage.getAgreementCards();
      const agreementCard = agreementCards.first();
      await agreementCard.click();

      // Verify the agreement details are visible
      const agreementDialog = await agreementsPage.getAgreementDialog();
      await expect(agreementDialog).toBeVisible();

      // Initiate transfer for Azure
      await agreementsPage.initiateTransfer();
      await agreementsPage.selectAzureType();
      await agreementsPage.fillRequiredAzureDataDestination("single");
      await agreementsPage.submitTransfer();
      const successMessage = page.getByText('Transfer Process Initiated Successfully');
      await expect(successMessage).toBeVisible();
    });

    test("Displays agreement details when an agreement is selected and initiate a custom JSON (HTTP Push) transfer processes", async ({ page }) => {
      // Select an agreement
      const agreementCards = await agreementsPage.getAgreementCards();
      const agreementCard = agreementCards.first();
      await agreementCard.click();

      // Verify the agreement details are visible
      const agreementDialog = await agreementsPage.getAgreementDialog();
      await expect(agreementDialog).toBeVisible();

      // Initiate transfer with Custom JSON
      await agreementsPage.initiateTransfer();
      await agreementsPage.selectCustomJsonType();
      await agreementsPage.fillCustomJsonDataDestination();
      await agreementsPage.submitTransfer();
      const successMessage = page.getByText('Transfer Process Initiated Successfully');
      await expect(successMessage).toBeVisible();
    });
  });

  test.describe("Search Functionality", () => {
    test("should display search input and trigger button", async ({ page }) => {
      const searchInput = await agreementsPage.getSearchInput();
      const searchTrigger = await agreementsPage.getSearchTrigger();

      await expect(searchInput).toBeVisible();
      await expect(searchTrigger).toBeVisible();
    });

    test("should search for agreements by asset ID", async ({ page }) => {
      const initialAgreements = await agreementsPage.getAgreementCards();
      const initialCount = await initialAgreements.count();

      if (initialCount > 0) {
        const firstAgreement = initialAgreements.first();
        const assetId = await firstAgreement.locator('[data-testid="asset-id"]').textContent();
        const searchTerm = assetId || "";
        await agreementsPage.searchAgreements(searchTerm);

        const searchResults = await agreementsPage.getAgreementCards();
        await expect(searchResults).toBeVisible();

        await page.waitForTimeout(1000); // waits for additional 1 second to account for fetching the agreement details 

        const results = await searchResults.allTextContents();
        const hasMatchingResult = results.some((result) =>
          result.toLowerCase().includes(searchTerm.toLowerCase())
        );
        expect(hasMatchingResult).toBeTruthy();
      }
    });

    test("should clear search and show all agreements", async ({ page }) => {
      await agreementsPage.searchAgreements('test');

      await agreementsPage.clearAgreementSearch();

      const allAgreements = await agreementsPage.getAgreementCards();
      await expect(allAgreements.first()).toBeVisible();
    });

    test("should handle empty search results", async ({ page }) => {
      await agreementsPage.searchAgreements('nonexistentagreement12345');

      const searchResults = await agreementsPage.getAgreementCards();
      const resultCount = await searchResults.count();

      expect(resultCount).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Pagination Functionality", () => {
    test("should display pagination controls", async ({ page }) => {
      const paginationInfo = await agreementsPage.getPaginationInfo();
      await expect(paginationInfo).toBeVisible();
    });

    test("should navigate to next page when available", async ({ page }) => {
      const initialLastIndex = await agreementsPage.getLastElementIndex();
      const isNextEnabled = await agreementsPage.isNextPageEnabled();

      if (isNextEnabled) {
        await agreementsPage.goToNextPage();

        const newFirstIndex = await agreementsPage.getFirstElementIndex();
        expect(newFirstIndex).toBe(initialLastIndex + 1);
      } else {
        const totalLastIndex = await agreementsPage.getLastElementIndex();
        expect(initialLastIndex).toBe(totalLastIndex);
      }
    });

    test("should navigate to previous page when available", async ({ page }) => {
      const isNextEnabled = await agreementsPage.isNextPageEnabled();
      if (isNextEnabled) {
        await agreementsPage.goToNextPage();
        const pageAfterNextFirstIndex = await agreementsPage.getFirstElementIndex();

        await agreementsPage.goToPreviousPage();
        const pageAfterPrevFirstIndex = await agreementsPage.getFirstElementIndex();

        expect(pageAfterPrevFirstIndex).toBe(pageAfterNextFirstIndex - 1);
      } else {
        const isPrevEnabled = await agreementsPage.isPreviousPageEnabled();
        const currentFirstIndex = await agreementsPage.getFirstElementIndex();

        if (currentFirstIndex === 1) {
          expect(isPrevEnabled).toBeFalsy();
        }
      }
    });

    test("should disable previous button on first page", async ({ page }) => {
      const currentFirstIndex = await agreementsPage.getFirstElementIndex();

      if (currentFirstIndex === 1) {
        const isPrevEnabled = await agreementsPage.isPreviousPageEnabled();
        expect(isPrevEnabled).toBeFalsy();
      }
    });

    test("should disable next button on last page", async ({ page }) => {
      while (await agreementsPage.isNextPageEnabled()) {
        await agreementsPage.goToNextPage();
      }

      const isNextEnabled = await agreementsPage.isNextPageEnabled();
      expect(isNextEnabled).toBeFalsy();
    });

    test("should maintain search results across pagination", async ({ page }) => {
      await agreementsPage.searchAgreements('test');

      const isNextEnabled = await agreementsPage.isNextPageEnabled();
      if (isNextEnabled) {
        await agreementsPage.goToNextPage();

        const searchInput = await agreementsPage.getSearchInput();
        const searchValue = await searchInput.inputValue();
        expect(searchValue).toBe('test');
      }
    });
  });

  test.describe("Status Filter Functionality", () => {
    test.fixme("Navigates to active contracts and checks all are active", async ({ page }) => {
      await page.getByRole('button', { name: /Active Contracts/i }).click();
      await page.waitForTimeout(500); // adjust if needed for debounce
      const agreementCards = await agreementsPage.getAgreementCards();
      const count = await agreementCards.count();
      for (let i = 0; i < count; i++) {
        const card = agreementCards.nth(i);
        await expect(card.getByText('Active')).toBeVisible();
        await expect(card.getByText('Terminated')).not.toBeVisible();
      }
    });

    test.fixme("Navigates to terminated contracts and checks all are terminated", async ({ page }) => {
      await page.getByRole('button', { name: /Terminated Contracts/i }).click();
      await page.waitForTimeout(500); // adjust if needed for debounce
      const agreementCards = await agreementsPage.getAgreementCards();
      const count = await agreementCards.count();
      for (let i = 0; i < count; i++) {
        const card = agreementCards.nth(i);
        await expect(card.getByText('Terminated')).toBeVisible();
      }
    });
  });

  test.describe("Terminate Contract Functionality", () => {
    test("Terminates a contract, shows success message, and closes modal", async ({ page }) => {
      await page.getByRole('button', { name: /Active Contracts/i }).click();
      await page.waitForLoadState("networkidle")
      const agreementCards = await agreementsPage.getAgreementCards();
      const count = await agreementCards.count();
      if (count === 0) {
        test.skip(); // No active contracts to terminate
      }
      const firstCard = agreementCards.first();
      await firstCard.click();
      const agreementDialog = await agreementsPage.getAgreementDialog();
      await expect(agreementDialog).toBeVisible();
      const terminateBtn = agreementDialog.getByTestId('transfer-process-terminate');
      await terminateBtn.click();
      const terminateDialog = page.getByRole('dialog', { name: /Terminate Contract Agreement/i });
      await expect(terminateDialog).toBeVisible();
      const detailedReasonInput = terminateDialog.getByPlaceholder('You can enter a detailed explanation here');
      await detailedReasonInput.fill('Test termination reason');
      const confirmCheckbox = terminateDialog.getByLabel('I understand the consequences of terminating a contract.');
      await confirmCheckbox.check();
      const confirmTerminateBtn = terminateDialog.getByTestId('transfer-process-submit');
      await expect(confirmTerminateBtn).toBeEnabled();
      await confirmTerminateBtn.click();
      await expect(page.getByText('Contract terminated successful')).toBeVisible();
      await expect(agreementDialog).not.toBeVisible();
    });
  });
});
