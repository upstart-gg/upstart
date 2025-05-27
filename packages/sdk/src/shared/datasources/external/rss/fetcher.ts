import type { RssOptions } from "./options";
import { parseFeed } from "htmlparser2";
import { type RssSchema, rssSchema } from "./schema";
import { ajv, serializeAjvErrors } from "~/shared/ajv";
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
      pubDate: item.pubDate ? item.pubDate.toISOString() : new Date().toISOString(),
    })) ?? [];

  const validate = ajv.compile<RssSchema>(rssSchema);
  const isValid = validate(newFeed);

  if (!isValid) {
    throw new Error(`fetchRss Error: Invalid Feed data (${url}): ${serializeAjvErrors(validate.errors)}`);
  }

  return newFeed;
};

export default fetchRss;
