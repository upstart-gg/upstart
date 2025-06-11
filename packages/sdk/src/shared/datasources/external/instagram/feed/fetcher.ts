import type { InstagramFeedSchema } from "./schema";
import type { MetaFullOAuthConfig } from "~/shared/datasources/external/meta/oauth/config";
import { UnauthorizedError } from "~/shared/errors";
import type { MetaOptions } from "~/shared/datasources/external/meta/options";
import { stringifyObjectValues } from "~/shared/datasources/utils";
import type { DatasourceFetcher } from "~/shared/datasources/fetcher";

const fetchInstagramFeedDatasource: DatasourceFetcher<
  InstagramFeedSchema,
  MetaFullOAuthConfig,
  MetaOptions
> = async ({ options, oauth }) => {
  const params = new URLSearchParams({
    ...stringifyObjectValues(options),
    access_token: oauth.config.accessToken,
    fields: ["id", "caption", "timestamp", "thumbnail_url", "media_url", "permalink", "media_type"].join(","),
  });

  const response = await fetch(`https://graph.instagram.com/me/media?${params.toString()}`);

  if (!response.ok) {
    if (response.status === 401) {
      throw new UnauthorizedError(`fetchInstagramFeedDatasource Error: Unauthorized.`);
    }
    throw new Error(`fetchInstagramFeedDatasource Error: Response status: ${response.status}`);
  }

  const feed = (await response.json()) as InstagramFeedSchema;

  return feed;
};

export default fetchInstagramFeedDatasource;
