import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { textContentRef } from "../props/text";
import { paddingRef } from "../props/padding";
import { BsAlphabetUppercase } from "react-icons/bs";
import type { BrickProps } from "../props/types";
import { type Static, type TObject, Type } from "@sinclair/typebox";
import { shadowRef, textShadowRef } from "../props/effects";
import { borderRef, rounding, roundingRef } from "../props/border";
import { alignItemsRef } from "../props/align";
import { StringEnum } from "~/shared/utils/string-enum";
import { colorPresetRef } from "../props/color-preset";

export const manifest = defineBrickManifest({
  type: "hero",
  category: "basic",
  name: "Hero",
  description: "A big textual element for home pages",
  aiInstructions: `
This hero element is a large text element that can be used to display a title and an optional tagline.
It is typically used on home pages to grab the user's attention.
  `.trim(),
  icon: BsAlphabetUppercase,

  defaultWidth: { desktop: "60dvw", mobile: "auto" },

  // Force the wrapper direction to be the same as the text direction
  staticClasses: "flex-col",

  props: defineProps({
    content: textContentRef({
      title: "Hero title",
      default:
        "<h1 class='hero-size-1' style='text-align:center'><b>Leading Businesses<br />Choose Leading Software</b></h1>",
    }),
    tagline: Type.Optional(
      textContentRef({
        title: "Hero tagline",
        default: "<p style='text-align:center'>Use our platform to build your business with confidence.</p>",
      }),
    ),
    color: Type.Optional(
      colorPresetRef({
        title: "Color",
      }),
    ),
    gradientDirection: Type.Optional(
      StringEnum(
        [
          "bg-gradient-to-t",
          "bg-gradient-to-r",
          "bg-gradient-to-b",
          "bg-gradient-to-l",
          "bg-gradient-to-tl",
          "bg-gradient-to-tr",
          "bg-gradient-to-br",
          "bg-gradient-to-bl",
        ],
        {
          title: "Gradient direction",
          description: "The direction of the gradient. Only applies when color preset is a gradient.",
          enumNames: [
            "Top",
            "Right",
            "Bottom",
            "Left",
            "Top left",
            "Top right",
            "Bottom right",
            "Bottom left",
          ],
          default: "bg-gradient-to-br",
          "ui:responsive": "desktop",
          "ui:styleId": "styles:gradientDirection",
          metadata: {
            filter: (manifestProps: TObject, formData: Static<Manifest["props"]>) => {
              return formData.color?.includes("gradient") === true;
            },
          },
        },
      ),
    ),
    textShadow: Type.Optional(
      textShadowRef({
        default: "text-shadow-sm",
      }),
    ),
    padding: Type.Optional(
      paddingRef({
        default: "p-8",
      }),
    ),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(borderRef()),
    shadow: Type.Optional(shadowRef()),
    // alignItems: Type.Optional(
    //   alignItemsRef({
    //     default: "items-center",
    //   }),
    // ),
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
