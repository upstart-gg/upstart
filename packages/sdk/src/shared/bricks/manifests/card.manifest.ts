import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group, optional } from "../props/helpers";
import { fontSize, textContentRef } from "../props/text";
import { BsCardText } from "react-icons/bs";
import { imageRef } from "../props/image";
import { type Static, Type } from "@sinclair/typebox";
import type { BrickProps } from "../props/types";
import { shadowRef } from "../props/effects";
import { borderRef } from "../props/border";
import { colorPresetRef } from "../props/preset";

export const manifest = defineBrickManifest({
  type: "card",
  kind: "widget",
  name: "Card",
  description: "A card that can have a title, image, and content",
  repeatable: true,
  icon: BsCardText,
  defaultWidth: { desktop: "380px", mobile: "100%" },
  minWidth: { mobile: 200, desktop: 200 },
  maxWidth: { desktop: 650 },
  props: defineProps({
    colorPreset: optional(
      colorPresetRef({
        title: "Color preset",
        "ui:presets": {
          "primary-light": {
            previewBgClass: "bg-primary-light text-primary-content-light border-primary-light border-2",
            value: { container: "bg-primary-light text-primary-content-light border-primary-light" },
            label: "Primary lighter",
          },
          primary: {
            previewBgClass: "bg-primary text-primary-content border-primary border-2",
            label: "Primary",
            value: { container: "bg-primary text-primary-content border-primary" },
          },
          "primary-dark": {
            previewBgClass: "bg-primary-dark text-primary-content border-primary-dark border-2",
            label: "Primary darker",
            value: { container: "bg-primary-dark text-primary-content border-primary-dark" },
          },
          "secondary-light": {
            previewBgClass: "bg-secondary-light text-secondary-content-light border-secondary-light border-2",
            label: "Secondary lighter",
            value: { container: "bg-secondary-light text-secondary-content-light border-secondary-light" },
          },
          secondary: {
            previewBgClass: "bg-secondary text-secondary-content border-secondary border-2",
            label: "Secondary",
            value: { container: "bg-secondary text-secondary-content border-secondary" },
          },
          "secondary-dark": {
            previewBgClass: "bg-secondary-dark text-secondary-content border-secondary-dark border-2",
            label: "Secondary darker",
            value: { container: "bg-secondary-dark text-secondary-content border-secondary-dark" },
          },
          "accent-light": {
            previewBgClass: "bg-accent-light text-accent-content-light border-accent-light border-2",
            label: "Accent lighter",
            value: { container: "bg-accent-light text-accent-content-light border-accent-light" },
          },
          accent: {
            previewBgClass: "bg-accent text-accent-content border-accent border-2",
            label: "Accent",
            value: { container: "bg-accent text-accent-content border-accent" },
          },
          "accent-dark": {
            previewBgClass: "bg-accent-dark text-accent-content border-accent-dark border-2",
            label: "Accent darker",
            value: { container: "bg-accent-dark text-accent-content border-accent-dark" },
          },
          neutral: {
            previewBgClass: "bg-neutral text-neutral-content border-neutral border-2",
            label: "Neutral",
            value: { container: "bg-neutral text-neutral-content border-neutral" },
          },
          base100: {
            previewBgClass: "bg-base-100 text-base-content border-base-200 border-2",
            label: "Base 100",
            value: { container: "bg-base-100 text-base-content border-base-200" },
          },
          base100_primary: {
            previewBgClass: "bg-base-100 text-base-content border-primary border-2",
            label: "Base 100 / Primary",
            value: { container: "bg-base-100 text-base-content border-primary" },
          },
          base100_secondary: {
            previewBgClass: "bg-base-100 text-base-content border-secondary border-2",
            label: "Base 100 / Secondary",
            value: { container: "bg-base-100 text-base-content border-secondary" },
          },
          base100_accent: {
            previewBgClass: "bg-base-100 text-base-content border-accent border-2",
            label: "Base 100 / Accent",
            value: { container: "bg-base-100 text-base-content border-accent" },
          },
          base200: {
            previewBgClass: "bg-base-200 text-base-content border-base-300 border-2",
            label: "Base 200",
            value: { container: "bg-base-200 text-base-content border-base-300" },
          },
          base200_primary: {
            previewBgClass: "bg-base-200 text-base-content border-primary border-2",
            label: "Base 200 / Primary",
            value: { container: "bg-base-200 text-base-content border-primary" },
          },
          base200_secondary: {
            previewBgClass: "bg-base-200 text-base-content border-secondary border-2",
            label: "Base 200 / Secondary",
            value: { container: "bg-base-200 text-base-content border-secondary" },
          },
          base200_accent: {
            previewBgClass: "bg-base-200 text-base-content border-accent border-2",
            label: "Base 200 / Accent",
            value: { container: "bg-base-200 text-base-content border-accent" },
          },

          none: { label: "None", value: {} },
        },
        default: "primary",
      }),
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
    cardImage: optional(
      imageRef({
        "ui:responsive": "desktop",
      }),
    ),
    imagePosition: optional(
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
            filter: (manifestProps: Manifest["props"], formData: Static<Manifest["props"]>) => {
              return !!formData.cardImage?.src;
            },
          },
        },
      ),
    ),
    noTitle: optional(
      Type.Boolean({
        title: "No Title",
        description: "Whether to hide the card title",
        default: false,
        "ui:responsive": "desktop",
      }),
    ),
    cardTitle: optional(textContentRef({ title: "Title" })),
    cardBody: optional(textContentRef({ title: "Body" })),
    shadow: optional(shadowRef()),
    border: optional(
      borderRef({
        default: {
          width: "border",
          rounding: "rounded-md",
        },
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
