import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { commonProps } from "../props/all";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { LAYOUT_COLS } from "~/shared/layout-constants";
import { textContentProps } from "../props/text";

export const manifest = defineBrickManifest({
  type: "header",
  kind: "widget",
  title: "Header",
  description: "A header with logo and navigation",
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
  // svg icon for the "card" brick
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <!-- Main container -->
    <rect x="3" y="11" width="18" height="8" rx="2" ry="2"></rect>

    <!-- Logo area (rectangular) -->
    <rect x="5" y="13" width="6" height="3" rx="1"></rect>

    <!-- Navigation menu items (right-aligned, horizontal) -->
    <line x1="13" y1="14" x2="15" y2="14"></line>
    <line x1="17" y1="14" x2="19" y2="14"></line>
</svg>
  `,
  props: Type.Composite([textContentProps, commonProps]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);
