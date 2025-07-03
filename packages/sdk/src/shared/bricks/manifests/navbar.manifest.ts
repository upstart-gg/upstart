import { Type } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group, optional, prop } from "../props/helpers";
import { border, borderRef } from "../props/border";
import { string, urlOrPageId, urlOrPageIdRef } from "../props/string";
import { image, imageRef } from "../props/image";
import { backgroundColor, backgroundColorRef } from "../props/background";
import { textContent, textContentRef } from "../props/text";
import { shadow, shadowRef } from "../props/effects";
import { datasourceRef } from "../props/datasource";
import { fixedPositioned } from "../props/position";
import { boolean } from "../props/boolean";
import { VscLayoutPanelOff } from "react-icons/vsc";
import type { BrickProps } from "../props/types";
import { colorRef } from "../props/color";
import type { FC } from "react";

export const datasource = Type.Array(
  Type.Object({
    href: urlOrPageIdRef(),
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
  resizable: false,
  inlineDragDisabled: true,
  deletable: false,

  // maxHeight: {
  //   desktop: 90,
  //   mobile: 90,
  // },
  // minHeight: {
  //   desktop: 60,
  //   mobile: 60,
  // },
  staticClasses: "flex-1",
  icon: VscLayoutPanelOff,
  iconClassName: "rotate-180",
  props: defineProps(
    {
      enabled: boolean("Enabled", true, {
        description: "Enable or disable the navbar on this page",
      }),
      brand: optional(
        textContentRef({
          title: "Brand name",
          default: "Acme Inc.",
          disableSizing: true,
        }),
      ),
      logo: optional(
        imageRef({
          title: "Logo",
          "ui:show-img-search": false,
          "ui:no-object-options": true,
        }),
      ),
      hideText: optional(boolean("Hide brand name")),
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
              { default: "right", "ui:responsive": "desktop" },
            ),
          }),
          color: optional(colorRef()),
          pageTagsFilter: optional(
            prop({
              title: "Page tags filter",
              description:
                "Filter pages in the navbar by tags. Only pages with all of these tags will be shown.",
              schema: Type.Array(Type.String(), {
                title: "Tags",
                default: ["navbar"],
              }),
            }),
          ),
          staticNavItems: optional(
            prop({
              title: "Nav items",
              description: "Additional static navigation items to show in the navbar",
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
      advanced: optional(
        group({
          title: "Advanced",
          children: {
            fixedPositioned: optional(fixedPositioned()),
            backgroundColor: optional(backgroundColorRef()),
            color: optional(colorRef()),
            border: optional(borderRef()),
            shadow: optional(shadowRef()),
          },
        }),
      ),
    },
    { noAlignSelf: true, defaultPreset: "primary" },
  ),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Corporate navbar with logo and right-aligned navigation",
    type: "navbar",
    props: {
      enabled: true,
      preset: "prominent-primary",
      brand: "TechCorp Solutions",
      logo: {
        src: "https://via.placeholder.com/120x40.png?text=TechCorp",
        alt: "TechCorp Solutions logo",
      },
      navigation: {
        position: "right",
        color: "#374151",
        staticNavItems: [
          { urlOrPageId: "/services" },
          { urlOrPageId: "/about" },
          { urlOrPageId: "/portfolio" },
          { urlOrPageId: "/contact" },
        ],
      },
      advanced: {
        color: "#1f2937",
      },
    },
  },
  {
    description: "Dark theme navbar with centered navigation",
    type: "navbar",
    props: {
      enabled: true,
      brand: "TechCorp Solutions",
      logo: {
        src: "https://via.placeholder.com/100x35.png?text=Studio",
        alt: "Creative Studio logo",
      },
      advanced: {
        color: "#ffffff",
      },
      navigation: {
        position: "center",
        color: "#d1d5db",
        staticNavItems: [
          { urlOrPageId: "/work" },
          { urlOrPageId: "/services" },
          { urlOrPageId: "/team" },
          { urlOrPageId: "/blog" },
        ],
      },
    },
  },
  {
    description: "SaaS platform navbar with fixed positioning",
    type: "navbar",
    props: {
      enabled: true,
      brand: "TechCorp Solutions",
      advanced: {
        backgroundColor: "#3b82f6",
        fixedPositioned: true,
        shadow: "shadow-md",
        color: "#ffffff",
      },

      logo: {
        src: "https://via.placeholder.com/110x38.png?text=CloudFlow",
        alt: "CloudFlow platform logo",
      },
      navigation: {
        position: "right",
        color: "#f1f5f9",
        staticNavItems: [
          { urlOrPageId: "/features" },
          { urlOrPageId: "/pricing" },
          { urlOrPageId: "/docs" },
          { urlOrPageId: "/login" },
        ],
      },
    },
  },
  {
    description: "E-commerce navbar",
    type: "navbar",
    props: {
      enabled: true,
      brand: "TechCorp Solutions",
      preset: "prominent-primary",
      logo: {
        src: "https://via.placeholder.com/130x45.png?text=ShopEasy",
        alt: "ShopEasy store logo",
      },
      navigation: {
        position: "right",
        staticNavItems: [
          { urlOrPageId: "/products" },
          { urlOrPageId: "/categories" },
          { urlOrPageId: "/deals" },
          { urlOrPageId: "/account" },
          { urlOrPageId: "/cart" },
        ],
      },
    },
  },
  {
    description: "Agency navbar with logo-only brand",
    type: "navbar",
    props: {
      enabled: true,
      brand: "TechCorp Solutions",
      advanced: {
        shadow: "shadow-sm",
      },
      logo: {
        src: "https://via.placeholder.com/140x50.png?text=Agency+Logo",
        alt: "Digital agency logo",
      },
      hideText: true,
      navigation: {
        position: "right",
        color: "#64748b",
        staticNavItems: [
          { urlOrPageId: "/projects" },
          { urlOrPageId: "/capabilities" },
          { urlOrPageId: "/insights" },
          { urlOrPageId: "/contact" },
        ],
      },
    },
  },
  {
    description: "Restaurant navbar with warm styling",
    type: "navbar",
    props: {
      enabled: true,
      brand: "TechCorp Solutions",
      advanced: {
        backgroundColor: "#7c2d12",
        shadow: "shadow-lg",
        color: "#fed7aa",
      },
      logo: {
        src: "https://via.placeholder.com/80x50.png?text=BV",
        alt: "Bella Vista restaurant logo",
      },
      navigation: {
        position: "center",
        color: "#fdba74",
        staticNavItems: [
          { urlOrPageId: "/menu" },
          { urlOrPageId: "/reservations" },
          { urlOrPageId: "/events" },
          { urlOrPageId: "/location" },
        ],
      },
    },
  },
  {
    description: "Portfolio navbar with left-aligned navigation",
    type: "navbar",
    props: {
      enabled: true,
      brand: "TechCorp Solutions",
      preset: "prominent-secondary",
      advanced: {
        backgroundColor: "#f1f5f9",
        border: {
          sides: ["border-b"],
          color: "border-accent",
        },
        color: "#334155",
      },
      navigation: {
        position: "left",
        color: "#64748b",
        staticNavItems: [
          { urlOrPageId: "/work" },
          { urlOrPageId: "/about" },
          { urlOrPageId: "/experience" },
          { urlOrPageId: "/contact" },
        ],
      },
    },
  },
  {
    description: "Non-profit navbar with mission-focused design",
    type: "navbar",
    props: {
      enabled: true,
      brand: "TechCorp Solutions",
      preset: "prominent-primary",
      logo: {
        src: "https://via.placeholder.com/100x40.png?text=GF",
        alt: "Green Future organization logo",
      },
      navigation: {
        position: "right",
        staticNavItems: [
          { urlOrPageId: "/mission" },
          { urlOrPageId: "/programs" },
          { urlOrPageId: "/volunteer" },
          { urlOrPageId: "/donate" },
        ],
      },
    },
  },
];
