import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { textContentRef } from "../props/text";
import { paddingRef } from "../props/padding";
import { BsAlphabetUppercase } from "react-icons/bs";
import type { BrickProps } from "../props/types";
import { type Static, type TObject, Type } from "@sinclair/typebox";
import { textShadowRef } from "../props/effects";
import { borderRef, rounding } from "../props/border";
import { alignItemsRef } from "../props/align";
import { StringEnum } from "~/shared/utils/string-enum";
import { colorPresetRef } from "../props/preset";

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
  // minWidth: { desktop: 800 },

  props: defineProps({
    content: textContentRef({
      title: "Hero title",
      default:
        "<h1 class='hero-size-1' style='text-align:left'><b>Leading Businesses<br />Choose Leading Software</b></h1>",
    }),
    tagline: Type.Optional(
      textContentRef({
        title: "Hero tagline",
        default: "<p style='text-align:left'>Use our platform to build your business with confidence.</p>",
      }),
    ),
    color: Type.Optional(
      colorPresetRef({
        title: "Color",
        "ui:presets": {
          "primary-light": {
            previewBgClass: "bg-primary-light text-primary-content-light",
            value: { main: "bg-primary-light text-primary-content-light border-primary-light" },
            label: "Primary light",
          },
          "primary-light-gradient": {
            previewBgClass: "bg-gradient-to-br from-primary-300 to-primary-500 text-primary-content-light",
            value: {
              main: "from-primary-300 to-primary-500 text-primary-content-light border-primary",
            },
            label: "Primary light gradient",
          },
          primary: {
            previewBgClass: "bg-primary text-primary-content",
            label: "Primary",
            value: { main: "bg-primary text-primary-content border-primary" },
          },
          "primary-gradient": {
            previewBgClass: "bg-gradient-to-br from-primary-500 to-primary-700 text-primary-content",
            label: "Primary gradient",
            value: { main: "from-primary-500 to-primary-700 text-primary-content border-primary" },
          },
          "primary-dark": {
            previewBgClass: "bg-primary-dark text-primary-content",
            label: "Primary dark",
            value: { main: "bg-primary-dark text-primary-content border-primary-dark" },
          },
          "primary-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-primary-700 to-primary-900 text-primary-content",
            label: "Primary dark gradient",
            value: {
              main: "from-primary-700 to-primary-900 text-primary-content border-primary-dark",
            },
          },
          "secondary-light": {
            previewBgClass: "bg-secondary-light text-secondary-content-light",
            label: "Secondary light",
            value: { main: "bg-secondary-light text-secondary-content-light border-secondary-light" },
          },
          "secondary-light-gradient": {
            previewBgClass:
              "bg-gradient-to-br from-secondary-300 to-secondary-500 text-secondary-content-light",
            label: "Secondary light gradient",
            value: {
              main: "from-secondary-300 to-secondary-500 text-secondary-content-light border-secondary",
            },
          },
          secondary: {
            previewBgClass: "bg-secondary text-secondary-content",
            label: "Secondary",
            value: { main: "bg-secondary text-secondary-content border-secondary" },
          },
          "secondary-gradient": {
            previewBgClass: "bg-gradient-to-br from-secondary-500 to-secondary-700 text-secondary-content",
            label: "Secondary gradient",
            value: {
              main: "from-secondary-500 to-secondary-700 text-secondary-content border-secondary",
            },
          },
          "secondary-dark": {
            previewBgClass: "bg-secondary-dark text-secondary-content",
            label: "Secondary dark",
            value: { main: "bg-secondary-dark text-secondary-content border-secondary-dark" },
          },

          "secondary-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-secondary-700 to-secondary-900 text-secondary-content",
            label: "Secondary dark gradient",
            value: {
              main: "from-secondary-700 to-secondary-900 text-secondary-content border-secondary-dark",
            },
          },

          "accent-light": {
            previewBgClass: "bg-accent-light text-accent-content-light",
            label: "Accent lighter",
            value: { main: "bg-accent-light text-accent-content-light border-accent-light" },
          },

          "accent-light-gradient": {
            previewBgClass: "bg-gradient-to-br from-accent-300 to-accent-500 text-accent-content-light",
            label: "Accent light gradient",
            value: { main: "from-accent-300 to-accent-500 text-accent-content-light border-accent" },
          },
          accent: {
            previewBgClass: "bg-accent text-accent-content",
            label: "Accent",
            value: { main: "bg-accent text-accent-content border-accent" },
          },

          "accent-gradient": {
            previewBgClass: "bg-gradient-to-br from-accent-500 to-accent-700 text-accent-content",
            label: "Accent gradient",
            value: { main: "from-accent-500 to-accent-700 text-accent-content border-accent" },
          },
          "accent-dark": {
            previewBgClass: "bg-accent-dark text-accent-content",
            label: "Accent dark",
            value: { main: "bg-accent-dark text-accent-content border-accent-dark" },
          },

          "accent-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-accent-700 to-accent-900 text-accent-content",
            label: "Accent dark gradient",
            value: { main: "from-accent-700 to-accent-900 text-accent-content border-accent-dark" },
          },
          "neutral-light": {
            previewBgClass: "bg-neutral-light text-neutral-content-light",
            label: "Neutral light",
            value: { main: "bg-neutral-light text-neutral-content-light border-neutral-light" },
          },

          "neutral-light-gradient": {
            previewBgClass: "bg-gradient-to-br from-neutral-300 to-neutral-500 text-neutral-content-light",
            label: "Neutral light gradient",
            value: {
              main: "from-neutral-300 to-neutral-500 text-neutral-content-light border-neutral",
            },
          },

          neutral: {
            previewBgClass: "bg-neutral text-neutral-content",
            label: "Neutral",
            value: { main: "bg-neutral text-neutral-content border-neutral" },
          },

          "neutral-gradient": {
            previewBgClass: "bg-gradient-to-br from-neutral-500 to-neutral-700 text-neutral-content",
            label: "Neutral gradient",
            value: { main: "from-neutral-500 to-neutral-700 text-neutral-content border-neutral" },
          },

          "neutral-dark": {
            previewBgClass: "bg-neutral-dark text-neutral-content",
            label: "Neutral dark",
            value: { main: "bg-neutral-dark text-neutral-content border-neutral-dark" },
          },

          "neutral-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-neutral-700 to-neutral-900 text-neutral-content",
            label: "Neutral dark gradient",
            value: {
              main: "from-neutral-700 to-neutral-900 text-neutral-content border-neutral-dark",
            },
          },
          base100: {
            previewBgClass: "bg-base-100 text-base-content border-base-200 border-2",
            label: "Base 100",
            value: { main: "bg-base-100 text-base-content border-base-200" },
          },
          base100_primary: {
            previewBgClass: "bg-base-100 text-base-content border-primary border-2",
            label: "Base 100 / Primary",
            value: { main: "bg-base-100 text-base-content border-primary" },
          },
          base100_secondary: {
            previewBgClass: "bg-base-100 text-base-content border-secondary border-2",
            label: "Base 100 / Secondary",
            value: { main: "bg-base-100 text-base-content border-secondary" },
          },
          base100_accent: {
            previewBgClass: "bg-base-100 text-base-content border-accent border-2",
            label: "Base 100 / Accent",
            value: { main: "bg-base-100 text-base-content border-accent" },
          },

          none: { label: "None", value: {} },
        },
        default: "base100",
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
    border: Type.Optional(borderRef()),
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
    rounding: rounding(),
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
