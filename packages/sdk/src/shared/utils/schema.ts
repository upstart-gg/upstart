import type { TArray, TObject, TSchema, Static } from "@sinclair/typebox";
import type { PageAttributes } from "../site/attributes";
import { defaultsDeep as applyDefaultsDeep } from "lodash-es";
import { FormatRegistry } from "@sinclair/typebox";
import { Validator } from "@cfworker/json-schema";
// export const jsonStringsSupportedFormats = ["date-time", "date", "email", "url"] as const;

// import string enum for its side effects
import "./string-enum";

const urlValidator = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const noCheck = (value: string) => true;

FormatRegistry.Set("uuid", (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value),
);
// Allow different lengths for nanoid
FormatRegistry.Set("nanoid", (value) => /^[A-Za-z0-9_-]{7,32}$/.test(value));
FormatRegistry.Set("slug", (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value));
// Simple format checks for richtext, markdown, multiline, password, image, file
FormatRegistry.Set("richtext", noCheck);
FormatRegistry.Set("markdown", noCheck);
FormatRegistry.Set("multiline", noCheck);
FormatRegistry.Set("password", noCheck);
FormatRegistry.Set("image", urlValidator);
FormatRegistry.Set("file", urlValidator);

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
): Static<T> {
  // Handle object schemas
  if (schema.type === "object" && "properties" in schema) {
    const objectSchema = schema as TObject;

    // First pass: collect all properties that have defaults
    const propertiesWithDefaults: Record<string, unknown> = {};
    for (const [key, propertySchema] of Object.entries(objectSchema.properties)) {
      const defaultValue = getNestedDefaults(propertySchema as TSchema, mode);
      if (defaultValue !== undefined) {
        propertiesWithDefaults[key] = defaultValue;
      }
    }

    // If we get here, all required properties have defaults, so we can include all properties
    return propertiesWithDefaults as Static<T>;
  }

  // Handle array schemas
  if (schema.type === "array" && "items" in schema) {
    const arraySchema = schema as TArray;

    if (mode && typeof arraySchema[`default:${mode}`] !== "undefined") {
      return arraySchema[`default:${mode}`];
    }

    // If the array itself has an explicit default, return it
    if (arraySchema.default) {
      return arraySchema.default;
    }

    // Otherwise return empty array
    return [];
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
    const required = objectSchema.required || [];

    // First pass: collect all properties that have defaults
    const propertiesWithDefaults: Record<string, unknown> = {};
    for (const [key, propertySchema] of Object.entries(objectSchema.properties)) {
      const defaultValue = getNestedDefaults(propertySchema as TSchema, mode);
      if (defaultValue !== undefined) {
        propertiesWithDefaults[key] = defaultValue;
      }
    }

    // Second pass: validate that all required properties have defaults
    // If any required property lacks a default, this nested object cannot be included
    for (const requiredProp of required) {
      if (!(requiredProp in propertiesWithDefaults)) {
        return undefined;
      }
    }

    // If we get here, all required properties have defaults
    return Object.keys(propertiesWithDefaults).length > 0 ? propertiesWithDefaults : undefined;
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

export function validate<T extends TSchema>(schema: TSchema, data: unknown): Static<T> {
  const validator = new Validator(schema, "7", false);
  const result = validator.validate(data);
  if (!result.valid) {
    const errors = [];
    for (const error of result.errors) {
      errors.push(`${error.error} (at ${error.keywordLocation})`);
    }
    const formatedError = `- ${errors.join("\n- ")}`;
    throw new Error(formatedError);
  }

  // Mutate data with defaults
  const defaults = getSchemaDefaults(schema as TObject | TArray);
  const finalObject = Array.isArray(data) ? data : applyDefaultsDeep({}, data, defaults);

  return finalObject as Static<T>;
}
