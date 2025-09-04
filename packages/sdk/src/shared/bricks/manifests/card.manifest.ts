import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { textContentRef } from "../props/text";
import { BsCardText } from "react-icons/bs";
import { imageRef } from "../props/image";
import { type Static, Type } from "@sinclair/typebox";
import type { BrickProps } from "../props/types";
import { shadowRef } from "../props/effects";
import { borderRef, roundingRef } from "../props/border";
import { colorPresetRef } from "../props/color-preset";
import { loopRef } from "../props/dynamic";
import { StringEnum } from "~/shared/utils/string-enum";

export const manifest = defineBrickManifest({
  type: "card",
  name: "Card",
  description: "A card that can have a title, image, and content",
  icon: BsCardText,
  defaultWidth: { desktop: "400px", mobile: "100%" },
  minWidth: { desktop: 300 },
  minHeight: { mobile: 200, desktop: 200 },
  maxWidth: { desktop: 650 },
  props: defineProps({
    colorPreset: Type.Optional(
      colorPresetRef({
        title: "Color preset",
        default: { color: "base-100" },
      }),
    ),

    cardImage: Type.Optional(
      imageRef({
        "ui:responsive": "desktop",
        metadata: {
          category: "content",
        },
      }),
    ),
    imagePosition: Type.Optional(
      StringEnum(["top", "middle", "bottom", "left", "right"], {
        enumNames: ["Top", "Middle", "Bottom", "Left", "Right"],
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
      }),
    ),
    noTitle: Type.Optional(
      Type.Boolean({
        title: "No Title",
        description: "Whether to hide the card title",
        default: false,
        "ui:responsive": "desktop",
      }),
    ),
    title: Type.Optional(textContentRef({ title: "Title" })),
    text: Type.Optional(textContentRef({ title: "Text" })),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(
      borderRef({
        // default: { width: "border", color: "border-base-300" },
      }),
    ),
    shadow: Type.Optional(
      shadowRef({
        default: "shadow-sm",
      }),
    ),
    loop: Type.Optional(loopRef()),
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
      title: "Card Title",
      text: "This is the body of the card.",
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
      title: "Overlay Title",
      text: "Beautiful overlay content with semi-transparent background.",
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
      title: "Premium Headphones",
      text: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    },
  },
  {
    description: "Feature card with large padding and background",
    type: "card",
    props: {
      title: "Key Feature",
      text: "This feature provides exceptional value and enhances user experience significantly.",
    },
  },
  {
    description: "Blog post card with image at the bottom",
    type: "card",
    props: {
      title: "The Future of Technology",
      text: "Exploring emerging trends and innovations that will shape our digital landscape in the coming decade.",
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
      title: "Customer Review",
      text: '"This product exceeded my expectations. The quality is outstanding and the customer service is top-notch!"',
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
      title: "Simple Announcement",
      text: "Important updates will be posted here regularly.",
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
      title: "Annual Conference 2025",
      text: "Join us for three days of inspiring talks, networking opportunities, and hands-on workshops.",
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
      title: "Breaking News Update",
      text: "Latest developments in the ongoing story with expert analysis and community reactions.",
    },
  },
  {
    description: "Call-to-action card with prominent styling",
    type: "card",
    props: {
      title: "Get Started Today",
      text: "Transform your workflow with our powerful tools. Sign up now and get 30 days free!",
    },
  },
];
