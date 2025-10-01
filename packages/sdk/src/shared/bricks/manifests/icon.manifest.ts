import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { PiConfetti } from "react-icons/pi";
import { icon, urlOrPageId } from "../props/string";
import { Type } from "@sinclair/typebox";
import { cssLength } from "../props/css-length";
import { color } from "../props/color";
import { loop } from "../props/dynamic";
import type { BrickExample } from "./_types";

export const manifest = defineBrickManifest({
  type: "icon",
  name: "Icon",
  category: "basic",
  description: "An icon.",
  aiInstructions: `Use the icon component for adding visual symbols and interactive elements throughout your design.

WHEN TO USE:
- Navigation elements (menu, close, arrow buttons)
- Contact information (email, phone, location markers)
- User interface actions (search, shopping cart, download)
- Content enhancement (stars, hearts, thumbs up)
- Feature highlights (checkmarks, shields, awards)

ICON SELECTION:
- Use Iconify format: "mdi:icon-name", "lucide:icon-name", "heroicons:icon-name"
- Examples: "mdi:heart", "lucide:star", "heroicons:envelope", "mdi:facebook"

SIZING GUIDELINES:
- size: "1em" for inline text icons, "1.5em" for buttons, "2em" for headers
- Use "em" units to scale with text, "px" for fixed sizes
- Large decorative icons: "3em", "4em", or "48px", "64px"

COLOR OPTIONS:
- color: "currentColor" inherits text color (default)
- Match color scheme: warnings (orange/yellow), errors (red), success (green)

INTERACTIVE ICONS:
- Add link property for clickable icons
- External links: "https://facebook.com/yourpage"
- Email links: "mailto:contact@example.com"
- Phone links: "tel:+1234567890"
- For internal pages, use page IDs: "page_12345"

DYNAMIC CONTENT:
- Use template variables: icon: "{{ service.iconName }}"
- Dynamic colors: color: "{{ brand.primaryColor }}"
- Loop over data for icon lists or social media sets

AVOID:
- Oversized icons that dominate content
- Poor contrast (light icons on light backgrounds)
- Inconsistent icon styles within the same design
- Missing alt text context when icons convey important information`,
  resizable: false,
  staticClasses: "!grow-0",
  icon: PiConfetti,
  props: defineProps(
    {
      icon: icon({
        default: "mdi:heart",
      }),
      size: Type.Optional(
        cssLength({
          title: "Size",
          description: "The size of the icon. Can be a CSS length value (e.g. '2em', '24px')",
          default: "1em",
          "ui:css-units": ["em", "rem", "px"],
          "ai:instructions": "Use 'em', 'rem', or 'px' for units. Example: '2em', '24px'",
        }),
      ),
      color: Type.Optional(
        color({
          title: "Color",
          default: "currentColor",
          "ui:hide-color-label": true,
        }),
      ),
      link: Type.Optional(urlOrPageId({ title: "Link" })),
      loop: Type.Optional(loop()),
    },
    { noGrow: true },
  ),
});

export type Manifest = typeof manifest;

export const examples: BrickExample<Manifest>[] = [
  // BASIC ICONS
  {
    description: "Heart icon with default styling - Inherits text color and size",
    type: "icon",
    props: {
      icon: "mdi:heart",
    },
  },
  {
    description: "Star icon with gold color - Perfect for ratings and reviews",
    type: "icon",
    props: {
      icon: "mdi:star",
      size: "1.2em",
      color: "#fbbf24",
    },
  },

  // NAVIGATION ICONS
  {
    description: "Menu hamburger icon - Mobile navigation toggle",
    type: "icon",
    props: {
      icon: "mdi:menu",
      size: "1.8em",
      color: "#374151",
    },
  },
  {
    description: "Search icon - Search functionality indicator",
    type: "icon",
    props: {
      icon: "mdi:magnify",
      size: "1.2em",
      color: "#6b7280",
    },
  },
  {
    description: "Shopping cart icon - E-commerce navigation",
    type: "icon",
    props: {
      icon: "mdi:cart",
      size: "1.4em",
      color: "#059669",
    },
  },
  {
    description: "Arrow right icon - Navigation and call-to-action",
    type: "icon",
    props: {
      icon: "mdi:arrow-right",
      size: "1.1em",
      color: "currentColor",
    },
  },

  // SOCIAL MEDIA ICONS
  {
    description: "Facebook icon with official brand color and link",
    type: "icon",
    props: {
      icon: "mdi:facebook",
      size: "1.5em",
      color: "#1877f2",
      link: "https://facebook.com/yourpage",
    },
  },
  {
    description: "Twitter/X icon with link - Social media engagement",
    type: "icon",
    props: {
      icon: "mdi:twitter",
      size: "1.5em",
      color: "#000000",
      link: "https://x.com/yourhandle",
    },
  },
  {
    description: "Instagram icon with gradient-inspired color",
    type: "icon",
    props: {
      icon: "mdi:instagram",
      size: "1.5em",
      color: "#e1306c",
      link: "https://instagram.com/yourprofile",
    },
  },
  {
    description: "LinkedIn icon with professional blue",
    type: "icon",
    props: {
      icon: "mdi:linkedin",
      size: "1.5em",
      color: "#0077b5",
      link: "https://linkedin.com/company/yourcompany",
    },
  },

  // CONTACT INFORMATION ICONS
  {
    description: "Email icon with link - Contact information",
    type: "icon",
    props: {
      icon: "mdi:email",
      size: "1.3em",
      color: "#4f46e5",
      link: "mailto:contact@example.com",
    },
  },
  {
    description: "Phone icon with clickable link - Direct calling",
    type: "icon",
    props: {
      icon: "mdi:phone",
      size: "1.4em",
      color: "#10b981",
      link: "tel:+1234567890",
    },
  },
  {
    description: "Location marker icon - Address and directions",
    type: "icon",
    props: {
      icon: "mdi:map-marker",
      size: "1.6em",
      color: "#ef4444",
    },
  },

  // STATUS & FEEDBACK ICONS
  {
    description: "Success checkmark icon - Confirmation and completion",
    type: "icon",
    props: {
      icon: "mdi:check-circle",
      size: "1.5em",
      color: "#10b981",
    },
  },
  {
    description: "Warning icon - Alerts and cautions",
    type: "icon",
    props: {
      icon: "mdi:alert-triangle",
      size: "1.5em",
      color: "#f59e0b",
    },
  },
  {
    description: "Error icon - Problems and failures",
    type: "icon",
    props: {
      icon: "mdi:alert-circle",
      size: "1.5em",
      color: "#ef4444",
    },
  },
  {
    description: "Information icon - Help and guidance",
    type: "icon",
    props: {
      icon: "mdi:information",
      size: "1.4em",
      color: "#3b82f6",
    },
  },
];
