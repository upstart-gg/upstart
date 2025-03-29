/**
 * Helper functions for defining and working with props and groups of props
 */
import { type TProperties, Type, type TSchema, type TObject } from "@sinclair/typebox";
import { commonProps } from "./common";
import type { PartialBy, Prop, PropGroup, GroupMetadata } from "./types";
import { get } from "lodash-es";

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

export function prop<T extends TSchema>({ title, schema, description, $id }: Prop<T>): T {
  // add the title
  schema.title = title;
  // add the description
  if (description) {
    schema.description = description;
  }
  // add the id
  if ($id) {
    schema.$id = $id;
  }
  return schema;
}

// Functions to extract metadata from schemas
export function getGroupInfo(schema: TSchema) {
  const meta = schema.metadata as GroupMetadata;
  return {
    title: (schema.title ?? schema.metadata?.title) as string | undefined,
    meta,
    tab: meta.groupTab || "common",
  };
}

export function defineProps<P extends TProperties>(props: P) {
  const finalProps = { ...commonProps, ...props };
  return Type.Object(finalProps);
}

export const optional = Type.Optional;
export const array = Type.Array;

export type PropertyPath = string;
export type StyleId = string;

// Helper function to traverse a schema and filter to get style properties
// (properties whose $id starts with "#styles:") and return them as an object with the path to the property
// as the key and the $id as the value. Paths should be dot-separated.
// The initial schema is a TObject, but nested schemas can be any type and arrays.
export function getStyleProperties(schema: TSchema, path = "", styles: Record<PropertyPath, StyleId> = {}) {
  if (schema.type === "object") {
    for (const key in schema.properties) {
      const prop = schema.properties[key];
      if (prop.$id?.startsWith("#styles:")) {
        styles[`${path}${key}`] = prop.$id;
      }
      getStyleProperties(prop, `${path}${key}.`, styles);
    }
  } else if (schema.type === "array") {
    getStyleProperties(schema.items, `${path}[].`, styles);
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
