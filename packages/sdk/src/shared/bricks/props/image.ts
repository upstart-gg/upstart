import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";

export const imageSchema = Type.Object(
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
  },
);

type PropImageOptions = {
  defaultImageUrl?: string;
  showImgSearch?: boolean;
  required?: boolean;
};

export function propImage(id: string, title = "Image", props?: PropImageOptions) {
  const { required, defaultImageUrl, showImgSearch = false } = props || {};
  const schema = Type.Object(
    {
      src: Type.String({
        default: defaultImageUrl,
        title,
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
      "ui:field": "image",
      "ui:accept": "image/*",
      "ui:show-img-search": !!showImgSearch,
    },
  );
  return prop({
    id,
    title,
    schema: required ? schema : Type.Optional(schema),
  });
}

export type ImageProps = Static<typeof imageSchema>;
export type ImageProps2 = Static<ReturnType<typeof propImage>>;
