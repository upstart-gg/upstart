import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { basicAlignRef } from "../props/align";
import { backgroundRef } from "../props/background";
import { borderRef } from "../props/border";
import { textContentRef } from "../props/text";
import { paddingRef } from "../props/padding";
import { BsAlphabetUppercase } from "react-icons/bs";
import type { BrickProps } from "../props/types";
import { colorRef } from "../props/color";
import { Type } from "@sinclair/typebox";
import { shadowRef, textShadow } from "../props/effects";
import { StringEnum } from "~/shared/utils/string-enum";

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

  defaultWidth: { desktop: "60dvw", mobile: "auto" },
  minWidth: { desktop: 800 },

  props: defineProps({
    content: textContentRef({
      title: "Hero title",
      default: "<b>Leading Businesses Choose Leading Software</b>",
    }),
    tagline: Type.Optional(
      textContentRef({
        title: "Hero tagline",
        default: "Use our platform to build your business with confidence.",
      }),
    ),
    background: Type.Optional(backgroundRef()),
    color: Type.Optional(colorRef()),
    textShadow: Type.Optional(textShadow()),
    layout: Type.Optional(
      StringEnum(["centered", "sided"], {
        title: "Layout",
        default: "sided",
        enumNames: ["Centered", "Sided"],
      }),
    ),
    padding: Type.Optional(
      paddingRef({
        default: "p-2",
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
    description: "Simple welcome hero with blue background",
    type: "hero",
    props: {
      content: "Welcome to Our Platform",
      tagline: "The future of productivity starts here",
      padding: "p-8",
    },
  },
  {
    description: "Startup hero with gradient background",
    type: "hero",
    props: {
      content: "Build Something Amazing",
      tagline: "Turn your ideas into reality with our cutting-edge tools",
      padding: "p-16",
    },
  },
  {
    description: "Construction company hero with bold presence",
    type: "hero",
    props: {
      content: "Building Tomorrow Today",
      tagline: "Quality construction services for residential and commercial projects",
      padding: "p-16",
    },
  },
  {
    description: "Fashion brand hero with modern appeal",
    type: "hero",
    props: {
      content: "Express Your Style",
      tagline: "Contemporary fashion that speaks to your individuality",
      padding: "p-16",
    },
  },
  {
    description: "Law firm hero with authoritative tone",
    type: "hero",
    props: {
      content: "Justice You Can Trust",
      tagline: "Experienced legal representation for individuals and businesses",
      padding: "p-8",
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
