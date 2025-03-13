import { Type } from "@sinclair/typebox";

export const commonProps = {
  className: Type.Optional(
    Type.String({
      default: "",
      "ui:field": "hidden",
    }),
  ),
  lastTouched: Type.Optional(
    Type.Number({
      default: 0,
      "ui:field": "hidden",
    }),
  ),
  editable: Type.Optional(
    Type.Boolean({
      description: "Allow editing. It is automatically set by the editor, so no need to specify it manually.",
      default: false,
      "ui:field": "hidden",
    }),
  ),
};

// export type CommonProps = Static<typeof commonProps>;

// export const commonStyleProps = Type.Object({
//   layout: Type.Optional(layout),
//   border: Type.Optional(borderSchema),
//   effects: Type.Optional(effectsSchema),
//   background: Type.Optional(backgroundSchema),
//   text: Type.Optional(textContent),
// });

// /**
//  * All style props that can be applied to a brick
//  */
// export const allStyleProps = Type.Partial(
//   Type.Composite([
//     containerLayoutProps,
//     Type.Object({
//       align,
//       layout,
//       height,
//       border: borderSchema,
//       effects: effectsSchema,
//       background: backgroundSchema,
//     }),
//   ]),
// );

// export type AllStyleProps = Static<typeof allStyleProps>;
// export type StyleProp = keyof Required<AllStyleProps>;
