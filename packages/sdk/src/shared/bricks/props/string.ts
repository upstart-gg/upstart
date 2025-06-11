import { type Static, Type, type StringOptions } from "@sinclair/typebox";
import { prop } from "./helpers";
import type { FieldMetadata } from "./types";
import { typedRef } from "~/shared/utils/typed-ref";

type StrFieldOptions = StringOptions & FieldMetadata;

export function string(title: string, defaultValue?: string, options: Omit<StrFieldOptions, "default"> = {}) {
  return prop({
    title,
    schema: Type.String({ default: defaultValue, ...options }),
  });
}

export function url(title = "URL", defaultValue?: string) {
  return prop({
    title,
    schema: Type.String({
      format: "uri",
      "ui:field": "url",
      default: defaultValue,
    }),
  });
}

const pageIdSchema = Type.String({
  "ui:field": "page-id",
});

export function urlOrPageId(title = "URL or Page ID", defaultValue?: string) {
  return prop({
    title,
    schema: Type.Union(
      [
        Type.String({
          format: "uri",
        }),
        pageIdSchema,
      ],
      {
        $id: "content:urlOrPageId",
        default: defaultValue,
        title: "URL or Page ID",
        "ui:field": "url-page-id",
        "ai:instructions":
          "This field can be a URL or a page ID. Use the page ID when linking to a internal page, and a URL for external links.",
      },
    ),
  });
}

export type UrlOrPageIdSettings = Static<ReturnType<typeof urlOrPageId>>;

export function urlOrPageIdRef(options: { title?: string; default?: string } = {}) {
  return typedRef("content:urlOrPageId", { ...options });
}
