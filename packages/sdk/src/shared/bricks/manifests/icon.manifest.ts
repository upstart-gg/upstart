import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { PiConfetti } from "react-icons/pi";
import { iconRef, urlOrPageIdRef } from "../props/string";
import type { BrickProps } from "../props/types";
import { Type } from "@sinclair/typebox";
import { cssLengthRef } from "../props/css-length";
import { colorRef } from "../props/color";
import { loopRef } from "../props/dynamic";
import type { BrickExample } from "./_types";

export const manifest = defineBrickManifest({
  type: "icon",
  name: "Icon",
  category: "basic",
  description: "An icon.",
  aiInstructions: `Use the icon component for adding visual symbols and interactive elements throughout your design.

WHEN TO USE:
- Navigation elements (menu, close, arrow buttons)
- Social media links (Facebook, Twitter, Instagram, LinkedIn)
- Contact information (email, phone, location markers)
- User interface actions (search, shopping cart, download)
- Status indicators (success, warning, error, info)
- Content enhancement (stars, hearts, thumbs up)
- Feature highlights (checkmarks, shields, awards)

ICON SELECTION:
- Use Iconify format: "mdi:icon-name", "lucide:icon-name", "heroicons:icon-name"
- Examples: "mdi:heart", "lucide:star", "heroicons:envelope", "mdi:facebook"

SIZING GUIDELINES:
- size: "1em" for inline text icons, "1.5em" for buttons, "2em" for headers
- Common sizes: "16px", "20px", "24px", "32px" for pixel precision
- Use "em" units to scale with text, "px" for fixed sizes
- Large decorative icons: "3em", "4em", or "48px", "64px"

COLOR OPTIONS:
- color: "currentColor" inherits text color (default)
- Hex colors: "#1877f2" (Facebook blue), "#ff0000" (red), "#10b981" (green)
- Use brand colors for social media icons
- Match color scheme: warnings (orange/yellow), errors (red), success (green)

INTERACTIVE ICONS:
- Add link property for clickable icons
- External links: "https://facebook.com/yourpage"
- Email links: "mailto:contact@example.com"
- Phone links: "tel:+1234567890"
- Internal pages: "/contact", "/about"

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
      icon: iconRef({
        default: "mdi:heart",
      }),
      size: Type.Optional(
        cssLengthRef({
          title: "Size",
          description: "The size of the icon. Can be a CSS length value (e.g. '2em', '24px')",
          default: "1em",
          "ui:css-units": ["em", "rem", "px"],
          "ai:instructions": "Use 'em', 'rem', or 'px' for units. Example: '2em', '24px'",
        }),
      ),
      color: Type.Optional(
        colorRef({
          title: "Color",
          default: "currentColor",
          "ui:hide-color-label": true,
        }),
      ),
      link: Type.Optional(urlOrPageIdRef({ title: "Link" })),
      loop: Type.Optional(loopRef()),
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

  // ACTION ICONS
  {
    description: "Download icon with link - File downloads",
    type: "icon",
    props: {
      icon: "mdi:download",
      size: "1.4em",
      color: "#8b5cf6",
      link: "/files/brochure.pdf",
    },
  },
  {
    description: "Share icon - Content sharing functionality",
    type: "icon",
    props: {
      icon: "mdi:share-variant",
      size: "1.2em",
      color: "#6b7280",
    },
  },
  {
    description: "Print icon - Document printing",
    type: "icon",
    props: {
      icon: "mdi:printer",
      size: "1.3em",
      color: "#374151",
    },
  },

  // LARGE DECORATIVE ICONS
  {
    description: "Large security shield icon - Trust and safety messaging",
    type: "icon",
    props: {
      icon: "mdi:shield-check",
      size: "3em",
      color: "#10b981",
    },
  },
  {
    description: "Large rocket icon - Innovation and growth themes",
    type: "icon",
    props: {
      icon: "mdi:rocket",
      size: "2.5em",
      color: "#f59e0b",
    },
  },

  // DYNAMIC CONTENT EXAMPLES
  {
    description: "Dynamic service icon using template variables - Data-driven icons",
    type: "icon",
    props: {
      icon: "{{service.iconName}}",
      size: "2em",
      color: "{{service.brandColor}}",
      link: "/services/{{service.slug}}",
    },
  },
  {
    description: "Dynamic social media icon with loop - Multiple social platforms",
    type: "icon",
    props: {
      icon: "{{socialLinks.iconName}}",
      size: "1.6em",
      color: "{{socialLinks.brandColor}}",
      link: "{{socialLinks.url}}",
      loop: { over: "socialLinks" },
    },
  },
  {
    description: "Team member contact icon - Dynamic contact information",
    type: "icon",
    props: {
      icon: "mdi:email",
      size: "1.2em",
      color: "#4f46e5",
      link: "mailto:{{teamMember.email}}",
    },
  },
];
