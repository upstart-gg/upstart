import { Type } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group } from "../props/helpers";
import { basicAlign } from "../props/align";
import { background } from "../props/background";
import { border } from "../props/border";
import { color, textContent } from "../props/text";
import { pad } from "lodash-es";
import { padding } from "../props/padding";

const heroSize = Type.Union(
  [
    Type.Literal("hero-size-1", { title: "M" }),
    Type.Literal("hero-size-2", { title: "L" }),
    Type.Literal("hero-size-3", { title: "XL" }),
    Type.Literal("hero-size-4", { title: "2XL" }),
    Type.Literal("hero-size-5", { title: "3XL" }),
  ],
  {
    $id: "#styles:heroSize",
    title: "Text size",
    default: "hero-size-1",
    "ui:display": "button-group",
    "ui:responsive": true,
  },
);

export const manifest = defineBrickManifest({
  type: "hero",
  name: "Hero",
  kind: "brick",
  description: "A big textual element for home pages",
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect x="10" y="10" width="80" height="80" rx="4" fill="none" stroke="currentColor" stroke-width="3"/>
    <rect x="20" y="35" width="60" height="12" rx="2" fill="currentColor"/>
    <rect x="20" y="52" width="40" height="12" rx="2" fill="currentColor"/></svg>`,

  defaultHeight: { desktop: 5, mobile: 5 },
  defaultWidth: { desktop: 12, mobile: 12 },

  props: defineProps({
    content: textContent("I'm a big text"),
    border: border(),
    background: background(),
    color: color(),
    align: basicAlign(),
    padding: padding("p-4"),
    textSize: heroSize,
  }),
});

export type Manifest = typeof manifest;
