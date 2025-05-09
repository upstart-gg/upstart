import { Type, type Static, TypeRegistry } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";
import { LAYOUT_COLS } from "./layout-constants";
import { defaultProps } from "./bricks/manifests/all-manifests";
import { attr } from "./attributes";
import { background } from "./bricks/props/background";
import { merge } from "lodash-es";
import { border } from "./bricks/props/border";
import { preset } from "./bricks/props/preset";

/**
 * Generates a unique identifier for bricks.
 */
export const generateId = customAlphabet("1234567890azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN", 7);

const brickPositionSchema = Type.Object({
  x: Type.Number({
    title: "X",
    description: "The column start (0-based) in grid units, not pixels.",
  }),
  y: Type.Number({
    title: "Y",
    description: "The row start (0-based) in grid units, not pixels.",
  }),
  w: Type.Number({
    title: "Width",
    description: "The width in columns in grid units, not pixels.",
  }),
  h: Type.Number({
    title: "Height",
    description: "The height in rows in grid units, not pixels.",
  }),
  manualHeight: Type.Optional(
    Type.Number({
      description: "Do not use this field. It is used internally by the editor.",
    }),
  ),
  hidden: Type.Optional(
    Type.Boolean({
      description: "Do not use this field. It is used internally by the editor.",
    }),
  ),
});

export type BrickPosition = Static<typeof brickPositionSchema>;

const definedBrickPositionSchema = Type.Object({
  x: Type.Optional(
    Type.Union(
      [
        Type.Number(),
        Type.Literal("half"),
        Type.Literal("third"),
        Type.Literal("twoThird"),
        Type.Literal("quarter"),
        Type.Literal("threeQuarter"),
      ],
      {
        title: "X",
        description:
          "The column start within the section in (0-based) grid units, not pixels. Can use aliases like 'half' to represent half of the grid. Do not specify if 0 (default)",
        default: 0,
      },
    ),
  ),
  y: Type.Optional(
    Type.Number({
      title: "Y",
      description: "The row start (0-based) in grid units, not pixels. Do not specify if 0 (default)",
      default: 0,
    }),
  ),
  w: Type.Optional(
    Type.Union(
      [
        Type.Number(),
        Type.Literal("full"),
        Type.Literal("half"),
        Type.Literal("third"),
        Type.Literal("twoThird"),
        Type.Literal("quarter"),
        Type.Literal("threeQuarter"),
      ],
      {
        title: "Width",
        description:
          "The width in columns in grid units, not pixels. Can use aliases like 'half' to represent half of the grid.",
        default: "full",
      },
    ),
  ),
  h: Type.Number({
    title: "Height",
    description: "The height in rows in grid units, not pixels.",
  }),
  hidden: Type.Optional(
    Type.Boolean({
      description: "Do not use this field. It is used internally by the editor.",
    }),
  ),
});

export type DefinedBrickPosition = Static<typeof definedBrickPositionSchema>;

export const brickSchema = Type.Object({
  id: Type.String({
    title: "ID",
    description: "A unique identifier for the brick.",
  }),
  type: Type.String({
    title: "Type",
  }),
  props: Type.Record(Type.String(), Type.Unknown(), {
    description: "The available props depends on the brick type.",
  }),
  mobileProps: Type.Optional(
    Type.Record(Type.String(), Type.Unknown(), {
      description: "The available props depends on the brick type.",
    }),
  ),
  // parentId: Type.Optional(
  //   Type.String({ title: "Parent ID", description: "The ID of the parent brick if the brick is nested." }),
  // ),
  // sectionId: Type.String({
  //   description: "The ID of the section the brick belongs to.",
  // }),
  $children: Type.Optional(
    Type.Array(Type.Ref("brick"), {
      title: "Children",
      description: "The children of the brick. Only used when the brick is a container.",
    }),
  ),
  position: Type.Optional(
    Type.Object(
      {
        mobile: brickPositionSchema,
        desktop: brickPositionSchema,
      },
      {
        title: "Position",
        description: "The position of the brick in the layout. Optional when the brick is a container child",
        additionalProperties: false,
      },
    ),
  ),
});

export type Brick = Static<typeof brickSchema>;
export type BricksLayout = Brick[];

export const definedBrickSchema = Type.Composite(
  [
    Type.Pick(brickSchema, ["type", "props", "sectionId", "parentId", "$children"]),
    Type.Object({
      id: Type.Optional(
        Type.String({
          description: "ai:instructions: Do not generate this.",
        }),
      ),
      mobileProps: Type.Optional(brickSchema.properties.props),
      position: Type.Object({
        desktop: definedBrickPositionSchema,
        mobile: definedBrickPositionSchema,
      }),
    }),
  ],
  { $id: "brick", additionalProperties: false },
);

