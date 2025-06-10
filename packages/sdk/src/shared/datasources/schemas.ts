import type { TArray, TObject } from "@sinclair/typebox";
import type { DatasourceProvider } from "./types";

import { facebookPostSchema } from "./external/facebook/posts/schema";
import { instagramFeedSchema } from "./external/instagram/feed/schema";
import { mastodonStatusArraySchema, mastodonStatusSchema } from "./external/mastodon/status/schema";
import { mastodonAccountSchema } from "./external/mastodon/account/schema";
import { rssSchema } from "./external/rss/schema";
import { threadsMediaSchema } from "./external/threads/media/schema";
import { tiktokVideoListSchema } from "./external/tiktok/video/schema";
import { youtubeListSchema } from "./external/youtube/list/schema";
import { jsonArraySchema, jsonObjectSchema } from "./external/http-json/schema";

// internal
import { blogSchema } from "./internal/blog/schema";
import { changelogSchema } from "./internal/changelog/schema";
import { contactInfoSchema } from "./internal/contact-info/schema";
import { cvSchema } from "./internal/cv/schema";
import { faqSchema } from "./internal/faq/schema";
import { linksSchema } from "./internal/links/schema";
import { recipesSchema } from "./internal/recipes/schema";
import { restaurantSchema } from "./internal/restaurant/schema";

export const schemasMap = {
  // "facebook-posts": facebookPostSchema,
  // "instagram-feed": instagramFeedSchema,
  // "mastodon-account": mastodonAccountSchema,
  // "mastodon-status": mastodonStatusSchema,
  // "mastodon-status-list": mastodonStatusArraySchema,
  rss: rssSchema,
  // "threads-media": threadsMediaSchema,
  // "tiktok-video": tiktokVideoListSchema,
  "youtube-list": youtubeListSchema,
  "internal-blog": blogSchema,
  "internal-changelog": changelogSchema,
  // "internal-contact-info": contactInfoSchema,
  "internal-faq": faqSchema,
  "internal-links": linksSchema,
  "internal-recipes": recipesSchema,
  // "internal-restaurant": restaurantSchema,
  // "internal-cv": cvSchema,
  "http-json": {
    description: "JSON array retrieved from an HTTP endpoint",
  },
} as const satisfies Record<DatasourceProvider, TArray | TArray[] | { description: string }>;
