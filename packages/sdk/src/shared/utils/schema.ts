import type { Static, TSchema } from "@sinclair/typebox";
import { jsonDefault } from "json-schema-default";

export function normalizeSchemaEnum(schema: TSchema): Array<{ const: string; title: string }> {
  if (!("enum" in schema)) {
    return schema.anyOf ?? schema.oneOf;
  }
  const { enum: enumValues, enumNames } = schema as unknown as { enum: string[]; enumNames?: string[] };
  // combine to key-value pairs
  return enumValues.map((value, index) => ({
    const: value,
    title: enumNames ? enumNames[index] : value,
  }));
}

/**
 * @warning DOES NOT HANDLE ARRAYs, just OBJECTs
 */
export function getSchemaObjectDefaults<T extends TSchema>(schema: T) {
  return jsonDefault(schema) as Static<T>;
}
