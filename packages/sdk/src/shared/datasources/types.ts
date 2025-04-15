import { Type, type Static, type TObject, type TArray } from "@sinclair/typebox";
import { youtubeListOptions } from "./external/youtube/list/options";
import { metaOptions } from "./external/meta/options";
import { mastodonCommonOptions } from "./external/mastodon/options";
import { httpJsonOptions } from "./external/json/options";
import { rssOptions } from "./external/rss/options";
import { tiktokVideoOptions } from "./external/tiktok/video/options";
import { jsonArraySchema, jsonObjectSchema } from "./external/json/schema";
import { schemasMap } from "./schemas";

export const providersSchema = Type.Union([
  Type.Literal("facebook-posts"),
  Type.Literal("instagram-feed"),
  Type.Literal("mastodon-account"),
  Type.Literal("mastodon-status"),
  Type.Literal("mastodon-status-list"),
  Type.Literal("rss"),
  Type.Literal("threads-media"),
  Type.Literal("tiktok-video"),
  Type.Literal("youtube-list"),
  Type.Literal("json-array"),
  Type.Literal("json-object"),
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
    schema: Type.Optional(schemasMap["youtube-list"]),
  }),
  Type.Object({
    provider: Type.Literal("facebook-posts"),
    options: metaOptions,
    schema: Type.Optional(schemasMap["facebook-posts"]),
  }),
  Type.Object({
    provider: Type.Literal("instagram-feed"),
    options: metaOptions,
    schema: Type.Optional(schemasMap["instagram-feed"]),
  }),
  Type.Object({
    provider: Type.Literal("threads-media"),
    options: metaOptions,
    schema: Type.Optional(schemasMap["threads-media"]),
  }),
  Type.Object({
    provider: Type.Literal("mastodon-account"),
    options: mastodonCommonOptions,
    schema: Type.Optional(schemasMap["mastodon-account"]),
  }),
  Type.Object({
    provider: Type.Literal("mastodon-status"),
    options: mastodonCommonOptions,
    schema: Type.Optional(schemasMap["mastodon-status"]),
  }),
  Type.Object({
    provider: Type.Literal("mastodon-status-list"),
    options: mastodonCommonOptions,
    schema: Type.Optional(schemasMap["mastodon-status-list"]),
  }),
  Type.Object({
    provider: Type.Literal("rss"),
    options: rssOptions,
    schema: Type.Optional(schemasMap.rss),
  }),
  Type.Object({
    provider: Type.Literal("tiktok-video"),
    options: tiktokVideoOptions,
    schema: Type.Optional(schemasMap["tiktok-video"]),
  }),
  Type.Object({
    provider: Type.Literal("internal-blog"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    schema: Type.Optional(schemasMap["internal-blog"]),
  }),
  Type.Object({
    provider: Type.Literal("internal-changelog"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    schema: Type.Optional(schemasMap["internal-changelog"]),
  }),
  Type.Object({
    provider: Type.Literal("internal-contact-info"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    schema: Type.Optional(schemasMap["internal-contact-info"]),
  }),
  Type.Object({
    provider: Type.Literal("internal-faq"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    schema: Type.Optional(schemasMap["internal-faq"]),
  }),
  Type.Object({
    provider: Type.Literal("internal-links"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    schema: Type.Optional(schemasMap["internal-links"]),
  }),
  Type.Object({
    provider: Type.Literal("internal-recipes"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    schema: Type.Optional(schemasMap["internal-recipes"]),
  }),
  Type.Object({
    provider: Type.Literal("internal-restaurant"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    schema: Type.Optional(schemasMap["internal-restaurant"]),
  }),
  Type.Object({
    provider: Type.Literal("internal-cv"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    schema: Type.Optional(schemasMap["internal-cv"]),
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
  schema: Type.Array(Type.Object({}, { additionalProperties: true })),
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

const datasourceJsonObjectManifest = Type.Object({
  provider: Type.Literal("json-object", {
    title: "JSON Object",
    description: "JSON object datasource.",
  }),
  options: httpJsonOptions,
  schema: jsonObjectSchema,
  name: Type.String({ title: "Name of the datasource", comment: "For example, 'My data'" }),
  description: Type.Optional(Type.String({ title: "Description of the datasource" })),
  sampleData: Type.Optional(
    Type.Any({
      title: "Sample data",
      description: "Sample data for the datasource. Should match the declared schema.",
    }),
  ),
});

export type DatasourceJsonObjectManifest = Static<typeof datasourceJsonObjectManifest>;

const datasourceJsonArrayManifest = Type.Object({
  provider: Type.Literal("json-array", {
    title: "JSON Array",
    description: "JSON array datasource.",
  }),
  options: httpJsonOptions,
  schema: jsonArraySchema,
  name: Type.String({ title: "Name of the datasource", comment: "For example, 'My data'" }),
  description: Type.Optional(Type.String({ title: "Description of the datasource" })),
  sampleData: Type.Optional(
    Type.Any({
      title: "Sample data",
      description: "Sample data for the datasource. Should match the declared schema.",
    }),
  ),
});

export type DatasourceJsonArrayManifest = Static<typeof datasourceJsonArrayManifest>;

export const datasourcesMap = Type.Record(
  Type.String(),
  Type.Union([
    datasourceCustomManifest,
    datasourceJsonObjectManifest,
    datasourceJsonArrayManifest,
    datasourceProviderManifest,
  ]),
  { title: "Datasources map", description: "The map of datasources available in the system" },
);

export type DatasourcesMap = Record<
  string,
  | (Omit<Static<typeof datasourceCustomManifest>, "schema"> & {
      schema: (typeof datasourceCustomManifest)["schema"];
    })
  | (Omit<Static<typeof datasourceJsonObjectManifest>, "schema"> & {
      schema: (typeof datasourceJsonObjectManifest)["schema"];
    })
  | (Omit<Static<typeof datasourceJsonArrayManifest>, "schema"> & {
      schema: (typeof datasourceJsonArrayManifest)["schema"];
    })
  | (Omit<Static<typeof datasourceProviderManifest>, "schema"> & {
      schema?: (typeof datasourceProviderManifest)["schema"];
    })
>;

export type DatasourcesResolved<T extends DatasourcesMap = DatasourcesMap> = {
  [K in keyof T]: unknown;
};
