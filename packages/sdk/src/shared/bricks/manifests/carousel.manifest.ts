import { type Static, type TObject, Type } from "@sinclair/typebox";
import { TbCarouselHorizontal } from "react-icons/tb";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { imageRef } from "../props/image";
import { string } from "../props/string";
import type { BrickProps } from "../props/types";
import { roundingRef } from "../props/border";
import { colorPresetRef } from "../props/preset";
import { gradientDirectionRef } from "../props/color";
import { paddingRef } from "../props/padding";

export const manifest = defineBrickManifest({
  type: "carousel",
  name: "Carousel",
  description: "An image carousel with navigation arrows and dots or numbers indicator",
  aiInstructions:
    "This brick should be used for image carousels with sliding functionality and navigation controls.",
  defaultInspectorTab: "content",
  minHeight: {
    desktop: 200,
  },
  minWidth: {
    desktop: 300,
  },
  icon: TbCarouselHorizontal,
  props: defineProps({
    color: Type.Optional(
      colorPresetRef({
        title: "Color",
        default: "none",
        "ui:presets": {
          "primary-light": {
            previewBgClass: "bg-primary-light text-primary-content-light",
            value: {
              main: "bg-primary-light text-primary-content-light",
              arrows: "bg-primary-light text-primary-content-light",
            },
            label: "Primary lighter",
          },
          "primary-light-gradient": {
            previewBgClass: "bg-gradient-to-br from-primary-300 to-primary-500 text-primary-content-light",
            value: {
              main: "from-primary-300 to-primary-500 text-primary-content-light",
              arrows: "bg-primary-light text-primary-content-light",
            },
            label: "Primary light gradient",
          },
          primary: {
            previewBgClass: "bg-primary text-primary-content",
            label: "Primary",
            value: {
              main: "bg-primary text-primary-content",
              arrows: "bg-primary text-primary-content",
            },
          },
          "primary-gradient": {
            previewBgClass: "bg-gradient-to-br from-primary-500 to-primary-700 text-primary-content",
            value: {
              main: "from-primary-500 to-primary-700 text-primary-content",
              arrows: "bg-primary text-primary-content",
            },
            label: "Primary gradient",
          },
          "primary-dark": {
            previewBgClass: "bg-primary-dark text-primary-content",
            label: "Primary dark",
            value: {
              main: "bg-primary-dark text-primary-content",
              arrows: "bg-primary-dark text-primary-content-dark",
            },
          },
          "primary-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-primary-700 to-primary-900 text-primary-content",
            value: {
              main: "from-primary-700 to-primary-900 text-primary-content",
              arrows: "bg-primary-dark text-primary-content-dark",
            },
            label: "Primary dark gradient",
          },
          "secondary-light": {
            previewBgClass: "bg-secondary-light text-secondary-content-light",
            label: "Secondary light",
            value: {
              main: "bg-secondary-light text-secondary-content-light",
              arrows: "bg-secondary-light text-secondary-content-light",
            },
          },
          "secondary-light-gradient": {
            previewBgClass:
              "bg-gradient-to-br from-secondary-300 to-secondary-500 text-secondary-content-light",
            value: {
              main: "from-secondary-300 to-secondary-500 text-secondary-content-light",
              arrows: "bg-secondary-light text-secondary-content-light",
            },
            label: "Secondary light gradient",
          },
          secondary: {
            previewBgClass: "bg-secondary text-secondary-content",
            label: "Secondary",
            value: {
              main: "bg-secondary text-secondary-content",
              arrows: "bg-secondary text-secondary-content",
            },
          },
          "secondary-gradient": {
            previewBgClass: "bg-gradient-to-br from-secondary-500 to-secondary-700 text-secondary-content",
            value: {
              main: "from-secondary-500 to-secondary-700 text-secondary-content",
              arrows: "bg-secondary text-secondary-content",
            },
            label: "Secondary gradient",
          },
          "secondary-dark": {
            previewBgClass: "bg-secondary-dark text-secondary-content",
            label: "Secondary dark",
            value: {
              main: "bg-secondary-dark text-secondary-content",
              arrows: "bg-secondary-dark text-secondary-content-dark",
            },
          },
          "secondary-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-secondary-700 to-secondary-900 text-secondary-content",
            value: {
              main: "from-secondary-700 to-secondary-900 text-secondary-content",
              arrows: "bg-secondary-dark text-secondary-content-dark",
            },
            label: "Secondary dark gradient",
          },
          "neutral-light": {
            previewBgClass: "bg-neutral-light text-neutral-content-light",
            value: {
              main: "bg-neutral-light text-neutral-content-light",
              arrows: "bg-neutral-light text-neutral-content-light",
            },
            label: "Neutral light",
          },
          "neutral-light-gradient": {
            previewBgClass: "bg-gradient-to-br from-neutral-300 to-neutral-500 text-neutral-content-light",
            value: {
              main: "from-neutral-300 to-neutral-500 text-neutral-content-light",
              arrows: "bg-neutral-light text-neutral-content-light",
            },
            label: "Neutral light gradient",
          },
          neutral: {
            previewBgClass: "bg-neutral text-neutral-content",
            label: "Neutral",
            value: {
              main: "bg-neutral text-neutral-content",
              arrows: "bg-neutral text-neutral-content",
            },
          },
          "neutral-gradient": {
            previewBgClass: "bg-gradient-to-br from-neutral-500 to-neutral-700 text-neutral-content",
            value: {
              main: "from-neutral-500 to-neutral-700 text-neutral-content",
            },
            label: "Neutral gradient",
          },
          "neutral-dark": {
            previewBgClass: "bg-neutral-dark text-neutral-content",
            label: "Neutral dark",
            value: {
              main: "bg-neutral-dark text-neutral-content",
              arrows: "bg-neutral-dark text-neutral-content-dark",
            },
          },
          "neutral-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-neutral-700 to-neutral-900 text-neutral-content",
            value: {
              main: "from-neutral-700 to-neutral-900 text-neutral-content",
              arrows: "bg-neutral-dark text-neutral-content-dark",
            },
            label: "Neutral dark gradient",
          },
          base100: {
            previewBgClass: "bg-base-100 text-base-content",
            label: "Base 1",
            value: {
              main: "bg-base-100 text-base-content",
              arrows: "bg-base-100 text-base-content",
            },
          },
          base200: {
            previewBgClass: "bg-base-200 text-base-content",
            label: "Base 2",
            value: {
              main: "bg-base-200 text-base-content",
              arrows: "bg-base-200 text-base-content",
            },
          },
          none: {
            label: "None",
            value: {
              main: "bg-transparent",
              arrows: "bg-black/60 text-white/90",
            },
          },
        },
      }),
    ),
    padding: Type.Optional(
      paddingRef({
        default: "p-px",
      }),
    ),
    gradientDirection: Type.Optional(
      gradientDirectionRef("color", {
        default: "bg-gradient-to-br",
      }),
    ),
    // navigationColor: Type.Optional(
    //   colorPresetRef({
    //     title: "Indicators Color",
    //     default: "neutral",
    //     "ui:presets": {
    //       primary: {
    //         previewBgClass: "bg-primary text-primary-content",
    //         label: "Primary",
    //         value: { nav: "bg-primary text-primary-content" },
    //       },
    //       secondary: {
    //         previewBgClass: "bg-secondary text-secondary-content",
    //         label: "Secondary",
    //         value: { main: "bg-secondary text-secondary-content" },
    //       },
    //       neutral: {
    //         previewBgClass: "bg-neutral text-neutral-content",
    //         label: "Neutral",
    //         value: { main: "bg-neutral text-neutral-content" },
    //       },

    //       base100: {
    //         previewBgClass: "bg-base-100 text-base-content",
    //         label: "Base 1",
    //         value: { main: "bg-base-100 text-base-content" },
    //       },

    //       base200: {
    //         previewBgClass: "bg-base-200 text-base-content",
    //         label: "Base 2",
    //         value: { main: "bg-base-200 text-base-content" },
    //       },
    //     },
    //   }),
    // ),
    images: Type.Optional(
      Type.Array(
        Type.Object({
          src: imageRef({
            "ui:responsive": "desktop",
            "ui:no-alt-text": true,
            "ui:no-object-options": true,
          }),
          legend: string("Legend"),
        }),
        {
          title: "Images",
          default: [],
          maxItems: 12,
          metadata: {
            category: "content",
          },
        },
      ),
    ),
    borderRadius: Type.Optional(
      roundingRef({
        default: "rounded-md",
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
    description: "An image carousel with title and legends",
    type: "carousel",
    props: {
      images: [
        {
          src: {
            src: "https://via.placeholder.com/800x400.png?text=Slide+1",
            alt: "First slide",
          },
          legend: "Beautiful landscape",
        },
        {
          src: {
            src: "https://via.placeholder.com/800x400.png?text=Slide+2",
            alt: "Second slide",
          },
          legend: "Amazing architecture",
        },
        {
          src: {
            src: "https://via.placeholder.com/800x400.png?text=Slide+3",
            alt: "Third slide",
          },
          legend: "Stunning nature",
        },
      ],
    },
  },
];
