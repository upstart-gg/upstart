import { Type, type Static } from "@sinclair/typebox";

export const groupEffects = {
  "ui:group": "effects",
  "ui:group:title": "Effects",
  "ui:inspector-tab": "style",
};

export const effects = Type.Optional(
  Type.Object(
    {
      shadow: Type.Union(
        [
          Type.Literal("shadow-none", { title: "None" }),
          Type.Literal("shadow-sm", { title: "Small" }),
          Type.Literal("shadow-md", { title: "Medium" }),
          Type.Literal("shadow-lg", { title: "Large" }),
          Type.Literal("shadow-xl", { title: "Extra large" }),
          Type.Literal("shadow-2xl", { title: "Extra large (2x)" }),
        ],
        {
          $id: "shadow",
          default: "shadow-none",
          title: "Shadow",
          description: "Shadow",
          "ui:field": "enum",
          "ui:display": "button-group",
          ...groupEffects,
        },
      ),
      opacity: Type.Optional(
        Type.Number({
          $id: "opacity",
          minimum: 0.1,
          maximum: 1,
          default: 1,
          multipleOf: 0.1,
          title: "Opacity",
          description: "Global opacity",
          "ui:field": "slider",
          ...groupEffects,
        }),
      ),
      textShadow: Type.Optional(
        Type.Union(
          [
            Type.Literal("text-shadow-none", { title: "None" }),
            Type.Literal("text-shadow-sm", { title: "S" }),
            Type.Literal("text-shadow-md", { title: "M" }),
            Type.Literal("text-shadow-lg", { title: "L" }),
            Type.Literal("text-shadow-xl", { title: "XL" }),
          ],
          {
            default: "text-shadow-none",
            title: "Text shadow",
            "ui:field": "enum",
            "ui:display": "button-group",
            ...groupEffects,
          },
        ),
      ),
    },
    {
      title: "Effects",
      "ui:field": "effects",
      "ui:group": "effects",
      "ui:group:title": "Effects",
      default: {
        shadow: "shadow-none",
        textShadow: "text-shadow-none",
        opacity: 1,
      },
    },
  ),
);

export type EffectsSettings = Static<typeof effects>;
