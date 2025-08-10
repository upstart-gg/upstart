import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { PiConfetti } from "react-icons/pi";
import { iconRef, urlOrPageIdRef } from "../props/string";
import type { BrickProps } from "../props/types";
import { Type } from "@sinclair/typebox";
import { cssLengthRef } from "../props/css-length";
import { colorRef } from "../props/color";

export const manifest = defineBrickManifest({
  type: "icon",
  name: "Icon",
  category: "basic",
  description: "An icon with optional text",
  resizable: false,
  staticClasses: "grow-0",
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
    description: "Large heart icon",
    type: "icon",
    props: {
      icon: "mdi:heart",
      size: "2em",
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
    description: "Email/message icon",
    type: "icon",
    props: {
      icon: "mdi:email",
      size: "1.1em",
      link: "mailto:john.doe@example.com",
    },
  },
  {
    description: "Phone contact icon",
    type: "icon",
    props: {
      icon: "mdi:phone",
      size: "1em",
      link: "tel:+1234567890",
    },
  },
  {
    description: "Large download icon",
    type: "icon",
    props: {
      icon: "mdi:download",
      size: "2.5em",
      link: "https://example.com/file.zip",
    },
  },
  {
    description: "Menu hamburger icon",
    type: "icon",
    props: {
      icon: "mdi:menu",
      size: "1.4em",
    },
  },
  {
    description: "Close/X icon",
    type: "icon",
    props: {
      icon: "mdi:close",
      size: "1.2em",
    },
  },
  {
    description: "Social media Facebook icon",
    type: "icon",
    props: {
      icon: "mdi:facebook",
      size: "1.4em",
      link: "https://www.facebook.com/yourprofile",
    },
  },
  {
    description: "Social media Twitter icon",
    type: "icon",
    props: {
      icon: "mdi:twitter",
      size: "1.4em",
      link: "https://twitter.com/yourprofile",
    },
  },
  {
    description: "Social media Instagram icon",
    type: "icon",
    props: {
      icon: "mdi:instagram",
      size: "1.4em",
      link: "https://www.instagram.com/yourprofile",
    },
  },
];
