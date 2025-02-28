import { Type, type Static } from "@sinclair/typebox";

export const datasourceRef = Type.Object(
  {
    id: Type.String({
      title: "Data Source ID",
    }),
    useExistingDatasource: Type.Boolean({
      title: "Use Existing data source",
      default: false,
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
      Type.Record(Type.String(), Type.String(), { description: "Sort data source records" }),
    ),
    limit: Type.Optional(Type.Number({ description: "Limit the number of records to fetch" })),
    offset: Type.Optional(Type.Number({ description: "Offset the records to fetch" })),
  },
  {
    title: "Database",
    description: "Reference to a data source",
    "ui:field": "datasource-ref",
    "ui:group": "content",
    "ui:group:title": "Database",
  },
);

export type DatasourceRef = Static<typeof datasourceRef>;

export const datasourceRefProps = Type.Object({
  datasourceRef,
});
