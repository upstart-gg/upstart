import { get } from "lodash-es";
import type { PageAttributes } from "../site/attributes";
import type { TArray, TSchema } from "@sinclair/typebox";
import { datasourceSystemProperties, type Datasource } from "./types";

export function stringifyObjectValues(
  obj: Record<string, string | number | Date | boolean>,
): Record<string, string> {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, value.toString()]));
}

export function createPlaceholderReplacer(attr?: PageAttributes) {
  return function replacePlaceholders(_: unknown, p1: string) {
    const varName = (p1 as string).trim();
    return String(get(attr, varName)) ?? "";
  };
}

export const placeholderRx = /{{(.+?)}}/g;

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
      datasource.schema as TArray<TSchema>,
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
        ...datasourceSystemProperties.properties,
      },
      // We should likely reuse `datasourceSystemProperties.required` instead of hardcoding but I'm not sure
      // how the dashboard is handling it right now when creating new items
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
  const properties = (datasource.schema as TArray<TSchema>)?.items?.properties || {};
  const uniqueFields = Array.from(new Set(datasource.indexes?.map((idx) => idx.fields[0]) ?? []));
  return uniqueFields.map((field) => ({
    value: field,
    title: properties[field]?.title || field,
  }));
}
