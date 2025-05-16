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
    container: group({
      title: "Main element",
      children: {
        backgroundColor: backgroundColor(),
        border: optional(border()),
        shadow: optional(shadow()),
        fixedPositioned: optional(fixedPositioned()),
      },
      metadata: {
        "ui:responsive": true,
      },
    }),
    navigation: group({
      title: "Links",
      children: {
        datasource: optional(datasourceRef()),
        navItems: optional(
          prop({
            title: "Nav items",
            schema: Type.Array(
              Type.Object({
                urlOrPageId: urlOrPageId(),
              }),
              { title: "Navigation items", default: [] },
            ),
          }),
        ),
      },
    }),
  }),
});

export type Manifest = typeof manifest;
