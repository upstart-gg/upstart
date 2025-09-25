import type { TArray } from "@sinclair/typebox";
import type { Datasource } from "./datasources/types";

/**
 * For now, defineDatasources() force the usage of a custom (internal) datasource
 * @returns
 */
export function defineDatasource<D extends Datasource>(datasource: D) {
  return {
    ...datasource,
    provider: "internal", // make sure to use Upstart provider
    schema: mapDatasourceSchemaWithInternalProperties(
      // datasource.provider === "internal" ? datasource.schema : getSchemaByProvider(datasource.provider),
      datasource.schema,
    ),
  };
}

/**
 * Map a datasource schema to include $id, $createdAt, and $updatedAt properties.
 */
export function mapDatasourceSchemaWithInternalProperties(schema: TArray): Datasource["schema"] {
  const { items, ...rest } = schema;
  return {
    ...rest,
    items: {
      ...items,
      type: "object",
      properties: {
        ...items.properties,
        $id: { type: "string", title: "Id" },
        $slug: { type: "string", format: "slug", title: "Slug" },
        $publicationDate: { type: "string", format: "date-time", title: "Publication Date" },
        $lastModificationDate: { type: "string", format: "date-time", title: "Last Modification Date" },
      },
      required: Array.from(new Set(["$id", "$slug", "$lastModificationDate", ...items.required])),
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
