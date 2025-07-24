import { Type, type Static, type StringOptions } from "@sinclair/typebox";
import { typedRef } from "~/shared/utils/typed-ref";
import { StringEnum } from "~/shared/utils/string-enum";

export function border(opts: StringOptions = {}) {
  return StringEnum(["border-0", "border", "border-2", "border-4", "border-8"], {
    title: "Border",
    enumNames: ["None", "S", "M", "L", "XL"],
    "ai:instructions": "Don't specify width if you want no border.",
    "ui:field": "enum",
    "ui:display": "button-group",
    "ui:placeholder": "None",
    "ui:styleId": "styles:border",
    $id: "styles:border",
    default: "border-0",
    ...opts,
  });
}

// sides: Type.Optional(
//   Type.Array(
//     StringEnum(["border-l", "border-t", "border-r", "border-b"], {
//       title: "Sides",
//       enumNames: ["Left", "Top", "Right", "Bottom"],
//       description:
//         "The specific sides where to apply the border. Not specifying sides will apply the border to all sides.",
//       "ai:instructions":
//         "Use this to apply the border to specific sides. Not specifying sides will apply the border to all sides.",
//     }),
//     {
//       "ui:field": "border-side",
//     },
//   ),
// ),

export function borderRef(options: StringOptions = {}) {
  return typedRef("styles:border", options);
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
        enumNames: ["Auto", "None", "Small", "Medium", "Large", "Extra large", "2xl", "Full"],
        $id: "styles:rounding",
        "ui:styleId": "styles:rounding",
        ...opts,
      },
    ),
  );
}

export type RoundingSettings = Static<ReturnType<typeof rounding>>;

export function roundingRef(options: StringOptions = {}) {
  return typedRef("styles:rounding", options);
}
