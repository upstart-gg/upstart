import { type SchemaOptions, Type, type Static } from "@sinclair/typebox";
import { group, optional, prop } from "./helpers";
import { StringEnum } from "~/shared/utils/schema";
import { typedRef } from "~/shared/utils/typed-ref";

type ShadowOptions = {
  title?: string;
  defaultValue?: string;
};

export function shadow({ title = "Shadow", defaultValue = "shadow-none" }: ShadowOptions = {}) {
  return prop({
    title,
    schema: StringEnum(["shadow-none", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"], {
      $id: "styles:shadow",
      title,
      default: defaultValue,
      enumNames: ["None", "S", "M", "L", "XL", "2XL"],
      "ui:placeholder": "Not specified",
      "ui:field": "enum",
      "ui:display": "select",
    }),
  });
}

export type ShadowSettings = Static<ReturnType<typeof shadow>>;

export function shadowRef(options: SchemaOptions & ShadowOptions = {}) {
  return typedRef("styles:shadow", options);
}

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
    schema: StringEnum(
      ["text-shadow-none", "text-shadow-sm", "text-shadow-md", "text-shadow-lg", "text-shadow-xl"],
      {
        default: defaultValue,
        enumNames: ["None", "Small", "Medium", "Large", "Extra large"],
        "ui:placeholder": "Not specified",
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

// export function effects({ title = "Effects", defaultValue = {}, enableTextShadow }: EffectsOptions = {}) {
//   return group({
//     title,
//     options: {
//       default: defaultValue,
//       $id: "styles:effects",
//     },
//     children: {
//       opacity: optional(
//         opacity({
//           title: "Opacity",
//           defaultValue: defaultValue.opacity,
//         }),
//       ),
//       shadow: optional(
//         shadowRef({
//           title: "Shadow",
//           defaultValue: defaultValue.shadow,
//         }),
//       ),
//       ...(enableTextShadow && {
//         textShadow: optional(
//           textShadow({
//             title: "Text shadow",
//             defaultValue: defaultValue.textShadow,
//           }),
//         ),
//       }),
//     },
//   });
// }

// export function effectsRef(options: SchemaOptions & EffectsOptions = {}) {
//   return typedRef("styles:effects", options);
// }
