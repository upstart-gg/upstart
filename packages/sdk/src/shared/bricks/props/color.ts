import { type SchemaOptions, type Static, type StringOptions, type TObject, Type } from "@sinclair/typebox";
import { typedRef } from "~/shared/utils/typed-ref";

export function color(defaultValue?: string, title = "Text color") {
  return Type.String({
    title,
    $id: "styles:color",
    "ai:instructions":
      "hex/rgb/rgba color or classes like `text-<variant>-<shade>`, variants being `primary`, `secondary`, `accent` and `neutral`, and shades between 50 and 900",
    default: defaultValue,
    "ui:styleId": "styles:color",
    "ui:field": "color",
    "ui:color-type": "text",
  });
}

export type ColorSettings = Static<ReturnType<typeof color>>;

export function colorRef(options: SchemaOptions = {}) {
  return typedRef("styles:color", { ...options, "ui:styleId": "styles:color" });
}

export function borderColor(defaultValue?: string, title = "Border color") {
  return Type.String({
    title,
    $id: "styles:borderColor",
    "ai:instructions":
      "hex/rgb/rgba color or classes like `border-<variant>-<shade>`, variants being `primary`, `secondary`, `accent` and `neutral`, and shades between 50 and 900",
    default: defaultValue,
    "ui:styleId": "styles:borderColor",
    "ui:field": "color",
    "ui:color-type": "border",
  });
}

export type BorderColorSettings = Static<ReturnType<typeof borderColor>>;

export function borderColorRef(options: SchemaOptions = {}) {
  return typedRef("styles:borderColor", { ...options, "ui:styleId": "styles:borderColor" });
}
