import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";

export function datasourceRef() {
  return prop({
    title: "Database",
    description: "Reference to a data source. Only used for dynamic websites.",
    schema: Type.Object(
      {
        id: Type.String({
          title: "Data Source ID",
        }),
        mapping: Type.Record(Type.String(), Type.String(), {
          description: "Mapping of data source fields to brick props",
        }),
        filters: Type.Optional(
          Type.Record(
            Type.String(),
            Type.Object({
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
              ]),
              value: Type.String(),
            }),
            { description: "Filter data source records" },
          ),
        ),
        sort: Type.Optional(
          Type.Record(
            Type.String(),
            Type.Union([
              Type.Literal("asc", { title: "Ascending" }),
              Type.Literal("desc", { title: "Descending" }),
            ]),
            { description: "Sort data source records" },
          ),
        ),
        limit: Type.Optional(Type.Number({ description: "Limit the number of records to fetch" })),
        offset: Type.Optional(Type.Number({ description: "Offset the records to fetch" })),
      },
      {
        "ui:field": "datasource-ref",
        "ui:meta-type": "datasource-ref",
        description: "Datasource reference. Only used for dynamic websites. Do not use for static websites.",
      },
    ),
  });
}

export type DatasourceRefSettings = Static<ReturnType<typeof datasourceRef>>;
