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
import type { BrickProps } from "../props/types";

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
    brand: group({
      title: "Brand",
      children: {
        name: optional(textContent("Brand name", "Acme Inc.", { disableSizing: true })),
        logo: optional(image("Logo", { noObjectOptions: true })),
        hideText: optional(boolean("Hide text")),
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
        color: optional(color()),
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

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Corporate navbar with logo and right-aligned navigation",
    type: "navbar",
    props: {
      preset: "bold-primary",
      container: {},
      brand: {
        name: "TechCorp Solutions",
        logo: {
          src: "https://via.placeholder.com/120x40.png?text=TechCorp",
          alt: "TechCorp Solutions logo",
        },
        color: "#1f2937",
      },
      navigation: {
        position: "right",
        color: "#374151",
        staticItems: [
          { urlOrPageId: "/services" },
          { urlOrPageId: "/about" },
          { urlOrPageId: "/portfolio" },
          { urlOrPageId: "/contact" },
        ],
      },
    },
  },
  {
    description: "Dark theme navbar with centered navigation",
    type: "navbar",
    props: {
      container: {
        backgroundColor: "#1f2937",
        shadow: "shadow-lg",
      },
      brand: {
        name: "Creative Studio",
        logo: {
          src: "https://via.placeholder.com/100x35.png?text=Studio",
          alt: "Creative Studio logo",
        },
        color: "#ffffff",
      },
      navigation: {
        position: "center",
        color: "#d1d5db",
        staticItems: [
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
      container: {
        backgroundColor: "#3b82f6",
        fixedPositioned: true,
        shadow: "shadow-md",
      },
      brand: {
        name: "CloudFlow",
        logo: {
          src: "https://via.placeholder.com/110x38.png?text=CloudFlow",
          alt: "CloudFlow platform logo",
        },
        color: "#ffffff",
      },
      navigation: {
        position: "right",
        color: "#f1f5f9",
        staticItems: [
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
      preset: "bold-primary",
      brand: {
        name: "ShopEasy",
        logo: {
          src: "https://via.placeholder.com/130x45.png?text=ShopEasy",
          alt: "ShopEasy store logo",
        },
      },
      navigation: {
        position: "right",
        staticItems: [
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
      container: {
        shadow: "shadow-sm",
      },
      brand: {
        logo: {
          src: "https://via.placeholder.com/140x50.png?text=Agency+Logo",
          alt: "Digital agency logo",
        },
        hideText: true,
      },
      navigation: {
        position: "right",
        color: "#64748b",
        staticItems: [
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
      container: {
        backgroundColor: "#7c2d12",
        shadow: "shadow-lg",
      },
      brand: {
        name: "Bella Vista",
        logo: {
          src: "https://via.placeholder.com/80x50.png?text=BV",
          alt: "Bella Vista restaurant logo",
        },
        color: "#fed7aa",
      },
      navigation: {
        position: "center",
        color: "#fdba74",
        staticItems: [
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
      preset: "bold-secondary",
      container: {
        backgroundColor: "#f1f5f9",
        border: {
          sides: ["border-b"],
          color: "border-accent",
        },
      },
      brand: {
        name: "Alex Martinez",
        color: "#334155",
      },
      navigation: {
        position: "left",
        color: "#64748b",
        staticItems: [
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
      preset: "bold-primary",
      container: {
        shadow: "shadow-md",
      },
      brand: {
        name: "Green Future",
        logo: {
          src: "https://via.placeholder.com/100x40.png?text=GF",
          alt: "Green Future organization logo",
        },
        color: "#d1fae5",
      },
      navigation: {
        position: "right",
        color: "#a7f3d0",
        staticItems: [
          { urlOrPageId: "/mission" },
          { urlOrPageId: "/programs" },
          { urlOrPageId: "/volunteer" },
          { urlOrPageId: "/donate" },
        ],
      },
    },
  },
];
