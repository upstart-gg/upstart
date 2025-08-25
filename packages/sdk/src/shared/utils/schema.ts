import type { TArray, TObject, TSchema } from "@sinclair/typebox";
import type { PageAttributes } from "../attributes";

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

export function getSchemaDefaults<T extends TObject | TArray>(
  schema: T,
  mode?: "mobile" | "desktop",
): T extends TObject ? Record<string, unknown> : unknown[] {
  // Handle object schemas
  if (schema.type === "object" && "properties" in schema) {
    const objectSchema = schema as TObject;
    const defaults: Record<string, unknown> = {};

    for (const [key, propertySchema] of Object.entries(objectSchema.properties)) {
      const defaultValue = getNestedDefaults(propertySchema as TSchema, mode);

      // Only include properties that have explicit defaults
      if (defaultValue !== undefined) {
        defaults[key] = defaultValue;
      }
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return defaults as any;
  }

  // Handle array schemas
  if (schema.type === "array" && "items" in schema) {
    const arraySchema = schema as TArray;

    if (mode && typeof arraySchema[`default:${mode}`] !== "undefined") {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      return arraySchema[`default:${mode}`] as any;
    }

    // If the array itself has an explicit default, return it
    if (arraySchema.default) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      return arraySchema.default as any;
    }

    // Otherwise return empty array
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return [] as any;
  }

  throw new Error("Schema must be either TObject or TArray");
}

// Helper function for nested schema processing
function getNestedDefaults(schema: TSchema, mode?: "mobile" | "desktop"): unknown {
  if (mode && typeof schema[`default:${mode}`] !== "undefined") {
    return schema[`default:${mode}`];
  }
  // Handle schemas with explicit default values
  if ("default" in schema && schema.default !== undefined) {
    return schema.default;
  }

  // Handle nested object schemas
  if (schema.type === "object" && "properties" in schema) {
    const objectSchema = schema as TObject;
    const defaults: Record<string, unknown> = {};

    for (const [key, propertySchema] of Object.entries(objectSchema.properties)) {
      const defaultValue = getNestedDefaults(propertySchema as TSchema, mode);

      // Only include properties that have explicit defaults
      if (defaultValue !== undefined) {
        defaults[key] = defaultValue;
      }
    }

    return Object.keys(defaults).length > 0 ? defaults : undefined;
  }

  // Handle nested array schemas
  if (schema.type === "array" && "items" in schema) {
    // Arrays only contribute defaults if explicitly set
    return undefined;
  }

  // No implicit defaults for any type
  return undefined;
}

export type FieldFilter<
  T extends TSchema = TSchema,
  P extends Record<string, unknown> = Record<string, unknown>,
> = (propsSchema: T, formData: P, pageAttributes: PageAttributes) => boolean;

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
