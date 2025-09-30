import { type Static, Type, type StringOptions } from "@sinclair/typebox";
import type { FieldMetadata } from "./types";

type StrFieldOptions = StringOptions &
  FieldMetadata & {
    "ui:multiline"?: boolean;
  };

export function url(title = "URL", defaultValue?: string) {
  return Type.String({
    title,
    format: "url",
    "ui:field": "url",
    default: defaultValue,
  });
}

const pageIdSchema = Type.String({
  "ui:field": "page-id",
});

export function urlOrPageId(options: StringOptions = {}) {
  return Type.Union(
    [
      Type.String({
        format: "url",
      }),
      pageIdSchema,
    ],
    {
      // $id: "content:urlOrPageId",
      title: "URL",
      description: "A URL or a page ID",
      metadata: {
        category: "content",
      },
      "ui:field": "url-page-id",
      "ai:instructions":
        "This field can be a URL or a page ID. Use the page ID when linking to a internal page, and a URL for external links. It can also contain page queries refrences like '/products/{{ categories.$slug }}' or '/blog/{{ blogPosts.$slug }}'.",
      ...options,
    },
  );
}

export type UrlOrPageIdSettings = Static<ReturnType<typeof urlOrPageId>>;

type IconOptions = StrFieldOptions & { "ui:default-icon-collection"?: string };

export function icon(options: IconOptions = {}) {
  return Type.String({
    title: "Icon",
    description: "An icon from the Iconify collection",
    "ai:instructions": "Use a iconify reference like 'mdi:heart' or 'fa-solid:coffee'.",
    "ui:field": "iconify",
    // $id: "assets:icon",
    metadata: {
      category: "content",
    },
    ...options,
  });
}
