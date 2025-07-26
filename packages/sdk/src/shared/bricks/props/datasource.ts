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
          description: "Limit the number of records to fetch from the datasource",
          minimum: 1,
          default: 10,
        }),
      ),
      sortDirection: Type.Optional(
        StringEnum(["asc", "desc", "rand"], {
          title: "Sort Direction",
          description: "Direction to sort the records by",
          default: "asc",
          "ui:display": "select",
        }),
      ),
      sortField: Type.Optional(
        Type.String({
          title: "Sort Field",
          description: "Select a field to sort by (must be indexed)",
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
              Type.Literal("startsWith"),
              Type.Literal("endsWith"),
              Type.Literal("exists"),
              Type.Literal("not_exists"),
              Type.Literal("before"),
              Type.Literal("after"),
              Type.Literal("between"),
              Type.Literal("last"),
              Type.Literal("next"),
            ]),
            value: Type.String(),
            unit: Type.Optional(
              StringEnum(["minute", "hour", "day", "week", "month", "year"], {
                title: "Time Unit",
                description: "Time unit for relative date comparisons",
              }),
            ),
          }),
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
