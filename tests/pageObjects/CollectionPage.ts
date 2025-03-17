import { Page } from "playwright";
import axeCore from "axe-core";

export class CollectionPage {
  private page: Page;

  private browseByCollectionBlock = ".a-to-z-buttons__nav";

  private letterSelector = (letter: string) =>
    `ul.a-to-z-buttons__scrollable-bar.js-a-z-items li:has-text("${letter}")`; // Corrected for letter buttons

  private collectionName = (collection: string) =>
    `h4.heading.heading--tertiary.mark-highlightable:has-text("${collection}")`; // Updated for collection names

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToBrowseByCollection() {
    await this.scrollToElementUntilVisible(this.browseByCollectionBlock);
  }

  async scrollToElementUntilVisible(selector: string) {
    let isVisible = false;
    const scrollPause = 1000;
    const maxScrolls = 20;

    for (let i = 0; i < maxScrolls; i++) {
      await this.page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });

      const element = await this.page.$(selector);

      if (element) {
        isVisible = await element.isVisible();
      }

      if (isVisible) {
        break;
      }

      await this.page.waitForTimeout(scrollPause);
    }

    if (!isVisible) {
      throw new Error(`Element ${selector} not found after scrolling`);
    }
  }

  async selectLetter(letter: string) {
    const letterButton = this.letterSelector(letter);
    await this.page.click(letterButton);
  }

  async scrollToCollectionsStartingWithLetter(letter: string) {
    const letterButton = this.letterSelector(letter);
    const letterElement = await this.page.$(letterButton);
    if (letterElement) {
      await letterElement.scrollIntoViewIfNeeded();
    }
  }

  async verifyCollectionIsDisplayed(collection: string) {
    const collectionElement = this.collectionName(collection);
    await this.page.waitForSelector(collectionElement);
  }

  async checkAccessibility() {
    await this.page.addScriptTag({
      content: axeCore.source,
    });

    await this.page.waitForLoadState("domcontentloaded");

    const results = await this.page.evaluate(() => {
      const config = {
        runOnly: {
          type: "tag",
          values: ["wcag2aa"],
        },
      };

      // @ts-ignore: Bypass TypeScript error for runOnly property (if necessary)
      return axe.run(config);
    });

    

    console.log("All Violations:", results.violations);

    // Filter out 'low' impact violations and log the impact for each violation
    const filteredViolations = results.violations.filter((violation, index) => {
      const impact = violation.impact ? violation.impact.toLowerCase() : 'unknown'; // Normalize to lowercase to handle case variations
      console.log(`Violation ${index + 1}:`, violation);
      console.log(`Impact of Violation ${index + 1}:`, impact);  // Log the impact for each violation

      // Ensure the violation has a valid impact and it's not 'low' or 'unknown'
      return impact !== 'low' && impact !== 'unknown' && impact !== '';  // Exclude low, unknown, and empty impacts
    });

    // Log filtered violations for deeper inspection
    console.log("Filtered Violations (non-low impact):", filteredViolations);

    return { violations: filteredViolations };
  }
}
