import { Type, type Static } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";
import { defaultProps } from "./bricks/manifests/all-manifests";
import { background } from "./bricks/props/background";
import { border } from "./bricks/props/border";
import { preset } from "./bricks/props/preset";
import { merge } from "lodash-es";
import { cssLength } from "./bricks/props/css-length";
import { enumProp } from "./bricks/props/enum";
import { containerLayout } from "./bricks/props/container";
import { StringEnum } from "./utils/schema";

/**
 * Generates a unique identifier for bricks.
 */
export const generateId = customAlphabet("1234567890azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN", 7);

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
    props: Type.Record(Type.String(), Type.Any(), {
      description: "The available props depends on the brick type.",
    }),
    mobileProps: Type.Optional(
      Type.Record(Type.String(), Type.Any(), {
        description: "The props for mobile, merged with the default props",
      }),
    ),
    $children: Type.Optional(
      Type.Array(Type.Ref("brick"), {
        title: "Children",
        description: "The children of the brick. Only used when the brick is a container.",
      }),
    ),
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
  { $id: "brick", additionalProperties: false },
);

export type Brick = Static<typeof brickSchema>;

export const sectionProps = Type.Object(
  {
    layout: Type.Optional(containerLayout({ options: { disableGrid: true } })),
    background: Type.Optional(background()),
    preset: preset(),
    border: Type.Optional(border()),
    minHeight: Type.Optional(
      cssLength("Minimum height", "0px", {
        description: "The min height of the section",
        units: "height-only",
      }),
    ),
    maxWidth: Type.Optional(
      enumProp("Maximum width", "max-w-full", {
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
      cssLength("Horizontal padding", "20px", {
        description: "Horizontal padding. Desktop only",
        units: "width-only",
      }),
    ),
    verticalPadding: Type.Optional(
      cssLength("Vertical padding", "20px", {
        description: "Vertical padding.",
        units: "height-only",
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
    id: Type.String(),
    label: Type.Optional(Type.String()),
    order: Type.Number({
      description: "Determines section order in the page (lower numbers appear first). 0-based",
    }),
    props: sectionProps,
    mobileProps: Type.Optional(Type.Partial(sectionProps, { additionalProperties: false })),
    bricks: Type.Array(brickSchema),
  },
  {
    $id: "section",
    additionalProperties: false,
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
export function processBrick(brick: Brick): Brick {
  const defProps = defaultProps[brick.type];

  const result = {
    ...brick,
    props: merge({}, defProps.props, brick.props),
    ...(brick.$children ? { $children: (brick.$children as Brick[]).map(processBrick) } : {}),
  };

  return result;
}
