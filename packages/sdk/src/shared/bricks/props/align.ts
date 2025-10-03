import type { Static, StringOptions } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/string-enum";

export function justifyContent(options: StringOptions = {}) {
  return StringEnum(
    ["justify-start", "justify-center", "justify-end", "justify-between", "justify-around", "justify-evenly"],
    {
      enumNames: ["Start", "Center", "End", "Between", "Around", "Evenly"],
      // $id: "styles:justifyContent",
      title: "Justify bricks",
      "ui:field": "justify-content",
      "ui:responsive": true,
      "ui:styleId": "styles:justifyContent",
      examples: ["justify-center", "justify-evenly"],
      ...options,
    },
  );
}

export type JustifyContentSettings = Static<ReturnType<typeof justifyContent>>;

export function alignItems(options: StringOptions = {}) {
  return StringEnum(["items-start", "items-center", "items-end", "items-stretch"], {
    enumNames: ["Start", "Center", "End", "Stretch"],
    // $id: "styles:alignItems",
    title: "Align bricks",
    "ui:field": "align-items",
    "ui:responsive": true,
    "ui:styleId": "styles:alignItems",
    examples: ["items-center", "items-stretch"],
    ...options,
  });
}

export type AlignItemsSettings = Static<ReturnType<typeof alignItems>>;

export function alignSelf(options: StringOptions = {}) {
  return StringEnum(["self-auto", "self-start", "self-center", "self-end", "self-stretch"], {
    enumNames: ["Auto", "Start", "Center", "End", "Stretch"],
    default: "self-auto",
    description: "The alignment of the element on the cross axis.",
    // $id: "styles:alignSelf",
    title: "Align self",
    "ui:field": "align-self",
    "ui:responsive": true,
    "ui:styleId": "styles:alignSelf",
    ...options,
  });
}

export type AlignSelfSettings = Static<ReturnType<typeof alignSelf>>;
