import type { TArray, TObject, TSchema } from "@sinclair/typebox";
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
    if (visited.has(schema.$ref)) {
      console.warn(`Circular reference detected: ${schema.$ref}`);
      return schema; // Return original schema to avoid infinite loop
    }

    const resolved = ajv.getSchema(schema.$ref)?.schema as TSchema;
    if (!resolved) {
      throw new Error(`Schema not found for reference: ${schema.$ref}`);
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
    const resolvedAnyOf = schema.anyOf.map((subSchema) =>
      resolveSchemaRecursive(subSchema as TSchema, visited),
    );

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

/**
 * Clean all properties from custom metadata recursively. Custom metadata are key that:
 * - Either with the name "metadata"
 * - Or starting with "ui:"
 * Also removes properties that have "ai:hidden" set to true
 */
export function toLLMSchema<T extends TSchema>(schema: T): T {
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
        const refId = value.startsWith("#/") ? value : value;
        if (!refId.startsWith("#/")) {
          collectedRefs.add(refId);
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
