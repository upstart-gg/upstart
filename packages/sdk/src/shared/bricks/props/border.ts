import { Type, type Static } from "@sinclair/typebox";

const groupBorder = {
  "ui:group": "border",
  "ui:group:title": "Border",
  "ui:inspector-tab": "style",
};

export const border = Type.Object(
  {
    radius: Type.Union(
      [
        Type.Literal("rounded-none", { title: "None" }),
        Type.Literal("rounded-sm", { title: "Small" }),
        Type.Literal("rounded-md", { title: "Medium" }),
        Type.Literal("rounded-lg", { title: "Large" }),
        Type.Literal("rounded-xl", { title: "Extra large" }),
        Type.Literal("rounded-full", { title: "Full" }),
      ],
      {
        $id: "borderRadius",
        default: "rounded-none",
        title: "Rounding",
        description: "Corners rounding",
        "ui:field": "enum",
        "ui:display": "button-group",
        ...groupBorder,
      },
    ),
    style: Type.Union(
      [
        Type.Literal("border-solid", { title: "Solid" }),
        Type.Literal("border-dashed", { title: "Dashed" }),
        Type.Literal("border-dotted", { title: "Dotted" }),
      ],
      {
        $id: "borderStyle",
        default: "border-solid",
        title: "Border style",
        description: "The brick border style",
        "ui:field": "enum",
        "ui:display": "button-group",
        ...groupBorder,
      },
    ),
    color: Type.String({
      $id: "borderColor",
      default: "transparent",
      title: "Border color",
      "ui:field": "color",
      "ui:color-type": "border",
      ...groupBorder,
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
        $id: "borderWidth",
        default: "border-0",
        title: "Border width",
        "ui:field": "enum",
        "ui:display": "button-group",
        ...groupBorder,
      },
    ),
  },
  {
    title: "Border style",
    "ui:field": "border",
    "ui:group": "border",
    "ui:group:title": "Border",
    "ui:inspector-tab": "style",
    default: {
      radius: "rounded-none",
      style: "border-solid",
      color: "#000000",
      width: "border-0",
    },
  },
);

export type BorderSettings = Static<typeof border>;
