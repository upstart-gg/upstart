import type { DatasourceProvider, Datasource } from "./datasources/types";
import { schemasMap } from "./datasources/schemas";
import type { TArray } from "@sinclair/typebox";

export function defineDatasource<D extends Omit<Datasource, "id">>(datasource: D) {
  return {
    id: crypto.randomUUID(),
    ...datasource,
    schema: mapDatasourceSchema(
      datasource.provider === "custom" ? datasource.schema : getSchemaByProvider(datasource.provider),
    ),
  };
}

function getSchemaByProvider(provider: DatasourceProvider) {
  return schemasMap[provider];
}

/**
 * Map a datasource schema to include $id, $createdAt, and $updatedAt properties.
 */
export function mapDatasourceSchema(schema: TArray): Datasource["schema"] {
  const { items, ...rest } = schema;
  return {
    ...rest,
    items: {
      type: "object",
      properties: {
        $id: { type: "string", title: "Id" },
        $slug: { type: "string", format: "slug", title: "Slug" },
        $publicationDate: { type: "string", format: "date-time", title: "Publication Date" },
        $lastModificationDate: { type: "string", format: "date-time", title: "Last Modification Date" },
        ...items.properties,
      },
      required: ["$id", "$slug", "$publicationDate", "$lastModificationDate", ...items.required],
    },
  };
}

/**
 * Extract the indexed fields of a datasource with their titles
 */
export function getDatasourceIndexedFieldsWithTitles(datasource: Datasource) {
  if ("indexes" in datasource === false) {
    console.error("no datasource or indexes found", datasource);
    return [];
  }
  const properties = datasource.schema?.items?.properties || {};
  const uniqueFields = Array.from(new Set(datasource.indexes?.map((idx) => idx.fields[0]) ?? []));
  return uniqueFields.map((field) => ({
    value: field,
    title: properties[field]?.title || field,
  }));
}
