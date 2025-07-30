import type { DatasourceProvider, Datasource } from "./datasources/types";
import { schemasMap } from "./datasources/schemas";
import type { TArray } from "@sinclair/typebox";

export function defineDatasource<D extends Datasource>(datasource: D) {
  return {
    ...datasource,
    schema: mapDatasourceSchema(
      // @ts-ignore Seems like TS can't infer properly here
      "schema" in datasource ? datasource.schema : getSchemaByProvider(datasource.provider),
    ),
  } as D;
}

function getSchemaByProvider(provider: DatasourceProvider) {
  return schemasMap[provider];
}

/**
 * Map a datasource schema to include $id, $createdAt, and $updatedAt properties.
 */
export function mapDatasourceSchema(schema: TArray) {
  const { items, ...rest } = schema;
  return {
    items: {
      type: "object",
      properties: {
        _id: { type: "string", title: "Id" },
        _slug: { type: "string", format: "slug", title: "Slug" },
        _publicationDate: { type: "string", format: "date-time", title: "Publication Date" },
        _lastModificationDate: { type: "string", format: "date-time", title: "Last Modification Date" },
        ...items.properties,
      },
      required: ["_id", "_slug", "_publicationDate", "_lastModificationDate", ...items.required],
    },
    ...rest,
  };
}
