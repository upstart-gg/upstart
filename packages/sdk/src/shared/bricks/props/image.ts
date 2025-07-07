import { type SchemaOptions, Type, type Static, type ObjectOptions } from "@sinclair/typebox";
import { typedRef } from "~/shared/utils/typed-ref";

type PropImageOptions = {
  defaultImageUrl?: string;
  showImgSearch?: boolean;
  noObjectOptions?: boolean;
} & ObjectOptions;

export function image(title = "Image", options: PropImageOptions = {}) {
  const { defaultImageUrl, showImgSearch = false, noObjectOptions = false } = options;
  const schema = Type.Object(
    {
      src: Type.String({
        default: defaultImageUrl,
        title,
        description: "Image URL. Can be a link to an image or a data URI",
      }),
      alt: Type.Optional(
        Type.String({
          title: "Alternate Text",
          description: "Alternative text for the image. Recommended for screen readers and SEO",
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
            title: "Fit",
            description: "How the image should be resized to fit its container",
            "ui:field": "enum",
            "ui:styleId": "styles:objectFit",
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
            Type.Literal("object-top-left", { title: "Top left" }),
            Type.Literal("object-top-right", { title: "Top right" }),
            Type.Literal("object-bottom-left", { title: "Bottom left" }),
            Type.Literal("object-bottom-right", { title: "Bottom right" }),
          ],
          {
            "ui:styleId": "styles:objectPosition",
            title: "Position",
            description: "The position of the image inside its container",
            "ui:field": "enum",
          },
        ),
      ),
    },
    {
      $id: "assets:image",
      title,
      "ui:field": "image",
      "ui:accept": "image/*",
      "ui:show-img-search": showImgSearch,
      "ui:no-object-options": noObjectOptions,
      default: {
        alt: "Image",
        fit: "object-cover",
        position: "object-center",
      },
      "ui:responsive": "desktop",
      ...options,
    },
  );
  return schema;
}

export function imageRef(options: PropImageOptions & SchemaOptions = {}) {
  return typedRef("assets:image", { ...options });
}

export type ImageProps = Static<ReturnType<typeof image>>;
