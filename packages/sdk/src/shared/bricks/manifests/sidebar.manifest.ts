import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group } from "../props/helpers";
import { VscLayoutSidebarLeftOff } from "react-icons/vsc";
import { Type } from "@sinclair/typebox";
import { urlOrPageId } from "../props/string";
import { backgroundColor } from "../props/background";
import { border } from "../props/border";
import { fixedPositioned } from "../props/position";
import type { BrickProps } from "../props/types";
import { shadow } from "../props/effects";
import type { BrickExample } from "./_types";

export const manifest = defineBrickManifest({
  type: "sidebar",
  category: "layout",
  name: "Sidebar",
  description: "A sidebar element",
  inlineDragDisabled: true,
  isGlobalBrick: true,
  duplicatable: false,
  resizable: false,
  movable: false,
  aiInstructions: `
    This brick should be used on most sites/pages for navigation. By default, it will display links
    to the main pages of the site. You can customize the links by using the 'navigation.navItems' prop.
  `.trim(),
  icon: VscLayoutSidebarLeftOff,
  props: defineProps({
    container: Type.Optional(
      group({
        title: "Main element",
        children: {
          backgroundColor: Type.Optional(backgroundColor()),
          border: Type.Optional(border()),
          shadow: Type.Optional(shadow()),
          fixedPositioned: Type.Optional(fixedPositioned()),
        },
        metadata: {
          "ui:responsive": true,
        },
      }),
    ),
    navigation: Type.Optional(
      group({
        title: "Links",
        children: {
          navItems: Type.Optional(
            Type.Array(
              Type.Object({
                urlOrPageId: urlOrPageId(),
                label: Type.Optional(Type.String({ title: "Label" })),
              }),
              { title: "Navigation items", default: [] },
            ),
          ),
        },
      }),
    ),
  }),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  {
    description: "Standard sidebar with navigation links base on site pages",
    type: "sidebar",
    props: {},
  },
  {
    description: "Sidebar with specified navigation links",
    type: "sidebar",
    props: {
      container: {
        backgroundColor: "#f0f0f0",
      },
      navigation: {
        navItems: [
          { urlOrPageId: "https://google.com", label: "Google" },
          { urlOrPageId: "https://bing.com", label: "Bing" },
        ],
      },
    },
  },
];
