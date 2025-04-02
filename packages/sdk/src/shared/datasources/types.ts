import { Type, type Static } from "@sinclair/typebox";
import { youtubeListOptions } from "./external/youtube/list/options";
import { metaOptions } from "./external/meta/options";
import { mastodonCommonOptions } from "./external/mastodon/options";
import { httpJsonOptions } from "./external/json/options";
import { rssOptions } from "./external/rss/options";
import { tiktokVideoOptions } from "./external/tiktok/video/options";
import { faqSchema } from "./internal/faq/schema";
import { linksSchema } from "./internal/links/schema";
import { contactInfoSchema } from "./internal/contact-info/schema";
import { blogSchema } from "./internal/blog/schema";
import { changelogSchema } from "./internal/changelog/schema";
import { recipesSchema } from "./internal/recipes/schema";

export const providersSchema = Type.Union([
  Type.Literal("facebook-posts"),
  Type.Literal("instagram-feed"),
  Type.Literal("mastodon-status"),
  Type.Literal("mastodon-status-list"),
  Type.Literal("rss"),
  Type.Literal("threads-media"),
  Type.Literal("tiktok-video"),
  Type.Literal("youtube-list"),
  Type.Literal("json"),
  Type.Literal("internal-blog"),
  Type.Literal("internal-changelog"),
  Type.Literal("internal-contact-info"),
  Type.Literal("internal-faq"),
  Type.Literal("internal-links"),
  Type.Literal("internal-recipes"),
  Type.Literal("internal-restaurant"),
  Type.Literal("internal-cv"),
]);

export type DatasourceProvider = Static<typeof providersSchema>;

const providersChoices = Type.Union([
  Type.Object({
    provider: Type.Literal("youtube-list"),
    options: youtubeListOptions,
  }),
  Type.Object({
    provider: Type.Literal("facebook-posts"),
    options: metaOptions,
  }),
  Type.Object({
    provider: Type.Literal("instagram-feed"),
    options: metaOptions,
  }),
  Type.Object({
    provider: Type.Literal("threads-media"),
    options: metaOptions,
  }),
  Type.Object({
    provider: Type.Literal("mastodon-status"),
    options: mastodonCommonOptions,
  }),
  Type.Object({
    provider: Type.Literal("mastodon-status-list"),
    options: mastodonCommonOptions,
  }),
  Type.Object({
    provider: Type.Literal("rss"),
    options: rssOptions,
  }),
  Type.Object({
    provider: Type.Literal("tiktok-video"),
    options: tiktokVideoOptions,
  }),
  Type.Object({
    provider: Type.Literal("internal-blog"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
  }),
  Type.Object({
    provider: Type.Literal("internal-changelog"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
  }),
  Type.Object({
    provider: Type.Literal("internal-contact-info"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
  }),
  Type.Object({
    provider: Type.Literal("internal-faq"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
  }),
  Type.Object({
    provider: Type.Literal("internal-links"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
  }),
  Type.Object({
    provider: Type.Literal("internal-recipes"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
  }),
  Type.Object({
    provider: Type.Literal("internal-restaurant"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
  }),
  Type.Object({
    provider: Type.Literal("internal-cv"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
  }),
]);

const datasourceProviderManifest = Type.Composite([
  providersChoices,
  Type.Object({
    name: Type.String({ title: "Name of the datasource", comment: "For example, 'My data'" }),
    description: Type.Optional(Type.String({ title: "Description of the datasource" })),
    sampleData: Type.Optional(Type.Any()),
    ttlMinutes: Type.Optional(
      Type.Number({
        title: "Time to live",
        description:
          "Time to live in minutes. If set to -1, it never expires and has to be manually refreshed. If set to 0, the datasource is always fetched live. If > 0, then the datasource is feteched every N minutes.",
      }),
    ),
    refresh: Type.Optional(
      Type.Object(
        {
          method: Type.Union([Type.Literal("interval"), Type.Literal("manual"), Type.Literal("live")]),
          interval: Type.Optional(Type.Number()),
        },
        {
          title: "Refresh options",
          description: "Options to refresh the datasource",
        },
      ),
    ),
  }),
]);

export type DatasourceProviderManifest = Static<typeof datasourceProviderManifest>;

const datasourceCustomManifest = Type.Object({
  provider: Type.Literal("custom", {
    title: "Custom",
    description: "Custom datasource saved locally in Upstart.",
  }),
  options: Type.Optional(Type.Object({}, { additionalProperties: true })),
  schema: Type.Union([
    Type.Array(Type.Object({}, { additionalProperties: true })),
    Type.Object({}, { additionalProperties: true }),
  ]),
  name: Type.String({ title: "Name of the datasource", comment: "For example, 'My data'" }),
  description: Type.Optional(Type.String({ title: "Description of the datasource" })),
  sampleData: Type.Optional(
    Type.Any({
      title: "Sample data",
      description: "Sample data for the datasource. Should match the declared schema.",
    }),
  ),
});

export type DatasourceCustomManifest = Static<typeof datasourceCustomManifest>;

const datasourceJsonManifest = Type.Object({
  provider: Type.Literal("json", {
    title: "JSON",
    description: "JSON datasource.",
  }),
  options: httpJsonOptions,
  schema: Type.Union([
    Type.Array(Type.Object({}, { additionalProperties: true })),
    Type.Object({}, { additionalProperties: true }),
  ]),
  name: Type.String({ title: "Name of the datasource", comment: "For example, 'My data'" }),
  description: Type.Optional(Type.String({ title: "Description of the datasource" })),
  sampleData: Type.Optional(
    Type.Any({
      title: "Sample data",
      description: "Sample data for the datasource. Should match the declared schema.",
    }),
  ),
});

export type DatasourceJsonManifest = Static<typeof datasourceJsonManifest>;

export const datasourcesMap = Type.Record(
  Type.String(),
  Type.Union([datasourceCustomManifest, datasourceJsonManifest, datasourceProviderManifest]),
  { title: "Datasources map", description: "The map of datasources available in the system" },
);

export type DatasourcesMap = Static<typeof datasourcesMap>;

export type DatasourcesResolved<T extends DatasourcesMap = DatasourcesMap> = {
  [K in keyof T]: unknown;
};
