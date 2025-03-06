import { Type, type Static } from "@sinclair/typebox";

export const imageProps = Type.Object(
  {
    src: Type.String({
      default: "/placeholder.svg",
      title: "Image",
    }),
    alt: Type.Optional(
      Type.String({
        title: "Alternate Text",
        description: "Alternative text for the image. Recommended for screen readers and SEO.",
        "ui:placeholder": "Your image description",
      }),
    ),
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
