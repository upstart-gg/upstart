import { Type, type Static, type TObject } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";
import { defaultProps } from "./bricks/manifests/all-manifests";
import { cssLengthRef } from "./bricks/props/css-length";
import { enumProp } from "./bricks/props/enum";
import { colorPresetRef } from "./bricks/props/preset";
import { mergeIgnoringArrays } from "./utils/merge";
import { getSchemaObjectDefaults } from "./utils/schema";
import { StringEnum } from "./utils/string-enum";

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
    backgroundColor: Type.Optional(
      colorPresetRef({
        title: "Background color",
        "ui:presets": {
          "primary-light": {
            previewBgClass: "bg-primary-light text-primary-content-light",
            value: { main: "bg-primary-light text-primary-content-light" },
            label: "Primary lighter",
          },
          "primary-light-gradient": {
            previewBgClass: "bg-gradient-to-br from-primary-300 to-primary-500 text-primary-content-light",
            value: { main: "from-primary-300 to-primary-500 text-primary-content-light" },
            label: "Primary light gradient",
          },
          primary: {
            previewBgClass: "bg-primary text-primary-content",
            label: "Primary",
            value: { main: "bg-primary text-primary-content" },
          },
          "primary-gradient": {
            previewBgClass: "bg-gradient-to-br from-primary-500 to-primary-700 text-primary-content",
            value: { main: "from-primary-500 to-primary-700 text-primary-content" },
            label: "Primary gradient",
          },
          "primary-dark": {
            previewBgClass: "bg-primary-dark text-primary-content",
            label: "Primary dark",
            value: { main: "bg-primary-dark text-primary-content" },
          },
          "primary-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-primary-700 to-primary-900 text-primary-content",
            value: { main: "from-primary-700 to-primary-900 text-primary-content" },
            label: "Primary dark gradient",
          },
          "secondary-light": {
            previewBgClass: "bg-secondary-light text-secondary-content-light",
            label: "Secondary light",
            value: { main: "bg-secondary-light text-secondary-content-light" },
          },
          "secondary-light-gradient": {
            previewBgClass:
              "bg-gradient-to-br from-secondary-300 to-secondary-500 text-secondary-content-light",
            value: {
              main: "from-secondary-300 to-secondary-500 text-secondary-content-light",
            },
            label: "Secondary light gradient",
          },
          secondary: {
            previewBgClass: "bg-secondary text-secondary-content",
            label: "Secondary",
            value: { main: "bg-secondary text-secondary-content" },
          },
          "secondary-gradient": {
            previewBgClass: "bg-gradient-to-br from-secondary-500 to-secondary-700 text-secondary-content",
            value: { main: "from-secondary-500 to-secondary-700 text-secondary-content" },
            label: "Secondary gradient",
          },
          "secondary-dark": {
            previewBgClass: "bg-secondary-dark text-secondary-content",
            label: "Secondary dark",
            value: { main: "bg-secondary-dark text-secondary-content" },
          },
          "secondary-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-secondary-700 to-secondary-900 text-secondary-content",
            value: { main: "from-secondary-700 to-secondary-900 text-secondary-content" },
            label: "Secondary dark gradient",
          },
          "neutral-light": {
            previewBgClass: "bg-neutral-light text-neutral-content-light",
            value: { main: "bg-neutral-light text-neutral-content-light" },
            label: "Neutral light",
          },
          "neutral-light-gradient": {
            previewBgClass: "bg-gradient-to-br from-neutral-300 to-neutral-500 text-neutral-content-light",
            value: { main: "from-neutral-300 to-neutral-500 text-neutral-content-light" },
            label: "Neutral light gradient",
          },
          neutral: {
            previewBgClass: "bg-neutral text-neutral-content",
            label: "Neutral",
            value: { main: "bg-neutral text-neutral-content" },
          },
          "neutral-gradient": {
            previewBgClass: "bg-gradient-to-br from-neutral-500 to-neutral-700 text-neutral-content",
            value: { main: "from-neutral-500 to-neutral-700 text-neutral-content" },
            label: "Neutral gradient",
          },
          "neutral-dark": {
            previewBgClass: "bg-neutral-dark text-neutral-content",
            label: "Neutral dark",
            value: { main: "bg-neutral-dark text-neutral-content" },
          },
          "neutral-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-neutral-700 to-neutral-900 text-neutral-content",
            value: { main: "from-neutral-700 to-neutral-900 text-neutral-content" },
            label: "Neutral dark gradient",
          },
          base100: {
            previewBgClass: "bg-base-100 text-base-content",
            label: "Base 1",
            value: { main: "bg-base-100 text-base-content" },
          },

          base200: {
            previewBgClass: "bg-base-200 text-base-content",
            label: "Base 2",
            value: { main: "bg-base-200 text-base-content" },
          },

          none: { label: "None", value: {} },
        },
        default: "none",
      }),
    ),
    gradientDirection: Type.Optional(
      StringEnum(
        [
          "bg-gradient-to-t",
          "bg-gradient-to-r",
          "bg-gradient-to-b",
          "bg-gradient-to-l",
          "bg-gradient-to-tl",
          "bg-gradient-to-tr",
          "bg-gradient-to-br",
          "bg-gradient-to-bl",
        ],
        {
          title: "Gradient direction",
          description: "The direction of the gradient. Only applies when color preset is a gradient.",
          enumNames: [
            "Top",
            "Right",
            "Bottom",
            "Left",
            "Top left",
            "Top right",
            "Bottom right",
            "Bottom left",
          ],
          default: "bg-gradient-to-br",
          "ui:responsive": "desktop",
          "ui:styleId": "styles:gradientDirection",
          metadata: {
            filter: (manifestProps: TObject, formData: Section["props"]) => {
              return formData.backgroundColor?.includes("gradient") === true;
            },
          },
        },
      ),
    ),
    // background: Type.Optional(backgroundRef()),
    // preset: Type.Optional(presetRef()),
    minHeight: Type.Optional(
      cssLengthRef({
        title: "Min height",
        default: "fit-content",
        description: "The min height of the section",
        "ui:styleId": "minHeight",
        "ui:field": "hidden",
      }),
    ),
    purpose: Type.Optional(
      StringEnum(["navbar", "sidebar"], {
        title: "Specific purpose",
        description: "The purpose of the section. Used for styling and layout.",
        enumNames: ["Navbar", "Sidebar"],
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
          title: "Horizontal align.",
          "ui:placeholder": "Not specified",
          default: "justify-center",
          "ui:display": "icon-group",
          "ui:responsive": "desktop",
          "ui:icons": [
            "fluent:align-start-horizontal-20-regular",
            "fluent:align-center-vertical-20-regular",
            "fluent:align-end-horizontal-20-regular",
            "fluent:align-space-between-vertical-20-regular",
            "fluent:align-space-around-vertical-20-regular",
            "fluent:align-space-evenly-horizontal-20-regular",
          ],
        },
      ),
    ),
    alignItems: Type.Optional(
      StringEnum(["items-start", "items-center", "items-end"], {
        enumNames: ["Top", "Center", "Bottom"],
        title: "Vertical alignment",
        "ui:placeholder": "Not specified",
        default: "items-center",
        "ui:responsive": "desktop",
        "ui:display": "icon-group",
        "ui:icons": [
          "fluent:align-start-vertical-20-regular",
          "fluent:center-vertical-20-regular",
          "fluent:align-end-vertical-20-regular",
        ],
      }),
    ),
    gap: Type.Optional(
      cssLengthRef({
        title: "Gap",
        description: "The gap between the bricks in the section.",
        default: "20px",
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
      props: mergeIgnoringArrays({}, sectionDefaultprops, section.props),
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
    props: mergeIgnoringArrays({}, defProps.props, {
      ...brick.props,
      ...(brick.props.$children
        ? { $children: (brick.props.$children as T[]).map(processBrick).filter(Boolean) }
        : {}),
    }),
  };
  return result;
}
