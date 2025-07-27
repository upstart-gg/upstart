import type { Static, TObject, TSchema } from "@sinclair/typebox";
import { jsonDefault } from "json-schema-default";
import type { BrickManifest } from "../brick-manifest";

export function normalizeSchemaEnum(schema: TSchema): Array<{ const: string; title: string }> {
  if (!("enum" in schema)) {
    return schema.anyOf ?? schema.oneOf;
  }
  const {
    enum: enumValues,
    enumNames,
    "ui:icons": icons,
  } = schema as unknown as { enum: string[]; enumNames?: string[]; "ui:icons"?: string[] };
  // combine to key-value pairs
  return enumValues.map((value, index) => ({
    const: value,
    title: enumNames ? enumNames[index] : value,
    "ui:icon": icons ? icons[index] : undefined,
  }));
}

/**
 * @warning DOES NOT HANDLE ARRAYs, just OBJECTs
 */
export function getSchemaObjectDefaults<T extends TSchema>(schema: T) {
  return jsonDefault(schema) as Static<T>;
}

export type FieldFilter<
  T extends TSchema = TSchema,
  P extends Record<string, unknown> = Record<string, unknown>,
> = (propsSchema: T, formData: P) => boolean;

export function filterSchemaProperties(schema: TObject, filter: (prop: TSchema) => boolean) {
  function extractProperties(schema: TObject): Record<string, TSchema> {
    const props: Record<string, TSchema> = {};
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (filter(prop)) {
        props[key] = prop;
      } else if (prop.type === "object" && prop.properties) {
        const nestedContentProps = extractProperties(prop as TObject);
        if (Object.keys(nestedContentProps).length > 0) {
          Object.assign(props, nestedContentProps);
        }
      }
    }
    return props;
  }
  return extractProperties(schema);
}
