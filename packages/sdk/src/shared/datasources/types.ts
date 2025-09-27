import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "../utils/string-enum";
import { toLLMSchema } from "../utils/llm";

export const providersSchema = StringEnum([
  // "facebook-posts",
  // "instagram-feed",
  // "mastodon-account",
  // "mastodon-status",
  // "mastodon-status-list",
  "internal",
  // "rss",
  // // "threads-media",
  // // "tiktok-video",
  // "youtube-list",
  // "http-json",
  // "internal-blog",
  // "internal-changelog",
  // // "internal-contact-info",
  // "internal-faq",
  // "internal-links",
  // "internal-recipes",
  // "internal-restaurant",
  // "internal-cv",
]);

export type DatasourceProvider = Static<typeof providersSchema>;

// const datasourceProviderManifest = Type.Composite([
//   Type.Object({
//     id: Type.String({
//       title: "ID",
//       description:
//         "Unique identifier of the datasource. Used to reference the datasource in the system. Use a url-safe string like a slug.",
//     }),
//     label: Type.String({ title: "Label", description: "Label of the datasource displayed in the UI" }),
//     schema: Type.Null({
//       description: "Always null for provider datasources. The schema is defined by the provider.",
//     }),
//     ttlMinutes: Type.Optional(
//       Type.Number({
//         title: "Time to live",
//         description:
//           "Time to live in minutes. If set to -1, it never expires and has to be manually refreshed. If set to 0, the datasource is always fetched live. If > 0, then the datasource is feteched every N minutes.",
//       }),
//     ),
//     refresh: Type.Optional(
//       Type.Object(
//         {
//           method: Type.Union([Type.Literal("interval"), Type.Literal("manual"), Type.Literal("live")]),
//           interval: Type.Optional(Type.Number()),
//         },
//         {
//           title: "Refresh options",
//           description: "Options to refresh the datasource",
//         },
//       ),
//     ),
//   }),
// ]);

// export type DatasourceProviderManifest = Static<typeof datasourceProviderManifest>;

const datasourceInternalManifest = Type.Object(
  {
    id: Type.String({
      title: "ID",
      description:
        "Unique identifier of the datasource. Used to reference the datasource in the system. Use a url-safe string like a slug.",
    }),
    label: Type.String({ title: "Label", description: "Label of the datasource displayed in the UI" }),
    provider: Type.Literal("internal", {
      title: "Internal",
      description: "Internal datasource saved locally in Upstart.",
    }),
    schema: Type.Any({
      title: "Schema",
      description: "JSON Schema of datasource. MUST Always an array of objects.",
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
  {
    examples: [
      {
        id: "customers",
        label: "Customers",
        provider: "internal",
        schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", title: "Name" },
              email: { type: "string", title: "Email", format: "email" },
            },
            required: ["name", "email"],
            title: "Customer",
            examples: [
              { name: "John Doe", email: "john.doe@example.com" },
              {
                name: "Jane Smith",
                email: "jane.smith@example.com",
              },
              {
                name: "Alice Johnson",
                email: "alice.johnson@example.com",
              },
              {
                name: "Bob Brown",
                email: "bob.brown@example.com",
              },
              {
                name: "Charlie Davis",
                email: "charlie.davis@example.com",
              },
            ],
          },
        },
        indexes: [
          {
            name: "idx_customers_email",
            fields: ["email"],
            unique: true,
          },
        ],
      },
      {
        id: "blog_posts",
        label: "Blog Posts",
        provider: "internal",
        schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string", title: "Title" },
              content: { type: "string", title: "Content" },
              author: { type: "string", title: "Author" },
            },
            required: ["title", "content", "author"],
            title: "Blog Post",
            examples: [
              {
                title: "My First Blog Post",
                content: "This is the content of my first blog post.",
                author: "John Doe",
              },
              {
                title: "Exploring the Cosmos",
                content: "A journey through the stars and galaxies.",
                author: "Jane Smith",
              },
              {
                title: "The Art of Cooking",
                content: "Delicious recipes and cooking tips.",
                author: "Alice Johnson",
              },
              {
                title: "Traveling the World",
                content: "My adventures in different countries.",
                author: "Bob Brown",
              },
              {
                title: "Technology Trends",
                content: "The latest trends in technology.",
                author: "Charlie Davis",
              },
            ],
          },
        },
        indexes: [
          {
            name: "idx_blog_posts_title",
            fields: ["title"],
            unique: true,
          },
        ],
      },
    ],
  },
);

export type InternalDatasource = Static<typeof datasourceInternalManifest>;

// const datasourceJsonManifest = Type.Composite([
//   datasourceBaseFields,
//   Type.Object({
//     provider: Type.Literal("http-json", {
//       title: "JSON Array",
//       description: "JSON array datasource.",
//     }),
//     options: httpJsonOptions,
//     schema: Type.Any({
//       title: "Schema",
//       description: "JSON Schema of datasource. Always an array of objects.",
//       examples: [
//         {
//           type: "array",
//           items: {
//             type: "object",
//             properties: {
//               id: { type: "string", title: "ID" },
//               title: { type: "string", title: "Title" },
//               firstname: { type: "string", title: "Firstname" },
//               lastname: { type: "string", title: "Lastname" },
//               createdAt: { type: "string", format: "date-time", title: "Created at" },
//               email: { type: "string", format: "email", title: "Email" },
//             },
//             required: ["id", "title", "firstname", "lastname", "email", "createdAt"],
//             title: "Employee",
//           },
//           title: "Employees",
//           description: "Employees list",
//         },
//       ],
//     }),
//   }),
// ]);

