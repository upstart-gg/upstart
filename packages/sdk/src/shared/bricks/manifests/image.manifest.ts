import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional } from "../props/helpers";
import { imageRef } from "../props/image";
import { backgroundColorRef } from "../props/background";
import { borderRef } from "../props/border";
import { shadowRef } from "../props/effects";
import { paddingRef } from "../props/padding";
import { RxImage } from "react-icons/rx";
import { string } from "../props/string";
import { Type } from "@sinclair/typebox";
import type { BrickProps } from "../props/types";

export const manifest = defineBrickManifest({
  type: "image",
  kind: "brick",
  name: "Image",
  description: "An image brick",
  repeatable: true,
  defaultWidth: { desktop: "200px", mobile: "100%" },
  icon: RxImage,
  props: defineProps({
    image: imageRef(),
    backgroundColor: optional(backgroundColorRef()),
    border: optional(borderRef()),
    padding: optional(paddingRef()),
    shadow: optional(shadowRef()),
    blurHash: optional(
      string("Blur Hash", {
        "ui:fied": "hidden",
        description: "A placeholder for the image while it is loading. Use a blur hash string.",
      }),
    ),
    author: optional(
      Type.Object({
        name: string("Image Author", {
          "ui:field": "hidden",
          description: "Image author. Use this to give credit to the author",
        }),
        url: string("Image Author URL", {
          "ui:field": "hidden",
          description: "Image author URL. Use this to give credit to the author",
        }),
      }),
    ),
    provider: optional(
      string("Image Provider", {
        "ui:field": "hidden",
        description: "Image provider. Use this to give credit to the author",
        "ai:instructions": "The provider of the image, e.g. 'unsplash', 'pexels', etc.",
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
    description: "Hero landscape image with shadow",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/800x400.png?text=Hero+Landscape",
        alt: "Beautiful landscape view for hero section",
      },
      shadow: "shadow-lg",
    },
  },
  {
    description: "Team member profile photo",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/300x300.png?text=Profile+Photo",
        alt: "Team member profile photo",
      },
      shadow: "shadow-md",
      border: {
        rounding: "rounded-full",
        width: "border-2",
      },
    },
  },
  {
    description: "Product showcase image",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/400x400.png?text=Product+Image",
        alt: "Premium product showcase",
      },
      shadow: "shadow-sm",
    },
  },
  {
    description: "Blog article featured image",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/600x300.png?text=Article+Featured",
        alt: "Featured image for blog article",
      },
      author: {
        name: "John Photographer",
        url: "https://example.com/john",
      },
      provider: "unsplash",
      shadow: "shadow-md",
    },
  },
  {
    description: "Gallery thumbnail with hover effect",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/250x250.png?text=Gallery+Thumb",
        alt: "Gallery thumbnail image",
      },

      shadow: "shadow-md",
    },
  },
  {
    description: "Logo image with padding",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/200x80.png?text=Company+Logo",
        alt: "Company logo",
      },
      padding: "p-8",
      shadow: "shadow-sm",
    },
  },
  {
    description: "Testimonial customer photo",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/120x120.png?text=Customer",
        alt: "Happy customer testimonial photo",
      },
      border: {
        rounding: "rounded-xl",
        width: "border-2",
      },
      shadow: "shadow-lg",
      padding: "p-2",
      backgroundColor: "#ffffff",
    },
  },
  {
    description: "Event banner image",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/800x200.png?text=Event+Banner",
        alt: "Annual conference event banner",
      },
      border: {
        rounding: "rounded-lg",
        width: "border-2",
      },
      shadow: "shadow-xl",
      author: {
        name: "Event Photographer",
        url: "https://example.com/photographer",
      },
      provider: "pexels",
    },
  },
  {
    description: "Illustration with background",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/150x150.png?text=Blabla+Feature",
        alt: "Feature illustration",
      },
      backgroundColor: "#f0f9ff",
      padding: "p-8",
      border: {
        rounding: "rounded-lg",
        width: "border-2",
      },
      shadow: "shadow-sm",
    },
  },
  {
    description: "Image with blurHash",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/300x200.png?text=Card+Image",
        alt: "My image",
      },
      border: {
        rounding: "rounded-lg",
        width: "border-2",
      },
      shadow: "shadow-md",
      blurHash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
    },
  },
];
