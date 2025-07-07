import { type TObject, Type } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group } from "../props/helpers";
import { string, urlOrPageIdRef } from "../props/string";
import { imageRef } from "../props/image";
import { textContentRef } from "../props/text";
import { shadowRef } from "../props/effects";
import { boolean } from "../props/boolean";
import { VscLayoutPanelOff } from "react-icons/vsc";
import type { BrickProps } from "../props/types";
import { colorRef } from "../props/color";
import { colorPresetRef } from "../props/preset";

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
  staticClasses: "flex-1",
  icon: VscLayoutPanelOff,
  iconClassName: "rotate-180",
  props: defineProps(
    {
      colorPreset: Type.Optional(
        colorPresetRef({
          title: "Color preset",
          "ui:presets": {
            "primary-light": {
              previewBgClass: "bg-primary-light text-primary-content-light",
              value: {
                container: "bg-primary-light text-primary-content-light",
              },
              label: "Primary lighter",
            },
            primary: {
              previewBgClass: "bg-primary text-primary-content",
              label: "Primary",
              value: { container: "bg-primary text-primary-content" },
            },
            "primary-dark": {
              previewBgClass: "bg-primary-dark text-primary-content",
              value: { container: "bg-primary-dark text-primary-content" },
              label: "Primary darker",
            },
            "secondary-light": {
              previewBgClass: "bg-secondary-light text-secondary-content-light",
              value: {
                container: "bg-secondary-light text-secondary-content-light",
              },
              label: "Secondary lighter",
            },
            secondary: {
              previewBgClass: "bg-secondary text-secondary-content",
              label: "Secondary",
              value: { container: "bg-secondary text-secondary-content" },
            },
            "secondary-dark": {
              previewBgClass: "bg-secondary-dark text-secondary-content",
              label: "Secondary darker",
              value: { container: "bg-secondary-dark text-secondary-content" },
            },
            "neutral-light": {
              previewBgClass: "bg-neutral-light text-neutral-content-light",
              value: { container: "bg-neutral-light text-neutral-content-light" },
              label: "Neutral lighter",
            },
            neutral: {
              previewBgClass: "bg-neutral text-neutral-content",
              label: "Neutral",
              value: { container: "bg-neutral text-neutral-content" },
            },
            "neutral-dark": {
              previewBgClass: "bg-neutral-dark text-neutral-content",
              label: "Neutral darker",
              value: { container: "bg-neutral-dark text-neutral-content" },
            },
            base100: {
              previewBgClass: "bg-base-100 text-base-content",
              label: "Base 1",
              value: { container: "bg-base-100 text-base-content" },
            },
            base200: {
              previewBgClass: "bg-base-200 text-base-content",
              label: "Base 2",
              value: { container: "bg-base-200 text-base-content" },
            },
            none: { label: "None", value: {} },
          },
          default: "primary",
        }),
      ),
      brand: Type.Optional(
        textContentRef({
          title: "Brand name",
          default: "Acme Inc.",
          disableSizing: true,
        }),
      ),
      logo: Type.Optional(
        imageRef({
          title: "Logo",
          "ui:show-img-search": false,
          "ui:no-object-options": true,
        }),
      ),
      hideBrand: Type.Optional(
        boolean("Hide brand name", undefined, {
          metadata: {
            filter: (manifestProps: TObject, formData: Record<string, unknown>) => {
              return !!formData.logo; // Enable this field only if logo is set
            },
          },
        }),
      ),
      navigation: group({
        title: "Links",
        children: {
          position: Type.Union(
            [
              Type.Literal("left", { title: "Left" }),
              Type.Literal("center", { title: "Center" }),
              Type.Literal("right", { title: "Right" }),
            ],
            { title: "Position", default: "right", "ui:responsive": "desktop" },
          ),
          color: Type.Optional(colorRef()),
          pageTagsFilter: Type.Optional(
            Type.Array(Type.String(), {
              description:
                "Filter pages in the navbar by tags. Only pages with all of these tags will be shown.",
              title: "Tags",
              default: ["navbar"],
            }),
          ),
          staticNavItems: Type.Optional(
            Type.Array(
              Type.Object({
                urlOrPageId: urlOrPageIdRef(),
                label: Type.Optional(string("Label")),
              }),
              {
                title: "Navigation items",
                description: "Additional static navigation items to show in the navbar",
                default: [],
              },
            ),
          ),
        },
      }),
      shadow: Type.Optional(shadowRef()),
    },
    { noAlignSelf: true },
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
    },
  },
  {
    description: "Dark theme navbar with centered navigation",
    type: "navbar",
    props: {
      brand: "TechCorp Solutions",
      logo: {
        src: "https://via.placeholder.com/100x35.png?text=Studio",
        alt: "Creative Studio logo",
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
      brand: "TechCorp Solutions",
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
      brand: "TechCorp Solutions",
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
      brand: "TechCorp Solutions",
      logo: {
        src: "https://via.placeholder.com/140x50.png?text=Agency+Logo",
        alt: "Digital agency logo",
      },
      hideBrand: true,
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
      brand: "TechCorp Solutions",
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
      brand: "TechCorp Solutions",
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
      brand: "TechCorp Solutions",
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
