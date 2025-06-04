import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group, optional, prop } from "../props/helpers";
import { VscLayoutSidebarLeftOff } from "react-icons/vsc";
import { Type } from "@sinclair/typebox";
import { color } from "../props/text";
import { datasourceRef } from "../props/datasource";
import { urlOrPageId } from "../props/string";
import { backgroundColor } from "../props/background";
import { shadow } from "../props/effects";
import { border } from "../props/border";
import { fixedPositioned } from "../props/position";
import { preset } from "../props/preset";
import type { BrickProps } from "../props/types";

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
    // preset: optional(preset()),
    container: optional(
      group({
        title: "Main element",
        children: {
          backgroundColor: optional(backgroundColor()),
          border: optional(border()),
          shadow: optional(shadow()),
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
                  urlOrPageId: urlOrPageId(),
                  label: Type.String({
                    title: "Label",
                  }),
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
