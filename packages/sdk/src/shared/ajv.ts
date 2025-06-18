import Ajv, { type ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import { preset } from "./bricks/props/preset";
import { background, backgroundColor } from "./bricks/props/background";
import { containerLayout } from "./bricks/props/container";
import { basicAlign } from "./bricks/props/align";
import { hidden } from "./bricks/props/common";
import { border } from "./bricks/props/border";
import { padding } from "./bricks/props/padding";
import { image } from "./bricks/props/image";
import { color } from "./bricks/props/color";
import { shadow } from "./bricks/props/effects";
import { textContent } from "./bricks/props/text";
import { cssLength } from "./bricks/props/css-length";
import { urlOrPageId } from "./bricks/props/string";
import type { TSchema } from "@sinclair/typebox";

export type { JSONSchemaType, AnySchemaObject, SchemaObject, JSONType } from "ajv";

export const ajv = new Ajv({
  useDefaults: true,
  strictSchema: false,
  validateSchema: false,
  coerceTypes: true,
  allErrors: true,
  inlineRefs: false,
});

ajv.addSchema(preset(), "styles:preset");
ajv.addSchema(background(), "styles:background");
ajv.addSchema(backgroundColor(), "styles:backgroundColor");
ajv.addSchema(basicAlign(), "styles:basicAlign");
ajv.addSchema(containerLayout(), "styles:containerLayout");
ajv.addSchema(hidden(), "styles:hidden");
ajv.addSchema(border(), "styles:border");
ajv.addSchema(padding(), "styles:padding");
ajv.addSchema(color(), "styles:color");
ajv.addSchema(shadow(), "styles:shadow");
ajv.addSchema(cssLength(), "styles:cssLength");
ajv.addSchema(image(), "assets:image");
ajv.addSchema(textContent(), "content:textContent");
ajv.addSchema(urlOrPageId(), "content:urlOrPageId");

export const jsonStringsSupportedFormats = [
  "date-time",
  "time",
  "date",
  "email",
  "hostname",
  "ipv4",
  "ipv6",
  "uri",
  "uri-reference",
  "uuid",
  "uri-template",
  "json-pointer",
  "relative-json-pointer",
  "regex",
] as const;

// Add formats to Ajv
addFormats(ajv, [...jsonStringsSupportedFormats]);

ajv.addFormat("date-object", {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  validate: (data: any) => data instanceof Date && !Number.isNaN(data.getTime()),
  async: false,
});

ajv.addFormat("richtext", {
  validate: (data: string) => typeof data === "string",
  async: false,
});

ajv.addFormat("markdown", {
  validate: (data: string) => typeof data === "string",
  async: false,
});

ajv.addFormat("multiline", {
  validate: (data: string) => typeof data === "string",
  async: false,
});

ajv.addFormat("password", {
  validate: (data: string) => typeof data === "string",
  async: false,
});

export function resolveSchema(schema: TSchema) {
  const resolved = schema.$ref ? ajv.getSchema(schema.$ref!)?.schema : schema;
  if (!resolved) {
    throw new Error(`Schema not found for reference: ${schema.$ref}`);
  }
  if (typeof resolved === "object" && schema.title) {
    return {
      ...(resolved as object),
      title: schema.title,
    } as TSchema;
  }
  return resolved as TSchema;
}

export function serializeAjvErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors || errors.length === 0) {
    return "Unknown validation error";
  }
  return errors
    .map((error) => {
      const { instancePath, message, params } = error;
      const path = instancePath || "root";
      const details = Object.entries(params || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      return `${path} ${message} (${details})`;
    })
    .join("; ");
}
