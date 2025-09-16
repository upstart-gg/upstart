import Ajv, { type ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import { alignItems, alignSelf, justifyContent } from "./bricks/props/align";
import { background, backgroundColor } from "./bricks/props/background";
import { border, rounding } from "./bricks/props/border";
import { borderColor, color } from "./bricks/props/color";
import { hidden } from "./bricks/props/common";
import { cssLength } from "./bricks/props/css-length";
import { shadow, textShadow } from "./bricks/props/effects";
import { fontSize, textContent } from "./bricks/props/text";
import { icon, urlOrPageId } from "./bricks/props/string";
import { colorPreset } from "./bricks/props/color-preset";
import { image } from "./bricks/props/image";
import { direction } from "./bricks/props/direction";
import { loop, queryUse } from "./bricks/props/dynamic";
import { tags } from "./bricks/props/tags";

export type { AnySchemaObject, JSONSchemaType, JSONType, SchemaObject } from "ajv";

export const ajv = new Ajv({
  useDefaults: true,
  strictSchema: false,
  validateSchema: false,
  coerceTypes: true,
  allErrors: true,
  inlineRefs: true,
});

ajv.addSchema(background(), "styles:background");
ajv.addSchema(backgroundColor(), "styles:backgroundColor");
ajv.addSchema(justifyContent(), "styles:justifyContent");
ajv.addSchema(alignItems(), "styles:alignItems");
ajv.addSchema(alignSelf(), "styles:alignSelf");
ajv.addSchema(rounding(), "styles:rounding");
ajv.addSchema(fontSize(), "styles:fontSize");
ajv.addSchema(hidden(), "styles:hidden");
ajv.addSchema(direction(), "styles:direction");
ajv.addSchema(border(), "styles:border");
ajv.addSchema(color(), "styles:color");
ajv.addSchema(borderColor(), "styles:borderColor");
ajv.addSchema(shadow(), "styles:shadow");
ajv.addSchema(textShadow(), "styles:textShadow");
ajv.addSchema(cssLength(), "styles:cssLength");
ajv.addSchema(image(), "assets:image");
ajv.addSchema(icon(), "assets:icon");
ajv.addSchema(textContent(), "content:text");
ajv.addSchema(urlOrPageId(), "content:urlOrPageId");
ajv.addSchema(loop(), "content:loop");
ajv.addSchema(queryUse(), "content:queryUse");
ajv.addSchema(colorPreset(), "presets:color");
ajv.addSchema(tags(), "content:tags");

export const jsonStringsSupportedFormats = ["date-time", "date", "email", "url"] as const;

// Add formats to Ajv
addFormats(ajv, [...jsonStringsSupportedFormats]);

ajv.addFormat("slug", {
  validate: (data: string) => typeof data === "string",
  async: false,
  type: "string",
});
ajv.addFormat("image", {
  validate: (data: string) => typeof data === "string",
  async: false,
  type: "string",
});
ajv.addFormat("file", {
  validate: (data: string) => typeof data === "string",
  async: false,
  type: "string",
});

ajv.addFormat("nanoid", {
  validate: (data: string) => typeof data === "string",
  async: false,
  type: "string",
});

ajv.addFormat("richtext", {
  validate: (data: string) => typeof data === "string",
  async: false,
  type: "string",
});

ajv.addFormat("markdown", {
  validate: (data: string) => typeof data === "string",
  async: false,
  type: "string",
});

ajv.addFormat("multiline", {
  validate: (data: string) => typeof data === "string",
  async: false,
  type: "string",
});

ajv.addFormat("password", {
  validate: (data: string) => typeof data === "string",
  async: false,
  type: "string",
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
