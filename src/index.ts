import puppeteer, { Page } from "puppeteer";

class ExplodingTopicsScraper {
  protected static baseUrl = "https://explodingtopics.com/topics-last-6-months";

  public static async getTopics(pageNumber: number): Promise<string[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`${this.baseUrl}?page=${pageNumber}`);

    const keywordElements = await page.$$(".tileKeyword");

    if (keywordElements.length == 0) {
      await this.pageExsistsOrError(page, pageNumber);
      throw new Error(
        `An error occurred while reading page: ${pageNumber} content`
      );
    }

    const keywords: string[] = [];

    for (const keywordElement of keywordElements) {
      const text = await (
        await keywordElement.getProperty("textContent")
      ).jsonValue();

      if (text) keywords.push(text);
    }

    browser.close();

    return keywords;
  }

  /**
   * @throws {Error}
   */
  public static async pageExsistsOrError(
    page: Page,
    pageNumber?: number
  ): Promise<void> {
    const searchText = "This Page Does Not Exist.";

    const h2s = await page.$$("h2");

    for (const h2 of h2s) {
      const text = await (await h2.getProperty("innerText")).jsonValue();

      if (text === searchText) {
        throw new Error(`The page ${pageNumber} does not exist`);
      }
    }
  }
}

(async () => {
  let page = 1;
  while (true) {
    console.log(await ExplodingTopicsScraper.getTopics(page));
    page++;
  }
})();
