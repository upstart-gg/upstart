import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group, optional, prop } from "../props/helpers";
import { VscLayoutSidebarLeftOff } from "react-icons/vsc";
import { Type } from "@sinclair/typebox";
import { datasourceRef } from "../props/datasource";
import { string, urlOrPageId, urlOrPageIdRef } from "../props/string";
import { backgroundColor, backgroundColorRef } from "../props/background";
import { border, borderRef } from "../props/border";
import { fixedPositioned } from "../props/position";
import { preset } from "../props/preset";
import type { BrickProps } from "../props/types";
import type { FC } from "react";
import { shadowRef } from "../props/effects";

export const manifest = defineBrickManifest({
  type: "sidebar",
  kind: "widget",
  name: "Sidebar",
  description: "A sidebard element",
  aiInstructions: `
    This brick should be used on most sites/pages for navigation. By deault, it will display links
    to the main pages of the site. You can customize the links by using the 'navigation.navItems' prop.
  `.trim(),
  icon: VscLayoutSidebarLeftOff,
  props: defineProps({
    container: optional(
      group({
        title: "Main element",
        children: {
          backgroundColor: optional(backgroundColorRef()),
          border: optional(borderRef),
          shadow: optional(shadowRef()),
          fixedPositioned: optional(fixedPositioned()),
        },
        metadata: {
          "ui:responsive": true,
        },
      }),
    ),
    navigation: optional(
      group({
        title: "Links",
        children: {
          datasource: optional(datasourceRef()),
          navItems: optional(
            prop({
              title: "Nav items",
              schema: Type.Array(
                Type.Object({
                  urlOrPageId: urlOrPageIdRef(),
                  label: optional(string("Label")),
                }),
                { title: "Navigation items", default: [] },
              ),
            }),
          ),
        },
      }),
    ),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
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
