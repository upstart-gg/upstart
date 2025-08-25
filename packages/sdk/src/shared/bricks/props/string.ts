import { type Static, Type, type StringOptions } from "@sinclair/typebox";
import type { FieldMetadata } from "./types";
import { typedRef } from "~/shared/utils/typed-ref";

type StrFieldOptions = StringOptions &
  FieldMetadata & {
    "ui:multiline"?: boolean;
  };

export function string(title: string, options: StrFieldOptions = {}) {
  return Type.String({ title, ...options });
}

export function url(title = "URL", defaultValue?: string) {
  return Type.String({
    title,
    format: "uri",
    "ui:field": "url",
    default: defaultValue,
  });
}

const pageIdSchema = Type.String({
  "ui:field": "page-id",
});

export function urlOrPageId(title = "URL", defaultValue?: string) {
  return Type.Union(
    [
      Type.String({
        format: "uri",
      }),
      pageIdSchema,
    ],
    {
      $id: "content:urlOrPageId",
      default: defaultValue,
      title,
      metadata: {
        category: "content",
      },
      "ui:field": "url-page-id",
      "ai:instructions":
        "This field can be a URL or a page ID. Use the page ID when linking to a internal page, and a URL for external links.",
    },
  );
}

export type UrlOrPageIdSettings = Static<ReturnType<typeof urlOrPageId>>;

export function urlOrPageIdRef(options: StrFieldOptions = {}) {
  return typedRef("content:urlOrPageId", { ...options });
}

type IconOptions = StrFieldOptions & { "ui:default-icon-collection"?: string };

export function icon(title?: string, options: IconOptions = {}) {
  return Type.String({
    title: title ?? "Icon",
    "ai:instructions": "Use a iconify reference like 'mdi:heart' or 'fa-solid:coffee'.",
    "ui:field": "iconify",
    $id: "assets:icon",
    metadata: {
      category: "content",
    },
    ...options,
  });
}

export function iconRef(options: IconOptions = {}) {
  return typedRef("assets:icon", options);
}
