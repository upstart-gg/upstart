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
      colorPreset: Type.Optional(
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
export type NavbarProps = Static<Manifest["props"]>;

export const navbarSchemaPropsLLM = toLLMSchema(manifest.props);

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description:
      "Corporate technology company navbar featuring company logo with right-aligned navigation links filtered by navbar and featured tags",
    type: "navbar",
    props: {
      logo: {
        src: "https://via.placeholder.com/120x40.png?text=TechCorp",
        alt: "TechCorp Solutions logo",
      },
      linksPosition: "right",
      linksTagsFilter: ["navbar", "featured"],
    },
  },
  {
    description:
      "Dark-themed professional navbar with centered brand text and navigation, including external site link for service companies",
    type: "navbar",
    props: {
      brand: "TechCorp Solutions",
      linksPosition: "center",
      linksTagsFilter: ["navbar", "featured"],
      staticNavItems: [{ urlOrPageId: "http://example.com/", label: "Other site" }],
    },
  },
  {
    description:
      "E-commerce store navbar with primary blue branding, medium shadow effect, and right-aligned cart/account links for online shopping sites",
    type: "navbar",
    props: {
      brand: "ShopEasy",
      colorPreset: {
        color: "primary-500",
      },
      linksPosition: "right",
      linksTagsFilter: ["main", "shop"],
      shadow: "shadow-md",
      staticNavItems: [
        { urlOrPageId: "cart", label: "Cart" },
        { urlOrPageId: "account", label: "Account" },
      ],
    },
  },
  {
    description:
      "Restaurant navbar with logo and hidden brand text, featuring secondary color scheme and left-aligned navigation with reservation booking and phone contact",
    type: "navbar",
    props: {
      logo: {
        src: "https://via.placeholder.com/100x50.png?text=Bella+Vista",
        alt: "Bella Vista Restaurant logo",
      },
      brand: "Bella Vista",
      hideBrand: true,
      linksPosition: "left",
      linksTagsFilter: ["navbar"],
      colorPreset: {
        color: "secondary-200",
      },
      staticNavItems: [
        { urlOrPageId: "reservations", label: "Reservations" },
        { urlOrPageId: "tel:+1234567890", label: "Call Us" },
      ],
    },
  },
  {
    description:
      "Clean minimalist design navbar with neutral light background, centered navigation links, and subtle shadow for creative agencies and design studios",
    type: "navbar",
    props: {
      brand: "Minimal Studio",
      colorPreset: {
        color: "neutral-100",
      },
      linksPosition: "center",
      linksTagsFilter: ["main"],
      shadow: "shadow-sm",
    },
  },
  {
    description:
      "Creative portfolio navbar with dark neutral background, compact logo, and external social media links to showcase professional work and attract clients",
    type: "navbar",
    props: {
      logo: {
        src: "https://via.placeholder.com/80x40.png?text=Portfolio",
        alt: "Creative Portfolio logo",
      },
      brand: "Creative Portfolio",
      colorPreset: {
        color: "neutral-900",
      },
      linksPosition: "right",
      linksTagsFilter: ["portfolio", "main"],
      staticNavItems: [
        { urlOrPageId: "https://dribbble.com/mywork", label: "Dribbble" },
        { urlOrPageId: "https://behance.net/mywork", label: "Behance" },
        { urlOrPageId: "contact", label: "Hire Me" },
      ],
    },
  },
  {
    description:
      "Digital marketing agency navbar with horizontal gradient background, large shadow, and external consultation booking integration for lead generation",
    type: "navbar",
    props: {
      brand: "Digital Agency",
      colorPreset: {
        color: "primary-600",
        gradientDirection: "bg-gradient-to-r",
      },
      linksPosition: "right",
      linksTagsFilter: ["services", "navbar"],
      shadow: "shadow-lg",
      staticNavItems: [
        { urlOrPageId: "https://calendar.com/book", label: "Book Consultation" },
        { urlOrPageId: "case-studies", label: "Case Studies" },
      ],
    },
  },
  {
    description:
      "SaaS application navbar with accent color scheme, company logo, and essential user authentication links for software platforms",
    type: "navbar",
    props: {
      logo: {
        src: "https://via.placeholder.com/120x35.png?text=CloudApp",
        alt: "CloudApp SaaS logo",
      },
      brand: "CloudApp",
      colorPreset: {
        color: "accent-500",
      },
      linksPosition: "right",
      linksTagsFilter: ["features", "navbar"],
      staticNavItems: [
        { urlOrPageId: "pricing", label: "Pricing" },
        { urlOrPageId: "login", label: "Login" },
        { urlOrPageId: "signup", label: "Sign Up" },
      ],
    },
  },
  {
    description:
      "Nonprofit organization navbar with warm accent color, centered navigation, and donation call-to-action links for charitable foundations",
    type: "navbar",
    props: {
      brand: "Hope Foundation",
      colorPreset: {
        color: "accent-400",
      },
      linksPosition: "center",
      linksTagsFilter: ["about", "programs"],
      shadow: "shadow-md",
      staticNavItems: [
        { urlOrPageId: "donate", label: "Donate Now" },
        { urlOrPageId: "volunteer", label: "Volunteer" },
      ],
    },
  },
  {
    description:
      "Professional law firm navbar with dark authoritative styling, professional logo, and client consultation contact information for legal services",
    type: "navbar",
    props: {
      logo: {
        src: "https://via.placeholder.com/110x45.png?text=LawFirm",
        alt: "Professional Law Firm logo",
      },
      brand: "Smith & Associates",
      colorPreset: {
        color: "neutral-800",
      },
      linksPosition: "right",
      linksTagsFilter: ["practice-areas", "navbar"],
      staticNavItems: [
        { urlOrPageId: "consultation", label: "Free Consultation" },
        { urlOrPageId: "tel:+1234567890", label: "(123) 456-7890" },
      ],
    },
  },
  {
    description:
      "Event management company navbar with bold primary red gradient background, left-aligned navigation, and ticket purchasing links for entertainment venues",
    type: "navbar",
    props: {
      brand: "Event Masters",
      colorPreset: {
        color: "primary-500",
        gradientDirection: "bg-gradient-to-br",
      },
      linksPosition: "left",
      linksTagsFilter: ["events", "upcoming"],
      shadow: "shadow-xl",
      staticNavItems: [
        { urlOrPageId: "tickets", label: "Buy Tickets" },
        { urlOrPageId: "venues", label: "Venues" },
      ],
    },
  },
  {
    description:
      "Fitness studio navbar with secondary purple color scheme, visible brand name alongside logo, and centered class booking navigation for health and wellness businesses",
    type: "navbar",
    props: {
      logo: {
        src: "https://via.placeholder.com/90x50.png?text=FitStudio",
        alt: "Fitness Studio logo",
      },
      brand: "Peak Fitness",
      hideBrand: false,
      colorPreset: {
        color: "secondary-600",
      },
      linksPosition: "center",
      linksTagsFilter: ["classes", "membership"],
      staticNavItems: [
        { urlOrPageId: "book-class", label: "Book Class" },
        { urlOrPageId: "membership", label: "Join Now" },
        { urlOrPageId: "trainers", label: "Personal Training" },
      ],
    },
  },
];
