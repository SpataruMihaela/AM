import { test, expect } from "@playwright/test";
import { SearchPage } from "./pageObjects/SearchPage";
import { measurePerformance } from "./pageObjects/performanceUtils";

test.describe("Search Functionality Tests", () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await page.goto("https://demo.quartexcollections.com/");
  });

  test("Verify Basic Search with Valid Input", async ({ page }) => {
    await searchPage.clickSearch();
    await searchPage.fillSearch("Brown");
    await searchPage.applySearch();

    await expect(page.locator("//span[contains(.,'Documents')]")).toBeVisible();

    const results = page.locator(
      "//a[contains(.,'1 April 1875. Browning, Robert to Pollock, Lady.')]",
    );

    await expect(results).toContainText(
      "1 April 1875. Browning, Robert to Pollock, Lady.",
    );

    console.log("✅ Search test passed successfully!");
  });

  test("Verify Empty Search Field", async ({ page }) => {
    const searchTerm = "";

    await searchPage.clickSearch();
    await searchPage.fillSearch(searchTerm);
    await searchPage.applySearch();
    await searchPage.waitForErrorMessage();

    const errorMessage = await searchPage.getErrorMessage();
    expect(errorMessage).toBe("Please enter search term");
  });

  test("Verify Search Returns Results on Empty Collection", async ({
    page,
  }) => {
    const searchTerm = "abcdxyz";

    await searchPage.clickSearch();
    await searchPage.fillSearch(searchTerm);
    await searchPage.applySearch();
    const results = page.locator(
      "//span[contains(.,'Sorry, no results found that match your criteria.')]",
    );
    await expect(results).toContainText(
      "Sorry, no results found that match your criteria.",
    );
  });

  test("Search Performance Test for Shakespeare", async ({ page }) => {
    const searchTerm = "Shakespeare";

    const { pageLoadTime, resultDisplayTime } = await measurePerformance(
      page,
      searchTerm,
    );

    expect(pageLoadTime).toBeLessThan(3000);
    expect(resultDisplayTime).toBeLessThan(5000);

    const result = await page.locator("//h1[contains(.,'Browse All')]");
    await expect(result).toBeVisible();
  });

  test("Accessibility Test for Search Functionality", async ({ page }) => {
    const searchTerm = "Shakespeare";

    await searchPage.checkAccessibility();

    await searchPage.search(searchTerm);

    await searchPage.waitForResults();

    await searchPage.checkAccessibility();
  });
});
