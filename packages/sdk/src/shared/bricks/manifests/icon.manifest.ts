import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { PiConfetti } from "react-icons/pi";
import { iconRef, urlOrPageIdRef } from "../props/string";
import type { BrickProps } from "../props/types";
import { Type } from "@sinclair/typebox";
import { cssLengthRef } from "../props/css-length";
import { colorRef } from "../props/color";
import { loopRef } from "../props/dynamic";

export const manifest = defineBrickManifest({
  type: "icon",
  name: "Icon",
  category: "basic",
  description: "An icon.",
  aiInstructions: "Uses iconify references",
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

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Large heart icon with inherited color and size",
    type: "icon",
    props: {
      icon: "mdi:heart",
    },
  },
  {
    description: "Shopping cart icon",
    type: "icon",
    props: {
      icon: "mdi:cart",
      size: "1.2em",
    },
  },
  {
    description: "Social media icon with blue color and link",
    type: "icon",
    props: {
      icon: "mdi:facebook",
      size: "1.5em",
      color: "#1877f2",
      link: "https://facebook.com/yourpage",
    },
  },
  {
    description: "Warning icon with orange color for alerts",
    type: "icon",
    props: {
      icon: "mdi:alert-triangle",
      size: "1.8em",
      color: "#f59e0b",
    },
  },
  {
    description: "Email contact icon with link",
    type: "icon",
    props: {
      icon: "mdi:email",
      size: "1.3em",
      color: "#4f46e5",
      link: "mailto:contact@example.com",
    },
  },
  {
    description: "Phone icon with green color",
    type: "icon",
    props: {
      icon: "mdi:phone",
      size: "1.4em",
      color: "#10b981",
    },
  },
  {
    description: "Location pin icon with red color",
    type: "icon",
    props: {
      icon: "mdi:map-marker",
      size: "2.2em",
      color: "#ef4444",
    },
  },
  {
    description: "Twitter/X icon with custom color and link",
    type: "icon",
    props: {
      icon: "mdi:twitter",
      size: "1.6em",
      color: "#000000",
      link: "https://x.com/yourhandle",
    },
  },
  {
    description: "Star rating icon with gold color",
    type: "icon",
    props: {
      icon: "mdi:star",
      size: "1.2em",
      color: "#fbbf24",
    },
  },
  {
    description: "Download icon with link and purple color",
    type: "icon",
    props: {
      icon: "mdi:download",
      size: "1.5em",
      color: "#8b5cf6",
      link: "/files/brochure.pdf",
    },
  },
  {
    description: "Menu hamburger icon for navigation",
    type: "icon",
    props: {
      icon: "mdi:menu",
      size: "1.8em",
      color: "#374151",
    },
  },
  {
    description: "Search icon with dark color",
    type: "icon",
    props: {
      icon: "mdi:magnify",
      size: "1.1em",
      color: "#1f2937",
    },
  },
];
