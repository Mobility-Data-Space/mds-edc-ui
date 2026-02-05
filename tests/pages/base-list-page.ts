import { Page } from '@playwright/test';
import { SnackbarType } from '../../src/components/molecules/snackbar';

export class BaseListPage {
    readonly page: Page;
    readonly searchInputLocator = 'input[placeholder*="Search"]';
    readonly searchTriggerLocator = 'button:has-text("Search")';
    readonly paginationNextLocator = 'button[aria-label="Next page"]';
    readonly paginationPrevLocator = 'button[aria-label="Previous page"]';
    readonly paginationPageInfoLocator = '[data-testid="pagination-info"]';
    readonly successMessageLocator = '[data-testid="toast-success-message"]';
    readonly infoMessageLocator = '[data-testid="toast-info-message"]';
    readonly errorMessageLocator = '[data-testid="toast-error-message"]';

    constructor(page: Page) {
        this.page = page;
    }

    async waitForApiResponse(apiEndpoint: string, options?: { timeout?: number, retries?: number, expectedStatus?: number }): Promise<boolean> {
        const timeout = options?.timeout || 45000;
        const retries = options?.retries || 3;
        const expectedStatus = options?.expectedStatus;
        
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await this.page.waitForResponse(
                    (response) => {
                        const respnoseStatus = response.status()
                        let statusCheck = respnoseStatus < 400;
                        if(expectedStatus){
                            statusCheck = respnoseStatus === expectedStatus;
                        }

                        return response.url().includes(apiEndpoint) && statusCheck
                    },
                    { timeout: timeout / retries }
                );
                return true;
            } catch (error) {
                if (attempt === retries) {
                    console.warn(`Failed to get response from ${apiEndpoint} after ${retries} attempts`);
                    return false;
                }
                await this.page.waitForTimeout(1000 * attempt); // Exponential backoff
            }
        }
        return false;
    }

    async getToastMessage(type: SnackbarType) {
        const locatorMap: Record<SnackbarType, string> = {
            success: this.successMessageLocator,
            info: this.infoMessageLocator,
            error: this.errorMessageLocator,
        };
        const locator = locatorMap[type];
        return this.page.locator(locator);
    }

    async waitForToastMessage(type: SnackbarType, timeout = 10000) {
        const locatorMap: Record<SnackbarType, string> = {
            success: this.successMessageLocator,
            info: this.infoMessageLocator,
            error: this.errorMessageLocator,
        };
        const locator = this.page.locator(locatorMap[type]);
        await locator.waitFor({ state: 'visible', timeout });
        return locator;
    }

    async searchItems(searchTerm: string, apiEndpoint: string) {
        const searchInput = this.page.locator(this.searchInputLocator);
        await searchInput.fill(searchTerm);
        await this.page.locator(this.searchTriggerLocator).click();
        // Wait for API response instead of networkidle
        await this.waitForApiResponse(apiEndpoint);
    }

    async clearSearch(apiEndpoint: string) {
        const searchInput = this.page.locator(this.searchInputLocator);
        await searchInput.clear();
        await this.page.locator(this.searchTriggerLocator).click();
        await this.waitForApiResponse(apiEndpoint);
    }

    async getSearchInput() {
        return this.page.locator(this.searchInputLocator);
    }

    async getSearchTrigger() {
        return this.page.locator(this.searchTriggerLocator);
    }

    // Pagination functionality
    async goToNextPage(apiEndpoint: string) {
        const nextButton = this.page.locator(this.paginationNextLocator);
        if (await nextButton.isEnabled()) {
            await nextButton.click();
            await this.waitForApiResponse(apiEndpoint);
        }
    }

    async goToPreviousPage(apiEndpoint: string) {
        const prevButton = this.page.locator(this.paginationPrevLocator);
        if (await prevButton.isEnabled()) {
            await prevButton.click();
            await this.waitForApiResponse(apiEndpoint);
        }
    }

    async isNextPageEnabled() {
        const nextButton = this.page.locator(this.paginationNextLocator);
        if (await nextButton.count() === 0 || !(await nextButton.isVisible())) {
            return false;
        }
        return await nextButton.isEnabled();
    }

    async isPreviousPageEnabled() {
        const prevButton = this.page.locator(this.paginationPrevLocator);
        if (await prevButton.count() === 0 || !(await prevButton.isVisible())) {
            return false;
        }
        return await prevButton.isEnabled();
    }

    async getFirstElementIndex() {
        const pageInfo = this.page.locator(this.paginationPageInfoLocator);
        const text = await pageInfo.textContent();
        const match = text?.match(/(\d+)-(\d+)/);
        return match ? parseInt(match[1]) : 1;
    }

    async getLastElementIndex() {
        const pageInfo = this.page.locator(this.paginationPageInfoLocator);
        const text = await pageInfo.textContent();
        const match = text?.match(/(\d+)-(\d+)/);
        return match ? parseInt(match[2]) : 1;
    }

    async getPaginationInfo() {
        return this.page.locator(this.paginationPageInfoLocator);
    }
}
