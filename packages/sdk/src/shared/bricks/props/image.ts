import { Type, type Static } from "@sinclair/typebox";

const imageProps = Type.Object(
  {
    src: Type.String({
      default: "/placeholder.svg",
      title: "Image",
    }),
    alt: Type.String({
      title: "Alternate Text",
      description: "Alternative text for the image. Recommended for screen readers and SEO.",
      "ui:placeholder": "Your image description",
    }),
  },
  {
    "ui:group": "image",
    "ui:group:title": "Image",
    "ui:group:order": 1,
    "ui:field": "image",
    "ui:accept": "image/*",
    "ui:show-img-search": true,
    "ui:allow-url": true,
    "ui:inspector-tab": "style",
  },
);

export type ImageProps = Static<typeof imageProps>;

export const imageSettings = Type.Object(imageProps.properties, {
  default: {
    src: "https://placehold.co/400x200",
    alt: "my image",
  },
});

export type ImageSettings = Static<typeof imageSettings>;
