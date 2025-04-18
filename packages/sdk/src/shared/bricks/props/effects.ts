import { Type, type Static } from "@sinclair/typebox";
import { group, prop } from "./helpers";

type ShadowOptions = {
  title?: string;
  defaultValue?: string;
};

export function shadow({ title = "Shadow", defaultValue = "shadow-none" }: ShadowOptions = {}) {
  return prop({
    title,
    $id: "#styles:shadow",
    schema: Type.Union(
      [
        Type.Literal("shadow-none", { title: "None" }),
        Type.Literal("shadow-sm", { title: "Small" }),
        Type.Literal("shadow-md", { title: "Medium" }),
        Type.Literal("shadow-lg", { title: "Large" }),
        Type.Literal("shadow-xl", { title: "Extra large" }),
        Type.Literal("shadow-2xl", { title: "Extra large (2x)" }),
      ],
      {
        default: defaultValue,
        "ui:field": "enum",
        "ui:display": "select",
      },
    ),
  });
}

export type ShadowSettings = Static<ReturnType<typeof shadow>>;

type TextShadowOptions = {
  title?: string;
  defaultValue?: string;
};

export function textShadow({
  title = "Text shadow",
  defaultValue = "text-shadow-none",
}: TextShadowOptions = {}) {
  return prop({
    title,
    schema: Type.Union(
      [
        Type.Literal("text-shadow-none", { title: "None" }),
        Type.Literal("text-shadow-sm", { title: "S" }),
        Type.Literal("text-shadow-md", { title: "M" }),
        Type.Literal("text-shadow-lg", { title: "L" }),
        Type.Literal("text-shadow-xl", { title: "XL" }),
      ],
      {
        default: defaultValue,
        "ui:field": "enum",
      },
    ),
  });
}

export type TextShadowSettings = Static<ReturnType<typeof textShadow>>;

type OpacityOptions = {
  title?: string;
  defaultValue?: number;
};

export function opacity({ defaultValue = 1, title = "Opacity" }: OpacityOptions = {}) {
  return prop({
    title,
    schema: Type.Number({
      minimum: 0.1,
      maximum: 1,
      default: defaultValue,
      multipleOf: 0.1,
      "ui:field": "slider",
      "ui:unit": "%",
      "ui:multiplier": 100,
    }),
  });
}

export type OpacitySettings = Static<ReturnType<typeof opacity>>;

type EffectsOptions = {
  title?: string;
  defaultValue?: {
    opacity?: number;
    shadow?: string;
    textShadow?: string;
  };
  enableTextShadow?: boolean;
};

export function effects({ title = "Effects", defaultValue = {}, enableTextShadow }: EffectsOptions = {}) {
  return group({
    title,
    options: {
      default: defaultValue,
    },
    children: {
      opacity: opacity({
        title: "Opacity",
        defaultValue: defaultValue.opacity,
      }),
      shadow: shadow({
        title: "Shadow",
        defaultValue: defaultValue.shadow,
      }),
      ...(enableTextShadow && {
        textShadow: textShadow({
          title: "Text shadow",
          defaultValue: defaultValue.textShadow,
        }),
      }),
    },
  });
}
