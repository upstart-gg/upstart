import { defineBrickManifest } from "~/shared/brick-manifest";
import { padding, paddingRef } from "../props/padding";
import { backgroundColor, backgroundColorRef } from "../props/background";
import { defineProps, group, optional } from "../props/helpers";
import { textContent, textContentRef } from "../props/text";
import { BsCardText } from "react-icons/bs";
import { image, imageRef } from "../props/image";
import { Type } from "@sinclair/typebox";
import type { BrickProps } from "../props/types";
import { borderRef } from "../props/border";
import { shadowRef } from "../props/effects";
import { colorRef } from "../props/color";

export const manifest = defineBrickManifest({
  type: "card",
  name: "Card",
  description: "A multi-purpose card that can have a title, image, and content",
  repeatable: true,
  icon: BsCardText,
  props: defineProps({
    variants: Type.Array(
      Type.Union(
        [
          Type.Literal("image-first", { title: "Image First", "ui:variant-type": "image-placement" }),
          Type.Literal("image-last", { title: "Image Last", "ui:variant-type": "image-placement" }),
          Type.Literal("image-overlay", { title: "Image Overlay", "ui:variant-type": "image-placement" }),
          Type.Literal("image-left-side", { title: "Image Left Side", "ui:variant-type": "image-placement" }),
          Type.Literal("image-right-side", {
            title: "Image Right Side",
            "ui:variant-type": "image-placement",
          }),
          Type.Literal("centered", { title: "Centered", "ui:variant-type": "align" }),
          Type.Literal("bordered", { title: "Bordered", "ui:variant-type": "border" }),
          Type.Literal("shadow-none", { title: "No Shadow", "ui:variant-type": "shadow" }),
          Type.Literal("shadow-small", { title: "Small Shadow", "ui:variant-type": "shadow" }),
          Type.Literal("shadow-medium", { title: "Medium Shadow", "ui:variant-type": "shadow" }),
          Type.Literal("shadow-large", {
            title: "Large Shadow",
            "ui:variant-type": "shadow",
          }),
        ],
        {
          title: "Variants",
        },
      ),
      {
        "ui:field": "variant",
        "ui:variant-names": {
          "image-placement": "Image Placement",
          align: "Alignment",
          border: "Border Style",
        },
      },
    ),
    cardImage: optional(imageRef()),
    cardTitle: optional(
      group({
        title: "Title",
        children: {
          content: textContentRef(),
          padding: optional(paddingRef()),
          backgroundColor: optional(backgroundColorRef()),
        },
      }),
    ),

    cardBody: optional(
      group({
        title: "Body",
        children: {
          content: textContentRef(),
          padding: optional(paddingRef()),
          backgroundColor: optional(backgroundColorRef()),
        },
      }),
    ),
    backgroundColor: optional(backgroundColorRef({ "ui:field": "hidden" })),
    color: optional(colorRef()),
    border: optional(borderRef),
    shadow: optional(shadowRef()),
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
      cardTitle: {
        content: "Card Title",
        padding: "p-4",
      },
      cardBody: {
        content: "This is the body of the card.",
      },
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
      cardTitle: {
        content: "Overlay Title",
        padding: "p-8",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      },
      cardBody: {
        content: "Beautiful overlay content with semi-transparent background.",
        padding: "p-4",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
      },
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
      cardTitle: {
        content: "Premium Headphones",
        padding: "p-4",
      },
      cardBody: {
        content: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
        padding: "p-4",
      },
    },
  },
  {
    description: "Feature card with large padding and background",
    type: "card",
    props: {
      variants: ["centered"],
      cardTitle: {
        content: "Key Feature",
        padding: "p-8",
        backgroundColor: "#f8f9fa",
      },
      cardBody: {
        content: "This feature provides exceptional value and enhances user experience significantly.",
        padding: "p-8",
        backgroundColor: "#ffffff",
      },
    },
  },
  {
    description: "Blog post card with image at the bottom",
    type: "card",
    props: {
      variants: ["image-last"],
      cardTitle: {
        content: "The Future of Technology",
        padding: "p-4",
      },
      cardBody: {
        content:
          "Exploring emerging trends and innovations that will shape our digital landscape in the coming decade.",
        padding: "p-4",
      },
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
      cardTitle: {
        content: "Customer Review",
        padding: "p-4",
        backgroundColor: "#e3f2fd",
      },
      cardBody: {
        content:
          '"This product exceeded my expectations. The quality is outstanding and the customer service is top-notch!"',
        padding: "p-4",
      },
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
      cardTitle: {
        content: "Simple Announcement",
        padding: "p-4",
      },
      cardBody: {
        content: "Important updates will be posted here regularly.",
        padding: "p-4",
      },
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
      cardTitle: {
        content: "Annual Conference 2025",
        padding: "p-8",
        backgroundColor: "#1976d2",
      },
      cardBody: {
        content:
          "Join us for three days of inspiring talks, networking opportunities, and hands-on workshops.",
        padding: "p-8",
      },
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
      cardTitle: {
        content: "Breaking News Update",
        padding: "p-2",
      },
      cardBody: {
        content: "Latest developments in the ongoing story with expert analysis and community reactions.",
        padding: "p-2",
      },
    },
  },
  {
    description: "Call-to-action card with prominent styling",
    type: "card",
    props: {
      variants: ["centered"],
      cardTitle: {
        content: "Get Started Today",
        padding: "p-8",
        backgroundColor: "#4caf50",
      },
      cardBody: {
        content: "Transform your workflow with our powerful tools. Sign up now and get 30 days free!",
        padding: "p-8",
        backgroundColor: "#f1f8e9",
      },
    },
  },
];
