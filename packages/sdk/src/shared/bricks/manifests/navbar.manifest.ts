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
import { toLLMSchema } from "~/shared/utils/llm";

export const manifest = defineBrickManifest({
  type: "navbar",
  name: "Navbar",
  category: "layout",
  description: "A navigation bar with logo and navigation",
  aiInstructions: "This brick should be used on most sites/pages. It must be placed on its own section.",
  isGlobalBrick: true,
  duplicatable: false,
  resizable: false,
  movable: false,
  hideInLibrary: true,
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
          examples: [{ color: "primary-500" }, { color: "neutral-900" }, { color: "secondary-200" }],
        }),
      ),
      brand: Type.Optional(
        textContentRef({
          title: "Brand name",
          default: "Acme Inc.",
          disableSizing: true,
          "ai:instructions":
            "The brand name of the website, for example the company name. Please provide it even if optional.",
          metadata: {
            category: "content",
          },
          examples: ["Acme Inc.", "TechCorp Solutions", "ShopEasy", "Bella Vista"],
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
          "ai:hidden": true, // Hide from AI as it should always be provided if available
        }),
      ),
      hideBrand: Type.Optional(
        boolean("Hide brand name", undefined, {
          "ai:hidden": true,
          metadata: {
            filter: (manifestProps: TObject, formData: Static<Manifest["props"]>) => {
              return !!formData.logo; // Enable this field only if logo is set
            },
          },
        }),
      ),
      linksTagsFilter: Type.Optional(
        tagsRef({
          title: "Pages tags",
          description: "Filter pages links in the navbar by tags. Only pages with these tags will be shown.",
          default: ["navbar"],
          metadata: {
            category: "content",
          },
          examples: [["navbar", "main"], ["top-menu"], ["important-link", "navbar"]],
        }),
      ),
      staticNavItems: Type.Optional(
        Type.Array(
          Type.Object({
            urlOrPageId: urlOrPageIdRef(),
            label: Type.Optional(string("Label")),
          }),
          {
            title: "Static links",
            description: "Additional static navigation links to show in the navbar",
            "ai:instructions": "Don't include pages already included by the tags filter.",
            default: [],
            metadata: {
              category: "content",
            },
            examples: [
              [
                { urlOrPageId: "http://example.com/", label: "Other site" },
                { urlOrPageId: "https://docs.example.com/", label: "External docs" },
              ],
              [{ urlOrPageId: "https://www.amazon.com/our-brand", label: "Buy our brand on Amazon" }],
            ],
          },
        ),
      ),
      linksPosition: Type.Optional(
        Type.Union(
          [
            Type.Literal("left", { title: "Left" }),
            Type.Literal("center", { title: "Center" }),
            Type.Literal("right", { title: "Right" }),
          ],
          { title: "Links position", default: "right", "ui:responsive": "desktop" },
        ),
      ),
      shadow: Type.Optional(shadowRef()),
    },
    { noAlignSelf: true, noGrow: true },
  ),
});

export type Manifest = typeof manifest;

export const navbarSchemaLLM = toLLMSchema(manifest.props);
export type NavbarProps = Static<Manifest["props"]>;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Corporate navbar with logo and right-aligned navigation",
    type: "navbar",
    props: {
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
    description: "Dark theme navbar with a brand text and centered navigation, no logo",
    type: "navbar",
    props: {
      brand: "TechCorp Solutions",
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
    description: "SaaS platform navbar with fixed positioning and brand text",
    type: "navbar",
    props: {
      brand: "TechCorp Solutions",
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
    description: "E-commerce navbar with logo and shopping links",
    type: "navbar",
    props: {
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
      logo: {
        src: "https://via.placeholder.com/140x50.png?text=Agency+Logo",
        alt: "Digital agency logo",
      },
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
