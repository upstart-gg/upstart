import { type SchemaOptions, Type, type Static } from "@sinclair/typebox";
import { typedRef } from "~/shared/utils/typed-ref";
import { StringEnum, type StringEnumOptions } from "~/shared/utils/string-enum";

type ShadowOptions = {
  title?: string;
  defaultValue?: string;
};

export function shadow({ title = "Shadow", defaultValue = "shadow-none" }: ShadowOptions = {}) {
  return StringEnum(["shadow-none", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"], {
    $id: "styles:shadow",
    title,
    default: defaultValue,
    enumNames: ["None", "S", "M", "L", "XL", "2XL"],
    "ui:placeholder": "Not specified",
    "ui:field": "enum",
    "ui:display": "select",
    // "ui:advanced": true,
  });
}

export type ShadowSettings = Static<ReturnType<typeof shadow>>;

export function shadowRef(options: SchemaOptions & ShadowOptions = {}) {
  return typedRef("styles:shadow", {
    ...options,
    "ui:styleId": "styles:shadow",
  });
}

type TextShadowOptions = {
  title?: string;
} & StringEnumOptions;

/**
 * This function is used in ajv and type ref translations, but should not be used directly in bricks
 * @deprecated When using OUSTIDE of ajv.addSchema(), use `textShadowRef` instead.
 */
export function textShadow({ title = "Text shadow", ...rest }: TextShadowOptions = {}) {
  return StringEnum(
    ["text-shadow-none", "text-shadow-sm", "text-shadow-md", "text-shadow-lg", "text-shadow-xl"],
    {
      $id: "styles:textShadow",
      title,
      enumNames: ["None", "Small", "Medium", "Large", "Extra large"],
      "ui:placeholder": "Not specified",
      "ui:field": "enum",
      "ui:styleId": "styles:textShadow",
      ...rest,
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
  });
}

export type OpacitySettings = Static<ReturnType<typeof opacity>>;
