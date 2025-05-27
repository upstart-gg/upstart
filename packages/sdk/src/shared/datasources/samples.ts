import type { TSchema, Static } from "@sinclair/typebox";
import { sample as rssSample } from "./external/rss/sample";
import { sample as youtubeListSample } from "./external/youtube/list/sample";
import type { DatasourceProvider } from "./types";

export const samples: Record<
  Extract<
    DatasourceProvider,
    // | "facebook-posts"
    // | "instagram-feed"
    | "rss"
    // | "threads-media"
    // | "tiktok-video"
    | "youtube-list"
    // | "mastodon-status"
  >,
  Static<TSchema>
> = {
  // "facebook-posts": facebookListSample,
  // "instagram-feed": instagramFeedSample,
  // "mastodon-status": mastodonStatusSample,
  rss: rssSample,
  // "threads-media": threadsMediaSample,
  // "tiktok-video": tiktokVideoSample,
  "youtube-list": youtubeListSample,
} as const;
