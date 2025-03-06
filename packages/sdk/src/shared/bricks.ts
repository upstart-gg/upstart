import { Type, type Static } from "@sinclair/typebox";
import { customAlphabet } from "nanoid";
import { LAYOUT_COLS } from "./layout-constants";
import { defaults } from "./bricks/manifests/all-manifests";
import type { BrickManifest } from "./brick-manifest";

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
  x: Type.Union(
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
        "The column start (0-based) in grid units, not pixels. Can use aliases like 'half' to represent half of the grid.",
    },
  ),
  y: Type.Number({
    title: "Y",
    description: "The row start (0-based) in grid units, not pixels.",
  }),
  w: Type.Union(
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
    },
  ),
  h: Type.Union([
    Type.Number({
      title: "Height",
      description: "The height in rows in grid units, not pixels.",
    }),
  ]),
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
  props: Type.Record(Type.String(), Type.Unknown()),
  mobileProps: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  isContainer: Type.Optional(Type.Boolean()),
  parentId: Type.Optional(Type.String()),
  sectionId: Type.String(),
  position: Type.Object(
    {
      mobile: brickPositionSchema,
      desktop: brickPositionSchema,
    },
    {
      title: "Position",
      description: "The position of the brick in the layout.",
    },
  ),
});

export type Brick = Static<typeof brickSchema>;
export type BrickWithProps<M extends BrickManifest> = Omit<Brick, "props" | "mobileProps"> & {
  props: Static<M["props"]>;
  mobileProps: Partial<Static<M["props"]>>;
};
export type BricksLayout = Brick[];

const definedBrickSchema = Type.Composite([
  Type.Omit(brickSchema, ["id", "position", "sectionId"]),
  Type.Object({
    position: Type.Object({
      mobile: definedBrickPositionSchema,
      desktop: definedBrickPositionSchema,
    }),
  }),
]);

export type DefinedBrick = Static<typeof definedBrickSchema>;

export const sectionSchema = Type.Object({
  id: Type.String(),
  kind: Type.Literal("section"),
  label: Type.Optional(Type.String()),
  bricks: Type.Array(brickSchema),
  props: Type.Object({}, { additionalProperties: true }),
});

export type Section = Static<typeof sectionSchema>;
export type ResponsivePosition = Brick["position"];
export type DefinedSection = Omit<Section, "bricks" | "id" | "kind" | "props"> & {
  id?: string;
  props?: Record<string, unknown>;
  bricks: DefinedBrick[];
};

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
                : position.x,
    y: position.y,
    w:
      position.w === "full"
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
    const partialSection = {
      ...section,
      id: section.id ?? `section-${generateId()}`,
      props: section.props ?? {},
      kind: "section",
    } as const;
    return {
      ...partialSection,
      bricks: defineBricks(section.bricks, partialSection),
    };
  });
}

function defineBricks<B extends DefinedBrick[] = DefinedBrick[]>(
  bricks: B,
  section: { id: string },
): Brick[] {
  return bricks.map((brick) => {
    const id = `brick-${generateId()}`;
    return {
      id,
      sectionId: section.id,
      ...defaults[brick.type],
      ...brick,
      props: {
        ...brick.props,
        ...("childrenBricks" in brick.props
          ? {
              childrenBricks: (brick.props.childrenBricks as DefinedBrick[]).map((childBrick) => ({
                id: `brick-${generateId()}`,
                ...defaults[childBrick.type],
                ...childBrick,
                parentId: id,
                ...("position" in childBrick
                  ? {}
                  : {
                      position: {
                        mobile: {},
                        desktop: {},
                      },
                    }),
              })),
            }
          : {}),
      },
      position: {
        mobile: mapPosition(brick.position.mobile, "mobile"),
        desktop: mapPosition(brick.position.desktop, "desktop"),
      },
    };
  });
}
