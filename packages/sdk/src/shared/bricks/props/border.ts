import { Type, type Static } from "@sinclair/typebox";
import { group, optional, prop } from "./helpers";
import { StringEnum } from "~/shared/utils/schema";
import { typedRef } from "~/shared/utils/typed-ref";

export function border(title = "Border") {
  return group({
    title,
    options: {
      "ui:styleId": "#styles:border",
      $id: "styles:border",
    },
    children: {
      rounding: optional(
        StringEnum(
          [
            "rounded-auto",
            "rounded-none",
            "rounded-sm",
            "rounded-md",
            "rounded-lg",
            "rounded-xl",
            "rounded-2xl",
            "rounded-3xl",
            "rounded-full",
          ],
          {
            title: "Corner rounding",
            enumNames: ["Auto", "None", "Small", "Medium", "Large", "Extra large", "2xl", "3xl", "Full"],
            "ui:placeholder": "Not specified",
            "ui:field": "enum",
            "ui:display": "select",
          },
        ),
      ),
      width: optional(
        StringEnum(["border-0", "border", "border-2", "border-4", "border-8"], {
          title: "Width",
          enumNames: ["None", "S", "M", "L", "XL"],
          "ai:instructions": "Don't specify width if you want no border.",
          "ui:field": "enum",
          "ui:placeholder": "None",
        }),
      ),
      color: Type.Optional(
        Type.String({
          // default: defaultValue?.color,
          title: "Color",
          "ai:instructions":
            "Can be set to transparent, hex/rgb/rgba color, or classes like `border-<variant>-<shade>`, variants being primary, secondary, accent and neutral, and shades between 50 and 900",
          "ui:field": "color",
          "ui:color-type": "border",
        }),
      ),
      sides: Type.Optional(
        Type.Array(
          StringEnum(["border-l", "border-t", "border-r", "border-b"], {
            title: "Sides",
            enumNames: ["Left", "Top", "Right", "Bottom"],
            description:
              "The specific sides where to apply the border. Not specifying sides will apply the border to all sides.",
            "ui:field": "border-side",
            "ai:instructions":
              "Use this to apply the border to specific sides. Not specifying sides will apply the border to all sides.",
          }),
        ),
      ),
      style: optional(
        StringEnum(["border-solid", "border-dashed", "border-dotted"], {
          title: "Style",
          description: "The brick border style",
          enumNames: ["Solid", "Dashed", "Dotted"],
          "ai:instructions": "Use only when width is different than border-0.",
          "ui:field": "enum",
          "ui:display": "button-group",
        }),
      ),
    },
  });
}

export const borderRef = typedRef("styles:border", { "ui:styleId": "#styles:border" });

export type BorderSettings = Static<ReturnType<typeof border>>;
