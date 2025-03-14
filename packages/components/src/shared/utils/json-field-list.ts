import type { TArray, TObject, TSchema } from "@sinclair/typebox";

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

export function getJSONSchemaFieldsList(schemas?: Record<string, { schema: TSchema }>) {
  if (!schemas) return [];
  return Object.entries(schemas)
    .filter(([, ds]) => !!ds.schema)
    .flatMap(([name, ds]) => getSchemaEntry({ schema: ds.schema, rootName: name, level: 0 }));
}
