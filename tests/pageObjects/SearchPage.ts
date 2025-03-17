import { Page } from "@playwright/test";

export class SearchPage {
  private page: Page;
  private clickSearchButton = "//button[@title='Open search input']";
  private searchInput = "//input[@aria-label='Search the site']";
  private applySearchButton = "//button[@title='Apply Search']";
  private errorMessageLocator = "//div[@class='toast-message']";

  constructor(page: Page) {
    this.page = page;
  }

  async clickSearch() {
    await this.page.click(this.clickSearchButton);
  }

  async fillSearch(searchTerm: string) {
    await this.page.fill(this.searchInput, searchTerm);
  }

  async applySearch() {
    await this.page.click(this.applySearchButton);
  }

  async waitForErrorMessage() {
    await this.page.waitForSelector(this.errorMessageLocator);
  }

  async getErrorMessage(): Promise<string> {
    return (await this.page.textContent(this.errorMessageLocator)) || "";
  }

  async search(term: string) {
    await this.page.click(this.clickSearchButton);
    await this.page.fill(this.searchInput, term);
    await this.page.click(this.applySearchButton);
  }

  // Method to wait for the search results to load
  async waitForResults() {
    await this.page.waitForSelector("//h1[contains(.,'Browse All')]"); // You should update this selector to match the page
  }

  async getPageLoadTime() {
    // Wait for the page to load (navigation is complete)
    const startTime = Date.now();

    // Wait for the page to finish loading
    await this.page.waitForLoadState("load"); // "load" event triggers when the page and all resources are loaded

    const endTime = Date.now();
    const pageLoadTime = endTime - startTime;

    return pageLoadTime;
  }

  async checkAccessibility() {
    const snapshot = await this.page.accessibility.snapshot();

    // Perform simple checks: we want to ensure there are accessible elements in the snapshot
    if (!snapshot || Object.keys(snapshot).length === 0) {
      throw new Error("No accessible elements found on the page");
    }

    // Optional: Log the snapshot for debugging purposes
    console.log("Accessibility Snapshot:", snapshot);
  }
}
