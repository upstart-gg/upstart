import { Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/string-enum";

export function datasource(title = "Database") {
  return Type.Object(
    {
      id: Type.String({
        title: "Database",
      }),
      offset: Type.Optional(
        Type.Number({
          title: "Offset",
          description: "Offset the records to fetch from the datasource",
          minimum: 0,
          default: 0,
        }),
      ),
      limit: Type.Optional(
        Type.Number({
          title: "Limit",
          description:
            "Limit the number of records to fetch from the datasource. Setting to 1 will fetch and render only one item.",
          minimum: 1,
          default: 3,
        }),
      ),
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
          description: "Select a field to sort by (must be indexed)",
          default: "$publicationDate",
        }),
      ),
      filters: Type.Optional(
        Type.Array(
          Type.Object({
            field: Type.String(),
            op: Type.Union([
              Type.Literal("eq"),
              Type.Literal("ne"),
              Type.Literal("lt"),
              Type.Literal("lte"),
              Type.Literal("gt"),
              Type.Literal("gte"),
              Type.Literal("in"),
              Type.Literal("nin"),
              Type.Literal("contains"),
              Type.Literal("notContains"),
              Type.Literal("startsWith"),
              Type.Literal("notStartsWith"),
              Type.Literal("endsWith"),
              Type.Literal("notEndsWith"),
              Type.Literal("before"),
              Type.Literal("after"),
            ]),
            value: Type.Union([Type.String(), Type.Number(), Type.Boolean()]),
          }),
          {
            default: [],
          },
        ),
      ),
    },
    {
      "ui:field": "datasource",
      title,
      metadata: {
        category: "content",
      },
    },
  );
}

export type DatasourceSettings = Static<ReturnType<typeof datasource>>;
