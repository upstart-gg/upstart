import type { SchemaOptions, Static } from "@sinclair/typebox";
import { typedRef } from "~/shared/utils/typed-ref";
import { StringEnum } from "~/shared/utils/string-enum";

export function padding() {
  return StringEnum(
    ["p-0", "p-px", "p-1", "p-2", "p-3", "p-4", "p-6", "p-8", "p-10", "p-12", "p-16", "p-24"],
    {
      title: "Padding",
      $id: "styles:padding",
      enumNames: [
        "None",
        "Minimal",
        "Size 1",
        "Size 2",
        "Size 3",
        "Size 4",
        "Size 5",
        "Size 6",
        "Size 7",
        "Size 8",
        "Size 9",
        "Size 10",
      ],
      description: "Space between the content and the border",
      "ai:instructions": "Can be a tailwind class like `p-4` or a custom value like `p-[16px]`.",
      "ui:field": "enum",
      "ui:responsive": true,
      "ui:styleId": "styles:padding",
      examples: ["p-4", "p-8"],
    },
  );
}

export function paddingRef(options: SchemaOptions = {}) {
  return typedRef("styles:padding", {
    ...options,
    "ui:styleId": "styles:padding",
  });
}

export type PaddingSettings = Static<ReturnType<typeof padding>>;
