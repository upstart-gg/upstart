import { Type, type Static } from "@sinclair/typebox";
import { group, prop } from "./helpers";

type BorderOptions = {
  title?: string;
  defaultValue?: {
    style?: string;
    color?: string;
    width?: string;
    side?: string[];
  };
};

export function borderDeprecated({
  title = "Border",
  defaultValue = {
    color: "#000",
    style: "border-solid",
    width: "border-0",
    side: [],
  },
}: BorderOptions = {}) {
  return prop({
    title,
    $id: "#styles:border",
    schema: Type.Object(
      {
        style: Type.Union(
          [
            Type.Literal("border-solid", { title: "Solid" }),
            Type.Literal("border-dashed", { title: "Dashed" }),
            Type.Literal("border-dotted", { title: "Dotted" }),
          ],
          {
            default: "border-solid",
            title: "Border style",
            description: "The brick border style",
            "ui:field": "enum",
            "ui:display": "button-group",
          },
        ),
        color: Type.String({
          default: "transparent",
          title: "Border color",
          "ui:field": "color",
          "ui:color-type": "border",
        }),
        width: Type.Union(
          [
            Type.Literal("border-0", { title: "None" }),
            Type.Literal("border", { title: "Small" }),
            Type.Literal("border-2", { title: "Medium" }),
            Type.Literal("border-4", { title: "Large" }),
            Type.Literal("border-8", { title: "Extra large" }),
          ],
          {
            default: "border-0",
            title: "Border width",
            "ui:field": "enum",
            "ui:display": "button-group",
          },
        ),
        side: Type.Optional(
          Type.Array(
            Type.Union([
              Type.Literal("border-l", { title: "Left" }),
              Type.Literal("border-t", { title: "Top" }),
              Type.Literal("border-r", { title: "Right" }),
              Type.Literal("border-b", { title: "Bottom" }),
            ]),
            {
              default: [],
              title: "Border side",
              "ui:field": "border-side",
            },
          ),
        ),
      },
      {
        "ui:field": "border",
        "ui:inspector-tab": "style",
        default: defaultValue,
      },
    ),
  });
}

export function border({
  title = "Border",
  defaultValue = {
    style: "border-solid",
    width: "border-0",
  },
}: BorderOptions = {}) {
  return group({
    title,
    options: {
      $id: "#styles:border",
      default: defaultValue,
    },
    children: {
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
      width: Type.Union(
        [
          Type.Literal("border-0", { title: "None" }),
          Type.Literal("border", { title: "Small" }),
          Type.Literal("border-2", { title: "Medium" }),
          Type.Literal("border-4", { title: "Large" }),
          Type.Literal("border-8", { title: "Extra large" }),
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
    },
  });
}

export type BorderSettings = Static<ReturnType<typeof border>>;

export function rounding(defaultValue = "rounded-none", title = "Rounding") {
  return prop({
    title,
    $id: "#styles:rounding",
    schema: Type.Union(
      [
        Type.Literal("rounded-none", { title: "None" }),
        Type.Literal("rounded-sm", { title: "Small" }),
        Type.Literal("rounded-md", { title: "Medium" }),
        Type.Literal("rounded-lg", { title: "Large" }),
        Type.Literal("rounded-xl", { title: "Extra large" }),
        Type.Literal("rounded-full", { title: "Full" }),
      ],
      {
        default: defaultValue,
        "ui:field": "enum",
        "ui:display": "select",
      },
    ),
  });
}

export type RoundingSettings = Static<ReturnType<typeof rounding>>;
