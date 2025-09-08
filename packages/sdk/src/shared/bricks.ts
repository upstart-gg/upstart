import { Type, type Static, type TObject } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";
import { defaultProps } from "./bricks/manifests/all-manifests";
import { cssLengthRef } from "./bricks/props/css-length";
import { enumProp } from "./bricks/props/enum";
import { colorPresetRef } from "./bricks/props/color-preset";
import { mergeIgnoringArrays } from "./utils/merge";
import { getSchemaDefaults } from "./utils/schema";
import { StringEnum } from "./utils/string-enum";
import { alignItemsRef, justifyContentRef } from "./bricks/props/align";
import { paddingRef } from "./bricks/props/padding";
import type { CommonBrickProps } from "./bricks/props/common";
import { directionRef } from "./bricks/props/direction";
import type { PageAttributes, SiteAttributes } from "./attributes";

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
      description: "The static props of the brick. The available props depends on the brick type.",
    }),
    mobileProps: Type.Optional(
      Type.Any({
        title: "Props",
        description: "The overriden props for mobile, merged with desktop props.",
      }),
    ),
  },
  { additionalProperties: true },
);

export type Brick = Omit<Static<typeof brickSchema>, "props" | "mobileProps"> & {
  props: CommonBrickProps & Record<string, unknown>;
  mobileProps?: CommonBrickProps & Record<string, unknown>;
};

export const sectionProps = Type.Object(
  {
    colorPreset: Type.Optional(
      colorPresetRef({
        title: "Color",
      }),
    ),
    direction: Type.Optional(
      directionRef({
        default: "flex-row",
        title: "Direction",
        description: "The direction of the section. Only apply to desktop. On mobile, it is always vertical.",
        "ui:responsive": "desktop",
      }),
    ),
    minHeight: Type.Optional(
      cssLengthRef({
        title: "Min height",
        default: "fit-content",
        description: "The min height of the section",
        "ui:field": "hidden",
      }),
    ),
    variant: Type.Optional(
      StringEnum(["navbar", "footer", "sidebar"], {
        title: "Custom section variant",
        description: "Used for custom styling and layout.",
        enumNames: ["Navbar", "Footer", "Sidebar"],
        "ui:field": "hidden",
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
        "ui:responsive": "desktop",
      }),
    ),
    justifyContent: Type.Optional(
      justifyContentRef({
        default: "justify-center",
      }),
    ),
    alignItems: Type.Optional(
      alignItemsRef({
        default: "items-center",
        description: "The vertical alignment of bricks within the section.",
      }),
    ),
    padding: Type.Optional(
      paddingRef({
        default: "p-4",
        description: "The padding of the section.",
        "ui:responsive": true,
        "default:mobile": "p-3",
      }),
    ),
    gap: Type.Optional(
      cssLengthRef({
        title: "Gap",
        description: "The gap between the bricks in the section.",
        default: "20px",
        "ui:styleId": "styles:gap",
      }),
    ),
    wrap: Type.Optional(
      Type.Boolean({
        title: "Wrap",
        description: "Wrap bricks if they overflow the section.",
        default: true,
      }),
    ),
    lastTouched: Type.Optional(
      Type.Number({
        description: "Do not use this field. It is used internally by the editor.",
        "ui:field": "hidden",
        "ai:hidden": true,
      }),
    ),
  },
  {
    additionalProperties: false,
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
    description:
      "Sections are direct children of the page that are stacked vertically, but they always align their children horizontally (flex-row).",
  },
);

const sectionDefaultprops = getSchemaDefaults(sectionSchema.properties.props, "desktop");
const sectionMobileDefaultprops = getSchemaDefaults(sectionSchema.properties.mobileProps, "mobile");

export type Section = Static<typeof sectionSchema>;

export function processSections(
  sections: Section[],
  siteAttributes: SiteAttributes,
  pageAttributes: PageAttributes,
) {
  const finalSections = sections.map((section) => {
    return {
      ...section,
      props: mergeIgnoringArrays({}, sectionDefaultprops, section.props),
      mobileProps: mergeIgnoringArrays({}, sectionMobileDefaultprops, section.mobileProps || {}),
      bricks: section.bricks.map(processBrick).filter(Boolean) as Brick[],
    } as const;
  });

  if (siteAttributes.navbar && !pageAttributes.noNavbar) {
    finalSections.unshift({
      order: -1,
      id: "navbar-section",
      label: "Navbar section",
      props: {
        variant: "navbar",
      },
      mobileProps: {},
      bricks: [
        {
          id: "navbar",
          type: "navbar",
          props: siteAttributes.navbar,
        },
      ],
    });
  }
  if (siteAttributes.footer && !pageAttributes.noFooter) {
    finalSections.push({
      order: 1000,
      id: "footer-section",
      label: "Footer section",
      props: {
        variant: "footer",
      },
      mobileProps: {},
      bricks: [
        {
          id: "footer",
          type: "footer",
          props: siteAttributes.footer,
        },
      ],
    });
  }

  return finalSections;
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
    props: mergeIgnoringArrays({} as Brick["props"], defProps.props, {
      ...brick.props,
      ...(brick.props.$children
        ? { $children: (brick.props.$children as T[]).map(processBrick).filter(Boolean) }
        : {}),
    }),
  };
  return result;
}

export function createEmptyBrick(type: string, ghost = false): Brick {
  const props = { ...defaultProps[type].props, ghost };
  const newBrick = {
    id: `b-${generateId()}`,
    type,
    props,
  };
  return newBrick;
}
