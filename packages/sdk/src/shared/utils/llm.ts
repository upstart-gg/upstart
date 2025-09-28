import { Kind, type TObject, type TSchema } from "@sinclair/typebox";

/**
 * Clean all properties from custom metadata recursively. Custom metadata are key that:
 * - Either with the name "metadata"
 * - Or starting with "ui:"
 * Also removes properties that have "ai:hidden" set to true
 */
export function toLLMSchema<T extends TSchema = TObject>(schema: T): T {
  return cleanSchemaRecursive(schema) as T;
}

/**
 * Recursively removes custom metadata from schema and filters out properties with ai:hidden = true
 */
function cleanSchemaRecursive(schema: TSchema): TSchema {
  // Create a new object without custom metadata properties
  const cleaned: Record<string, unknown> = {
    [Kind]: schema[Kind],
  };

  for (const [key, value] of Object.entries(schema)) {
    // Skip metadata properties and ui: properties
    if (key === "metadata" || key.startsWith("ui:")) {
      continue;
    }

    // Handle nested objects and arrays
    if (value && typeof value === "object") {
      if (Array.isArray(value)) {
        // Handle arrays - clean each item if it's a schema
        cleaned[key] = value.map((item) => {
          if (item && typeof item === "object" && isSchemaLike(item)) {
            return cleanSchemaRecursive(item as TSchema);
          }
          return item;
        });
      } else if (isSchemaLike(value)) {
        // Handle nested schemas
        cleaned[key] = cleanSchemaRecursive(value as TSchema);
      } else if (
        key === "properties" ||
        key === "definitions" ||
        key === "$defs" ||
        key === "patternProperties"
      ) {
        // Handle schema property collections - filter out properties with ai:hidden = true
        const cleanedProps: Record<string, TSchema> = {};
        for (const [propKey, propValue] of Object.entries(value)) {
          if (propValue && typeof propValue === "object") {
            // Check if this property should be hidden from AI
            const propSchema = propValue as Record<string, unknown>;
            if (propSchema["ai:hidden"] === true) {
              continue; // Skip this property
            }
            cleanedProps[propKey] = cleanSchemaRecursive(propValue as TSchema);
          } else {
            cleanedProps[propKey] = propValue as TSchema;
          }
        }
        cleaned[key] = cleanedProps;
      } else {
        // For other objects, recursively clean if they look like schemas
        cleaned[key] = value;
      }
    } else {
      // Keep primitive values as-is
      cleaned[key] = value;
    }
  }

  return cleaned as TSchema;
}

/**
 * Helper function to determine if an object looks like a schema
 */
function isSchemaLike(obj: unknown): boolean {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  const schemaKeys = [
    "type",
    "$ref",
    "properties",
    "items",
    "anyOf",
    "oneOf",
    "allOf",
    "not",
    "if",
    "then",
    "else",
  ];
  return schemaKeys.some((key) => key in obj);
}
