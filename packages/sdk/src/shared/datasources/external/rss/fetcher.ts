import type { RssOptions } from "./options";
import { parseFeed } from "@rowanmanning/feed-parser";
import type { RssSchema } from "./schema";
import type { DatasourceFetcher } from "../../fetcher";
import { createPlaceholderReplacer, placeholderRx } from "../../utils";

const fetchRss: DatasourceFetcher<RssSchema, null, RssOptions> = async ({ options, attr }) => {
  const replacer = createPlaceholderReplacer(attr);
  const url = options.url.replace(placeholderRx, replacer);
  const content = await (await fetch(url)).text();
  const feed = parseFeed(content);

  const newFeed: RssSchema =
    feed?.items.map((item) => ({
      ...item,
      pubDate: item.published ? item.published.toISOString() : new Date().toISOString(),
    })) ?? [];

  // const isValid = ajv.validate<RssSchema>(rssSchema, newFeed);

  // if (!isValid) {
  //   throw new Error(`fetchRss Error: Invalid Feed data (${url}): ${serializeAjvErrors(ajv.errors)}`);
  // }

  return newFeed;
};

export default fetchRss;
