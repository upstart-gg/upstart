import { Type, type StringOptions } from "@sinclair/typebox";
import { prop } from "./helpers";
import type { jsonStringsSupportedFormats } from "../../ajv";
import type { FieldMetadata } from "./types";

type StrFieldOptions = StringOptions &
  FieldMetadata & {
    format?: (typeof jsonStringsSupportedFormats)[number];
  };

export function string(title: string, defaultValue?: string, options: Omit<StrFieldOptions, "default"> = {}) {
  return prop({
    title,
    schema: Type.String({ default: defaultValue, ...options }),
  });
}

const urlSchema = Type.String({
  format: "uri",
  "ui:field": "url",
});

const pageIdSchema = Type.String({
  "ui:field": "page-id",
});

export function url(title = "URL") {
  return prop({
    title,
    schema: urlSchema,
  });
}

export function urlOrPageId(title = "URL or Page ID") {
  return prop({
    title,
    schema: Type.Union([urlSchema, pageIdSchema], { title: "URL or Page ID" }),
  });
}
