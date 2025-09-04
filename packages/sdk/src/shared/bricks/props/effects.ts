import { type SchemaOptions, Type, type Static } from "@sinclair/typebox";
import { typedRef } from "~/shared/utils/typed-ref";
import { StringEnum, type StringEnumOptions } from "~/shared/utils/string-enum";

export function shadow(options: StringEnumOptions = {}) {
  return StringEnum(["shadow-none", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"], {
    // $id: "styles:shadow",
    title: "Shadow",
    enumNames: ["None", "Small", "Medium", "Large", "XL", "2XL"],
    "ui:placeholder": "Not specified",
    "ui:field": "enum",
    "ui:display": "select",
    "ui:responsive": "desktop",
    "ui:styleId": "styles:shadow",
    ...options,
  });
}

export type ShadowSettings = Static<ReturnType<typeof shadow>>;

export function shadowRef(options: StringEnumOptions = {}) {
  return typedRef("styles:shadow", options);
}

/**
 * This function is used in ajv and type ref translations, but should not be used directly in bricks
 */
export function textShadow(options: StringEnumOptions = {}) {
  return StringEnum(
    ["text-shadow-none", "text-shadow-sm", "text-shadow-md", "text-shadow-lg", "text-shadow-xl"],
    {
      // $id: "styles:textShadow",
      title: "Text shadow",
      enumNames: ["None", "S", "M", "L", "XL"],
      "ui:display": "button-group",
      "ui:placeholder": "Not specified",
      "ui:field": "enum",
      "ui:styleId": "styles:textShadow",
      examples: ["text-shadow-sm", "text-shadow-md", "text-shadow-lg"],
      ...options,
    },
  );
}

export function textShadowRef(options: SchemaOptions = {}) {
  return typedRef("styles:textShadow", options);
}

export type TextShadowSettings = Static<ReturnType<typeof textShadow>>;

type OpacityOptions = {
  title?: string;
  defaultValue?: number;
};

export function opacity({ defaultValue = 1, title = "Opacity" }: OpacityOptions = {}) {
  return Type.Number({
    title,
    minimum: 0.1,
    maximum: 1,
    default: defaultValue,
    multipleOf: 0.1,
    "ui:field": "slider",
    "ui:unit": "%",
    "ui:multiplier": 100,
    examples: [0.5, 0.75, 1],
  });
}

export type OpacitySettings = Static<ReturnType<typeof opacity>>;
