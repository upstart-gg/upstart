import { Type, type ObjectOptions, type Static } from "@sinclair/typebox";

type PropFaviconOptions = ObjectOptions;

export function favicon(options: PropFaviconOptions = {}) {
  const schema = Type.Object(
    {
      src: Type.Optional(
        Type.String({
          title: options.title ?? "Favicon URL",
          description: "Favicon URL. Should be a .ico, .png, or .svg file with 32×32 or 16×16 pixels",
          format: "uri",
        }),
      ),
      alt: Type.Optional(
        Type.String({
          title: "Alternate Text",
          description: "Alternative text for the favicon. Usually not needed for favicons",
          "ui:placeholder": "Site icon",
        }),
      ),
    },
    {
      title: "Favicon",
      "ui:field": "favicon",
      "ui:accept": "image/*",
      "ui:no-dynamic": true,
      metadata: {
        category: "meta",
      },
      ...options,
    },
  );
  return schema;
}

export type FaviconProps = Static<ReturnType<typeof favicon>>;
