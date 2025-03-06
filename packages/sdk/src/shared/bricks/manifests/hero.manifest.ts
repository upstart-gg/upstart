import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { LAYOUT_COLS } from "~/shared/layout-constants";
import { commonProps } from "../props/all";
import { layout } from "../props/layout";
import { border } from "../props/border";
import { background } from "../props/background";
import { effects } from "../props/effects";
import { align } from "../props/align";

const heroSize = Type.Union(
  [
    Type.Literal("hero-size-md", { title: "M" }),
    Type.Literal("hero-size-lg", { title: "L" }),
    Type.Literal("hero-size-xl", { title: "XL" }),
    Type.Literal("hero-size-2xl", { title: "2XL" }),
    Type.Literal("hero-size-3xl", { title: "3XL" }),
  ],
  {
    title: "Text size",
    default: "hero-size-lg",
    "ui:group": "hero",
    "ui:group:title": "Display",
    "ui:group:order": 0,
    "ui:display": "button-group",
    "ui:responsive": true,
  },
);

export const content = Type.String({
  default: "<h1>some text here</h1>",
  "ui:field": "hidden",
  "ui:paragraph-mode": "hero",
  "ui:group": "content",
  "ui:group:title": "Content",
  "ui:group:order": 3,
});

export const manifest = defineBrickManifest({
  type: "hero",
  title: "Hero",
  kind: "brick",
  description: "A big textual element for home pages",
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
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="10" y="10" width="80" height="80" rx="4" fill="none" stroke="currentColor" stroke-width="3"/>
  <rect x="20" y="35" width="60" height="12" rx="2" fill="currentColor"/>
  <rect x="20" y="52" width="40" height="12" rx="2" fill="currentColor"/>
</svg>
  `,
  props: Type.Composite([
    commonProps,
    Type.Object({ layout, border, background, effects, heroSize, align, content }),
  ]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);
