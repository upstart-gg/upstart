import { type SchemaOptions, Type, type Static, type ObjectOptions } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/string-enum";
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
        StringEnum(["object-none", "object-contain", "object-cover", "object-fill", "object-scale-down"], {
          enumNames: ["None", "Contain", "Cover", "Fill", "Scale down"],
          title: "Fit",
          description: "How the image should be resized to fit its container",
          default: "object-cover",
          "ui:field": "enum",
          "ui:styleId": "styles:objectFit",
        }),
      ),
      position: Type.Optional(
        StringEnum(
          [
            "object-top",
            "object-center",
            "object-bottom",
            "object-left",
            "object-right",
            "object-top-left",
            "object-top-right",
            "object-bottom-left",
            "object-bottom-right",
          ],
          {
            enumNames: [
              "Top",
              "Center",
              "Bottom",
              "Left",
              "Right",
              "Top left",
              "Top right",
              "Bottom left",
              "Bottom right",
            ],
            "ui:styleId": "styles:objectPosition",
            title: "Position",
            description: "The position of the image inside its container",
            "ui:field": "enum",
          },
        ),
      ),
    },
    {
      // $id: "assets:image",
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
      // "ui:responsive": "desktop",
      metadata: {
        category: "content",
      },
      ...options,
    },
  );
  return schema;
}

export function imageRef(options: PropImageOptions & SchemaOptions = {}) {
  return typedRef("assets:image", options);
}

export type ImageProps = Static<ReturnType<typeof image>>;
