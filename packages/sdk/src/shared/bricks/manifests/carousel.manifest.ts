import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { commonProps } from "../props/common";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { LAYOUT_COLS } from "~/shared/layout-constants";
import { commonStyleProps } from "../props/style-props";

export const manifest = defineBrickManifest({
  type: "carousel",
  kind: "widget",
  title: "Carousel",
  description: "A carousel element",
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
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <!-- Main container -->
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>

    <!-- Main image rectangle -->
    <rect x="6" y="6" width="12" height="8" rx="1"></rect>

    <!-- Navigation dots with more spacing -->
    <circle cx="9" cy="17" r="0.5" fill="currentColor"></circle>
    <circle cx="12" cy="17" r="0.5" fill="currentColor"></circle>
    <circle cx="15" cy="17" r="0.5" fill="currentColor"></circle>
</svg>
  `,
  props: Type.Composite([commonProps, commonStyleProps]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);
