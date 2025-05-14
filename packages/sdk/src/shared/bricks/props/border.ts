import { Type, type Static } from "@sinclair/typebox";
import { group, optional, prop } from "./helpers";

type BorderOptions = {
  title?: string;
  defaultValue?: {
    style?: string;
    color?: string;
    width?: string;
    sides?: string[];
    rounding?: string;
  };
};

export function border({ title = "Border", defaultValue = {} }: BorderOptions = {}) {
  return group({
    title,
    options: {
      "ui:styleId": "#styles:border",
      default: defaultValue,
    },
    children: {
      rounding: optional(
        Type.Union(
          [
            Type.Literal("rounded-auto", { title: "Auto" }),
            Type.Literal("rounded-none", { title: "None" }),
            Type.Literal("rounded-sm", { title: "Small" }),
            Type.Literal("rounded-md", { title: "Medium" }),
            Type.Literal("rounded-lg", { title: "Large" }),
            Type.Literal("rounded-xl", { title: "Extra large" }),
            Type.Literal("rounded-2xl", { title: "2xl" }),
            Type.Literal("rounded-3xl", { title: "3xl" }),
            Type.Literal("rounded-full", { title: "Full" }),
          ],
          {
            title: "Corner rounding",
            default: defaultValue.rounding,
            "ui:field": "enum",
            "ui:display": "select",
            "ui:placeholder": "Not specified",
          },
        ),
      ),
      width: optional(
        Type.Union(
          [
            Type.Literal("border-0", { title: "None" }),
            Type.Literal("border", { title: "S" }),
            Type.Literal("border-2", { title: "M" }),
            Type.Literal("border-4", { title: "L" }),
            Type.Literal("border-8", { title: "XL" }),
          ],
          {
            default: defaultValue.width,
            title: "Width",
            "ai:instructions": "Don't specify width if you want no border.",
            "ui:field": "enum",
            "ui:placeholder": "None",
          },
        ),
      ),
      color: Type.String({
        default: defaultValue?.color,
        title: "Color",
        "ai:instructions":
          "Can be set to transparent, hex/rgb/rgba color, or classes like `border-<variant>-<shade>`, variants being primary, secondary, accent and neutral, and shades between 50 and 900",
        "ui:field": "color",
        "ui:color-type": "border",
      }),
      sides: Type.Optional(
        Type.Array(
          Type.Union([
            Type.Literal("border-l", { title: "Left" }),
            Type.Literal("border-t", { title: "Top" }),
            Type.Literal("border-r", { title: "Right" }),
            Type.Literal("border-b", { title: "Bottom" }),
          ]),
          {
            default: defaultValue.sides,
            title: "Sides",
            description:
              "The specific sides where to apply the border. Not specifying sides will apply the border to all sides.",
            "ui:field": "border-side",
            "ai:instructions":
              "Use this to apply the border to specific sides. Not specifying sides will apply the border to all sides.",
          },
        ),
      ),
      style: optional(
        Type.Union(
          [
            Type.Literal("border-solid", { title: "Solid" }),
            Type.Literal("border-dashed", { title: "Dashed" }),
            Type.Literal("border-dotted", { title: "Dotted" }),
          ],
          {
            default: defaultValue.style ?? "border-solid",
            title: "Style",
            description: "The brick border style",
            "ai:instructions": "Use only when width is different than border-0.",
            "ui:field": "enum",
            "ui:display": "button-group",
          },
        ),
      ),
    },
  });
}

export type BorderSettings = Static<ReturnType<typeof border>>;
