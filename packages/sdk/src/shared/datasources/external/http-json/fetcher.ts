import type { DatasourceFetcher } from "../../fetcher";
import { createPlaceholderReplacer, placeholderRx } from "../../utils";
import type { HttpJsonOptions } from "./options";

/**
 * For this fetcher, validation is done outside of the fetcher.
 */
const fetchHttpJSON: DatasourceFetcher<unknown, null, HttpJsonOptions> = async ({
  options,
  pageAttributes: attr,
}) => {
  const replacer = createPlaceholderReplacer(attr);
  const url = options.url.replace(placeholderRx, replacer);
  const headers: Record<string, string> = {};

  if (options.headers) {
    for (const [key, value] of Object.entries(options.headers ?? {})) {
      headers[key] = (value as string).replace(placeholderRx, replacer);
    }
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`fetchHttpJSON Error: Response status: ${response.status}`);
  }

  return response.json();
};

export default fetchHttpJSON;
