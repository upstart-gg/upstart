import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";
import { canvasDataURI } from "~/shared/utils/canvas-data-uri";

type PropImageOptions = {
  defaultImageUrl?: string;
  showImgSearch?: boolean;
};

export function image(title = "Image", options: PropImageOptions = {}) {
  const { defaultImageUrl = canvasDataURI, showImgSearch = false } = options;
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
      fit: Type.Union(
        [
          Type.Literal("object-none", { title: "None" }),
          Type.Literal("object-contain", { title: "Contain" }),
          Type.Literal("object-cover", { title: "Cover" }),
          Type.Literal("object-fill", { title: "Fill" }),
          Type.Literal("object-scale-down", { title: "Scale down" }),
        ],
        {
          $id: "#styles:objectFit",
          default: "object-cover",
          title: "Fit",
          description: "How the image should be resized to fit its container.",
          "ui:field": "enum",
          "ui:display": "button-group",
        },
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
