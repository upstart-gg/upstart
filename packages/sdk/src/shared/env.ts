import type { D1Database, R2Bucket, KVNamespace } from "@cloudflare/workers-types";

export type UpstartEnv = {
  PUBLIC_UPSTART_SITE_ID: string;
  PUBLIC_UPSTART_API_BASE_URL: string;
  PUBLIC_UPSTART_SITE_HOST: string;
  PUBLIC_UPSTART_ASSETS_BASE_URL?: string;
  UPSTART_API_TOKEN: string;
  SITES_DB: D1Database;
  SITES_CACHE: KVNamespace;
  R2_SITES_BUCKET: R2Bucket;
  R2_SITES_BUCKET_NAME: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  NODE_ENV: "development" | "production" | "preview" | "local-preview";
  DATASOURCE_REFRESH_DELAY_IN_MINUTE: string;
  FACEBOOK_APP_SECRET?: string;
  INSTAGRAM_APP_SECRET?: string;
  THREADS_APP_SECRET?: string;
  TIKTOK_CLIENT_KEY?: string;
  TIKTOK_CLIENT_SECRET?: string;
  YOUTUBE_API_KEY?: string;
};
