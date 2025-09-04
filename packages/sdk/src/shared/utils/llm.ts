import type { TSchema } from "@sinclair/typebox";
import { ajv } from "../ajv";
import { resolveSchema } from "./schema";

/**
 * Clean all properties from custom metadata recursively. Custom metadata are key that:
 * - Either with the name "metadata"
 * - Or starting with "ui:"
 * Also removes properties that have "ai:hidden" set to true
 */
export function toLLMSchema<T extends TSchema>(schema: T): T {
  //
  // const compiledSchema = ajv.getSchema(schema.$id as string);
  // if (!compiledSchema) {
  //   throw new Error(`toLLMSchema Error: Schema not found ${schema.$id}`);
  // }
  // return cleanSchemaRecursive(resolveSchema(schema)) as T;
  return cleanSchemaRecursive(inlineSchemaRefs(schema)) as T;
}

/**
 * Recursively removes custom metadata from schema and filters out properties with ai:hidden = true
 */
function cleanSchemaRecursive(schema: TSchema): TSchema {
  // Create a new object without custom metadata properties
  const cleaned: Record<string, unknown> = {};

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

interface SchemaWithDefs extends TSchema {
  $defs?: Record<string, TSchema>;
}

/**
 * Inlines referenced schemas from AJV into the schema's $defs section
 * @param schema - The schema containing $ref references
 * @param ajv - The AJV instance containing the referenced schemas
 * @returns A new schema with references inlined in $defs
 */
export function inlineSchemaRefs<T extends TSchema>(schema: T): T {
  const inlinedSchema = JSON.parse(JSON.stringify(schema)) as T & SchemaWithDefs;
  const collectedRefs = new Set<string>();

  // Initialize $defs if it doesn't exist
  if (!inlinedSchema.$defs) {
    inlinedSchema.$defs = {};
  }

  /**
   * Recursively traverse the schema to find all $ref references
   */
  function collectRefs(obj: unknown): void {
    if (typeof obj !== "object" || obj === null) return;

    if (Array.isArray(obj)) {
      obj.forEach(collectRefs);
      return;
    }

    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (key === "$ref" && typeof value === "string") {
        // Extract the schema ID from the reference
        if (!value.startsWith("#/")) {
          //   console.log("Collected ref:", value, "for object", obj);
          collectedRefs.add(value);
        }
      } else {
        collectRefs(value);
      }
    }
  }

  /**
   * Convert external $ref to local $defs reference
   */
  function convertRefsToLocal(obj: unknown, refMap: Map<string, string>): unknown {
    if (typeof obj !== "object" || obj === null) return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => convertRefsToLocal(item, refMap));
    }

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (key === "$ref" && typeof value === "string") {
        const localRef = refMap.get(value);
        result[key] = localRef || value;
      } else {
        result[key] = convertRefsToLocal(value, refMap);
      }
    }
    return result;
  }

  // Collect all references in the schema
  collectRefs(inlinedSchema);

  // Map to track original ref -> local def reference
  const refToLocalMap = new Map<string, string>();

  // Process each collected reference
  for (const refId of collectedRefs) {
    // Get the schema from AJV
    const referencedSchema = ajv.getSchema(refId);

    if (!referencedSchema?.schema) {
      console.warn(`Schema with ID "${refId}" not found in AJV instance`);
      continue;
    }

    // Create a safe key for $defs (remove special characters, use last part of URI)
    const defKey =
      refId.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/^_+|_+$/g, "") ||
      refId
        .split("/")
        .pop()
        ?.replace(/[^a-zA-Z0-9_-]/g, "_") ||
      `ref_${Object.keys(inlinedSchema.$defs!).length}`;

    // Ensure unique key
    let uniqueDefKey = defKey;
    let counter = 1;
    while (inlinedSchema.$defs![uniqueDefKey]) {
      uniqueDefKey = `${defKey}_${counter}`;
      counter++;
    }

    // Add to $defs
    const { $id, ...schemaWithoutId } = referencedSchema.schema as TSchema;
    inlinedSchema.$defs![uniqueDefKey] = schemaWithoutId;

    // Map original reference to local reference
    refToLocalMap.set(refId, `#/$defs/${uniqueDefKey}`);
  }

  // Convert all external references to local $defs references
  const finalSchema = convertRefsToLocal(inlinedSchema, refToLocalMap) as T & SchemaWithDefs;

  // Recursively inline references in the newly added $defs schemas
  if (finalSchema.$defs) {
    // Keep processing until no new references are found
    let foundNewRefs = true;
    while (foundNewRefs) {
      foundNewRefs = false;
      const newRefsFound = new Set<string>();

      // Check each $defs schema for new references
      for (const [defKey, defSchema] of Object.entries(finalSchema.$defs)) {
        const defCollectedRefs = new Set<string>();

        // Collect refs specifically for this schema
        function collectDefsRefs(obj: unknown): void {
          if (typeof obj !== "object" || obj === null) return;

          if (Array.isArray(obj)) {
            obj.forEach(collectDefsRefs);
            return;
          }

          for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
            if (key === "$ref" && typeof value === "string") {
              const refId = value.startsWith("#/") ? value : value;
              if (!refId.startsWith("#/")) {
                defCollectedRefs.add(refId);
              }
            } else {
              collectDefsRefs(value);
            }
          }
        }

        collectDefsRefs(defSchema);

        // Process any new references found in this $defs schema
        for (const refId of defCollectedRefs) {
          if (!refToLocalMap.has(refId)) {
            newRefsFound.add(refId);
            foundNewRefs = true;
          }
        }
      }

      // Add all newly found references to $defs
      for (const refId of newRefsFound) {
        const referencedSchema = ajv.getSchema(refId);
        if (referencedSchema?.schema) {
          const newDefKey =
            refId.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/^_+|_+$/g, "") ||
            `ref_${Object.keys(finalSchema.$defs).length}`;

          let uniqueNewDefKey = newDefKey;
          let counter = 1;
          while (finalSchema.$defs[uniqueNewDefKey]) {
            uniqueNewDefKey = `${newDefKey}_${counter}`;
            counter++;
          }

          finalSchema.$defs[uniqueNewDefKey] = referencedSchema.schema as TSchema;
          refToLocalMap.set(refId, `#/$defs/${uniqueNewDefKey}`);
        }
      }
    }

    // Finally, update all $defs schemas with converted references
    for (const [defKey, defSchema] of Object.entries(finalSchema.$defs)) {
      finalSchema.$defs[defKey] = convertRefsToLocal(defSchema, refToLocalMap) as TSchema;
    }
  }

  return finalSchema as T & { $defs: Record<string, TSchema> };
}
