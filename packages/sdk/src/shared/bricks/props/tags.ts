import { type Static, Type, type StringOptions } from "@sinclair/typebox";
import { typedRef } from "~/shared/utils/typed-ref";

export function tags(options?: StringOptions) {
  return Type.Array(
    Type.String({
      title: options?.title ?? "Tags",
      ...options,
    }),
    {
      $id: "content:tags",
      "ui:field": "tags",
      title: options?.title ?? "Tags",
      metadata: {
        category: "content",
      },
      ...options,
    },
  );
}

export type TagsSettings = Static<ReturnType<typeof tags>>;

export function tagsRef(options: StringOptions = {}) {
  return typedRef("content:tags", { ...options });
}
