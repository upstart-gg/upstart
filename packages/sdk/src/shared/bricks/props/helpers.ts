/**
 * Helper functions for defining and working with props and groups of props
 */
import { type TProperties, Type, type TSchema, type TObject } from "@sinclair/typebox";
import { commonProps } from "./common";

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Export the TSchema type for use in other files
export type { TSchema };

export type FieldMetadata = {
  "ui:field"?: string;
  [key: string]: string | number | boolean | undefined;
};

export interface PropSchema extends TSchema {
  title: string;
}

export type Prop<T = TSchema> = {
  title: string;
  $id?: string;
  description?: string;
  schema: T;
};

export type PropGroup<T extends TProperties = TProperties> = {
  title: string;
  tab: "common" | "preset";
  children: T;
};

// UI metadata that we want to associate with schemas - only for group-related info
export type UIMetadata = {
  group?: string;
  groupTab?: string;
};

function groupTitleToId(title: string) {
  return title.toLowerCase().replace(/\s/g, "_");
}

export function group<T extends TProperties>({
  title,
  children,
  tab = "common",
}: PartialBy<PropGroup<T>, "tab">): TObject<T> {
  // Create the TypeBox schema with title as a standard property
  // and group-specific info in metadata
  return Type.Object(children, {
    title,
    metadata: {
      group: groupTitleToId(title),
      groupTab: tab,
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
