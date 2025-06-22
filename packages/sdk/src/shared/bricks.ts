import { Type, type Static } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";
import { defaultProps } from "./bricks/manifests/all-manifests";
import { backgroundRef } from "./bricks/props/background";
import { border, borderRef } from "./bricks/props/border";
import { preset, presetRef } from "./bricks/props/preset";
import { merge } from "lodash-es";
import { cssLength, cssLengthRef } from "./bricks/props/css-length";
import { enumProp } from "./bricks/props/enum";
import { containerLayoutRef, sectionLayout } from "./bricks/props/container";
import { StringEnum } from "./utils/string-enum";
import { group } from "./bricks/props/helpers";
import { resolveSchema } from "./utils/schema-resolver";

/**
 * Generates a unique identifier for bricks.
 */
export const generateId = customAlphabet("azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN", 7);

const brickAbsolutePositionSchema = Type.Object({
  left: Type.Optional(
    Type.String({
      title: "top",
      description: "The left position in css unit.",
    }),
  ),
  top: Type.Optional(
    Type.String({
      title: "top",
      description: "The top position in css unit.",
    }),
  ),
  right: Type.Optional(
    Type.String({
      title: "right",
      description: "The right position in css unit.",
    }),
  ),
  bottom: Type.Optional(
    Type.String({
      title: "bottom",
      description: "The bottom position in css unit.",
    }),
  ),
  inset: Type.Optional(
    Type.String({
      title: "inset",
      description: "The inset position in css unit.",
    }),
  ),
  translateX: Type.Optional(
    Type.String({
      title: "translateX",
      description: "The translateX position in css unit.",
    }),
  ),
  translateY: Type.Optional(
    Type.String({
      title: "translateY",
      description: "The translateY position in css unit.",
    }),
  ),
  rotate: Type.Optional(
    Type.String({
      title: "rotate",
      description: "The rotate position in css unit.",
    }),
  ),
});

export type BrickAbsolutePosition = Static<typeof brickAbsolutePositionSchema>;

export const brickTypeSchema = StringEnum(Object.keys(defaultProps), {
  title: "Brick type",
});

export const brickSchema = Type.Object(
  {
    id: Type.String({
      title: "ID",
      description: "A unique identifier for the brick.",
    }),
    type: brickTypeSchema,
    props: Type.Any({
      title: "Props",
      description: "The props of the brick. The available props depends on the brick type.",
    }),
    // props: Type.Object({
    //   ...commonProps,
    //   $children: Type.Optional(
    //     Type.Array(Type.Ref("brick"), {
    //       title: "Children",
    //       description: "The children of the brick. Only used when the brick is a container.",
    //     }),
    //   ),
    // }),
    mobileProps: Type.Optional(
      Type.Object(
        {},
        { additionalProperties: true, description: "The props for mobile, merged with the default props" },
      ),
    ),
    // props: Type.Record(Type.String(), Type.Any(), {
    //   description: "The available props depends on the brick type.",
    // }),
    // mobileProps: Type.Optional(
    //   Type.Record(Type.String(), Type.Any(), {
    //     description: "The props for mobile, merged with the default props",
    //   }),
    // ),

    // absolutePosition: Type.Optional(
    //   Type.Object(
    //     {
    //       mobile: brickAbsolutePositionSchema,
    //       desktop: brickAbsolutePositionSchema,
    //     },
    //     {
    //       title: "Position",
    //       description:
    //         "The position of the brick in the layout. Optional when the brick is a container child",
    //       additionalProperties: false,
    //     },
    //   ),
    // ),
  },
  { $id: "brick", additionalProperties: true },
);

export type Brick = Static<typeof brickSchema>;

export const sectionProps = Type.Object(
  {
    layout: Type.Optional(
      group({
        title: "Layout",
        children: sectionLayout({
          defaults: {
            gap: "gap-4",
            wrap: true,
            fillSpace: false,
            alignItems: "items-stretch",
            justifyContent: "justify-stretch",
          },
        }),
      }),
    ),
    background: Type.Optional(backgroundRef()),
    preset: Type.Optional(presetRef),
    border: Type.Optional(borderRef()),
    minHeight: Type.Optional(
      cssLengthRef({
        title: "Min height",
        default: "0px",
        description: "The min height of the section",
        "ui:styleId": "minHeight",
        "ui:advanced": true,
      }),
    ),

    maxWidth: Type.Optional(
      enumProp("Max width", "max-w-full", {
        options: [
          {
            value: "max-w-screen-lg",
            title: "Medium",
            description: "Common for text-heavy content/blog posts",
          },
          { value: "max-w-screen-xl", title: "Large", description: "Usefull or some landing pages" },
          { value: "max-w-screen-2xl", title: "Extra large", description: "Common width" },
          { value: "max-w-full", title: "Full width", description: "Takes the entire space" },
        ],
        description: "The maximum width of the section. Desktop only",
        displayAs: "select",
      }),
    ),
    horizontalPadding: Type.Optional(
      cssLengthRef({
        title: "Horizontal padding",
        default: "20px",
        description: "Horizontal padding. Desktop only",
        "ui:styleId": "minHeight",
        "ui:advanced": true,
      }),
    ),
    verticalPadding: Type.Optional(
      // cssLengthRef({ title: "Vertical padding", default: "20px", description: "Vertical padding." }),
      cssLength({
        title: "Vertical padding",
        default: "20px",
        description: "Vertical padding.",
        "ui:styleId": "verticalPadding",
        "ui:advanced": true,
      }),
    ),
    lastTouched: Type.Optional(
      Type.Number({
        description: "Do not use this field. It is used internally by the editor.",
        "ui:field": "hidden",
      }),
    ),
  },
  { additionalProperties: true, "ai:instructions": "Do not use the border prop" },
);

export const sectionSchema = Type.Object(
  {
    id: Type.String({ description: "The unique ID of the section. Use a human readable url-safe slug" }),
    label: Type.Optional(
      Type.String({
        description: "The label (name) of the section. Used for editor purposes only.",
      }),
    ),
    order: Type.Number({
      description: "Determines section order in the page (lower numbers appear first). 0-based",
    }),
    props: sectionProps,
    mobileProps: Type.Optional(Type.Partial(sectionProps, { additionalProperties: false })),
    bricks: Type.Array(brickSchema),
  },
  {
    $id: "section",
    description:
      "Sections are direct children of the page that are stacked vertically, but they always align their children horizontally (flex-row).",
  },
);

export type Section = Static<typeof sectionSchema>;

export function processSections(sections: Section[]) {
  return sections.map((section) => {
    return {
      ...section,
      bricks: section.bricks.map(processBrick),
    } as const;
  });
}

/**
 *  process a brick and add default props
 */
export function processBrick<T extends Brick>(brick: T): T {
  const defProps = defaultProps[brick.type];
  const result = {
    ...brick,
    props: merge({}, defProps.props, {
      ...brick.props,
      ...(brick.props.$children ? { $children: (brick.props.$children as T[]).map(processBrick) } : {}),
    }),
  };
  return result;
}
