import { test, expect } from "@playwright/test";
import { TimelinePage } from "./pageObjects/TimelinePage";

test.describe("Timeline Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://demo.quartexcollections.com/");
  });

  test("Navigate to the correct webpage from the Timeline content block", async ({
    page,
  }) => {
    test.setTimeout(60000);

    const timelinePage = new TimelinePage(page);

    // Step 1: Navigate to the Timeline content block
    await timelinePage.navigateToTimelineContentBlock();

    // Step 2: Scroll down until the 1845 Timeline item is visible and click it
    await timelinePage.scrollToElementAndClick();

    // Step 3: Click on the link in the 1845 Timeline item and switch focus to the new tab (if opened)
    const newTab = await timelinePage.clickOnTimelineLink();

    // Step 4: Get the current page URL of the new tab
    const currentUrl = await newTab.url();

    // Step 5: Assert that the correct URL is launched in the current page (new tab)
    expect(currentUrl).toBe(
      "https://demo.quartexcollections.com/Documents/Detail/10-january-1845.-browning-robert-to-browning-elizabeth-barrett./36113",
    );
  });

  test("Verify Invalid Timeline Link", async ({ page }) => {
    test.setTimeout(60000);
    // Initialize the TimelinePage object
    const timelinePage = new TimelinePage(page);

    // Step 1: Navigate to the Timeline content block
    await timelinePage.navigateToTimelineContentBlock();

    // Step 2: Simulate clicking on an invalid link by navigating to a non-existent page
    await timelinePage.navigateToInvalidLink();

    // Step 3: Wait for the 404 error page to load
    await timelinePage.ensure404PageLoaded();

    // Step 4: Assert that a 404 page is shown
    const errorMessage = await page
      .locator('h1:has-text("Page Not Found")')
      .textContent();
    expect(errorMessage).toContain("Page Not Found");
  });
});
