/**
 * Helper functions for defining and working with props and groups of props
 */
import { type TProperties, Type, type TSchema, type TObject, type ObjectOptions } from "@sinclair/typebox";
import { commonProps } from "./common";
import type { PartialBy, Prop, PropGroup, GroupMetadata } from "./types";
import { get } from "lodash-es";
import { presetRef } from "./preset";

// Local version of resolveSchema to avoid circular dependency with ajv
function resolveSchemaLocal(schema: TSchema): TSchema {
  // For now, just return the schema as-is if it has no $ref
  // This breaks the circular dependency while maintaining functionality
  if (!schema.$ref) {
    return schema;
  }
  // If we have a $ref, we'll handle it later when ajv is available
  // For props definition, we don't usually need to resolve refs immediately
  return schema;
}

function isTObject(schema: TSchema | TProperties): schema is TObject {
  return schema.type === "object";
}

export function group<T extends TProperties>({
  title,
  children,
  category = "settings",
  metadata,
  options,
}: PartialBy<PropGroup<T>, "category">) {
  // check if children is already a TObject
  if (isTObject(children)) {
    const generated = Type.Composite([Type.Object({}), children], {
      title,
      metadata: {
        category,
        group: true,
        ...metadata,
      },
      ...options,
    });
    return generated;
  }

  // Create the TypeBox schema with title as a standard property and group-specific info in metadata
  return Type.Object(children, {
    title,
    ...options,
    metadata: {
      category,
      group: true,
      ...metadata,
    },
  });
}

// Re-export prop function from ./prop for backward compatibility
export { prop } from "./prop";

// Functions to extract metadata from schemas
export function getGroupInfo(schema: TSchema) {
  const meta = schema.metadata as GroupMetadata;
  return {
    title: (schema.title ?? schema.metadata?.title) as string | undefined,
    meta,
    tab: meta.groupTab || "common",
  };
}

export function defineProps<P extends TProperties>(
  props: P,
  options?: ObjectOptions & { noPreset?: boolean; noAlignSelf?: boolean; defaultPreset?: string },
) {
  const finalProps = { ...commonProps, ...props };
  if (options?.noPreset) {
    // If noPreset is true, we don't add the preset property
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // biome-ignore lint/performance/noDelete: <explanation>
    delete (finalProps as any).preset;
  }
  if (options?.defaultPreset) {
    // If defaultPreset is provided, we set it as the default value for the preset property
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (finalProps as any).preset = Type.Optional(presetRef({ default: options.defaultPreset }));
  }
  if (options?.noAlignSelf) {
    // If noPreset is true, we don't add the preset property
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // biome-ignore lint/performance/noDelete: <explanation>
    delete (finalProps as any).alignSelf;
  }
  return Type.Object(finalProps, options);
}

export const optional = Type.Optional;
export const array = Type.Array;

export type PropertyPath = string;
export type StyleId = string;

// Helper function to traverse a schema and filter to get style properties
// (properties whose "ui:styleId" starts with "styles:") and return them as an object with the path to the property
// as the key and the $id as the value. Paths should be dot-separated.
// The initial schema is a TObject, but nested schemas can be any type and arrays.
export function getStyleProperties(schema: TSchema, path = "", styles: Record<PropertyPath, StyleId> = {}) {
  const resolvedSchema = resolveSchemaLocal(schema);
  if (resolvedSchema.type === "object") {
    for (const key in resolvedSchema.properties) {
      const prop = resolvedSchema.properties[key];
      if (prop["ui:styleId"]) {
        styles[`${path}${key}`] = prop["ui:styleId"];
      }
      getStyleProperties(prop, `${path}${key}.`, styles);
    }
  } else if (resolvedSchema.type === "array") {
    getStyleProperties(resolvedSchema.items, `${path}[].`, styles);
  }
  return styles;
}

export function getStyleValueById<T>(
  stylePos: ReturnType<typeof getStyleProperties>,
  formData: Record<string, unknown>,
  id: string,
) {
  for (const [stylePath, styleId] of Object.entries(stylePos)) {
    if (styleId === id) {
      return get(formData, stylePath) as T;
    }
  }
}
