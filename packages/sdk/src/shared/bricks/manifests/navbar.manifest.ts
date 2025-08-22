import { type Static, type TObject, Type } from "@sinclair/typebox";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { string, urlOrPageIdRef } from "../props/string";
import { imageRef } from "../props/image";
import { textContentRef } from "../props/text";
import { shadowRef } from "../props/effects";
import { boolean } from "../props/boolean";
import { VscLayoutPanelOff } from "react-icons/vsc";
import type { BrickProps } from "../props/types";
import { colorPresetRef } from "../props/color-preset";
import { tagsRef } from "../props/tags";

export const manifest = defineBrickManifest({
  type: "navbar",
  name: "Navbar",
  category: "layout",
  description: "A navigation bar with logo and navigation",
  aiInstructions: "This brick should be used on most sites/pages.",
  duplicatable: false,
  resizable: false,
  staticClasses: "flex-grow",
  defaultWidth: { mobile: "100%" },
  defaultHeight: { mobile: "60px", desktop: "60px" },
  icon: VscLayoutPanelOff,
  iconClassName: "rotate-180",
  props: defineProps(
    {
      color: Type.Optional(
        colorPresetRef({
          title: "Color",
          default: { color: "primary-500" },
        }),
      ),
      brand: Type.Optional(
        textContentRef({
          title: "Brand name",
          default: "Acme Inc.",
          disableSizing: true,
          metadata: {
            category: "content",
          },
        }),
      ),
      logo: Type.Optional(
        imageRef({
          title: "Logo",
          "ui:show-img-search": false,
          "ui:no-object-options": true,
          "ui:no-dynamic": true,
          "ui:placeholder": "https://example.com/logo.png",
          metadata: {
            category: "content",
          },
        }),
      ),
      hideBrand: Type.Optional(
        boolean("Hide brand name", undefined, {
          metadata: {
            filter: (manifestProps: TObject, formData: Static<Manifest["props"]>) => {
              return !!formData.logo; // Enable this field only if logo is set
            },
          },
        }),
      ),
      shadow: Type.Optional(shadowRef()),
      linksPosition: Type.Union(
        [
          Type.Literal("left", { title: "Left" }),
          Type.Literal("center", { title: "Center" }),
          Type.Literal("right", { title: "Right" }),
        ],
        { title: "Links position", default: "right", "ui:responsive": "desktop" },
      ),
      linksTagsFilter: Type.Optional(
        tagsRef({
          description: "Filter pages in the navbar by tags. Only pages with all of these tags will be shown.",
          default: ["navbar"],
          metadata: {
            category: "content",
          },
        }),
      ),
      staticNavItems: Type.Optional(
        Type.Array(
          Type.Object({
            urlOrPageId: urlOrPageIdRef(),
            label: Type.Optional(string("Label")),
          }),
          {
            title: "Static items",
            description: "Additional static navigation items to show in the navbar",
            default: [],
            metadata: {
              category: "content",
            },
          },
        ),
      ),
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
      linksPosition: "right",
      staticNavItems: [
        { urlOrPageId: "/services" },
        { urlOrPageId: "/about" },
        { urlOrPageId: "/portfolio" },
        { urlOrPageId: "/contact" },
      ],
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
      linksPosition: "center",
      staticNavItems: [
        { urlOrPageId: "/work" },
        { urlOrPageId: "/services" },
        { urlOrPageId: "/team" },
        { urlOrPageId: "/blog" },
      ],
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
      linksPosition: "right",
      staticNavItems: [
        { urlOrPageId: "/features" },
        { urlOrPageId: "/pricing" },
        { urlOrPageId: "/docs" },
        { urlOrPageId: "/login" },
      ],
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
      linksPosition: "right",
      staticNavItems: [
        { urlOrPageId: "/products" },
        { urlOrPageId: "/categories" },
        { urlOrPageId: "/deals" },
        { urlOrPageId: "/account" },
        { urlOrPageId: "/cart" },
      ],
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
      linksPosition: "right",
      staticNavItems: [
        { urlOrPageId: "/projects" },
        { urlOrPageId: "/capabilities" },
        { urlOrPageId: "/insights" },
        { urlOrPageId: "/contact" },
      ],
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
      linksPosition: "center",
      staticNavItems: [
        { urlOrPageId: "/menu" },
        { urlOrPageId: "/reservations" },
        { urlOrPageId: "/events" },
        { urlOrPageId: "/location" },
      ],
    },
  },
  {
    description: "Portfolio navbar with left-aligned navigation",
    type: "navbar",
    props: {
      brand: "TechCorp Solutions",
      linksPosition: "left",
      staticNavItems: [
        { urlOrPageId: "/work" },
        { urlOrPageId: "/about" },
        { urlOrPageId: "/experience" },
        { urlOrPageId: "/contact" },
      ],
    },
  },
];
