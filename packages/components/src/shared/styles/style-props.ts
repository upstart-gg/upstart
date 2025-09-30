// Helper function to traverse a schema and filter to get style properties
// (properties whose "ui:styleId" starts with "styles:") and return them as an object with the path to the property
// as the key and the $id as the value. Paths should be dot-separated.
import type { TSchema } from "@sinclair/typebox";
import get from "lodash-es/get";

export type PropertyPath = string;
export type StyleId = string;

// The initial schema is a TObject, but nested schemas can be any type and arrays.
export function getStyleProperties(schema: TSchema, path = "", styles: Record<PropertyPath, StyleId> = {}) {
  if (schema.type === "object") {
    for (const key in schema.properties) {
      const prop = schema.properties[key];
      // const prop = schema.properties[key];
      if (prop["ui:styleId"]) {
        styles[`${path}${key}`] = prop["ui:styleId"];
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
