import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { commonProps } from "../props/all";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { LAYOUT_COLS } from "~/shared/layout-constants";

export const manifest = defineBrickManifest({
  type: "loop",
  kind: "widget",
  title: "Loop",
  description: "Allow users to loop through a list of items",
  preferredWidth: {
    mobile: LAYOUT_COLS.mobile / 2,
    desktop: LAYOUT_COLS.desktop / 4,
  },
  preferredHeight: {
    mobile: 6,
    desktop: 6,
  },
  minWidth: {
    mobile: 3,
    desktop: 3,
  },
  minHeight: {
    mobile: 3,
    desktop: 3,
  },
  // svg icon for the "loop" brick
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <!-- Main container -->
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>

    <!-- Loop arrow -->
    <path d="M8 12 L12 16 L16 12"></path>
    <path d="M8 12 L12 8 L16 12"></path>
</svg>
  `,
  props: Type.Composite([
    commonProps,
    Type.Object({
      layoutType: Type.Union([
        Type.Literal("vertical", { title: "Vertical" }),
        Type.Literal("horizontal", { title: "Horizontal" }),
        Type.Literal("grid", { title: "Grid" }),
      ]),
      gap: Type.Optional(Type.Number({ default: 0 })),
      columns: Type.Optional(Type.Number({ default: 2 })),
      children: Type.Array(Type.Any()),
      data: Type.Union([
        Type.Array(Type.Any()),
        Type.Object({
          datasourceId: Type.String(),
        }),
      ]),
    }),
  ]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);
