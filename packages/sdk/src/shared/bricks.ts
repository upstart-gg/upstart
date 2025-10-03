import { Type, type Static } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";
import { defaultProps, manifests } from "./bricks/manifests/all-manifests";
import { cssLength } from "./bricks/props/css-length";
import { colorPreset } from "./bricks/props/color-preset";
import { mergeIgnoringArrays } from "./utils/merge";
import { getSchemaDefaults } from "./utils/schema";
import { StringEnum } from "./utils/string-enum";
import { alignItems, justifyContent } from "./bricks/props/align";
import type { CommonBrickProps } from "./bricks/props/common";
import { direction } from "./bricks/props/direction";
import type { PageAttributes, SiteAttributes } from "./attributes";
import { toLLMSchema } from "./utils/llm";
import { background } from "./bricks/props/background";

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

export const brickSchema = Type.Object({
  id: Type.String({
    title: "ID",
    description: "A unique identifier for the brick.",
  }),
  type: brickTypeSchema,
  label: Type.Optional(
    Type.String({
      title: "Label",
      description: "A human-readable label for the brick. Used for organization and identification.",
    }),
  ),
  props: Type.Any({
    title: "Props",
    description: "The static props of the brick. The available props depends on the brick type.",
  }),
  mobileProps: Type.Optional(
    Type.Any({
      title: "Props",
      description:
        "The overriden props for mobile, merged with desktop props. Same type as props but partial.",
    }),
  ),
});

export function makeFullBrickSchemaForLLM(type: string, otherTypes?: string[]) {
  if (!otherTypes || !otherTypes.length) {
    return toLLMSchema(
      Type.Object(
        {
          id: Type.String({
            title: "ID",
            description: "A unique identifier for the brick.",
          }),
          type: Type.Literal(type),
          props: manifests[type].props,
          // Mobileprops are always partial and do not contain $children
          mobileProps: Type.Optional(Type.Partial(Type.Omit(manifests[type].props, ["$children"]))),
        },
        // IMPORTANT: DO NOT set "additionalProperties" to `false` because it would break validation with Cabidela library
        // { additionalProperties: false },
      ),
    );
  }
  return toLLMSchema(
    Type.Object(
      {
        id: Type.String({
          title: "ID",
          description: "A unique identifier for the brick.",
        }),
        type: Type.Literal(type),
        props: Type.Composite([
          brickSchema.properties.props,
          Type.Object({
            $children: Type.Array(
              Type.Union(
                otherTypes.map((t) =>
                  Type.Object({
                    id: Type.String({
                      title: "ID",
                      description: "A unique identifier for the brick.",
                    }),
                    type: Type.Literal(t),
                    props: manifests[t].props,
                    mobileProps: Type.Optional(Type.Partial(Type.Omit(manifests[t].props, ["$children"]))),
                  }),
                ),
              ),
            ),
          }),
        ]),
        mobileProps: Type.Optional(Type.Partial(manifests[type].props)),
      },
      // IMPORTANT: DO NOT set "additionalProperties" to `false` because it would break validation with Cabidela library
      // { additionalProperties: false },
    ),
  );
}

export type Brick = Omit<Static<typeof brickSchema>, "props" | "mobileProps"> & {
  props: CommonBrickProps & Record<string, unknown>;
  mobileProps?: Partial<CommonBrickProps & Record<string, unknown>>;
};

