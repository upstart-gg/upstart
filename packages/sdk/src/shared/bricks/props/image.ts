import { Type, type Static, type ObjectOptions } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/string-enum";

type PropImageOptions = {
  defaultImageUrl?: string;
  showImgSearch?: boolean;
  noObjectOptions?: boolean;
} & ObjectOptions;

export function image(options: PropImageOptions = {}) {
  const { defaultImageUrl, showImgSearch = false, noObjectOptions = false } = options;
  const schema = Type.Object(
    {
      src: Type.String({
        title: options.title ?? "Image URL",
        description: "Image URL. Can be a link to an image or a data URI",
      }),
      alt: Type.Optional(
        Type.String({
          title: "Alternate Text",
          description: "Alternative text for the image. Recommended for screen readers and SEO",
          "ui:placeholder": "Your image description",
        }),
      ),
      aspectRatio: Type.Optional(
        StringEnum(
          [
            "auto",
            "1:1",
            "4:3",
            "3:4",
            "16:9",
            "9:16",
            "2:3",
            "3:2",
            "5:4",
            "4:5",
            "21:9",
            "9:21",
            "original",
          ],
          {
            enumNames: [
              "Auto",
              "1:1 (Square)",
              "4:3 (Standard landscape)",
              "3:4 (Standard portrait)",
              "16:9 (Widescreen)",
              "9:16 (Vertical video)",
              "2:3 (Portrait)",
              "3:2 (Landscape)",
              "5:4 (Classic photo)",
              "4:5 (Instagram post)",
              "21:9 (Cinema widescreen)",
              "9:21 (Tall vertical)",
              "Original",
            ],
            title: "Aspect Ratio",
            description: "The aspect ratio of the image",
            default: "auto",
            "ui:field": "enum",
            "ui:styleId": "styles:aspectRatio",
          },
        ),
      ),
      fit: Type.Optional(
        StringEnum(["object-none", "object-contain", "object-cover", "object-fill", "object-scale-down"], {
          enumNames: ["None", "Contain", "Cover", "Fill", "Scale down"],
          title: "Fit",
          description: "How the image should be resized to fit its container",
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
      title: "Image",
      "ui:field": "image",
      "ui:accept": "image/*",
      "ui:show-img-search": showImgSearch,
      "ui:no-object-options": noObjectOptions,
      // "ui:responsive": "desktop",
      metadata: {
        category: "content",
      },
      ...options,
    },
  );
  return schema;
}

export type ImageProps = Static<ReturnType<typeof image>>;
