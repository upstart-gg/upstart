import { Type, type Static, type TObject, type TArray } from "@sinclair/typebox";
import { youtubeListOptions } from "./external/youtube/list/options";
import { httpJsonOptions } from "./external/http-json/options";
import { rssOptions } from "./external/rss/options";

export const providersSchema = Type.Union([
  // Type.Literal("facebook-posts"),
  // Type.Literal("instagram-feed"),
  // Type.Literal("mastodon-account"),
  // Type.Literal("mastodon-status"),
  // Type.Literal("mastodon-status-list"),
  Type.Literal("rss"),
  // Type.Literal("threads-media"),
  // Type.Literal("tiktok-video"),
  Type.Literal("youtube-list"),
  Type.Literal("http-json"),
  Type.Literal("internal-blog"),
  Type.Literal("internal-changelog"),
  // Type.Literal("internal-contact-info"),
  Type.Literal("internal-faq"),
  Type.Literal("internal-links"),
  Type.Literal("internal-recipes"),
  // Type.Literal("internal-restaurant"),
  // Type.Literal("internal-cv"),
]);

export type DatasourceProvider = Static<typeof providersSchema>;

const providersChoices = Type.Union([
  Type.Object({
    provider: Type.Literal("youtube-list"),
    options: youtubeListOptions,
    // schema: Type.Optional(schemasMap["youtube-list"]),
  }),
  // Type.Object({
  //   provider: Type.Literal("facebook-posts"),
  //   options: metaOptions,
  //   schema: Type.Optional(schemasMap["facebook-posts"]),
  // }),
  // Type.Object({
  //   provider: Type.Literal("instagram-feed"),
  //   options: metaOptions,
  //   schema: Type.Optional(schemasMap["instagram-feed"]),
  // }),
  // Type.Object({
  //   provider: Type.Literal("threads-media"),
  //   options: metaOptions,
  //   schema: Type.Optional(schemasMap["threads-media"]),
  // }),
  // Type.Object({
  //   provider: Type.Literal("mastodon-account"),
  //   options: mastodonCommonOptions,
  //   schema: Type.Optional(schemasMap["mastodon-account"]),
  // }),
  // Type.Object({
  //   provider: Type.Literal("mastodon-status"),
  //   options: mastodonCommonOptions,
  //   schema: Type.Optional(schemasMap["mastodon-status"]),
  // }),
  // Type.Object({
  //   provider: Type.Literal("mastodon-status-list"),
  //   options: mastodonCommonOptions,
  //   schema: Type.Optional(schemasMap["mastodon-status-list"]),
  // }),
  Type.Object({
    provider: Type.Literal("rss"),
    options: rssOptions,
    // schema: Type.Optional(schemasMap.rss),
  }),
  // Type.Object({
  //   provider: Type.Literal("tiktok-video"),
  //   options: tiktokVideoOptions,
  //   schema: Type.Optional(schemasMap["tiktok-video"]),
  // }),
  Type.Object({
    provider: Type.Literal("internal-blog"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    // schema: Type.Optional(schemasMap["internal-blog"]),
  }),
  Type.Object({
    provider: Type.Literal("internal-changelog"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    // schema: Type.Optional(schemasMap["internal-changelog"]),
  }),
  // Type.Object({
  //   provider: Type.Literal("internal-contact-info"),
  //   options: Type.Optional(Type.Object({}, { additionalProperties: true })),
  //   schema: Type.Optional(schemasMap["internal-contact-info"]),
  // }),
  Type.Object({
    provider: Type.Literal("internal-faq"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    // schema: Type.Optional(schemasMap["internal-faq"]),
  }),
  Type.Object({
    provider: Type.Literal("internal-links"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    // schema: Type.Optional(schemasMap["internal-links"]),
  }),
  Type.Object({
    provider: Type.Literal("internal-recipes"),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),

    // schema: Type.Optional(schemasMap["internal-recipes"]),
  }),
  // Type.Object({
  //   provider: Type.Literal("internal-restaurant"),
  //   options: Type.Optional(Type.Object({}, { additionalProperties: true })),
  //   schema: Type.Optional(schemasMap["internal-restaurant"]),
  // }),
  // Type.Object({
  //   provider: Type.Literal("internal-cv"),
  //   options: Type.Optional(Type.Object({}, { additionalProperties: true })),
  //   schema: Type.Optional(schemasMap["internal-cv"]),
  // }),
]);

const datasourceProviderManifest = Type.Composite([
  providersChoices,
  Type.Object({
    id: Type.String({
      title: "ID",
      description:
        "Unique identifier of the datasource. Used to reference the datasource in the system. Use a url-safe string like a slug.",
    }),
    name: Type.String({ title: "Name of the datasource", comment: "For example, 'My data'" }),
    description: Type.Optional(Type.String({ title: "Description of the datasource" })),
    schema: Type.Null({
      description: "Always null for provider datasources. The schema is defined by the provider.",
    }),
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

const datasourceCustomManifest = Type.Object(
  {
    id: Type.String({
      title: "ID",
      description:
        "Unique identifier of the datasource. Used to reference the datasource in the system. Use a url-safe string like a slug.",
    }),
    provider: Type.Literal("custom", {
      title: "Custom",
      description: "Custom datasource saved locally in Upstart.",
    }),
    options: Type.Optional(Type.Object({}, { additionalProperties: true })),
    schema: Type.Any({
      title: "Schema",
      description: "JSON Schema of datasource. Always an array of objects.",
    }),
    name: Type.String({ title: "Name of the datasource", comment: "For example, 'My data'" }),
    description: Type.Optional(Type.String({ title: "Description of the datasource" })),
    indexes: Type.Optional(
      Type.Array(
        Type.Object({
          name: Type.String({ title: "Index name" }),
          fields: Type.Array(Type.String(), { title: "Fields to index" }),
          unique: Type.Optional(Type.Boolean({ title: "Unique index", default: false })),
        }),
        {
          title: "Indexes",
          description:
            "IMPORTANT: Indexes to create on the datasource. use it to enforce uniqueness or improve query performance.",
        },
      ),
    ),
  },
  { $id: "datasource:custom" },
);

export type DatasourceCustomManifest = Static<typeof datasourceCustomManifest>;

const datasourceJsonManifest = Type.Object({
  id: Type.String({
    title: "ID",
    description:
      "Unique identifier of the datasource. Used to reference the datasource in the system. Use a url-safe string like a slug.",
  }),
  provider: Type.Literal("http-json", {
    title: "JSON Array",
    description: "JSON array datasource.",
  }),
  options: httpJsonOptions,
  schema: Type.Any({
    title: "Schema",
    description: "JSON Schema of datasource. Always an array of objects.",
    examples: [
      {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", title: "ID" },
            title: { type: "string", title: "Title" },
            firstname: { type: "string", title: "Firstname" },
            lastname: { type: "string", title: "Lastname" },
            createdAt: { type: "string", format: "date-time", title: "Created at" },
            email: { type: "string", format: "email", title: "Email" },
          },
          required: ["id", "title", "firstname", "lastname", "email", "createdAt"],
          title: "Employee",
        },
        title: "Employees",
        description: "Employees list",
      },
    ],
  }),
  name: Type.String({ title: "Name of the datasource", comment: "For example, 'My data'" }),
  description: Type.Optional(Type.String({ title: "Description of the datasource" })),
});

export type DatasourceJsonArrayManifest = Static<typeof datasourceJsonManifest>;

export const datasourceManifest = Type.Union([
  datasourceCustomManifest,
  datasourceJsonManifest,
  datasourceProviderManifest,
]);

export type Datasource = Static<typeof datasourceManifest>;
export const datasourcesList = Type.Array(datasourceManifest);
export type DatasourcesList = Static<typeof datasourcesList>;

// export type DatasourcesResolved<T extends DatasourcesList = DatasourcesList> = {
//   [K in keyof T]: unknown;
// };
