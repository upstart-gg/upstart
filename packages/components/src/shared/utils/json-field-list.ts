import type { TArray, TObject, TSchema } from "@sinclair/typebox";
import type { Site } from "@upstart.gg/sdk/shared/site";

function getSchemaObject({ schema: { required, properties }, level }: { schema: TObject; level: number }) {
  const renderProperties = properties;

  if (properties) {
    return Object.entries(renderProperties).flatMap(([name, value], i) =>
      getSchemaEntry({
        schema: { ...value, name, optional: required && !required.includes(name) },
        level: level + 1,
      }),
    );
  }
  return [];
}

function getSchemaArray({
  schema: { name, items, required, allOf, properties },
  level,
}: { schema: TArray; level: number }) {
  if (items) {
    return getSchemaEntry({
      schema: { ...items, name, optional: required && !required.includes(name) },
      level: level + 1,
    });
  }
  return [];
}

function getSchemaEntry({ schema, level }: { schema: TSchema; level: number }): string | string[] {
  if (schema.type === "object") {
    return getSchemaObject({ schema: schema as TObject, level });
  } else if (schema.type === "array") {
    return getSchemaArray({ schema: schema as TArray, level });
  }
  return `${schema.name}`;
}

export function getJSONSchemaFieldsList(schemasMap?: Site["datasources"]) {
  if (!schemasMap) return [];
  return (
    Object.entries(schemasMap)
      .filter(([, ds]) => !!ds.schema)
      // todo fix this
      // @ts-ignore
      .flatMap(([name, ds]) => getSchemaEntry({ schema: ds.schema as TSchema, level: 0 }))
  );
}
