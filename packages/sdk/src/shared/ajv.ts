import Ajv, { type ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import { alignItems, justifyContent } from "./bricks/props/align";
import { basicGap } from "./bricks/props/gap";
import { background, backgroundColor } from "./bricks/props/background";
import { border, rounding } from "./bricks/props/border";
import { color, gradientDirection } from "./bricks/props/color";
import { hidden } from "./bricks/props/common";
import { cssLength } from "./bricks/props/css-length";
import { shadow, textShadow } from "./bricks/props/effects";
import { fontSize, textContent } from "./bricks/props/text";
import { icon, urlOrPageId } from "./bricks/props/string";
import { padding } from "./bricks/props/padding";
import { colorPreset } from "./bricks/props/preset";
import { image } from "./bricks/props/image";
import { direction } from "./bricks/props/direction";

export type { AnySchemaObject, JSONSchemaType, JSONType, SchemaObject } from "ajv";

export const ajv = new Ajv({
  useDefaults: true,
  strictSchema: false,
  validateSchema: false,
  coerceTypes: true,
  allErrors: true,
  inlineRefs: false,
});

ajv.addSchema(background(), "styles:background");
ajv.addSchema(backgroundColor(), "styles:backgroundColor");
ajv.addSchema(justifyContent(), "styles:justifyContent");
ajv.addSchema(alignItems(), "styles:alignItems");
ajv.addSchema(basicGap(), "styles:basicGap");
ajv.addSchema(rounding(), "styles:rounding");
ajv.addSchema(fontSize(), "styles:fontSize");
ajv.addSchema(hidden(), "styles:hidden");
ajv.addSchema(direction(), "styles:direction");
ajv.addSchema(gradientDirection(), "styles:gradientDirection");
ajv.addSchema(border(), "styles:border");
ajv.addSchema(padding(), "styles:padding");
ajv.addSchema(color(), "styles:color");
ajv.addSchema(shadow(), "styles:shadow");
ajv.addSchema(textShadow(), "styles:textShadow");
ajv.addSchema(cssLength(), "styles:cssLength");
ajv.addSchema(image(), "assets:image");
ajv.addSchema(icon(), "assets:icon");
ajv.addSchema(textContent(), "content:textContent");
ajv.addSchema(urlOrPageId(), "content:urlOrPageId");
ajv.addSchema(colorPreset(), "presets:color");

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
