import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { commonProps, textContentProps } from "../props/all";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { LAYOUT_COLS } from "~/shared/layout-constants";

export const manifest = defineBrickManifest({
  type: "icon",
  title: "Icon",
  kind: "brick",
  description: "An icon with optional text",
  repeatable: true,
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
  icon: `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <path d="M7 12 L12 7 L17 12 L12 17 Z"></path>
</svg>
  `,
  props: Type.Composite([textContentProps, commonProps]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);
