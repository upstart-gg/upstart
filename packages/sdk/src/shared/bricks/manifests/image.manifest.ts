import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { imageRef } from "../props/image";
import { shadowRef } from "../props/effects";
import { paddingRef } from "../props/padding";
import { RxImage } from "react-icons/rx";
import { string } from "../props/string";
import { Type } from "@sinclair/typebox";
import type { BrickProps } from "../props/types";
import { backgroundColorRef } from "../props/background";
import { borderRef, roundingRef } from "../props/border";
import { loopRef } from "../props/dynamic";

export const manifest = defineBrickManifest({
  type: "image",
  name: "Image",
  category: "media",
  description: "An image brick",
  defaultWidth: { desktop: "auto", mobile: "100%" },
  icon: RxImage,
  props: defineProps({
    image: imageRef({
      metadata: {
        category: "content",
      },
    }),
    backgroundColor: Type.Optional(backgroundColorRef()),
    padding: Type.Optional(paddingRef({})),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(borderRef()),
    shadow: Type.Optional(shadowRef()),
    blurHash: Type.Optional(
      string("Blur Hash", {
        "ui:field": "hidden",
        description: "A placeholder for the image while it is loading. Use a blur hash string.",
      }),
    ),
    author: Type.Optional(
      Type.Object(
        {
          name: string("Image Author", {
            description: "Image author. Use this to give credit to the author",
          }),
          url: string("Image Author URL", {
            description: "Image author URL. Use this to give credit to the author",
          }),
        },
        {
          "ui:field": "hidden",
        },
      ),
    ),
    provider: Type.Optional(
      string("Image Provider", {
        "ui:field": "hidden",
        "ai:instructions": "The provider of the image, e.g. 'unsplash', 'pexels', etc.",
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
    description: "Hero landscape image with large shadow",
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
    description: "Team member profile photo, full rounded",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/300x300.png?text=Profile+Photo",
        alt: "Team member profile photo",
      },
      shadow: "shadow-md",
      rounding: "rounded-full",
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
    description: "Blog article featured image with medium shadow and full author info",
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
    description: "Logo image with padding and small shadow",
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
    description: "Testimonial customer photo with large shadow and small padding",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/120x120.png?text=Customer",
        alt: "Happy customer testimonial photo",
      },
      shadow: "shadow-lg",
      padding: "p-2",
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
      shadow: "shadow-xl",
      author: {
        name: "Event Photographer",
        url: "https://example.com/photographer",
      },
      provider: "pexels",
    },
  },
  {
    description: "Illustration with background and padding",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/150x150.png?text=Blabla+Feature",
        alt: "Feature illustration",
      },
      padding: "p-8",
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
      shadow: "shadow-md",
      blurHash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
    },
  },
];
