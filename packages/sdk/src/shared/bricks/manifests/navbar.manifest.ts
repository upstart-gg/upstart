import { Type } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group, optional, prop } from "../props/helpers";
import { border } from "../props/border";
import { urlOrPageId } from "../props/string";
import { image } from "../props/image";
import { backgroundColor } from "../props/background";
import { color, textContent } from "../props/text";
import { shadow } from "../props/effects";
import { datasourceRef } from "../props/datasource";
import { fixedPositioned } from "../props/position";
import { boolean } from "../props/boolean";
import { VscLayoutPanelOff } from "react-icons/vsc";

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
  type: "navbar",
  kind: "widget",
  name: "Navbar",
  description: "A navigation bar with logo and navigation",
  aiInstructions: "This brick should be used on most sites/pages.",
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
  icon: VscLayoutPanelOff,
  iconClassName: "rotate-180",
  props: defineProps({
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
    brand: group({
      title: "Brand",
      children: {
        name: optional(textContent("Brand name", "Acme Inc.", { disableSizing: true })),
        logo: optional(image("Logo", { noObjectOptions: true })),
        hideText: optional(boolean("Hide text")),
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
        color: color(),
        datasource: optional(datasourceRef()),
        staticItems: optional(
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
