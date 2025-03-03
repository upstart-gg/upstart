import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import {
  commonProps,
  commonStyleProps,
  containerChildrenProps,
  containerLayoutProps,
  datasourceRefProps,
} from "../props/all";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { LAYOUT_COLS } from "~/shared/layout-constants";

// Generic container can hold any type of array data source
export const manifest = defineBrickManifest({
  type: "container",
  kind: "brick",
  title: "Container",
  description: "A container that can hold other bricks and align them horizontally or vertically",
  isContainer: true,
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
  // svg icon for the "container" brick
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <!-- Main container -->
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>

    <!-- Horizontal line -->
    <line x1="3" y1="12" x2="21" y2="12"></line>

    <!-- Vertical line -->
    <line x1="12" y1="3" x2="12" y2="21"></line>
</svg>
  `,
  props: Type.Composite([
    containerLayoutProps,
    containerChildrenProps,
    commonProps,
    datasourceRefProps,
    commonStyleProps,
  ]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);
