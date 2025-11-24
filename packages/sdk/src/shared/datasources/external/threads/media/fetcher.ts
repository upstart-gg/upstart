import { type ThreadsMediaSchema, threadsMediaSchema } from "./schema";
import type { MetaFullOAuthConfig } from "~/shared/datasources/external/meta/oauth/config";
// import invariant from "~/shared/utils/invariant";
import { UnauthorizedError } from "~/shared/datasources/errors";
import type { MetaOptions } from "~/shared/datasources/external/meta/options";
import { stringifyObjectValues } from "~/shared/datasources/utils";
import type { DatasourceFetcher } from "~/shared/datasources/fetcher";

/**
 * todo: add a way to retrieve media/posts from Threads for a given user other than "me"
 */
const fetchThreadsMediaDatasource: DatasourceFetcher<
  ThreadsMediaSchema,
  MetaFullOAuthConfig,
  MetaOptions
> = async ({ options, oauth }) => {
  // invariant(oauth?.config, "fetchThreadsMediaDatasource Error: OAuth config is required");

  const params = new URLSearchParams({
    ...stringifyObjectValues(options),
    access_token: oauth.config.accessToken,
    fields: [
      "id",
      "media_product_type",
      "media_type",
      "media_url",
      "permalink",
      "owner",
      "username",
      "text",
      "timestamp",
      "shortcode",
      "thumbnail_url",
      "children",
      "is_quote_post",
    ].join(","),
  });

  const response = await fetch(`https://graph.threads.net/v1.0/me/threads?${params.toString()}`);

  if (!response.ok) {
    if (response.status === 401) {
      throw new UnauthorizedError(`fetchThreadsMediaDatasource Error: Unauthorized.`);
    }
    throw new Error(`fetchThreadsMediaDatasource Error: Response status: ${response.status}`);
  }

  const media = (await response.json()) as ThreadsMediaSchema;

  return media;
};

export default fetchThreadsMediaDatasource;
