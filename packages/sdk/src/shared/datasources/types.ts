import { Type, type Static } from "@sinclair/typebox";
import { youtubeListOptions } from "./external/youtube/list/options";
import { httpJsonOptions } from "./external/http-json/options";
import { rssOptions } from "./external/rss/options";
import { StringEnum } from "../utils/string-enum";

export const providersSchema = Type.Union([
  // Type.Literal("facebook-posts"),
  // Type.Literal("instagram-feed"),
  // Type.Literal("mastodon-account"),
  // Type.Literal("mastodon-status"),
  // Type.Literal("mastodon-status-list"),
  Type.Literal("custom"),
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

const datasourceBaseFields = Type.Object({
  id: Type.String({
    title: "ID",
    description:
      "Unique identifier of the datasource. Used to reference the datasource in the system. Use a url-safe string like a slug.",
  }),
  label: Type.String({ title: "Label", description: "Label of the datasource displayed in the UI" }),
});

const datasourceProviderManifest = Type.Composite([
  providersChoices,
  datasourceBaseFields,
  Type.Object({
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

const datasourceCustomManifest = Type.Composite([
  datasourceBaseFields,
  Type.Object(
    {
      provider: Type.Literal("custom", {
        title: "Custom",
        description: "Custom datasource saved locally in Upstart.",
      }),
      options: Type.Optional(Type.Object({}, { additionalProperties: true })),
      schema: Type.Any({
        title: "Schema",
        description: "JSON Schema of datasource. Always an array of objects.",
      }),
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
  ),
]);

export type DatasourceCustomManifest = Static<typeof datasourceCustomManifest>;

const datasourceJsonManifest = Type.Composite([
  datasourceBaseFields,
  Type.Object({
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
  }),
]);

export type DatasourceJsonArrayManifest = Static<typeof datasourceJsonManifest>;

export const datasourceManifest = Type.Union([
  datasourceCustomManifest,
  datasourceJsonManifest,
  datasourceProviderManifest,
]);

export type Datasource = Static<typeof datasourceManifest>;
export const datasourcesList = Type.Array(datasourceManifest);
export type DatasourcesList = Static<typeof datasourcesList>;

const stringFilter = Type.Object({
  field: Type.String(),
  op: Type.Union([
    Type.Literal("eq"),
    Type.Literal("ne"),
    Type.Literal("contains"),
    Type.Literal("notContains"),
    Type.Literal("startsWith"),
    Type.Literal("notStartsWith"),
    Type.Literal("endsWith"),
    Type.Literal("notEndsWith"),
  ]),
  value: Type.String(),
});

const numberFilter = Type.Object({
  field: Type.String(),
  op: Type.Union([
    Type.Literal("eq"),
    Type.Literal("ne"),
    Type.Literal("lt"),
    Type.Literal("lte"),
    Type.Literal("gt"),
    Type.Literal("gte"),
  ]),
  value: Type.Number(),
});

const dateFilterAbsolute = Type.Object({
  field: Type.String(),
  op: Type.Union([Type.Literal("before"), Type.Literal("after")]),
  value: Type.String(),
});

const dateFilterRelative = Type.Object({
  field: Type.String(),
  op: Type.Union([Type.Literal("beforeNow"), Type.Literal("afterNow")]),
  value: Type.Null(),
});

const arrayFilter = Type.Object({
  field: Type.String(),
  op: Type.Union([
    Type.Literal("contains"),
    Type.Literal("notContains"),
    Type.Literal("containsAll"),
    Type.Literal("containsAny"),
    Type.Literal("notContainsAny"),
  ]),
  value: Type.Array(Type.String()),
});

const booleanFilter = Type.Object({
  field: Type.String(),
  op: Type.Literal("eq"),
  value: Type.Boolean(),
});

export const queryFilter = Type.Union([
  stringFilter,
  numberFilter,
  dateFilterAbsolute,
  dateFilterRelative,
  arrayFilter,
  booleanFilter,
]);

const filterExpression = Type.Recursive((This) =>
  Type.Union(
    [
      Type.Object({
        op: Type.Literal("and"),
        fields: Type.Array(Type.Union([queryFilter, This])),
      }),
      Type.Object({
        op: Type.Literal("or"),
        fields: Type.Array(Type.Union([queryFilter, This])),
      }),
    ],
    {
      default: {
        op: "and",
        fields: [],
      },
    },
  ),
);

export const querySchema = Type.Object({
  id: Type.String({
    title: "Query ID",
    description:
      "Unique identifier for the query. Used to reference the query in the system. URL-safe string like a slug.",
  }),
  label: Type.String({
    title: "Label",
    maxLength: 100,
    description: "Label of the query displayed in the UI",
  }),
  datasourceId: Type.String({
    title: "Database",
    description: "ID of the datasource to query",
  }),
  limit: Type.Number({
    title: "Limit",
    description: "Limit the number of records to fetch from the datasource.",
    minimum: 1,
    maximum: 50,
    default: 10,
  }),
  sortDirection: Type.Optional(
    Type.Union([
      Type.Null(),
      StringEnum(["asc", "desc"], {
        title: "Sort",
        enumNames: ["Ascending", "Descending"],
        description: "Direction to sort the records by",
        default: "desc",
      }),
    ]),
  ),
  sortField: Type.Optional(
    Type.String({
      title: "Sort Field",
      description: "Select a field to sort by (must be indexed)",
      default: "$publicationDate",
    }),
  ),
  filters: Type.Optional(filterExpression),
  parameters: Type.Optional(
    Type.Array(Type.String(), {
      title: "Parameters",
      description:
        "Field names that will be used as parameters when using the query. Only indexed fields can be used as parameters.",
      default: [],
      examples: [["$slug"], ["$id"], ["category", "tags"]],
    }),
  ),
});

export type Query = Static<typeof querySchema>;
