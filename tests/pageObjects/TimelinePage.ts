import { Page } from "playwright";

export class TimelinePage {
  private page: Page;

  private timelineContentBlock = "//a[@aria-label='Discovery Aids']";
  private timelineABriefHistory =
    "//a[contains(.,'The Brownings: A Brief History')]";
  private timelineItem1845 =
    "//a[contains(.,'one of their first love letters')]"; // The 1845 Timeline item selector
  private linkInTimelineItem =
    "text=View one of their first love letters within The Browning Letters Collection."; // Adjust the link text if needed

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToTimelineContentBlock() {
    await this.page.click(this.timelineContentBlock);

    await this.page.click(this.timelineABriefHistory);

    await this.page.waitForURL(
      "https://demo.quartexcollections.com/discovery-aids/the-brownings-a-brief-history",
    );
  }

  async scrollToElementAndClick() {
    let isVisible = false;
    const scrollPause = 1000;
    const maxScrolls = 20;

    for (let i = 0; i < maxScrolls; i++) {
      await this.page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });

      const element = await this.page.$(this.timelineItem1845);

      if (element) {
        isVisible = await element.isVisible();
      }

      if (isVisible) {
        await element?.click();
        break;
      }

      await this.page.waitForTimeout(scrollPause);
    }

    if (!isVisible) {
      throw new Error(
        `Element ${this.timelineItem1845} not found after scrolling`,
      );
    }
  }

  async clickOnTimelineLink() {
    const [newTab] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.page.click(this.linkInTimelineItem),
    ]);

    await newTab.bringToFront();

    return newTab;
  }

  async getCurrentPageUrl() {
    const pages = await this.page.context().pages();
    const newTab = pages.find((page) => page !== this.page);

    if (newTab) {
      return await newTab.url();
    } else {
      return await this.page.url();
    }
  }

  async ensureCorrectUrlIsOpened(expectedUrl: string) {
    let newPage;

    try {
      newPage = await this.page
        .context()
        .waitForEvent("page", { timeout: 60000 });

      console.log("New tab opened:", newPage.url());
    } catch (error) {
      console.log("Error waiting for new tab:", error);
      throw new Error("New tab was not opened or did not load in time.");
    }

    try {
      await newPage.waitForLoadState("domcontentloaded", { timeout: 30000 });
      const newPageUrl = newPage.url();
      console.log("New tab URL after load:", newPageUrl);

      if (newPageUrl !== expectedUrl) {
        console.error(
          `Mismatch in URL. Expected: ${expectedUrl}, but got: ${newPageUrl}`,
        );
        throw new Error(`Expected URL ${expectedUrl}, but got ${newPageUrl}`);
      }

      return newPageUrl;
    } catch (error) {
      console.error("Error during page load or URL mismatch:", error);
      throw new Error(
        "Error while validating the new tab URL or page load timeout exceeded.",
      );
    }
  }
  async measurePageLoadTime() {
    const startTime = Date.now();
    await this.navigateToTimelineContentBlock();
    const pageLoadTime = Date.now() - startTime;
    return pageLoadTime;
  }

  async measureTimelineItemInteractionTime() {
    const startTime = Date.now();
    await this.scrollToElementAndClick();
    const itemInteractionTime = Date.now() - startTime;
    return itemInteractionTime;
  }

  async navigateToInvalidLink() {
    await this.page.goto(
      "https://demo.quartexcollections.com/non-existent-page",
    );
  }

  async ensure404PageLoaded() {
    await this.page.waitForSelector('h1:has-text("Page Not Found")', {
      timeout: 10000,
    });
  }
}
