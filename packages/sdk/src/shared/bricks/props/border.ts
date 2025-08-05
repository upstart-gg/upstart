import { type ObjectOptions, Type, type Static, type StringOptions } from "@sinclair/typebox";
import { typedRef } from "~/shared/utils/typed-ref";
import { StringEnum } from "~/shared/utils/string-enum";
import { colorRef } from "./color";

export function border(opts: ObjectOptions = {}) {
  return Type.Object(
    {
      width: StringEnum(["border-0", "border", "border-2", "border-4", "border-8"], {
        title: "Width",
        enumNames: ["None", "Small", "Medium", "Large", "Extra large"],
        "ai:instructions": "Don't specify width if you want no border.",
        "ui:field": "enum",
        "ui:display": "select",
        "ui:placeholder": "None",
        default: "border-0",
      }),
      color: colorRef({
        title: "Color",
        description: "The color of the border.",
        default: "border-current",
      }),
    },
    {
      title: "Border",
      $id: "styles:border",
      "ui:styleId": "styles:border",
      description: "Set the border width and color.",
      "ui:field": "border",
      "ui:responsive": true,
      ...opts,
    },
  );
}

export type BorderSettings = Static<ReturnType<typeof border>>;

export function borderRef(
  options: Omit<ObjectOptions, "default"> & { default?: Partial<BorderSettings> } = {},
) {
  return typedRef("styles:border", options);
}

export function rounding(opts: StringOptions = {}) {
  return Type.Optional(
    StringEnum(
      [
        "rounded-auto",
        "rounded-none",
        "rounded-sm",
        "rounded-md",
        "rounded-lg",
        "rounded-xl",
        "rounded-2xl",
        "rounded-full",
      ],
      {
        title: "Corner rounding",
        enumNames: ["Auto", "None", "Small", "Medium", "Large", "Extra large", "2xl", "Full"],
        $id: "styles:rounding",
        "ui:styleId": "styles:rounding",
        "ui:responsive": "desktop",
        ...opts,
      },
    ),
  );
}

export type RoundingSettings = Static<ReturnType<typeof rounding>>;

export function roundingRef(options: StringOptions = {}) {
  return typedRef("styles:rounding", options);
}
