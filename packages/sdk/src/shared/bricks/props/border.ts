import { Type, type Static } from "@sinclair/typebox";
import { group, prop } from "./helpers";

type BorderOptions = {
  title?: string;
  defaultValue?: {
    style?: string;
    color?: string;
    width?: string;
    side?: string[];
    rounding?: string;
  };
};

export function border({
  title = "Border",
  defaultValue = {
    style: "border-solid",
    width: "border-0",
    side: [],
    rounding: "rounded-auto",
  },
}: BorderOptions = {}) {
  return group({
    title,
    options: {
      $id: "#styles:border",
      default: defaultValue,
    },
    children: {
      rounding: Type.Union(
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
        },
      ),
      width: Type.Union(
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
          "ui:field": "enum",
        },
      ),
      color: Type.String({
        default: defaultValue?.color,
        title: "Color",
        "ui:field": "color",
        "ui:color-type": "border",
      }),
      side: Type.Optional(
        Type.Array(
          Type.Union([
            Type.Literal("border-l", { title: "Left" }),
            Type.Literal("border-t", { title: "Top" }),
            Type.Literal("border-r", { title: "Right" }),
            Type.Literal("border-b", { title: "Bottom" }),
          ]),
          {
            default: defaultValue.side,
            title: "Sides",
            "ui:field": "border-side",
          },
        ),
      ),
      style: Type.Union(
        [
          Type.Literal("border-solid", { title: "Solid" }),
          Type.Literal("border-dashed", { title: "Dashed" }),
          Type.Literal("border-dotted", { title: "Dotted" }),
        ],
        {
          default: defaultValue.style,
          title: "Style",
          description: "The brick border style",
          "ui:field": "enum",
          "ui:display": "button-group",
        },
      ),
    },
  });
}

export type BorderSettings = Static<ReturnType<typeof border>>;

// export function rounding(defaultValue = "rounded-auto", title = "Rounding") {
//   return prop({
//     title,
//     $id: "#styles:rounding",
//     schema: Type.Union(
//       [
//         Type.Literal("rounded-auto", { title: "Auto" }),
//         Type.Literal("rounded-none", { title: "None" }),
//         Type.Literal("rounded-sm", { title: "Small" }),
//         Type.Literal("rounded-md", { title: "Medium" }),
//         Type.Literal("rounded-lg", { title: "Large" }),
//         Type.Literal("rounded-xl", { title: "Extra large" }),
//         Type.Literal("rounded-2xl", { title: "2xl" }),
//         Type.Literal("rounded-3xl", { title: "3xl" }),
//         Type.Literal("rounded-full", { title: "Full" }),
//       ],
//       {
//         default: defaultValue,
//         "ui:field": "enum",
//         "ui:display": "select",
//       },
//     ),
//   });
// }

// export type RoundingSettings = Static<ReturnType<typeof rounding>>;
