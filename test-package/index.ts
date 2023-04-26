import { ExplodingTopicsScraper } from "exploding-topics-scraper";

(async () => {
  let page = 1;
  while (true) {
    console.log(await ExplodingTopicsScraper.getTopics(page));
    page++;
  }
})();
