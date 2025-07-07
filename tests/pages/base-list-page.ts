import { Page } from '@playwright/test';

export class BaseListPage {
    readonly page: Page;
    readonly searchInputLocator = 'input[placeholder*="Search"]';
    readonly searchTriggerLocator = 'button:has-text("Search")';
    readonly paginationNextLocator = 'button[aria-label="Next page"]';
    readonly paginationPrevLocator = 'button[aria-label="Previous page"]';
    readonly paginationPageInfoLocator = '[data-testid="pagination-info"]';

    constructor(page: Page) {
        this.page = page;
    }

    async searchItems(searchTerm: string, apiEndpoint: string) {
        const searchInput = this.page.locator(this.searchInputLocator);
        await searchInput.fill(searchTerm);
        await this.page.locator(this.searchTriggerLocator).click();
        await this.page.waitForResponse((response) => response.url().includes(apiEndpoint));
    }

    async clearSearch(apiEndpoint: string) {
        const searchInput = this.page.locator(this.searchInputLocator);
        await searchInput.clear();
        await this.page.locator(this.searchTriggerLocator).click();
        await this.page.waitForResponse((response) => response.url().includes(apiEndpoint));
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
            await this.page.waitForResponse((response) => response.url().includes(apiEndpoint));
        }
    }

    async goToPreviousPage(apiEndpoint: string) {
        const prevButton = this.page.locator(this.paginationPrevLocator);
        if (await prevButton.isEnabled()) {
            await prevButton.click();
            await this.page.waitForResponse((response) => response.url().includes(apiEndpoint));
        }
    }

    async isNextPageEnabled() {
        return await this.page.locator(this.paginationNextLocator).isEnabled();
    }

    async isPreviousPageEnabled() {
        return await this.page.locator(this.paginationPrevLocator).isEnabled();
    }

    async getCurrentPageNumber() {
        const pageInfo = this.page.locator(this.paginationPageInfoLocator);
        const text = await pageInfo.textContent();
        const match = text?.match(/Page (\d+)/);
        return match ? parseInt(match[1]) : 1;
    }

    async getTotalPages() {
        const pageInfo = this.page.locator(this.paginationPageInfoLocator);
        const text = await pageInfo.textContent();
        const match = text?.match(/of (\d+)/);
        return match ? parseInt(match[1]) : 1;
    }

    async getPaginationInfo() {
        return this.page.locator(this.paginationPageInfoLocator);
    }
}