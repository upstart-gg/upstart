import type { TArray, TObject, TSchema } from "@sinclair/typebox";
import type { Site } from "@upstart.gg/sdk/shared/page";

function getSchemaObject({
  rootName,
  schema: { required, properties },
  level,
}: { schema: TObject; rootName: string; level: number }) {
  const renderProperties = properties;

  if (properties) {
    return Object.entries(renderProperties).flatMap(([name, value], i) =>
      getSchemaEntry({
        schema: { ...value, name, optional: required && !required.includes(name) },
        rootName,
        level: level + 1,
      }),
    );
  }
  return [];
}

function getSchemaArray({
  rootName,
  schema: { name, items, required, allOf, properties },
  level,
}: { schema: TArray; rootName: string; level: number }) {
  if (items) {
    return getSchemaEntry({
      schema: { ...items, name, optional: required && !required.includes(name) },
      rootName,
      level: level + 1,
    });
  }
  return [];
}

function getSchemaEntry({
  schema,
  rootName,
  level,
}: { schema: TSchema; rootName: string; level: number }): string | string[] {
  if (schema.type === "object") {
    return getSchemaObject({ schema: schema as TObject, rootName, level });
  } else if (schema.type === "array") {
    return getSchemaArray({ schema: schema as TArray, rootName, level });
  }
  return `${rootName}.${schema.name}`;
}

export function getJSONSchemaFieldsList(schemasMap?: Site["datasources"]) {
  if (!schemasMap) return [];
  return Object.entries(schemasMap)
    .filter(([, ds]) => !!ds.schema)
    .flatMap(([name, ds]) => getSchemaEntry({ schema: ds.schema as TSchema, rootName: name, level: 0 }));
}
