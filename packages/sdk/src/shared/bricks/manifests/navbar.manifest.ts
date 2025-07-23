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
import { StringEnum } from "~/shared/utils/string-enum";

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
  name: "Navbar",
  category: "layout",
  description: "A navigation bar with logo and navigation",
  aiInstructions: "This brick should be used on most sites/pages.",
  datasource,
  duplicatable: false,
  resizable: false,
  staticClasses: "flex-1 flex-grow",
  defaultWidth: { desktop: "100%", mobile: "100%" },
  icon: VscLayoutPanelOff,
  iconClassName: "rotate-180",
  props: defineProps(
    {
      backgroundColor: Type.Optional(
        colorPresetRef({
          title: "Background color",
          "ui:presets": {
            "primary-light": {
              previewBgClass: "bg-primary-light text-primary-content-light",
              value: { main: "bg-primary-light text-primary-content-light" },
              label: "Primary lighter",
            },
            "primary-light-gradient": {
              previewBgClass: "bg-gradient-to-br from-primary-300 to-primary-500 text-primary-content-light",
              value: { main: "from-primary-300 to-primary-500 text-primary-content-light" },
              label: "Primary light gradient",
            },
            primary: {
              previewBgClass: "bg-primary text-primary-content",
              label: "Primary",
              value: { main: "bg-primary text-primary-content" },
            },
            "primary-gradient": {
              previewBgClass: "bg-gradient-to-br from-primary-500 to-primary-700 text-primary-content",
              value: { main: "from-primary-500 to-primary-700 text-primary-content" },
              label: "Primary gradient",
            },
            "primary-dark": {
              previewBgClass: "bg-primary-dark text-primary-content",
              label: "Primary dark",
              value: { main: "bg-primary-dark text-primary-content" },
            },
            "primary-dark-gradient": {
              previewBgClass: "bg-gradient-to-br from-primary-700 to-primary-900 text-primary-content",
              value: { main: "from-primary-700 to-primary-900 text-primary-content" },
              label: "Primary dark gradient",
            },
            "secondary-light": {
              previewBgClass: "bg-secondary-light text-secondary-content-light",
              label: "Secondary light",
              value: { main: "bg-secondary-light text-secondary-content-light" },
            },
            "secondary-light-gradient": {
              previewBgClass:
                "bg-gradient-to-br from-secondary-300 to-secondary-500 text-secondary-content-light",
              value: {
                main: "from-secondary-300 to-secondary-500 text-secondary-content-light",
              },
              label: "Secondary light gradient",
            },
            secondary: {
              previewBgClass: "bg-secondary text-secondary-content",
              label: "Secondary",
              value: { main: "bg-secondary text-secondary-content" },
            },
            "secondary-gradient": {
              previewBgClass: "bg-gradient-to-br from-secondary-500 to-secondary-700 text-secondary-content",
              value: { main: "from-secondary-500 to-secondary-700 text-secondary-content" },
              label: "Secondary gradient",
            },
            "secondary-dark": {
              previewBgClass: "bg-secondary-dark text-secondary-content",
              label: "Secondary dark",
              value: { main: "bg-secondary-dark text-secondary-content" },
            },
            "secondary-dark-gradient": {
              previewBgClass: "bg-gradient-to-br from-secondary-700 to-secondary-900 text-secondary-content",
              value: { main: "from-secondary-700 to-secondary-900 text-secondary-content" },
              label: "Secondary dark gradient",
            },
            "neutral-light": {
              previewBgClass: "bg-neutral-light text-neutral-content-light",
              value: { main: "bg-neutral-light text-neutral-content-light" },
              label: "Neutral light",
            },
            "neutral-light-gradient": {
              previewBgClass: "bg-gradient-to-br from-neutral-300 to-neutral-500 text-neutral-content-light",
              value: { main: "from-neutral-300 to-neutral-500 text-neutral-content-light" },
              label: "Neutral light gradient",
            },
            neutral: {
              previewBgClass: "bg-neutral text-neutral-content",
              label: "Neutral",
              value: { main: "bg-neutral text-neutral-content" },
            },
            "neutral-gradient": {
              previewBgClass: "bg-gradient-to-br from-neutral-500 to-neutral-700 text-neutral-content",
              value: { main: "from-neutral-500 to-neutral-700 text-neutral-content" },
              label: "Neutral gradient",
            },
            "neutral-dark": {
              previewBgClass: "bg-neutral-dark text-neutral-content",
              label: "Neutral dark",
              value: { main: "bg-neutral-dark text-neutral-content" },
            },
            "neutral-dark-gradient": {
              previewBgClass: "bg-gradient-to-br from-neutral-700 to-neutral-900 text-neutral-content",
              value: { main: "from-neutral-700 to-neutral-900 text-neutral-content" },
              label: "Neutral dark gradient",
            },
            base100: {
              previewBgClass: "bg-base-100 text-base-content",
              label: "Base 1",
              value: { main: "bg-base-100 text-base-content" },
            },

            base200: {
              previewBgClass: "bg-base-200 text-base-content",
              label: "Base 2",
              value: { main: "bg-base-200 text-base-content" },
            },

            none: { label: "None", value: {} },
          },
          default: "primary-gradient",
        }),
      ),
      gradientDirection: Type.Optional(
        StringEnum(
          [
            "bg-gradient-to-t",
            "bg-gradient-to-r",
            "bg-gradient-to-b",
            "bg-gradient-to-l",
            "bg-gradient-to-tl",
            "bg-gradient-to-tr",
            "bg-gradient-to-br",
            "bg-gradient-to-bl",
          ],
          {
            title: "Gradient direction",
            description: "The direction of the gradient. Only applies when color preset is a gradient.",
            enumNames: [
              "Top",
              "Right",
              "Bottom",
              "Left",
              "Top left",
              "Top right",
              "Bottom right",
              "Bottom left",
            ],
            default: "bg-gradient-to-br",
            "ui:responsive": "desktop",
            "ui:styleId": "styles:gradientDirection",
            metadata: {
              filter: (manifestProps: TObject, formData: Manifest["props"]) => {
                return formData.backgroundColor?.includes("gradient") === true;
              },
            },
          },
        ),
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
          metadata: {
            category: "content",
          },
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
        Type.Array(Type.String(), {
          description: "Filter pages in the navbar by tags. Only pages with all of these tags will be shown.",
          title: "Tags",
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
            title: "Navigation items",
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
