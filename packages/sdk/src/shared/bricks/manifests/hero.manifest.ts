import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { textContentRef } from "../props/text";
import { BsAlphabetUppercase } from "react-icons/bs";
import type { BrickProps } from "../props/types";
import { Type } from "@sinclair/typebox";
import { shadowRef, textShadowRef } from "../props/effects";
import { borderRef, roundingRef } from "../props/border";
import { colorPresetRef } from "../props/color-preset";
import { alignItemsRef, justifyContentRef } from "../props/align";
import { cssLengthRef } from "../props/css-length";

export const manifest = defineBrickManifest({
  type: "hero",
  category: "basic",
  name: "Hero",
  description: "A big textual element for home pages.",
  aiInstructions: `Displays a large text element that can be used to display a title and an optional tagline.
Typically used on home pages to grab the user's attention. It's usually better NOT to provide the colorPreset prop so that it inherits the background of its parent box or section.`,
  icon: BsAlphabetUppercase,

  defaultWidth: { desktop: "60dvw", mobile: "auto" },

  // Force the wrapper direction to be the same as the text direction
  staticClasses: "flex-col",

  props: defineProps({
    content: textContentRef({
      title: "Hero title",
      default: "<h1 class='hero-size-1' style='text-align:center'>Lorem Ipsum<br />dolor sit amet</h1>",
    }),
    tagline: Type.Optional(
      textContentRef({
        title: "Hero tagline",
        default: "<p style='text-align:center'>Use our platform to build your business with confidence.</p>",
      }),
    ),
    colorPreset: Type.Optional(
      colorPresetRef({
        title: "Color",
      }),
    ),

    textShadow: Type.Optional(
      textShadowRef({
        default: "text-shadow-sm",
      }),
    ),
    padding: Type.Optional(
      cssLengthRef({
        default: "6rem",
        description: "Padding inside the hero.",
        "ai:instructions": "Use only a single value like '1rem' or '10px'",
        title: "Padding",
        "ui:responsive": true,
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:padding",
      }),
    ),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(borderRef()),
    shadow: Type.Optional(shadowRef()),
    justifyContent: Type.Optional(
      justifyContentRef({
        default: "justify-center",
      }),
    ),
    alignItems: Type.Optional(
      alignItemsRef({
        default: "items-center",
      }),
    ),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "Simple welcome hero with primary background",
    type: "hero",
    props: {
      content: "Welcome to Our Platform",
      tagline: "The future of productivity starts here",
      padding: "3rem",
      colorPreset: {
        color: "primary-400",
      },
    },
  },
  {
    description: "Startup hero with primary gradient background to bottom-right",
    type: "hero",
    props: {
      content: "Build Something Amazing",
      tagline: "Turn your ideas into reality with our cutting-edge tools",
      padding: "3rem",
      colorPreset: {
        color: "primary-500",
        gradientDirection: "bg-gradient-to-br",
      },
    },
  },
  {
    description: "Construction company hero with bold presence",
    type: "hero",
    props: {
      content: "Building Tomorrow Today",
      tagline: "Quality construction services for residential and commercial projects",
      padding: "3rem",
    },
  },
  {
    description: "Fashion brand hero with modern appeal",
    type: "hero",
    props: {
      content: "Express Your Style",
      tagline: "Contemporary fashion that speaks to your individuality",
      padding: "6rem",
    },
  },
  {
    description: "Law firm hero with authoritative tone",
    type: "hero",
    props: {
      content: "Justice You Can Trust",
      tagline: "Experienced legal representation for individuals and businesses",
      padding: "6rem",
      colorPreset: {
        color: "neutral-800",
      },
    },
  },
  {
    description: "Photography studio hero with artistic flair",
    type: "hero",
    props: {
      content: "Capturing Life's Moments",
      tagline: "Professional photography services for weddings, portraits, and events",
    },
  },
];
