import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";

export function datasourceRef() {
  return prop({
    title: "Database",
    description: "Reference to a data source",
    $id: "#datasource",
    schema: Type.Object({
      isDynamic: Type.Optional(
        Type.Boolean({
          title: "Use dynamic content",
          description:
            "Content can be managed in two ways: Static or Dynamic. Static content is set in the editor. Dynamic content is fetched from a database and can be managed through our CMS.",
          default: false,
          "ui:field": "dynamic-content-switch",
          "ui:inspector-tab": "content",
          "ui:order": 0,
          "ui:group:order": 0,
          "ui:group": "content",
          "ui:group:title": "Dynamic / Static Mode",
        }),
      ),
      datasource: Type.Optional(
        Type.Object(
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
            "ui:inspector-tab": "content",
          },
        ),
      ),
    }),
  });
}

export type DatasourceRefProps = Static<ReturnType<typeof datasourceRef>>;
