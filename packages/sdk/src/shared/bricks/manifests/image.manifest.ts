import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps } from "../props/helpers";
import { image } from "../props/image";
import { shadow } from "../props/effects";
import { RxImage } from "react-icons/rx";
import { Type } from "@sinclair/typebox";
import type { BrickProps } from "../props/types";
import { border, rounding } from "../props/border";
import { loop } from "../props/dynamic";
import { cssLength } from "../props/css-length";
import { colorPreset } from "../props/color-preset";

export const manifest = defineBrickManifest({
  type: "image",
  name: "Image",
  category: "media",
  description: "An image brick",
  aiInstructions: `PURPOSE
Display a single image with optional framing (padding, rounding, border, shadow, colorPreset) and attribution (author/provider). Can also loop over a dataset showing one image per item.

REQUIRED
• 'image.src' and 'image.alt' (alt must be meaningful, not empty; may interpolate page queries fields).

COLOR & BACKGROUND
• colorPreset is optional – use when you need a frame or tone behind the image (neutral / accent / primary / secondary / base or gradient variants). Omit to keep a transparent/inherited background.
• Only use gradientDirection when the preset is a gradient token (e.g. primary-gradient-400).

STYLING
• padding should be a single css length value (like '1rem' or '0.75rem').
• rounding defaults to a modest radius; override for circular avatars (rounded-full) or strong accent (rounded-xl).
• border optional: keep subtle (border / border-2) unless emphasis required.
• Use shadow sparingly (shadow-sm / shadow-md); large (shadow-xl) for hero or banner impact.

ATTRIBUTION
• If using external photography include author { name, url } and provider (e.g. 'unsplash'). Omit provider if internal asset.

DYNAMIC DATA
• Interpolate dataset fields with {{dataset.field}} in src and alt.
• For lists: use loop.over = "datasetName". Provide exactly one example object (this component itself) when looping (do not replicate multiple objects).

RESPONSIVE
• mobileProps may reduce padding or alter rounding only if it materially improves mobile layout. Always repeat required fields (image.src, image.alt) if providing mobileProps.

DON'TS
✗ Don't add unrelated props.
✗ Don't fabricate color tokens (no success-, warning-, danger- etc.).
✗ Don't use HTML markup inside alt.

DO
✓ Provide descriptive alt text (<125 chars) describing content or function.
✓ Use semantic color presets consistently.
✓ Add author/provider when you have them.
`,
  defaultWidth: { desktop: "auto", mobile: "100%" },
  icon: RxImage,
  props: defineProps({
    image: image({
      metadata: {
        category: "content",
      },
    }),
    colorPreset: Type.Optional(colorPreset()),
    padding: Type.Optional(
      cssLength({
        description: "Padding inside the image.",
        title: "Padding",
        "ai:instructions": "Use only a single value like '1rem' or '10px'",
        "ui:responsive": true,
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:padding",
      }),
    ),
    rounding: Type.Optional(
      rounding({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(border()),
    shadow: Type.Optional(shadow()),
    blurHash: Type.Optional(
      Type.String({
        title: "Blur hash",
        "ui:field": "hidden",
        description: "A placeholder for the image while it is loading. Use a blur hash string.",
      }),
    ),
    author: Type.Optional(
      Type.Object(
        {
          name: Type.String({
            title: "Image Author",
            description: "Image author. Use this to give credit to the author",
          }),
          url: Type.String({
            title: "Image Author URL",
            format: "uri",
            description: "Image author URL. Use this to give credit to the author",
          }),
        },
        {
          "ui:field": "hidden",
        },
      ),
    ),
    provider: Type.Optional(
      Type.String({
        title: "Image Provider",
        "ui:field": "hidden",
        "ai:instructions": "The provider of the image, e.g. 'unsplash', 'pexels', etc.",
      }),
    ),
    loop: Type.Optional(loop()),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
  mobileProps?: BrickProps<Manifest>["brick"]["props"];
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
    description: "Framed image with accent gradient background and padding",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/640x360.png?text=Showcase",
        alt: "Showcase screenshot inside accent gradient frame",
      },
      colorPreset: { color: "accent-gradient-400", gradientDirection: "bg-gradient-to-br" },
      padding: "1rem",
      rounding: "rounded-xl",
      shadow: "shadow-md",
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
    description: "Dark framed image with neutral-800 background and subtle border",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/500x300.png?text=Dark+Mode",
        alt: "Interface preview in dark mode",
      },
      colorPreset: { color: "neutral-800" },
      padding: "1rem",
      border: { width: "border", color: "border-neutral-700" },
      rounding: "rounded-lg",
      shadow: "shadow-md",
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
    description: "Responsive image with reduced mobile padding",
    type: "image",
    props: {
      image: {
        src: "https://via.placeholder.com/640x360.png?text=Responsive",
        alt: "Responsive framed screenshot",
      },
      padding: "2rem",
      colorPreset: { color: "primary-50" },
      rounding: "rounded-xl",
      shadow: "shadow-sm",
    },
    mobileProps: {
      image: {
        src: "https://via.placeholder.com/640x360.png?text=Responsive",
        alt: "Responsive framed screenshot",
      },
      padding: "1rem",
      colorPreset: { color: "primary-50" },
      rounding: "rounded-lg",
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
    description: "Loop template: product gallery (one definition, repeated by loop.over)",
    type: "image",
    props: {
      image: {
        src: "{{products.mainImage}}",
        alt: "{{products.name}} – {{products.category}}",
      },
      rounding: "rounded-md",
      padding: "0.5rem",
      shadow: "shadow-sm",
      loop: { over: "products" },
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
