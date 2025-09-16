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
Typically used on home pages to grab the user's attention. It's better NOT to provide the colorPreset prop so that the Hero inherits the background of its parent box or section.`,
  icon: BsAlphabetUppercase,

  defaultWidth: { desktop: "60dvw", mobile: "auto" },

  // Force the wrapper direction to be the same as the text direction
  staticClasses: "flex-col",

  props: defineProps({
    content: textContentRef({
      title: "Hero title",
      default: "<h1 style='text-align:center'>Lorem Ipsum<br />dolor sit amet</h1>",
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
  {
    description: "Restaurant hero with warm colors and rounded design",
    type: "hero",
    props: {
      content: "Authentic Italian Cuisine",
      tagline: "Fresh ingredients, traditional recipes, unforgettable flavors",
      padding: "4rem",
      colorPreset: {
        color: "orange-600",
      },
      rounding: "rounded-xl",
      shadow: "shadow-lg",
    },
  },
  {
    description: "Tech company hero with success gradient and modern styling",
    type: "hero",
    props: {
      content: "Innovation Redefined",
      tagline: "Pushing the boundaries of what's possible with AI technology",
      padding: "5rem",
      colorPreset: {
        color: "success-500",
        gradientDirection: "bg-gradient-to-r",
      },
      textShadow: "text-shadow-lg",
      border: {
        width: "border-2",
        color: "border-success-300",
      },
    },
  },
  {
    description: "Medical practice hero with trust-inspiring design",
    type: "hero",
    props: {
      content: "Your Health, Our Priority",
      tagline: "Comprehensive healthcare services with compassionate care",
      padding: "4rem",
      colorPreset: {
        color: "blue-500",
      },
      rounding: "rounded-lg",
      justifyContent: "justify-start",
      alignItems: "items-start",
    },
  },
  {
    description: "Creative agency hero with warning accent and diagonal gradient",
    type: "hero",
    props: {
      content: "Creative Solutions",
      tagline: "Bold designs that make your brand unforgettable",
      padding: "3rem",
      colorPreset: {
        color: "warning-400",
        gradientDirection: "bg-gradient-to-tl",
      },
      shadow: "shadow-xl",
      border: {
        width: "border",
        color: "border-warning-200",
      },
    },
  },
  {
    description: "Fitness studio hero with danger color and strong presence",
    type: "hero",
    props: {
      content: "Transform Your Body",
      tagline: "High-intensity training programs that deliver real results",
      padding: "5rem",
      colorPreset: {
        color: "danger-600",
      },
      textShadow: "text-shadow-md",
      rounding: "rounded-2xl",
      justifyContent: "justify-center",
      alignItems: "items-center",
    },
  },
  {
    description: "Minimalist hero with neutral tones and subtle effects",
    type: "hero",
    props: {
      content: "Simplicity Perfected",
      tagline: "Clean design solutions for modern businesses",
      padding: "8rem",
      colorPreset: {
        color: "neutral-100",
      },
      shadow: "shadow-sm",
      border: {
        width: "border",
        color: "border-neutral-300",
      },
      rounding: "rounded-md",
    },
  },
];
