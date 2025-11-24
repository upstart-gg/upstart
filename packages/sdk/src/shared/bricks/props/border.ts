import { type ObjectOptions, Type, type Static, type StringOptions } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/string-enum";
import { borderColor } from "./color";

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
      color: borderColor({
        title: "Color",
        default: "border-current",
      }),
    },
    {
      title: "Border",
      "ui:styleId": "styles:border",
      description: "Border width and color",
      "ui:field": "border",
      "ui:responsive": true,
      examples: [
        {
          width: "border-2",
          color: "border-primary-200",
        },
        {
          width: "border-4",
          color: "border-accent-400",
        },
        {
          width: "border",
          color: "border-neutral-100",
        },
      ],
      ...opts,
    },
  );
}

export type BorderSettings = Static<ReturnType<typeof border>>;

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
        description: "The rounding of the element's corners.",
        enumNames: ["Auto", "None", "Small", "Medium", "Large", "Extra large", "2xl", "Full"],
        // $id: "styles:rounding",
        "ui:styleId": "styles:rounding",
        "ui:responsive": "desktop",
        ...opts,
      },
    ),
  );
}

export type RoundingSettings = Static<ReturnType<typeof rounding>>;