export const sectionProps = Type.Object({
  colorPreset: Type.Optional(
    colorPreset({
      title: "Color",
    }),
  ),
  backgroundImage: Type.Optional(
    background({
      title: "Background",
    }),
  ),
  direction: Type.Optional(
    direction({
      default: "flex-row",
      title: "Direction",
      description:
        "The direction of the section. Only apply to desktop. On mobile, it is always vertical. By default, horizontal (row), which is the most common.",
      "ui:responsive": "desktop",
    }),
  ),
  minHeight: Type.Optional(
    cssLength({
      title: "Min height",
      default: "fit-content",
      description:
        "The min height of the section. default is 'fit-content'. You can also use  the keyword 'full' to make it full viewport height. Lastly, you can use any valid CSS length unit.",
      "ui:field": "hidden",
    }),
  ),
  variant: Type.Optional(
    StringEnum(["navbar", "footer", "sidebar"], {
      title: "Custom section variant",
      description: "Used for custom styling and layout.",
      enumNames: ["Navbar", "Footer", "Sidebar"],
      "ui:field": "hidden",
      "ai:hidden": true,
    }),
  ),
  maxWidth: Type.Optional(
    StringEnum(["max-w-screen-lg", "max-w-screen-xl", "max-w-screen-2xl", "max-w-full"], {
      title: "Max width",
      default: "max-w-full",
      enumNames: ["M", "L", "XL", "Full"],
      description: "The maximum width of the section. Desktop only",
      "ai:instructions":
        "Choose the most appropriate max width for the section. The value 'max-w-full' is the most common and the default. Use the same value for all sections on the same page unless there is a good reason to do otherwise.",
      displayAs: "button-group",
      "ui:responsive": "desktop",
    }),
  ),
  verticalMargin: Type.Optional(
    cssLength({
      title: "Vertical Margin",
      description:
        "The vertical margin of the section. By default, all sections touch each other with no space in between. If you want to add space between sections, set this value to e.g. '2rem' or '32px'. Adding a vertical margin will reveal the background color of the page.",
      default: "0",
      "ui:styleId": "styles:verticalMargin",
    }),
  ),
  justifyContent: Type.Optional(
    justifyContent({
      default: "justify-center",
    }),
  ),
  alignItems: Type.Optional(
    alignItems({
      default: "items-center",
    }),
  ),
  padding: Type.Optional(
    cssLength({
      default: "2rem",
      description: "Padding inside the section.",
      title: "Padding",
      "ui:responsive": true,
      "ui:placeholder": "Not specified",
      "ui:styleId": "styles:padding",
    }),
  ),
  gap: Type.Optional(
    cssLength({
      title: "Gap",
      description: "The gap between the bricks in the section.",
      default: "2rem",
      "ui:styleId": "styles:gap",
    }),
  ),
  wrap: Type.Optional(
    Type.Boolean({
      title: "Wrap",
      description: "Wrap bricks if they overflow the section.",
      default: true,
      "ui:styleId": "styles:wrap",
    }),
  ),
  lastTouched: Type.Optional(
    Type.Number({
      description: "Do not use this field. It is used internally by the editor.",
      "ui:field": "hidden",
      "ai:hidden": true,
    }),
  ),
});

export const sectionSchema = Type.Object(
  {
    id: Type.String({
      description: "The unique ID of the section. Use a human readable url-safe slug",
      examples: ["content-section", "contact-section"],
    }),
    label: Type.String({
      description: "The label of the section. Shown only to the website owner, not public.",
      examples: ["Content", "Contact"],
    }),
    order: Type.Number({
      description: "Determines section order in the page (lower numbers appear first). 0-based",
    }),
    props: sectionProps,
    mobileProps: Type.Optional(Type.Partial(sectionProps)),
    bricks: Type.Array(brickSchema),
  },
  {
    description: "Sections are direct children of the page that are stacked vertically.",
  },
);

export const sectionSchemaNoBricks = Type.Omit(sectionSchema, ["bricks"]);
export type SectionSchemaNoBricks = Static<typeof sectionSchemaNoBricks>;

const sectionDefaultprops = getSchemaDefaults(sectionSchema.properties.props, "desktop") as Section["props"];
const sectionMobileDefaultprops = getSchemaDefaults(
  sectionSchema.properties.mobileProps,
  "mobile",
) as Section["mobileProps"];

export type Section = Static<typeof sectionSchema>;

export function processSections(
  sections: Section[],
  siteAttributes: SiteAttributes,
  pageAttributes: PageAttributes,
): Section[] {
  const processSection = (section: Section) => {
    return {
      ...section,
      props: mergeIgnoringArrays({} as Section["props"], sectionDefaultprops, section.props),
      mobileProps: mergeIgnoringArrays({}, sectionMobileDefaultprops, section.mobileProps || {}),
      bricks: section.bricks.map(processBrick).filter(Boolean) as Brick[],
    } as const;
  };

  const finalSections = sections.map(processSection);

  // if (siteAttributes.navbar && !pageAttributes.noNavbar) {
  //   finalSections.unshift(
  //     processSection({
  //       order: -1,
  //       id: "navbar-section",
  //       label: "Navbar",
  //       props: {
  //         variant: "navbar",
  //         direction: "flex-row",
  //       },
  //       mobileProps: {},
  //       bricks: [
  //         {
  //           id: "navbar",
  //           type: "navbar",
  //           props: siteAttributes.navbar,
  //         },
  //       ],
  //     }),
  //   );
  // }
  // if (siteAttributes.footer && !pageAttributes.noFooter) {
  //   finalSections.push(
  //     processSection({
  //       order: 1000,
  //       id: "footer-section",
  //       label: "Footer",
  //       props: {
  //         variant: "footer",
  //         direction: "flex-row",
  //       },
  //       mobileProps: {},
  //       bricks: [
  //         {
  //           id: "footer",
  //           type: "footer",
  //           props: siteAttributes.footer,
  //         },
  //       ],
  //     }),
  //   );
  // }

  return finalSections satisfies Section[];
}

/**
 *  process a brick and add default props
 */
export function processBrick<T extends Brick>(brick: T): T {
  const defProps = defaultProps[brick.type];
  // if (!defProps) {
  //   console.warn(`No default props found for brick type: ${brick.type}`);
  //   return false; // or throw an error if you prefer
  // }
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

export function getDefaultPropsForBrick(type: string) {
  return defaultProps[type].props;
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
