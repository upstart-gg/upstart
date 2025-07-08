import { type SchemaOptions, type Static, Type } from "@sinclair/typebox";
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
    "ui:advanced": true,
  });
}

export type ColorSettings = Static<ReturnType<typeof color>>;

export function colorRef(options: SchemaOptions = {}) {
  return typedRef("styles:color", { ...options, "ui:styleId": "styles:color" });
}
