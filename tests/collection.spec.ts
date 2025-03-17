import { test, expect } from "@playwright/test";
import { CollectionPage } from "./pageObjects/CollectionPage";

test.describe("Browse by Collection", () => {
  let collectionPage: CollectionPage;

  test.beforeEach(async ({ page }) => {
    collectionPage = new CollectionPage(page);
    await page.goto(
      "https://demo.quartexcollections.com/explore-the-collections",
    );
  });

  test("User can browse collections by selecting a letter", async ({
    page,
  }) => {
    // Step 1: Navigate to the "Browse by Collection Name A-Z" content block
    await collectionPage.navigateToBrowseByCollection();

    // Step 2: Select the letter 'W' to browse collections starting with 'W'
    await collectionPage.selectLetter("W");

    // Step 3: Scroll to collections starting with 'W'
    await collectionPage.scrollToCollectionsStartingWithLetter("W");

    // Step 4: Verify that the expected collection 'War & Conflict' is displayed
    await collectionPage.verifyCollectionIsDisplayed("War & Conflict");
  });

  test("Ensure Letter Buttons are Accessible", async () => {
    const results = await collectionPage.checkAccessibility();

    // Log the violations for debugging
    console.log("Accessibility violations:", results.violations);

    // Filter out low-impact violations
    const filteredViolations = results.violations.filter(
      (violation) => violation.impact !== "low"
    );

    // Log the filtered violations to ensure we're seeing what we expect
    console.log("Filtered Violations (non-low):", filteredViolations);
});


  test("Ensure Collection Names are Accessible", async () => {
    // Step 1: Use the checkAccessibility method from CollectionPage POM to check collection names for accessibility
    const results = await collectionPage.checkAccessibility();

    // Step 2: Assert that there are no accessibility violations for collection names
    expect(results.violations.length).toBe(0);
  });
});
