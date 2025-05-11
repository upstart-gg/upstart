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

const softBorderedPresets = [1, 2, 3, 4].reduce(
  (acc, i) => {
    const id = `soft-bordered-${i}`;
    acc[id] = {
      label: `Soft Bordered ${i}`,
      previewClasses: `color-auto border-b-4 bg-transparent preset-border-<variant>-${i}`,
      props: {
        container: {
          border: {
            side: ["border-b"],
            color: `preset-border-<variant>-${i}`,
            radius: "rounded-none",
            style: "border-solid",
            width: "border-4",
          },
          backgroundColor: `bg-transparent`,
          shadow: "shadow-none",
        },
        brand: {
          color: "color-auto",
        },
      },
    };
    return acc;
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  {} as Record<string, any>,
);

const gradientPresets = [1, 2, 3, 4].reduce(
  (acc, i) => {
    const id = `gradient-${i}`;
    acc[id] = {
      label: `Gradient ${i}`,
      previewClasses: `preset-bg-gradient-<variant>-${i} color-auto`,
      props: {
        container: {
          backgroundColor: `preset-bg-gradient-<variant>-${i}`,
          shadow: "shadow-none",
          border: {
            width: "border-0",
          },
        },
        brand: {
          color: "color-auto",
        },
      },
    };
    return acc;
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  {} as Record<string, any>,
);
const solidPresets = [1, 2, 3, 4].reduce(
  (acc, i) => {
    const id = `solid-${i}`;
    acc[id] = {
      label: `Solid ${i}`,
      previewClasses: `preset-bg-solid-<variant>-${i} color-auto`,
      props: {
        container: {
          backgroundColor: `preset-bg-solid-<variant>-${i}`,
          shadow: "shadow-none",
          border: {
            width: "border-0",
          },
        },
        brand: {
          color: "color-auto",
        },
      },
    };
    return acc;
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  {} as Record<string, any>,
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
  presets: {
    ...softBorderedPresets,
    ...solidPresets,
    ...gradientPresets,
  },
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
