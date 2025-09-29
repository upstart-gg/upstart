import { Type } from "@sinclair/typebox";
import { RxButton } from "react-icons/rx";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { urlOrPageId } from "../props/string";
import { rounding } from "../props/border";
import { StringEnum } from "~/shared/utils/string-enum";
import { fontSize } from "../props/text";
import { colorPreset } from "../props/color-preset";
import type { BrickExample } from "./_types";

export const manifest = defineBrickManifest({
  type: "button",
  name: "Button",
  category: "basic",
  description: "A button",
  aiInstructions: `Use this button component for navigation and call-to-action elements throughout the site.

WHEN TO USE:
- Navigation links (Learn More, About Us, Contact)
- Call-to-action buttons (Sign Up, Get Started, Buy Now)
- External links (Download, Visit Website, Social Media)
- Internal page navigation (Go to Services, View Portfolio)

STYLING GUIDELINES:
- colorPreset: Use "primary-500" for main CTAs, "secondary-500" for secondary actions, "neutral-500" for low-priority actions, "accent-500" for highlight actions
- fontSize: "text-sm" for compact buttons, "text-base" for standard, "text-lg" for emphasis, "text-xl" for hero buttons
- rounding: "rounded-none" for sharp/modern, "rounded-md" for standard, "rounded-lg" for friendly, "rounded-full" for pills
- fill: Use "solid" for primary actions with background color, "outline" for secondary actions with transparent background and border
- link: Use full URLs for external (https://example.com), relative paths for internal (/about), or page IDs for site pages (about-us)

DYNAMIC CONTENT:
- Support template variables: "Buy {{product.name}}" or "Contact {{employee.name}}"
- Link to dynamic pages: "/products/{{product.id}}" or "/team/{{employee.slug}}"

AVOID:
- Using in forms (forms have dedicated submit buttons)
- Empty or unclear labels (use descriptive action words)
- Mixing multiple high-emphasis colors on same page`,
  resizable: "horizontal",
  icon: RxButton,
  minWidth: {
    desktop: 120,
    mobile: 120,
  },
  defaultWidth: {
    mobile: "100%",
  },
  props: defineProps(
    {
      colorPreset: Type.Optional(
        colorPreset({
          default: { color: "primary-500" },
          title: "Color",
          "ui:default-gradient-direction": "bg-gradient-to-b",
        }),
      ),
      label: Type.String({ title: "Label", default: "My button", metadata: { category: "content" } }),
      fontSize: Type.Optional(
        fontSize({
          title: "Font size",
          description: "The font size of the button text.",
          default: "text-base",
          "ui:responsive": "desktop",
          "ui:no-extra-large-sizes": true,
        }),
      ),
      rounding: Type.Optional(
        rounding({
          default: "rounded-md",
        }),
      ),
      fill: Type.Optional(
        StringEnum(["solid", "outline"], {
          title: "Fill",
          description: "Button appearance style - solid background or outlined.",
          default: "solid",
          enumNames: ["Solid", "Outline"],
          "ui:field": "enum",
          "ui:display": "select",
        }),
      ),
      link: urlOrPageId({
        title: "Link",
        "ui:placeholder": "https://example.com",
        metadata: { category: "content" },
      }),
    },
    { noGrow: true },
  ),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  // BASIC BUTTON TYPES
  {
    description: "Primary call-to-action button - Use for main actions users should take",
    type: "button",
    props: {
      label: "Get Started",
      link: "/signup",
      colorPreset: { color: "primary-500" },
      fontSize: "text-base",
      rounding: "rounded-md",
      fill: "solid",
    },
  },
  {
    description: "Secondary button - Use for supporting actions or alternatives",
    type: "button",
    props: {
      label: "Learn More",
      link: "/about",
      colorPreset: { color: "secondary-500" },
      fontSize: "text-base",
      rounding: "rounded-md",
      fill: "outline",
    },
  },
  {
    description: "Neutral button - Use for low-priority actions or navigation",
    type: "button",
    props: {
      label: "View Details",
      link: "/details",
      colorPreset: { color: "neutral-500" },
      fontSize: "text-sm",
      rounding: "rounded-md",
    },
  },
  {
    description: "Accent button - Use for special promotions or highlighted actions",
    type: "button",
    props: {
      label: "Special Offer",
      link: "/promo",
      colorPreset: { color: "accent-500" },
      fontSize: "text-lg",
      rounding: "rounded-lg",
    },
  },

  // EXTERNAL LINK EXAMPLES
  {
    description: "External website link - Full URL for outside navigation",
    type: "button",
    props: {
      label: "Visit Our Store",
      link: "https://store.example.com",
      colorPreset: { color: "primary-500" },
      fontSize: "text-base",
      rounding: "rounded-md",
    },
  },
  {
    description: "Download button - Direct file download link",
    type: "button",
    props: {
      label: "Download PDF",
      link: "https://example.com/brochure.pdf",
      colorPreset: { color: "secondary-600" },
      fontSize: "text-base",
      rounding: "rounded-lg",
      fill: "outline",
    },
  },

  // INTERNAL NAVIGATION EXAMPLES
  {
    description: "Internal page navigation using page ID reference",
    type: "button",
    props: {
      label: "Contact Us",
      link: "contact",
      colorPreset: { color: "neutral-600" },
      fontSize: "text-base",
      rounding: "rounded-md",
    },
  },
  {
    description: "Internal relative URL navigation",
    type: "button",
    props: {
      label: "Our Services",
      link: "/services",
      colorPreset: { color: "primary-500" },
      fontSize: "text-base",
      rounding: "rounded-md",
    },
  },

  // DYNAMIC CONTENT EXAMPLES
  {
    description: "Dynamic product purchase button using product query data",
    type: "button",
    props: {
      label: "Buy {{product.name}} - ${{product.price}}",
      link: "/checkout/{{product.id}}",
      colorPreset: { color: "primary-600" },
      fontSize: "text-base",
      rounding: "rounded-md",
      fill: "outline",
    },
  },
  {
    description: "Dynamic employee contact button using team member data",
    type: "button",
    props: {
      label: "Contact {{employee.name}}",
      link: "mailto:{{employee.email}}",
      colorPreset: { color: "neutral-500" },
      fontSize: "text-sm",
      rounding: "rounded-md",
    },
  },
  {
    description: "Dynamic event registration using event query data",
    type: "button",
    props: {
      label: "Register for {{event.title}}",
      link: "/events/{{event.slug}}/register",
      colorPreset: { color: "accent-500" },
      fontSize: "text-base",
      rounding: "rounded-lg",
    },
  },

  // STYLING VARIATIONS
  {
    description: "Small compact button - Use in tight spaces or secondary contexts",
    type: "button",
    props: {
      label: "Edit",
      link: "/edit",
      colorPreset: { color: "neutral-400" },
      fontSize: "text-sm",
      rounding: "rounded-sm",
    },
  },
  {
    description: "Large hero button - Use for prominent call-to-actions",
    type: "button",
    props: {
      label: "Start Free Trial",
      link: "/trial",
      colorPreset: { color: "primary-600" },
      fontSize: "text-xl",
      rounding: "rounded-xl",
      fill: "outline",
    },
  },
  {
    description: "Pill-shaped button - Modern rounded design",
    type: "button",
    props: {
      label: "Subscribe",
      link: "/newsletter",
      colorPreset: { color: "accent-500" },
      fontSize: "text-base",
      rounding: "rounded-full",
    },
  },
  {
    description: "Sharp modern button - Angular design with no rounding",
    type: "button",
    props: {
      label: "Join Now",
      link: "/join",
      colorPreset: { color: "primary-500" },
      fontSize: "text-base",
      rounding: "rounded-none",
      fill: "outline",
    },
  },

  // GRADIENT EXAMPLES
  {
    description: "Gradient button - Eye-catching with color transitions",
    type: "button",
    props: {
      label: "Premium Upgrade",
      link: "/upgrade",
      colorPreset: {
        color: "primary-500",
        gradientDirection: "bg-gradient-to-r",
      },
      fontSize: "text-lg",
      rounding: "rounded-lg",
    },
  },
  {
    description: "Diagonal gradient button - Unique visual appeal",
    type: "button",
    props: {
      label: "Launch Campaign",
      link: "/campaigns/new",
      colorPreset: {
        color: "accent-600",
        gradientDirection: "bg-gradient-to-br",
      },
      fontSize: "text-base",
      rounding: "rounded-md",
      fill: "outline",
    },
  },

  // FILL STYLE COMPARISON EXAMPLES
  {
    description: "Solid fill button - Traditional filled background style",
    type: "button",
    props: {
      label: "Solid Button",
      link: "/solid",
      colorPreset: { color: "primary-500" },
      fontSize: "text-base",
      rounding: "rounded-md",
      fill: "solid",
    },
  },
  {
    description: "Outline fill button - Transparent background with border",
    type: "button",
    props: {
      label: "Outline Button",
      link: "/outline",
      colorPreset: { color: "primary-500" },
      fontSize: "text-base",
      rounding: "rounded-md",
      fill: "outline",
    },
  },
];