// type DatasourceJsonArrayManifest = Static<typeof datasourceJsonManifest>;

// Fow now, let support only custom (internal) datasource
// export const datasourceManifest = datasourceCustomManifest;
export const datasourceManifest = datasourceInternalManifest;
export const datasourceManifestLLM = toLLMSchema(datasourceManifest);

export type Datasource = Static<typeof datasourceManifest>;
export const datasourcesList = Type.Array(datasourceManifest);
export type DatasourcesList = Static<typeof datasourcesList>;

const stringFilter = Type.Object({
  field: Type.String(),
  op: StringEnum([
    "eq",
    "ne",
    "contains",
    "notContains",
    "startsWith",
    "notStartsWith",
    "endsWith",
    "notEndsWith",
  ]),
  value: Type.String(),
});

const numberFilter = Type.Object({
  field: Type.String(),
  op: StringEnum(["eq", "ne", "lt", "lte", "gt", "gte"]),
  value: Type.Number(),
});

const dateFilterAbsolute = Type.Object({
  field: Type.String(),
  op: StringEnum(["before", "after"]),
  value: Type.String(),
});

const dateFilterRelative = Type.Object({
  field: Type.String(),
  op: StringEnum(["beforeNow", "afterNow"]),
  value: Type.Null(),
});

const arrayFilter = Type.Object({
  field: Type.String(),
  op: StringEnum(["contains", "notContains", "containsAll", "containsAny", "notContainsAny"]),
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

const filterExpression = Type.Recursive(
  (This) =>
    Type.Union(
      [
        Type.Object({
          op: Type.Literal("and"),
          fields: Type.Array(Type.Union([queryFilter, This]), { title: "Indexed Fields" }),
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
        examples: [
          {
            op: "and",
            fields: [
              {
                field: "$id",
                op: "eq",
                value: "123",
              },
              {
                field: "$publicationDate",
                op: "beforeNow",
              },
            ],
          },
        ],
      },
    ),
  {
    title: "Filter Expression",
    description: "Expression used to filter query results. Can be a combination of and/or conditions.",
  },
);

export const querySchema = Type.Object(
  {
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
      default: 10,
    }),
    sortDirection: Type.Optional(
      StringEnum(["asc", "desc"], {
        title: "Sort",
        enumNames: ["Ascending", "Descending"],
        description: "Direction to sort the records by",
        default: "desc",
      }),
    ),
    sortField: Type.Optional(
      Type.String({
        title: "Sort Field",
        description: "Field to sort by (must be an indexed field)",
        default: "$publicationDate",
      }),
    ),
    filters: Type.Optional(filterExpression),
    parameters: Type.Optional(
      Type.Array(
        Type.Object({
          field: Type.String({ title: "Field", description: "Field name to use as parameter" }),
          op: StringEnum(
            [
              "eq",
              "ne",
              "contains",
              "notContains",
              "startsWith",
              "notStartsWith",
              "endsWith",
              "notEndsWith",
              "lt",
              "lte",
              "gt",
              "gte",
              "before",
              "after",
              "beforeNow",
              "afterNow",
              "containsAll",
              "containsAny",
              "notContainsAny",
            ],
            { title: "Operator", description: "Operator to use for the parameter" },
          ),
        }),
        {
          title: "Parameters",
          description:
            "Field name and operator that will be used as parameters when using the query in pages. Only indexed fields can be used as parameters.",
          default: [],
          examples: [
            [{ field: "$slug", op: "eq" }],
            [{ field: "category", op: "eq" }],
            [{ field: "tags", op: "containsAny" }],
            [{ field: "author", op: "eq" }],
            [{ field: "title", op: "contains" }],
          ],
        },
      ),
    ),
  },
  {
    examples: [
      {
        id: "latest-posts",
        label: "Latest posts",
        datasourceId: "blog_posts",
        limit: 5,
        sortDirection: "desc",
        sortField: "$publicationDate",
      },
      {
        id: "posts-by-category",
        label: "Posts by category",
        datasourceId: "blog_posts",
        limit: 10,
        sortDirection: "desc",
        sortField: "$publicationDate",
        parameters: [{ field: "category", op: "eq" }],
      },
      {
        id: "posts-by-tag",
        label: "Posts by tag",
        datasourceId: "blog_posts",
        limit: 10,
        sortDirection: "desc",
        sortField: "$publicationDate",
        parameters: [{ field: "tags", op: "containsAny" }],
      },
      {
        id: "author-posts",
        label: "Author posts",
        datasourceId: "blog_posts",
        limit: 10,
        sortDirection: "desc",
        sortField: "$publicationDate",
        parameters: [{ field: "author", op: "eq" }],
      },
      {
        id: "search-posts",
        label: "Search posts",
        datasourceId: "blog_posts",
        limit: 10,
        sortDirection: "desc",
        sortField: "$publicationDate",
        parameters: [{ field: "title", op: "contains" }],
      },
    ],
  },
);

export type Query = Static<typeof querySchema>;
