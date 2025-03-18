import { Type, type Static } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group, optional, prop } from "../props/helpers";
import { border } from "../props/border";
import { string, urlOrPageId } from "../props/string";
import { image } from "../props/image";
import { backgroundColor } from "../props/background";
import { color, textContent } from "../props/text";
import { shadow } from "../props/effects";
import { datasourceRef } from "../props/datasource";
import { fixedPositioned, position } from "../props/position";

export const datasource = Type.Array(
  Type.Object({
    href: urlOrPageId(),
    label: Type.String(),
  }),
  {
    default: [
      {
        href: "#",
        label: "Link 1",
      },
      {
        href: "#",
        label: "Link 2",
      },
      {
        href: "#",
        label: "Link 3",
      },
    ],
  },
);

export const manifest = defineBrickManifest({
  type: "header",
  kind: "widget",
  name: "Header",
  description: "A header with logo and navigation",
  datasource,
  duplicatable: false,
  defaultHeight: {
    desktop: 3,
    mobile: 3,
  },
  maxHeight: {
    desktop: 3,
    mobile: 3,
  },
  minHeight: {
    desktop: 3,
    mobile: 3,
  },
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="11" width="18" height="8" rx="2" ry="2"></rect>
    <rect x="5" y="13" width="6" height="3" rx="1"></rect>
    <line x1="13" y1="14" x2="15" y2="14"></line>
    <line x1="17" y1="14" x2="19" y2="14"></line></svg>`,

  props: defineProps({
    container: group({
      title: "Container",
      children: {
        border: border(),
        backgroundColor: backgroundColor(),
        shadow: shadow(),
        fixedPositioned: fixedPositioned(),
      },
    }),
    brand: group({
      title: "Brand",
      children: {
        name: textContent("Brand name", "Acme Inc."),
        logo: optional(image("Logo")),
        color: color(),
      },
    }),
    navigation: group({
      title: "Links",
      children: {
        position: prop({
          title: "Position",
          schema: Type.Union(
            [
              Type.Literal("left", { title: "Left" }),
              Type.Literal("center", { title: "Center" }),
              Type.Literal("right", { title: "Right" }),
            ],
            { default: "right" },
          ),
        }),
        items: datasourceRef(),
        navItems: prop({
          title: "Nav items",
          schema: Type.Array(
            Type.Object({
              urlOrPageId: urlOrPageId(),
            }),
            { title: "Navigation items", default: [] },
          ),
        }),
      },
    }),
  }),
});

export type Manifest = typeof manifest;
