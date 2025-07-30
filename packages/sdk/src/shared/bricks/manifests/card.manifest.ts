import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group } from "../props/helpers";
import { fontSize, textContentRef } from "../props/text";
import { BsCardText } from "react-icons/bs";
import { imageRef } from "../props/image";
import { type Static, type TObject, Type } from "@sinclair/typebox";
import type { BrickProps } from "../props/types";
import { shadowRef } from "../props/effects";
import { borderRef, roundingRef } from "../props/border";
import { colorPresetRef } from "../props/preset";
import { StringEnum } from "~/shared/utils/string-enum";

export const manifest = defineBrickManifest({
  type: "card",
  name: "Card",
  description: "A card that can have a title, image, and content",
  icon: BsCardText,
  defaultWidth: { desktop: "400px", mobile: "100%" },
  minWidth: { desktop: 400 },
  minHeight: { mobile: 200, desktop: 200 },
  maxWidth: { desktop: 650 },
  props: defineProps({
    colorPreset: Type.Optional(
      colorPresetRef({
        title: "Color preset",
        "ui:presets": {
          "primary-light": {
            previewBgClass: "bg-primary-light text-primary-content-light",
            value: { container: "bg-primary-light text-primary-content-light border-primary-light" },
            label: "Primary light",
          },
          "primary-light-gradient": {
            previewBgClass: "bg-gradient-to-br from-primary-300 to-primary-500 text-primary-content-light",
            value: { container: "from-primary-300 to-primary-500 text-primary-content-light border-primary" },
            label: "Primary light gradient",
          },
          primary: {
            previewBgClass: "bg-primary text-primary-content",
            label: "Primary",
            value: { container: "bg-primary text-primary-content border-primary" },
          },
          "primary-gradient": {
            previewBgClass: "bg-gradient-to-br from-primary-500 to-primary-700 text-primary-content",
            label: "Primary gradient",
            value: { container: "from-primary-500 to-primary-700 text-primary-content border-primary" },
          },
          "primary-dark": {
            previewBgClass: "bg-primary-dark text-primary-content",
            label: "Primary dark",
            value: { container: "bg-primary-dark text-primary-content border-primary-dark" },
          },
          "primary-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-primary-700 to-primary-900 text-primary-content",
            label: "Primary dark gradient",
            value: { container: "from-primary-700 to-primary-900 text-primary-content border-primary-dark" },
          },
          "secondary-light": {
            previewBgClass: "bg-secondary-light text-secondary-content-light",
            label: "Secondary light",
            value: { container: "bg-secondary-light text-secondary-content-light border-secondary-light" },
          },
          "secondary-light-gradient": {
            previewBgClass:
              "bg-gradient-to-br from-secondary-300 to-secondary-500 text-secondary-content-light",
            label: "Secondary light gradient",
            value: {
              container: "from-secondary-300 to-secondary-500 text-secondary-content-light border-secondary",
            },
          },
          secondary: {
            previewBgClass: "bg-secondary text-secondary-content",
            label: "Secondary",
            value: { container: "bg-secondary text-secondary-content border-secondary" },
          },
          "secondary-gradient": {
            previewBgClass: "bg-gradient-to-br from-secondary-500 to-secondary-700 text-secondary-content",
            label: "Secondary gradient",
            value: {
              container: "from-secondary-500 to-secondary-700 text-secondary-content border-secondary",
            },
          },
          "secondary-dark": {
            previewBgClass: "bg-secondary-dark text-secondary-content",
            label: "Secondary dark",
            value: { container: "bg-secondary-dark text-secondary-content border-secondary-dark" },
          },

          "secondary-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-secondary-700 to-secondary-900 text-secondary-content",
            label: "Secondary dark gradient",
            value: {
              container: "from-secondary-700 to-secondary-900 text-secondary-content border-secondary-dark",
            },
          },

          "accent-light": {
            previewBgClass: "bg-accent-light text-accent-content-light",
            label: "Accent lighter",
            value: { container: "bg-accent-light text-accent-content-light border-accent-light" },
          },

          "accent-light-gradient": {
            previewBgClass: "bg-gradient-to-br from-accent-300 to-accent-500 text-accent-content-light",
            label: "Accent light gradient",
            value: { container: "from-accent-300 to-accent-500 text-accent-content-light border-accent" },
          },
          accent: {
            previewBgClass: "bg-accent text-accent-content",
            label: "Accent",
            value: { container: "bg-accent text-accent-content border-accent" },
          },

          "accent-gradient": {
            previewBgClass: "bg-gradient-to-br from-accent-500 to-accent-700 text-accent-content",
            label: "Accent gradient",
            value: { container: "from-accent-500 to-accent-700 text-accent-content border-accent" },
          },
          "accent-dark": {
            previewBgClass: "bg-accent-dark text-accent-content",
            label: "Accent dark",
            value: { container: "bg-accent-dark text-accent-content border-accent-dark" },
          },

          "accent-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-accent-700 to-accent-900 text-accent-content",
            label: "Accent dark gradient",
            value: { container: "from-accent-700 to-accent-900 text-accent-content border-accent-dark" },
          },
          "neutral-light": {
            previewBgClass: "bg-neutral-light text-neutral-content-light",
            label: "Neutral light",
            value: { container: "bg-neutral-light text-neutral-content-light border-neutral-light" },
          },

          "neutral-light-gradient": {
            previewBgClass: "bg-gradient-to-br from-neutral-300 to-neutral-500 text-neutral-content-light",
            label: "Neutral light gradient",
            value: { container: "from-neutral-300 to-neutral-500 text-neutral-content-light border-neutral" },
          },

          neutral: {
            previewBgClass: "bg-neutral text-neutral-content",
            label: "Neutral",
            value: { container: "bg-neutral text-neutral-content border-neutral" },
          },

          "neutral-gradient": {
            previewBgClass: "bg-gradient-to-br from-neutral-500 to-neutral-700 text-neutral-content",
            label: "Neutral gradient",
            value: { container: "from-neutral-500 to-neutral-700 text-neutral-content border-neutral" },
          },

          "neutral-dark": {
            previewBgClass: "bg-neutral-dark text-neutral-content",
            label: "Neutral dark",
            value: { container: "bg-neutral-dark text-neutral-content border-neutral-dark" },
          },

          "neutral-dark-gradient": {
            previewBgClass: "bg-gradient-to-br from-neutral-700 to-neutral-900 text-neutral-content",
            label: "Neutral dark gradient",
            value: { container: "from-neutral-700 to-neutral-900 text-neutral-content border-neutral-dark" },
          },
          base100: {
            previewBgClass: "bg-base-100 text-base-content",
            label: "Base 100",
            value: { container: "bg-base-100 text-base-content" },
          },

          none: { label: "None", value: {} },
        },
        default: "primary",
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
              return formData.colorPreset?.includes("gradient") === true;
            },
          },
        },
      ),
    ),
    // variants: Type.Array(
    //   Type.Union(
    //     [
    //       Type.Literal("centered", {
    //         title: "Centered",
    //         "ui:variant-type": "align",
    //       }),
    //       Type.Literal("hide-title", {
    //         title: "Hide title",
    //         "ui:variant-type": "title",
    //       }),
    //       // Type.Literal("text-sm", {
    //       //   title: "S",
    //       //   "ui:variant-type": "font-size",
    //       // }),
    //       // Type.Literal("text-base", {
    //       //   title: "M",
    //       //   "ui:variant-type": "font-size",
    //       // }),
    //       // Type.Literal("text-lg", {
    //       //   title: "L",
    //       //   "ui:variant-type": "font-size",
    //       // }),
    //       // Type.Literal("text-xl", {
    //       //   title: "XL",
    //       //   "ui:variant-type": "font-size",
    //       // }),
    //       // Type.Literal("text-2xl", {
    //       //   title: "2XL",
    //       //   "ui:variant-type": "font-size",
    //       // }),
    //     ],
    //     {
    //       title: "Variants",
    //       "ui:display": "select",
    //     },
    //   ),
    //   {
    //     "ui:field": "variant",
    //     default: ["image-between", "text-base"],
    //     "ui:variant-names": {
    //       "image-placement": "Image Placement",
    //       align: "Alignment",
    //       title: "Hide title",
    //     },
    //   },
    // ),
    cardImage: Type.Optional(
      imageRef({
        "ui:responsive": "desktop",
        metadata: {
          category: "content",
        },
      }),
    ),
    imagePosition: Type.Optional(
      Type.Union(
        [
          Type.Literal("top", { title: "Top" }),
          Type.Literal("middle", { title: "Middle" }),
          Type.Literal("bottom", { title: "Bottom" }),
          Type.Literal("overlay", { title: "Overlay" }),
          Type.Literal("side", { title: "Side" }),
        ],
        {
          title: "Image Position",
          description: "Where the image should be placed in the card",
          default: "top",
          "ui:responsive": "desktop",
          metadata: {
            category: "content",
            filter: (manifestProps: Manifest["props"], formData: Static<Manifest["props"]>) => {
              return !!formData.cardImage?.src;
            },
          },
        },
      ),
    ),
    noTitle: Type.Optional(
      Type.Boolean({
        title: "No Title",
        description: "Whether to hide the card title",
        default: false,
        "ui:responsive": "desktop",
      }),
    ),
    cardTitle: Type.Optional(textContentRef({ title: "Title" })),
    cardBody: Type.Optional(textContentRef({ title: "Body" })),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(
      borderRef({
        default: { width: "border" },
      }),
    ),
    shadow: Type.Optional(shadowRef()),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [
  {
    description: "A simple card with a title and content",
    type: "card",
    props: {
      cardTitle: "Card Title",
      cardBody: "This is the body of the card.",
    },
  },
  {
    description: "Card with image and overlay text",
    type: "card",
    props: {
      cardImage: {
        src: "https://via.placeholder.com/400x300",
        alt: "Placeholder image",
      },
      cardTitle: "Overlay Title",
      cardBody: "Beautiful overlay content with semi-transparent background.",
    },
  },
  {
    description: "Product card with image on the left",
    type: "card",
    props: {
      cardImage: {
        src: "https://via.placeholder.com/200x200",
        alt: "Product image",
      },
      cardTitle: "Premium Headphones",
      cardBody: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    },
  },
  {
    description: "Feature card with large padding and background",
    type: "card",
    props: {
      cardTitle: "Key Feature",
      cardBody: "This feature provides exceptional value and enhances user experience significantly.",
    },
  },
  {
    description: "Blog post card with image at the bottom",
    type: "card",
    props: {
      cardTitle: "The Future of Technology",
      cardBody:
        "Exploring emerging trends and innovations that will shape our digital landscape in the coming decade.",
      cardImage: {
        src: "https://via.placeholder.com/400x200",
        alt: "Technology concept",
      },
    },
  },
  {
    description: "Testimonial card with right-side image",
    type: "card",
    props: {
      cardTitle: "Customer Review",
      cardBody:
        '"This product exceeded my expectations. The quality is outstanding and the customer service is top-notch!"',
      cardImage: {
        src: "https://via.placeholder.com/150x150",
        alt: "Customer photo",
      },
    },
  },
  {
    description: "Minimal centered card without image",
    type: "card",
    props: {
      cardTitle: "Simple Announcement",
      cardBody: "Important updates will be posted here regularly.",
    },
  },
  {
    description: "Event card with multiple variants",
    type: "card",
    props: {
      cardImage: {
        src: "https://via.placeholder.com/400x250",
        alt: "Event venue",
      },
      cardTitle: "Annual Conference 2025",
      cardBody:
        "Join us for three days of inspiring talks, networking opportunities, and hands-on workshops.",
    },
  },
  {
    description: "News article card with compact layout",
    type: "card",
    props: {
      cardImage: {
        src: "https://via.placeholder.com/120x120",
        alt: "News thumbnail",
      },
      cardTitle: "Breaking News Update",
      cardBody: "Latest developments in the ongoing story with expert analysis and community reactions.",
    },
  },
  {
    description: "Call-to-action card with prominent styling",
    type: "card",
    props: {
      cardTitle: "Get Started Today",
      cardBody: "Transform your workflow with our powerful tools. Sign up now and get 30 days free!",
    },
  },
];
