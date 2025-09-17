import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { imageRef } from "../props/image";
import { shadowRef } from "../props/effects";
import { RxImage } from "react-icons/rx";
import { string } from "../props/string";
import { Type } from "@sinclair/typebox";
import type { BrickProps } from "../props/types";
import { backgroundColorRef } from "../props/background";
import { borderRef, roundingRef } from "../props/border";
import { loopRef } from "../props/dynamic";
import { colorPresetRef } from "../props/color-preset";
import { cssLengthRef } from "../props/css-length";

export const manifest = defineBrickManifest({
  type: "image",
  name: "Image",
  category: "media",
  description: "An image brick",
  aiInstructions:
    "An image brick that can display an image with optional styling such as padding, border radius, and shadow. It supports giving credit to the image author and specifying the image provider.",
  defaultWidth: { desktop: "auto", mobile: "100%" },
  icon: RxImage,
  props: defineProps({
    image: imageRef({
      metadata: {
        category: "content",
      },
    }),
    colorPreset: Type.Optional(colorPresetRef()),
    padding: Type.Optional(
      cssLengthRef({
        description: "Padding inside the image.",
        title: "Padding",
        "ai:instructions": "Use only a single value like '1rem' or '10px'",
        "ui:responsive": true,
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:padding",
      }),
    ),
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
    description: "Event banner image with neutral-500 background",
    type: "image",
    props: {
      colorPreset: { color: "neutral-500" },
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
  {
    description: "Dynamic employee photo using employee query",
    type: "image",
    props: {
      image: {
        src: "{{employee.photo}}",
        alt: "Photo of {{employee.fullName}}",
      },
      rounding: "rounded-full",
      shadow: "shadow-lg",
      padding: "1rem",
    },
  },
  {
    description: "Dynamic product image using product query with author attribution",
    type: "image",
    props: {
      image: {
        src: "{{product.featuredImage}}",
        alt: "{{product.name}} - {{product.category}}",
      },
      author: {
        name: "{{product.photographer}}",
        url: "{{product.photographerUrl}}",
      },
      provider: "company-assets",
      shadow: "shadow-md",
      rounding: "rounded-lg",
    },
  },
  {
    description: "Dynamic company logo using company query",
    type: "image",
    props: {
      image: {
        src: "{{company.logo}}",
        alt: "{{company.name}} logo",
      },
      padding: "2rem",
      shadow: "shadow-sm",
      colorPreset: { color: "neutral-100" },
    },
  },
  {
    description: "Dynamic event banner using event query",
    type: "image",
    props: {
      image: {
        src: "{{event.bannerImage}}",
        alt: "{{event.title}} event banner",
      },
      shadow: "shadow-xl",
      rounding: "rounded-xl",
      author: {
        name: "{{event.photographer}}",
        url: "{{event.photographerProfile}}",
      },
      provider: "event-photography",
    },
  },
  {
    description: "Dynamic article featured image using article query",
    type: "image",
    props: {
      image: {
        src: "{{article.featuredImage}}",
        alt: "Featured image for {{article.title}}",
      },
      author: {
        name: "{{article.imageCredit}}",
        url: "{{article.imageCreditUrl}}",
      },
      provider: "{{article.imageProvider}}",
      shadow: "shadow-md",
      rounding: "rounded-lg",
    },
  },
  {
    description: "Dynamic property photo using property query",
    type: "image",
    props: {
      image: {
        src: "{{property.mainPhoto}}",
        alt: "{{property.address}} - {{property.propertyType}}",
      },
      shadow: "shadow-lg",
      rounding: "rounded-xl",
      colorPreset: { color: "primary-50" },
      padding: "1rem",
    },
  },
  {
    description: "Dynamic portfolio piece using portfolio query",
    type: "image",
    props: {
      image: {
        src: "{{portfolio.imageUrl}}",
        alt: "{{portfolio.projectName}} for {{portfolio.clientName}}",
      },
      author: {
        name: "{{portfolio.photographer}}",
        url: "{{portfolio.photographerWebsite}}",
      },
      provider: "portfolio-assets",
      shadow: "shadow-md",
      rounding: "rounded-lg",
      padding: "0.5rem",
    },
  },
  {
    description: "Dynamic service illustration using service query",
    type: "image",
    props: {
      image: {
        src: "{{service.illustration}}",
        alt: "{{service.name}} service illustration",
      },
      colorPreset: { color: "secondary-100" },
      padding: "2rem",
      shadow: "shadow-sm",
      rounding: "rounded-full",
    },
  },
  {
    description: "Dynamic testimonial customer photo using testimonial query",
    type: "image",
    props: {
      image: {
        src: "{{testimonial.customerPhoto}}",
        alt: "{{testimonial.customerName}} from {{testimonial.company}}",
      },
      rounding: "rounded-full",
      shadow: "shadow-lg",
      padding: "0.25rem",
      colorPreset: { color: "accent-50" },
    },
  },
  {
    description: "Product gallery using products query with loop",
    type: "image",
    props: {
      image: {
        src: "{{products.mainImage}}",
        alt: "{{products.name}} - {{products.category}}",
      },
      author: {
        name: "{{products.photographer}}",
        url: "{{products.photographerUrl}}",
      },
      provider: "product-catalog",
      shadow: "shadow-md",
      rounding: "rounded-lg",
      padding: "0.5rem",
      colorPreset: { color: "primary-50" },
      loop: {
        over: "products",
      },
    },
  },
  {
    description: "Team member photos using teamMembers query with loop",
    type: "image",
    props: {
      image: {
        src: "{{teamMembers.profilePhoto}}",
        alt: "{{teamMembers.fullName}} - {{teamMembers.position}}",
      },
      rounding: "rounded-full",
      shadow: "shadow-lg",
      padding: "0.75rem",
      colorPreset: { color: "secondary-100" },
      loop: {
        over: "teamMembers",
      },
    },
  },
];
