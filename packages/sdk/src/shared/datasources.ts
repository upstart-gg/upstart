import type { DatasourcesMap, DatasourceProvider } from "./datasources/types";
import {
  blogSchema,
  changelogSchema,
  contactInfoSchema,
  cvSchema,
  facebookPostSchema,
  faqSchema,
  instagramFeedSchema,
  mastodonStatusArraySchema,
  linksSchema,
  recipesSchema,
  restaurantSchema,
  rssSchema,
  youtubeListSchema,
  mastodonStatusSchema,
  tiktokVideoListSchema,
  threadsMediaSchema,
} from "./datasources/schemas";

export function defineDataSources(datasources: DatasourcesMap) {
  const datasourcesMapped: DatasourcesMap = {};
  for (const [key, value] of Object.entries(datasources)) {
    datasourcesMapped[key] = {
      ...value,
      // @ts-ignore Seems like TS can't infer properly here
      schema: "schema" in value ? value.schema : getSchemaByProvider(value.provider),
    };
  }
  return datasourcesMapped;
}

function getSchemaByProvider(provider: DatasourceProvider) {
  switch (provider) {
    case "facebook-posts":
      return facebookPostSchema;
    case "instagram-feed":
      return instagramFeedSchema;
    case "mastodon-status":
      return mastodonStatusSchema;
    case "mastodon-status-list":
      return mastodonStatusArraySchema;
    case "rss":
      return rssSchema;
    case "threads-media":
      return threadsMediaSchema;
    case "tiktok-video":
      return tiktokVideoListSchema;
    case "youtube-list":
      return youtubeListSchema;
    case "internal-blog":
      return blogSchema;
    case "internal-changelog":
      return changelogSchema;
    case "internal-contact-info":
      return contactInfoSchema;
    case "internal-faq":
      return faqSchema;
    case "internal-links":
      return linksSchema;
    case "internal-recipes":
      return recipesSchema;
    case "internal-restaurant":
      return restaurantSchema;
    case "internal-cv":
      return cvSchema;
  }
  throw new Error(`No schema for provider: ${provider}`);
}
