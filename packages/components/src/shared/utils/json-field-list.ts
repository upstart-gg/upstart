import type { TArray, TObject, TSchema } from "@sinclair/typebox";

function getSchemaObject({
  schema: { required, properties },
  level,
  prefix,
}: { schema: TObject; level: number; prefix: string }) {
  const renderProperties = properties;

  if (properties) {
    return Object.entries(renderProperties).flatMap(([name, value], i) =>
      getSchemaEntry({
        schema: { ...value, name, optional: required && !required.includes(name) },
        level: level + 1,
        prefix: `${prefix}`,
      }),
    );
  }
  return [];
}

function getSchemaArray({
  schema: { name, items, required, allOf, properties },
  level,
  prefix,
}: { schema: TArray; level: number; prefix: string }) {
  if (items) {
    return getSchemaEntry({
      schema: { ...items, name, optional: required && !required.includes(name) },
      level: level + 1,
      prefix,
    });
  }
  return [];
}

function getSchemaEntry({
  schema,
  level,
  prefix,
}: { schema: TSchema; level: number; prefix: string }): string | string[] {
  if (schema.type === "object") {
    return getSchemaObject({ schema: schema as TObject, level, prefix });
  } else if (schema.type === "array") {
    return getSchemaArray({ schema: schema as TArray, level, prefix });
  }
  return `${prefix}.${schema.name}`;
}

export function getJSONSchemaFieldsList(schema: TArray, prefix: string) {
  return (getSchemaEntry({ schema, level: 0, prefix }) as string[]).toSorted((a, b) => a.localeCompare(b));
}
