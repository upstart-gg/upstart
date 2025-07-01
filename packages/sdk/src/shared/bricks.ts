import { Type, type Static } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";
import { defaultProps } from "./bricks/manifests/all-manifests";
import { backgroundRef } from "./bricks/props/background";
import { borderRef } from "./bricks/props/border";
import { presetRef } from "./bricks/props/preset";
import { merge } from "lodash-es";
import { cssLength, cssLengthRef } from "./bricks/props/css-length";
import { enumProp } from "./bricks/props/enum";
import { sectionLayout } from "./bricks/props/container";
import { StringEnum } from "./utils/string-enum";
import { group } from "./bricks/props/helpers";
import { getSchemaObjectDefaults } from "./utils/schema";

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
    mobileProps: Type.Optional(
      Type.Object(
        {},
        {
          additionalProperties: true,
          description: "The props for mobile, merged with the default props",
        },
      ),
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
  { $id: "brick", additionalProperties: true },
);

export type Brick = Static<typeof brickSchema>;

export const sectionProps = Type.Object(
  {
    // layout: Type.Optional(
    //   group({
    //     title: "Layout",
    //     children: sectionLayout({
    //       defaults: {
    //         gap: "gap-4",
    //         wrap: true,
    //         fillSpace: false,
    //         alignItems: "items-stretch",
    //         justifyContent: "justify-stretch",
    //       },
    //     }),
    //   }),
    // ),
    background: Type.Optional(backgroundRef()),
    preset: Type.Optional(presetRef),
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
            title: "M",
            description: "Common for text-heavy content/blog posts",
          },
          {
            value: "max-w-screen-xl",
            title: "L",
            description: "Usefull or some landing pages",
          },
          {
            value: "max-w-screen-2xl",
            title: "XL",
            description: "Common width",
          },
          {
            value: "max-w-full",
            title: "Full",
            description: "Takes the entire space",
          },
        ],
        description: "The maximum width of the section. Desktop only",
        displayAs: "button-group",
      }),
    ),
    fillSpace: Type.Optional(
      Type.Boolean({
        title: "Fill available space",
        description: "Make bricks fill the available space",
      }),
    ),
    justifyContent: Type.Optional(
      StringEnum(
        [
          "justify-start",
          "justify-center",
          "justify-end",
          "justify-between",
          "justify-around",
          "justify-evenly",
        ],
        {
          enumNames: ["Left", "Center", "Right", "Space between", "Space around", "Evenly distributed"],
          title: "Horizontal alignment",
          "ui:placeholder": "Not specified",
          default: "justify-start",
        },
      ),
    ),
    alignItems: Type.Optional(
      StringEnum(["items-start", "items-center", "items-end", "items-stretch"], {
        enumNames: ["Top", "Center", "Bottom", "Stretch"],
        title: "Vertical alignment",
        "ui:placeholder": "Not specified",
        default: "items-stretch",
      }),
    ),
    gap: Type.Optional(
      cssLengthRef({
        title: "Gap",
        description: "The gap between the bricks in the section.",
        default: "12px",
        "ui:styleId": "gap",
      }),
    ),
    lastTouched: Type.Optional(
      Type.Number({
        description: "Do not use this field. It is used internally by the editor.",
        "ui:field": "hidden",
      }),
    ),
  },
  {
    additionalProperties: true,
    "ai:instructions": "Do not use the border prop",
  },
);

export const sectionSchema = Type.Object(
  {
    id: Type.String({
      description: "The unique ID of the section. Use a human readable url-safe slug",
    }),
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

export const sectionDefaultprops = getSchemaObjectDefaults(sectionSchema.properties.props);
export type Section = Static<typeof sectionSchema>;

export function processSections(sections: Section[]) {
  return sections.map((section) => {
    return {
      ...section,
      props: merge({}, sectionDefaultprops, section.props),
      bricks: section.bricks.map(processBrick).filter(Boolean) as Brick[],
    } as const;
  });
}

/**
 *  process a brick and add default props
 */
export function processBrick<T extends Brick>(brick: T): T | false {
  const defProps = defaultProps[brick.type];
  if (!defProps) {
    console.warn(`No default props found for brick type: ${brick.type}`);
    return false; // or throw an error if you prefer
  }
  const result = {
    ...brick,
    props: merge({}, defProps.props, {
      ...brick.props,
      ...(brick.props.$children
        ? { $children: (brick.props.$children as T[]).map(processBrick).filter(Boolean) }
        : {}),
    }),
  };
  return result;
}
