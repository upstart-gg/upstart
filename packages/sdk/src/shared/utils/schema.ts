import { type TArray, type TObject, type TSchema, Kind } from "@sinclair/typebox";
import type { PageAttributes } from "../attributes";
import { ajv } from "../ajv";

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

/**
 * Resolves a JSON schema by following $ref references recursively.
 * Handles nested objects, arrays, and complex schema structures.
 */
export function resolveSchema<T extends TSchema = TSchema>(schema: T): T {
  return resolveSchemaRecursive(schema, new Set()) as T;
}

/**
 * Internal recursive function with circular reference detection
 */
function resolveSchemaRecursive(schema: TSchema, visited: Set<string>): TSchema {
  // Handle primitive types and null
  if (!schema || typeof schema !== "object") {
    return schema;
  }

  // Handle $ref resolution
  if ("$ref" in schema && typeof schema.$ref === "string") {
    // Prevent infinite recursion with circular references
    if (visited.has(schema.$ref) || schema[Kind] === "This") {
      console.warn(`Circular reference detected: ${schema.$ref}`);
      return schema; // Return original schema to avoid infinite loop
    }

    const resolved = ajv.getSchema(schema.$ref)?.schema as TSchema;
    if (!resolved) {
      console.error("Schema not found for reference:", schema);
      return schema;
    }

    // Add to visited set and recursively resolve the referenced schema
    visited.add(schema.$ref);
    const { $ref, ...rest } = schema;
    const resolvedSchema = {
      ...resolveSchemaRecursive(resolved, visited),
      ...rest,
    };
    visited.delete(schema.$ref); // Remove from visited after processing

    return resolvedSchema as TSchema;
  }

  // Handle object schemas
  if ("type" in schema && schema.type === "object" && "properties" in schema) {
    const resolvedProperties: Record<string, TSchema> = {};

    if (schema.properties && typeof schema.properties === "object") {
      for (const [key, value] of Object.entries(schema.properties)) {
        if (value && typeof value === "object") {
          resolvedProperties[key] = resolveSchemaRecursive(value as TSchema, visited);
        } else {
          resolvedProperties[key] = value as TSchema;
        }
      }
    }

    const resolvedSchema = { ...schema };
    if (Object.keys(resolvedProperties).length > 0) {
      resolvedSchema.properties = resolvedProperties;
    }

    // Handle additionalProperties
    if (
      "additionalProperties" in schema &&
      schema.additionalProperties &&
      typeof schema.additionalProperties === "object" &&
      schema.additionalProperties !== true
    ) {
      resolvedSchema.additionalProperties = resolveSchemaRecursive(
        schema.additionalProperties as TSchema,
        visited,
      );
    }

    // Handle patternProperties
    if (
      "patternProperties" in schema &&
      schema.patternProperties &&
      typeof schema.patternProperties === "object"
    ) {
      const resolvedPatternProperties: Record<string, TSchema> = {};
      for (const [pattern, patternSchema] of Object.entries(schema.patternProperties)) {
        if (patternSchema && typeof patternSchema === "object") {
          resolvedPatternProperties[pattern] = resolveSchemaRecursive(patternSchema as TSchema, visited);
        } else {
          resolvedPatternProperties[pattern] = patternSchema as TSchema;
        }
      }
      resolvedSchema.patternProperties = resolvedPatternProperties;
    }

    return resolvedSchema as TSchema;
  }

  // Handle array schemas
  if ("type" in schema && schema.type === "array") {
    const resolvedSchema = { ...schema };

    if ("items" in schema && schema.items) {
      if (Array.isArray(schema.items)) {
        resolvedSchema.items = schema.items.map((item) => resolveSchemaRecursive(item as TSchema, visited));
      } else if (typeof schema.items === "object") {
        resolvedSchema.items = resolveSchemaRecursive(schema.items as TSchema, visited);
      }
    }

    // Handle additionalItems
    if (
      "additionalItems" in schema &&
      schema.additionalItems &&
      typeof schema.additionalItems === "object" &&
      schema.additionalItems !== true
    ) {
      resolvedSchema.additionalItems = resolveSchemaRecursive(schema.additionalItems as TSchema, visited);
    }

    return resolvedSchema as TSchema;
  }

  // Handle union schemas (anyOf)
  if ("anyOf" in schema && Array.isArray(schema.anyOf)) {
    const resolvedAnyOf = schema.anyOf.map((subSchema) => {
      return resolveSchemaRecursive(subSchema as TSchema, visited);
    });

    return { ...schema, anyOf: resolvedAnyOf } as TSchema;
  }

  // Handle union schemas (oneOf)
  if ("oneOf" in schema && Array.isArray(schema.oneOf)) {
    const resolvedOneOf = schema.oneOf.map((subSchema) =>
      resolveSchemaRecursive(subSchema as TSchema, visited),
    );

    return { ...schema, oneOf: resolvedOneOf } as TSchema;
  }

  // Handle intersection schemas (allOf)
  if ("allOf" in schema && Array.isArray(schema.allOf)) {
    const resolvedAllOf = schema.allOf.map((subSchema) =>
      resolveSchemaRecursive(subSchema as TSchema, visited),
    );

    return { ...schema, allOf: resolvedAllOf } as TSchema;
  }

  // Handle not schemas
  if ("not" in schema && schema.not && typeof schema.not === "object") {
    const resolvedNot = resolveSchemaRecursive(schema.not as TSchema, visited);

    return { ...schema, not: resolvedNot } as TSchema;
  }

  // Handle conditional schemas (if/then/else)
  if ("if" in schema || "then" in schema || "else" in schema) {
    const resolvedSchema = { ...schema };

    if ("if" in schema && schema.if && typeof schema.if === "object") {
      resolvedSchema.if = resolveSchemaRecursive(schema.if as TSchema, visited);
    }

    if ("then" in schema && schema.then && typeof schema.then === "object") {
      // biome-ignore lint/suspicious/noThenProperty: <explanation>
      resolvedSchema.then = resolveSchemaRecursive(schema.then as TSchema, visited);
    }

    if ("else" in schema && schema.else && typeof schema.else === "object") {
      resolvedSchema.else = resolveSchemaRecursive(schema.else as TSchema, visited);
    }

    return resolvedSchema as TSchema;
  }

  // Handle schemas with definitions
  if ("definitions" in schema || "$defs" in schema) {
    const resolvedSchema = { ...schema };

    if ("definitions" in schema && schema.definitions && typeof schema.definitions === "object") {
      const resolvedDefinitions: Record<string, TSchema> = {};
      for (const [key, def] of Object.entries(schema.definitions)) {
        if (def && typeof def === "object") {
          resolvedDefinitions[key] = resolveSchemaRecursive(def as TSchema, visited);
        } else {
          resolvedDefinitions[key] = def as TSchema;
        }
      }
      resolvedSchema.definitions = resolvedDefinitions;
    }

    if ("$defs" in schema && schema.$defs && typeof schema.$defs === "object") {
      const resolved$Defs: Record<string, TSchema> = {};
      for (const [key, def] of Object.entries(schema.$defs)) {
        if (def && typeof def === "object") {
          resolved$Defs[key] = resolveSchemaRecursive(def as TSchema, visited);
        } else {
          resolved$Defs[key] = def as TSchema;
        }
      }
      resolvedSchema.$defs = resolved$Defs;
    }

    return resolvedSchema as TSchema;
  }

  // Handle any other schema types that might contain nested schemas
  const resolvedSchema = { ...schema };

  for (const [key, value] of Object.entries(schema)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      // Check if this looks like a schema object
      if ("type" in value || "$ref" in value || "properties" in value || "items" in value) {
        (resolvedSchema as Record<string, unknown>)[key] = resolveSchemaRecursive(value as TSchema, visited);
      }
    } else if (Array.isArray(value)) {
      // Check if array contains schemas
      const hasSchemas = value.some(
        (item) =>
          item &&
          typeof item === "object" &&
          ("type" in item || "$ref" in item || "properties" in item || "items" in item),
      );

      if (hasSchemas) {
        (resolvedSchema as Record<string, unknown>)[key] = value.map((item) =>
          item && typeof item === "object" ? resolveSchemaRecursive(item as TSchema, visited) : item,
        );
      }
    }
  }

  return resolvedSchema as TSchema;
}
