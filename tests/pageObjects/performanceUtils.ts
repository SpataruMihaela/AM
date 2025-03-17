// src/utils/performanceUtils.ts
import { Page } from "playwright";
import { SearchPage } from "../pageObjects/SearchPage";

export async function measurePerformance(page: Page, searchTerm: string) {
  const searchPage = new SearchPage(page);

  const pageLoadTime = await searchPage.getPageLoadTime();
  console.log(`Page Load Time: ${pageLoadTime} ms`);

  await searchPage.search(searchTerm);
  await searchPage.waitForResults();

  const startTime = Date.now();
  await searchPage.waitForResults();
  const endTime = Date.now();

  const resultDisplayTime = endTime - startTime;
  console.log(`Time to display results: ${resultDisplayTime} ms`);

  return { pageLoadTime, resultDisplayTime };
}
