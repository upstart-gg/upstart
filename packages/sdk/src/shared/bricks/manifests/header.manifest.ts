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

const borderedPresets = [1, 2, 3, 4, 5].reduce(
  (acc, i) => {
    const id = `bordered-${i}`;
    acc[id] = {
      label: `Bordered ${i}`,
      previewClasses: `preset-bg-gradient-<variant>-${i} color-auto border-b-4 preset-border-<variant>-${i}`,
      props: {
        container: {
          backgroundColor: `preset-bg-gradient-<variant>-${i}`,
          border: {
            side: ["border-b"],
            color: `preset-border-<variant>-${i}`,
            radius: "rounded-none",
            style: "border-solid",
            width: "border-2",
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

const borderedAltPresets = [1, 2, 3, 4, 5].reduce(
  (acc, i) => {
    const id = `bordered-alt-${i}`;
    acc[id] = {
      label: `Bordered ${i}`,
      previewClasses: `preset-bg-gradient-<variant>-${i} color-auto border-b-4 preset-border-accent-${i}`,
      props: {
        container: {
          backgroundColor: `preset-bg-gradient-<variant>-${i}`,
          border: {
            side: ["border-b"],
            color: `preset-border-accent-${i}`,
            radius: "rounded-none",
            style: "border-solid",
            width: "border-2",
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

const shadowPresets = [1, 2, 3, 4, 5].reduce(
  (acc, i) => {
    const id = `shadow-${i}`;
    acc[id] = {
      label: `Shadow ${i}`,
      previewClasses: `preset-bg-gradient-<variant>-${i} color-auto shadow-lg`,
      props: {
        container: {
          backgroundColor: `preset-bg-gradient-<variant>-${i}`,
          shadow: "shadow-lg",
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

  presets: {
    ...borderedPresets,
    ...borderedAltPresets,
    ...shadowPresets,
  },

  props: defineProps({
    container: group({
      title: "Container",
      children: {
        border: optional(border()),
        backgroundColor: backgroundColor(),
        shadow: optional(shadow()),
        fixedPositioned: optional(fixedPositioned()),
      },
    }),
    brand: group({
      title: "Brand",
      children: {
        name: optional(textContent("Brand name", "Acme Inc.")),
        logo: optional(image("Logo")),
        color: optional(color()),
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
