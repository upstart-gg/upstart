import { Type, type StringOptions } from "@sinclair/typebox";
import { type FieldMetadata, prop } from "./helpers";
import type { jsonStringsSupportedFormats } from "../../ajv";

type StrFieldOptions = StringOptions &
  FieldMetadata & {
    format?: (typeof jsonStringsSupportedFormats)[number];
  };

export function propString(
  id: string,
  title: string,
  defaultValue?: string,
  options: Omit<StrFieldOptions, "default"> = {},
) {
  return prop({
    id,
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

export function propUrl(id: string, title = "URL") {
  return prop({
    id,
    title,
    schema: urlSchema,
  });
}

export function propUrlOrPageId(id: string, title = "URL or Page ID") {
  return prop({
    id,
    title,
    schema: Type.Union([urlSchema, pageIdSchema], { title: "URL or Page ID" }),
  });
}
