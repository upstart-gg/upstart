import { type TSchema, Type, type Static, type TArray } from "@sinclair/typebox";
import { StringEnum } from "../utils/string-enum";
import { toLLMSchema } from "../utils/llm";

export const datasourceSystemProperties = Type.Object({
  $id: Type.Optional(Type.String({ title: "Id", format: "text" })),
  $publicationDate: Type.Optional(Type.String({ title: "Publication Date", format: "date-time" })),
  $slug: Type.Optional(Type.String({ title: "Slug", format: "slug" })),
  $lastModificationDate: Type.Optional(Type.String({ title: "Last Modification", format: "date-time" })),
});

export type DatasourceSystemProperties = Static<typeof datasourceSystemProperties>;

export const providersSchema = StringEnum(["internal"]);

export type DatasourceProvider = Static<typeof providersSchema>;

const datasourceInternalManifest = Type.Object({
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
    description:
      "JSON Schema of datasource. Always a schema of type 'array' of objects. An object representing a single record.",
  }),
  indexes: Type.Array(
    Type.Object({
      name: Type.String({ title: "Index name" }),
      fields: Type.Array(Type.String(), { title: "Fields to index" }),
      unique: Type.Optional(Type.Boolean({ title: "Creates a unique index" })),
      fulltext: Type.Optional(Type.Boolean({ title: "Creates a fulltext index for search" })),
    }),
    {
      title: "Indexes",
      description:
        "IMPORTANT: Indexes to create on the datasource. use it to enforce uniqueness or improve query performance.",
    },
  ),
  foreignKeys: Type.Optional(
    Type.Array(
      Type.Object({
        field: Type.String({ title: "Field in this datasource" }),
        foreignDatasourceId: Type.String({ title: "Foreign Datasource ID" }),
        foreignField: Type.String({ title: "Field in the foreign datasource" }),
      }),
    ),
  ),
});

export type InternalDatasource = Static<typeof datasourceInternalManifest>;

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
    "match",
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

export const queryParameter = Type.Union([
  stringFilter,
  numberFilter,
  dateFilterAbsolute,
  dateFilterRelative,
  arrayFilter,
  booleanFilter,
]);

const queryParametersExpression = Type.Recursive(
  (This) =>
    Type.Union(
      [
        Type.Object({
          op: Type.Literal("and"),
          fields: Type.Array(Type.Union([queryParameter, This]), {
            title: "Fields",
            description: "Fields to combine with AND. Can only be indexed fields.",
          }),
        }),
        Type.Object({
          op: Type.Literal("or"),
          fields: Type.Array(Type.Union([queryParameter, This]), {
            title: "Fields",
            description: "Fields to combine with OR. Can only be indexed fields.",
          }),
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
    title: "Parameter Expression",
    description:
      "Expression used to build the query. Can be a combination of and/or conditions. Values can use placeholders like ':slug' to reference URL parameters.",
  },
);

export const querySchema = Type.Object(
  {
    alias: Type.String({
      title: "Alias",
      minLength: 1,
      maxLength: 100,
      pattern: "^[a-zA-Z0-9_]+$",
      description:
        "Unique alias for the query results, used in dynamic content. Use a simple keyword without spaces or special characters. Aliases are unique across the page.",
      "ai:instructions":
        "Use a simple keyword without spaces or special characters. Aliases are unique across the page. You can use the same query several times with different aliases in order to, for example, apply different parameters to the same query.",
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
    sort: Type.Optional(
      Type.Array(
        Type.Union([
          Type.Literal("random()", { description: "Random order" }),
          Type.Literal("match()", { description: "Full-text search" }),
          Type.Object(
            {
              field: Type.String({ title: "Field", description: "Field to sort by" }),
              direction: StringEnum(["asc", "desc"], {
                title: "Direction",
                enumNames: ["Ascending", "Descending"],
                description: "Direction to sort the records by",
                default: "desc",
              }),
            },
            {
              description: "Sort the results by a specific field",
            },
          ),
        ]),
        { default: [{ field: "$publicationDate", direction: "desc" }] },
      ),
    ),
    parameters: Type.Optional(queryParametersExpression),
  },
  {
    examples: [
      {
        alias: "latestPosts",
        label: "Latest posts",
        datasourceId: "blog_posts",
        limit: 5,
        sort: [{ field: "$publicationDate", direction: "desc" }],
      },
      {
        alias: "postsByCategory",
        label: "Posts by category",
        datasourceId: "blog_posts",
        limit: 10,
        sort: [{ field: "$publicationDate", direction: "desc" }],
        parameters: [{ field: "category", op: "eq", value: ":category" }],
      },
      {
        alias: "postsByTag",
        label: "Posts by tag",
        datasourceId: "blog_posts",
        limit: 10,
        sort: [{ field: "$publicationDate", direction: "desc" }],
        parameters: [{ field: "tags", op: "containsAny", value: ":tags" }],
      },
      {
        alias: "authorPosts",
        label: "Author posts",
        datasourceId: "blog_posts",
        limit: 10,
        sort: [{ field: "$publicationDate", direction: "desc" }],
        parameters: [{ field: "author", op: "eq", value: ":author" }],
      },
      {
        alias: "searchPosts",
        label: "Search posts",
        datasourceId: "blog_posts",
        limit: 10,
        sort: [{ field: "$publicationDate", direction: "desc" }],
        parameters: [{ field: "title", op: "contains", value: ":q" }],
      },
    ],
  },
);

export type Query = Static<typeof querySchema>;
