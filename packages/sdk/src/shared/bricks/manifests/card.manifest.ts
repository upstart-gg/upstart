import { defineBrickManifest } from "~/shared/brick-manifest";
import { padding } from "../props/padding";
import { backgroundColor } from "../props/background";
import { defineProps, group, optional } from "../props/helpers";
import { textContent } from "../props/text";
import { BsCardText } from "react-icons/bs";
import { image } from "../props/image";
import { Type } from "@sinclair/typebox";
import type { BrickProps } from "../props/types";

export const manifest = defineBrickManifest({
  type: "card",
  name: "Card",
  description: "A multi-purpose card that can have a title, subtitle, image, and content",
  repeatable: true,
  icon: BsCardText,
  props: defineProps({
    variants: Type.Array(
      Type.Union(
        [
          Type.Literal("image-first", { title: "Image First" }),
          Type.Literal("image-last", { title: "Image Last" }),
          Type.Literal("image-overlay", { title: "Image Overlay" }),
          Type.Literal("image-left-side", { title: "Image Left Side" }),
          Type.Literal("image-right-side", { title: "Image Right Side" }),
          Type.Literal("centered", { title: "Centered" }),
          Type.Literal("large-padding", { title: "Large padding" }),
        ],
        {
          title: "Variant",
          description:
            "The variants of the card. You can select multiple, for example: `image-first` and `centered`.",
        },
      ),
    ),
    cardTitle: optional(
      group({
        title: "Title",
        children: {
          content: textContent(),
          padding: optional(padding()),
          backgroundColor: optional(backgroundColor()),
        },
      }),
    ),
    cardImage: optional(
      group({
        title: "Image",
        children: {
          image: image(),
        },
      }),
    ),
    cardBody: optional(
      group({
        title: "Body",
        children: {
          content: textContent(),
          padding: optional(padding()),
          backgroundColor: optional(backgroundColor()),
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
      preset: "bold-primary",
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
        image: {
          src: "https://via.placeholder.com/400x300",
          alt: "Placeholder image",
        },
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
        image: {
          src: "https://via.placeholder.com/200x200",
          alt: "Product image",
        },
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
      variants: ["large-padding", "centered"],
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
        image: {
          src: "https://via.placeholder.com/400x200",
          alt: "Technology concept",
        },
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
        image: {
          src: "https://via.placeholder.com/150x150",
          alt: "Customer photo",
        },
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
      variants: ["image-first", "large-padding", "centered"],
      cardImage: {
        image: {
          src: "https://via.placeholder.com/400x250",
          alt: "Event venue",
        },
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
        image: {
          src: "https://via.placeholder.com/120x120",
          alt: "News thumbnail",
        },
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
      variants: ["centered", "large-padding"],
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
