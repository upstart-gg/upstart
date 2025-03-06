import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { commonProps } from "../props/all";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { LAYOUT_COLS } from "~/shared/layout-constants";
import { textContentProps } from "../props/text";

export const manifest = defineBrickManifest({
  type: "footer",
  kind: "widget",
  title: "Footer",
  description: "A footer with links and social media icons",
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
    <rect x="3" y="12" width="18" height="8" rx="2" ry="2"></rect>

    <!-- First column: single line aligned with top -->
    <line x1="6" y1="14.5" x2="8" y2="14.5"></line>

    <!-- Middle column: three lines -->
    <line x1="11" y1="14.5" x2="13" y2="14.5"></line>
    <line x1="11" y1="16" x2="13" y2="16"></line>
    <line x1="11" y1="17.5" x2="13" y2="17.5"></line>

    <!-- Last column: three lines -->
    <line x1="16" y1="14.5" x2="18" y2="14.5"></line>
    <line x1="16" y1="16" x2="18" y2="16"></line>
    <line x1="16" y1="17.5" x2="18" y2="17.5"></line>
</svg>
  `,
  props: Type.Composite([textContentProps, commonProps]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);
