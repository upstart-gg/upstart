import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { commonProps, contentAwareHeroProps, contentAwareProps } from "../props/common";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { LAYOUT_COLS } from "~/shared/layout-constants";
import {
  layout,
  border,
  background,
  getTextShadowSchema,
  alignFlex,
  alignFlexProps,
  alignBasicProps,
} from "../props/style-props";

const heroProps = Type.Object(
  {
    heroSize: Type.Union(
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
      },
    ),
    textShadow: getTextShadowSchema({
      "ui:group": "hero",
      "ui:group:title": "Display",
    }),
  },
  {
    title: "Display",
    default: {
      heroSize: "hero-size-lg",
      textShadow: "text-shadow-md",
    },
  },
);

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
    heroProps,
    alignBasicProps,
    contentAwareHeroProps,
    commonProps,
    Type.Object({ layout, border, background }),
  ]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);
