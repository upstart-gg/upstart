import type { YoutubeListOptions } from "./options";
import type { YoutubeListSchema } from "./schema";
import { UnauthorizedError } from "~/shared/datasources/errors";
import { stringifyObjectValues } from "~/shared/datasources/utils";
import type { YoutubeFullOAuthConfig } from "../oauth/config";
import type { DatasourceFetcher } from "~/shared/datasources/fetcher";

const fetchYoutubeList: DatasourceFetcher<
  YoutubeListSchema,
  YoutubeFullOAuthConfig,
  YoutubeListOptions
> = async ({ options, oauth }) => {
  const params = new URLSearchParams({
    ...stringifyObjectValues(options),
    part: "snippet,id",
    type: "video",
    videoEmbeddable: "true",
    access_token: oauth.config.accessToken,
  });

  const url = `https://www.googleapis.com/youtube/v3/search?${params}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) {
      throw new UnauthorizedError(`fetchYoutubeList Error: Unauthorized.`);
    }
    throw new Error(`fetchYoutubeList Error: Response status: ${response.status}`);
  }

  const data = (await response.json()) as YoutubeListSchema;

  return data;
};

export default fetchYoutubeList;
