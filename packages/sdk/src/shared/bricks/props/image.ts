import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";

type PropImageOptions = {
  defaultImageUrl?: string;
  showImgSearch?: boolean;
};

export function image(title = "Image", options?: PropImageOptions) {
  const { defaultImageUrl, showImgSearch = false } = options || {};
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
    title,
    schema,
  });
}

export type ImageProps = Static<ReturnType<typeof image>>;
