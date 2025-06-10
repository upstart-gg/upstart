import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group, optional } from "../props/helpers";
import { basicAlign, basicAlignRef } from "../props/align";
import { background, backgroundRef } from "../props/background";
import { border, borderRef } from "../props/border";
import { textContent, textContentRef } from "../props/text";
import { padding, paddingRef } from "../props/padding";
import { BsAlphabetUppercase } from "react-icons/bs";
import { preset } from "../props/preset";
import type { BrickProps } from "../props/types";
import { colorRef } from "../props/color";
import type { FC } from "react";
import type { Type } from "@sinclair/typebox";
import { shadowRef } from "../props/effects";

export const manifest = defineBrickManifest({
  type: "hero",
  name: "Hero",
  kind: "brick",
  description: "A big textual element for home pages",
  aiInstructions: `
This hero element is a large text element that can be used to display a title and an optional tagline.
It is typically used on home pages to grab the user's attention.
  `.trim(),
  icon: BsAlphabetUppercase,

  defaultHeight: { desktop: 5, mobile: 5 },
  defaultWidth: { desktop: 12, mobile: 12 },

  props: defineProps(
    {
      content: textContentRef({ title: "Hero title", default: "I'm a big text" }),
      tagline: optional(textContentRef({ title: "Hero tagline", default: "I'm a tagline" })),
      background: optional(backgroundRef()),
      color: optional(colorRef()),
      shadow: optional(shadowRef()),
      align: optional(basicAlignRef()),
      padding: optional(paddingRef),
      border: optional(borderRef),
    },
    {
      default: {
        padding: "p-4",
      },
    },
  ),
});

export type Manifest = typeof manifest;
export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Simple welcome hero with blue background",
    type: "hero",
    props: {
      preset: "prominent-primary",
      content: "Welcome to Our Platform",
      tagline: "The future of productivity starts here",
      align: {
        horizontal: "justify-center",
      },
      padding: "p-8",
    },
  },
  {
    description: "Startup hero with gradient background",
    type: "hero",
    props: {
      preset: "prominent-secondary",
      content: "Build Something Amazing",
      tagline: "Turn your ideas into reality with our cutting-edge tools",
      align: {
        horizontal: "justify-center",
      },
      padding: "p-16",
    },
  },
  {
    description: "Construction company hero with bold presence",
    type: "hero",
    props: {
      preset: "prominent-primary",
      content: "Building Tomorrow Today",
      tagline: "Quality construction services for residential and commercial projects",
      padding: "p-16",
    },
  },
  {
    description: "Fashion brand hero with modern appeal",
    type: "hero",
    props: {
      preset: "prominent-accent",
      content: "Express Your Style",
      tagline: "Contemporary fashion that speaks to your individuality",
      align: {
        horizontal: "justify-center",
        vertical: "items-start",
      },
      padding: "p-16",
    },
  },
  {
    description: "Law firm hero with authoritative tone",
    type: "hero",
    props: {
      preset: "prominent-secondary",
      content: "Justice You Can Trust",
      tagline: "Experienced legal representation for individuals and businesses",
      padding: "p-8",
      border: {
        width: "border-2",
        color: "border-gray-800",
        rounding: "rounded-lg",
      },
    },
  },
  {
    description: "Photography studio hero with artistic flair",
    type: "hero",
    props: {
      preset: "surface-1",
      content: "Capturing Life's Moments",
      tagline: "Professional photography services for weddings, portraits, and events",
      border: {
        rounding: "rounded-lg",
      },
    },
  },
];
