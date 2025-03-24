import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";
import { canvasDataURI } from "~/shared/utils/canvas-data-uri";

type PropImageOptions = {
  defaultImageUrl?: string;
  showImgSearch?: boolean;
  noObjectOptions?: boolean;
};

export function image(title = "Image", options: PropImageOptions = {}) {
  const { defaultImageUrl, showImgSearch = false } = options;
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
      fit: Type.Optional(
        Type.Union(
          [
            Type.Literal("object-none", { title: "None" }),
            Type.Literal("object-contain", { title: "Contain" }),
            Type.Literal("object-cover", { title: "Cover" }),
            Type.Literal("object-fill", { title: "Fill" }),
            Type.Literal("object-scale-down", { title: "Scale down" }),
          ],
          {
            $id: "#styles:objectFit",
            title: "Fit",
            description: "How the image should be resized to fit its container.",
            "ui:field": "enum",
          },
        ),
      ),
      position: Type.Optional(
        Type.Union(
          [
            Type.Literal("object-top", { title: "Top" }),
            Type.Literal("object-center", { title: "Center" }),
            Type.Literal("object-bottom", { title: "Bottom" }),
            Type.Literal("object-left", { title: "Left" }),
            Type.Literal("object-right", { title: "Right" }),
            Type.Literal("object-left-top", { title: "Top left" }),
            Type.Literal("object-right-top", { title: "Top right" }),
            Type.Literal("object-left-bottom", { title: "Bottom left" }),
            Type.Literal("object-right-bottom", { title: "Bottom right" }),
          ],
          {
            $id: "#styles:objectPosition",
            title: "Position",
            description: "The position of the image inside its container.",
            "ui:field": "enum",
          },
        ),
      ),
    },
    {
      "ui:field": "image",
      "ui:accept": "image/*",
      "ui:show-img-search": !!showImgSearch,
      "ui:no-object-options": !!options.noObjectOptions,
      default: {
        // src: defaultImageUrl,
        alt: "Image",
        fit: "object-cover",
        position: "object-center",
      },
    },
  );
  return prop({
    title,
    schema,
  });
}

export type ImageProps = Static<ReturnType<typeof image>>;
