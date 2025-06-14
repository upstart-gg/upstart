import type { DatasourcesMap, DatasourceProvider } from "./datasources/types";
import { schemasMap } from "./datasources/schemas";
import { type TArray, Type } from "@sinclair/typebox";

export function defineDataSources(datasources: DatasourcesMap) {
  const datasourcesMapped: DatasourcesMap = {};
  for (const [key, value] of Object.entries(datasources)) {
    datasourcesMapped[key] = {
      ...value,
      // @ts-ignore Seems like TS can't infer properly here
      schema: "schema" in value ? value.schema : getSchemaByProvider(value.provider),
    };
  }
  return datasourcesMapped;
}

function getSchemaByProvider(provider: DatasourceProvider) {
  return schemasMap[provider];
}

/**
 * Map a datasource schema to include $id, $createdAt, and $updatedAt properties.
 */
export function mapDatasourceSchema(schema: TArray) {
  const { items, title, description } = schema;
  // Add $id, $createdAt, $updatedAt to the schema
  return {
    type: "array",
    items: {
      type: "object",
      properties: {
        $id: { type: "string", title: "ID" },
        $createdAt: { type: "string", format: "date-time", title: "Created At" },
        $updatedAt: { type: "string", format: "date-time", title: "Updated At" },
        ...items.properties,
      },
      required: ["$id", "$createdAt", "$updatedAt", ...items.required],
    },
    title,
    description,
  };
}
