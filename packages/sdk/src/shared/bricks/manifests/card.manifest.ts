import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, group, optional } from "../props/helpers";
import { fontSize, textContentRef } from "../props/text";
import { BsCardText } from "react-icons/bs";
import { imageRef } from "../props/image";
import { Type } from "@sinclair/typebox";
import type { BrickProps } from "../props/types";
import { shadowRef } from "../props/effects";
import { borderRef } from "../props/border";

export const manifest = defineBrickManifest({
  type: "card",
  name: "Card",
  description: "A multi-purpose card that can have a title, image, and content",
  repeatable: true,
  icon: BsCardText,
  maxWidth: { mobile: 400, desktop: 1024 },
  minWidth: { mobile: 200, desktop: 250 },
  props: defineProps({
    variants: Type.Array(
      Type.Union(
        [
          Type.Literal("image-first", {
            title: "Image First",
            "ui:variant-type": "image-placement",
          }),
          Type.Literal("image-between", {
            title: "Image Between",
            "ui:variant-type": "image-placement",
          }),
          Type.Literal("image-last", {
            title: "Image Last",
            "ui:variant-type": "image-placement",
          }),
          Type.Literal("image-overlay", {
            title: "Image Overlay",
            "ui:variant-type": "image-placement",
          }),
          Type.Literal("image-left-side", {
            title: "Image Left Side",
            "ui:variant-type": "image-placement",
          }),
          Type.Literal("image-right-side", {
            title: "Image Right Side",
            "ui:variant-type": "image-placement",
          }),
          Type.Literal("centered", {
            title: "Centered",
            "ui:variant-type": "align",
          }),
          Type.Literal("text-sm", {
            title: "S",
            "ui:variant-type": "font-size",
          }),
          Type.Literal("text-base", {
            title: "M",
            "ui:variant-type": "font-size",
          }),
          Type.Literal("text-lg", {
            title: "L",
            "ui:variant-type": "font-size",
          }),
          Type.Literal("text-xl", {
            title: "XL",
            "ui:variant-type": "font-size",
          }),
          Type.Literal("text-2xl", {
            title: "2XL",
            "ui:variant-type": "font-size",
          }),
        ],
        {
          title: "Variants",
        },
      ),
      {
        "ui:field": "variant",
        default: ["image-between", "text-base"],
        "ui:variant-names": {
          "image-placement": "Image Placement",
          align: "Alignment",
          "font-size": "Base Font Size",
        },
      },
    ),
    cardImage: optional(
      imageRef({
        default: {
          src: "https://placehold.co/300x200?text=Card+Image",
          alt: "Sample Card Image",
        },
      }),
    ),
    cardTitle: optional(textContentRef({ title: "Title" })),
    cardBody: optional(textContentRef({ title: "Body" })),
    shadow: optional(shadowRef()),
    border: optional(
      borderRef({
        default: {
          width: "border",
          rounding: "rounded",
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
      variants: ["image-first"],
      preset: "prominent-primary",
      cardTitle: "Card Title",
      cardBody: "This is the body of the card.",
    },
  },
  {
    description: "Card with image and overlay text",
    type: "card",
    props: {
      variants: ["image-overlay", "centered"],
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
      variants: ["image-left-side"],
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
      variants: ["centered"],
      cardTitle: "Key Feature",
      cardBody: "This feature provides exceptional value and enhances user experience significantly.",
    },
  },
  {
    description: "Blog post card with image at the bottom",
    type: "card",
    props: {
      variants: ["image-last"],
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
      variants: ["image-right-side"],
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
      variants: ["centered"],
      cardTitle: "Simple Announcement",
      cardBody: "Important updates will be posted here regularly.",
    },
  },
  {
    description: "Event card with multiple variants",
    type: "card",
    props: {
      variants: ["image-first", "centered"],
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
      variants: ["image-left-side"],
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
      variants: ["centered"],
      cardTitle: "Get Started Today",
      cardBody: "Transform your workflow with our powerful tools. Sign up now and get 30 days free!",
    },
  },
];
