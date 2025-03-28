import { Type } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group } from "../props/helpers";
import { basicAlign } from "../props/align";
import { background } from "../props/background";
import { border } from "../props/border";
import { textContent } from "../props/text";

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
  props: defineProps({
    content: textContent("I'm a big text"),
    styles: group({
      title: "Styles",
      children: {
        border: border(),
        background: background(),
        align: basicAlign(),
        textSize: heroSize,
      },
    }),
  }),
});

export type Manifest = typeof manifest;
