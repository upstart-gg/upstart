import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { PiConfetti } from "react-icons/pi";
import { string, urlOrPageIdRef } from "../props/string";
import type { BrickProps } from "../props/types";
import { Type } from "@sinclair/typebox";

export const manifest = defineBrickManifest({
  type: "icon",
  name: "Icon",
  kind: "brick",
  description: "An icon with optional text",
  repeatable: true,
  icon: PiConfetti,
  props: defineProps({
    icon: string("Icon", {
      title: "Icon",
      description: "Icon to display (iconify reference)",
      "ui:field": "iconify",
    }),
    size: string("Size", {
      title: "Size",
      default: "1em",
      description: "Size of the icon",
      "ai:instructions": "The size of the icon can be set using 'em' or '%' unit.",
    }),
    link: Type.Optional(urlOrPageIdRef({ title: "Link" })),
  }),
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