export type DefinedBrick = Static<typeof definedBrickSchema>;

const sectionProps = Type.Object(
  {
    background: Type.Optional(background()),
    preset: preset(),
    border: Type.Optional(border()),
    maxWidth: Type.Optional(
      attr.enum("Width", "max-w-full", {
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
        "ui:group": "layout",
        "ui:group:order": 3,
        "ui:group:title": "Layout",
      }),
    ),
    $paddingHorizontal: Type.Optional(
      attr.number("Horizontal spacing", 20, {
        min: 0,
        description: "Horizontal spacing. Desktop only",
        displayAs: "button-group",
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
    position: Type.Object(
      {
        mobile: Type.Object(
          {
            h: Type.Optional(
              Type.Union([Type.Number(), Type.Literal("full")], {
                title: "Section height on mobile",
                description: "The height in grid rows unit, not pixels. You can also use the 'full' alias.",
              }),
            ),
          },
          { additionalProperties: false },
        ),
        desktop: Type.Object(
          {
            h: Type.Union([Type.Number(), Type.Literal("full")], {
              title: "Section height on desktop",
              description: "The height in grid rows unit, not pixels. You can also use the 'full' alias.",
            }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
    order: Type.Number({
      description: "Determines section order in the page (lower numbers appear first). 0-based",
    }),
    props: sectionProps,
    mobileProps: Type.Optional(Type.Partial(sectionProps, { additionalProperties: false })),
    bricks: Type.Array(brickSchema),
  },
  { $id: "section", additionalProperties: false },
);

export type Section = Static<typeof sectionSchema>;

export type ResponsivePosition = Brick["position"];

export const definedSectionSchema = Type.Composite([
  Type.Omit(sectionSchema, ["bricks"]),
  Type.Object({
    bricks: Type.Array(definedBrickSchema),
  }),
]);
export type DefinedSection = Static<typeof definedSectionSchema>;

export type LayoutCols = {
  mobile: number;
  desktop: number;
};

function mapPosition(
  position: DefinedBrickPosition,
  mode: "desktop" | "mobile",
  cols: LayoutCols = LAYOUT_COLS,
): BrickPosition {
  return {
    x:
      position.x === "quarter"
        ? cols[mode] / 4
        : position.x === "threeQuarter"
          ? cols[mode] * 0.75
          : position.x === "half"
            ? cols[mode] / 2
            : position.x === "third"
              ? cols[mode] / 3
              : position.x === "twoThird"
                ? (cols[mode] * 2) / 3
                : position.x ?? 0,
    y: position.y ?? 0,
    w:
      position.w === "full" || typeof position.w === "undefined"
        ? cols[mode]
        : position.w === "half"
          ? cols[mode] / 2
          : position.w === "third"
            ? cols[mode] / 3
            : position.w === "quarter"
              ? cols[mode] / 4
              : position.w === "twoThird"
                ? (cols[mode] * 2) / 3
                : position.w === "threeQuarter"
                  ? (cols[mode] * 3) / 4
                  : position.w,
    h: position.h,
    hidden: position.hidden,
  };
}

export function defineSections(sections: DefinedSection[]): Section[] {
  return sections.map((section) => {
    return {
      ...section,
      // props: section.props ?? {},
      // mobileProps: section.mobileProps ?? {},
      bricks: section.bricks.map(defineBrick),
      // kind: "section",
    } as const;
  });
}

export function defineBricks<B extends DefinedBrick[] = DefinedBrick[]>(bricks: B): Brick[] {
  return bricks.map(defineBrick);
}

export function getPositionDefaults() {
  return {
    desktop: {
      w: 0,
      h: 0,
      x: 0,
      y: 0,
    },
    mobile: {
      w: 0,
      h: 0,
      x: 0,
      y: 0,
    },
  };
}

export function defineBrick(brick: DefinedBrick): Brick {
  const id = brick.id ?? `brick-${generateId()}`;
  return {
    id,
    ...brick,
    props: {
      ...merge({}, defaultProps[brick.type].props, brick.props),
      ...("$children" in brick.props
        ? {
            $children: (brick.props.$children as DefinedBrick[]).map((childBrick) => ({
              ...childBrick,
              id: childBrick.id ?? `brick-${generateId()}`,
              // parentId: id,
              // sectionId: brick.sectionId,
              position: { mobile: {}, desktop: {} },
              props: merge({}, defaultProps[childBrick.type].props, childBrick.props),
            })),
          }
        : {}),
    },
    mobileProps: (brick.mobileProps ?? {}) as Brick["mobileProps"],
    position: brick.position
      ? {
          mobile: mapPosition(brick.position.mobile, "mobile"),
          desktop: mapPosition(brick.position.desktop, "desktop"),
        }
      : getPositionDefaults(),
  };
}
