import { type SchemaOptions, type Static, type StringOptions, type TObject, Type } from "@sinclair/typebox";
import type { BrickManifest } from "~/shared/brick-manifest";
import { StringEnum } from "~/shared/utils/string-enum";
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

export function gradientDirection(options: StringOptions = {}) {
  return StringEnum(
    [
      "bg-gradient-to-t",
      "bg-gradient-to-r",
      "bg-gradient-to-b",
      "bg-gradient-to-l",
      "bg-gradient-to-tl",
      "bg-gradient-to-tr",
      "bg-gradient-to-br",
      "bg-gradient-to-bl",
    ],
    {
      title: "Gradient direction",
      description: "The direction of the gradient. Only applies when color preset is a gradient.",
      enumNames: ["Top", "Right", "Bottom", "Left", "Top left", "Top right", "Bottom right", "Bottom left"],
      default: "bg-gradient-to-br",
      "ui:responsive": "desktop",
      "ui:styleId": "styles:gradientDirection",
      // metadata: {
      //   filter: (manifestProps: TObject, formData: Static<BrickManifest["props"]>) => {
      //     return (formData[colorPropKey] as string)?.includes("gradient") === true;
      //   },
      // },
      ...options,
    },
  );
}

export type GradientDirectionSettings = Static<ReturnType<typeof gradientDirection>>;

export function gradientDirectionRef(colorPropKey: string, options: StringOptions = {}) {
  return typedRef("styles:gradientDirection", {
    ...options,
    "ui:styleId": "styles:gradientDirection",
    metadata: {
      filter: (manifestProps: TObject, formData: Static<BrickManifest["props"]>) => {
        return (formData[colorPropKey] as string)?.includes("gradient") === true;
      },
    },
  });
}
