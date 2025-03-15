/**
 * Helper functions for defining and working with props and groups of props
 */
import { type TProperties, Type, type TSchema, type TObject } from "@sinclair/typebox";
import { commonProps } from "./common";
import type { PartialBy, Prop, PropGroup, UIMetadata } from "./types";

export function group<T extends TProperties>({
  title,
  children,
  category = "settings",
}: PartialBy<PropGroup<T>, "category">): TObject<T> {
  // Create the TypeBox schema with title as a standard property
  // and group-specific info in metadata
  return Type.Object(children, {
    title,
    metadata: {
      // group: groupTitleToId(title),
      category,
      group: true,
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
  const meta = schema.metadata as UIMetadata;
  return {
    title: (schema.title ?? schema.metadata?.title) as string | undefined,
    meta,
    tab: meta.groupTab || "common",
  };
}

export function defineProps<P extends TProperties>(props: P) {
  return Type.Object({ ...commonProps, ...props });
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
