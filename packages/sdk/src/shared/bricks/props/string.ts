import { type Static, Type, type StringOptions } from "@sinclair/typebox";
import type { FieldMetadata } from "./types";
import { typedRef } from "~/shared/utils/typed-ref";

type StrFieldOptions = StringOptions & FieldMetadata;

export function string(title: string, options: Omit<StrFieldOptions, "default"> = {}) {
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

export function urlOrPageId(title = "URL or Page ID", defaultValue?: string) {
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
      "ui:field": "url-page-id",
      "ai:instructions":
        "This field can be a URL or a page ID. Use the page ID when linking to a internal page, and a URL for external links.",
    },
  );
}

export type UrlOrPageIdSettings = Static<ReturnType<typeof urlOrPageId>>;

export function urlOrPageIdRef(options: { title?: string; default?: string } = {}) {
  return typedRef("content:urlOrPageId", { ...options });
}
