import type { Static, StringOptions } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/string-enum";
import { typedRef } from "~/shared/utils/typed-ref";

export function justifyContent(options: StringOptions = {}) {
  return StringEnum(
    [
      "justify-start",
      "justify-center",
      "justify-end",
      "justify-between",
      "justify-around",
      "justify-evenly",
      "justify-stretch",
    ],
    {
      enumNames: ["Start", "Center", "End", "Between", "Around", "Evenly", "Stretch"],
      $id: "styles:justifyContent",
      title: "Justify bricks",
      "ui:field": "justify-content",
      "ui:responsive": true,
      "ui:styleId": "styles:justifyContent",
      ...options,
    },
  );
}

export type JustifyContentSettings = Static<ReturnType<typeof justifyContent>>;

export function justifyContentRef(options: StringOptions = {}) {
  return typedRef("styles:justifyContent", options);
}

export function alignItems(options: StringOptions = {}) {
  return StringEnum(["items-start", "items-center", "items-end", "items-stretch"], {
    enumNames: ["Start", "Center", "End", "Stretch"],
    $id: "styles:alignItems",
    title: "Align bricks",
    "ui:field": "align-items",
    "ui:responsive": true,
    "ui:styleId": "styles:alignItems",
    ...options,
  });
}

export type AlignItemsSettings = Static<ReturnType<typeof alignItems>>;

export function alignItemsRef(options: StringOptions = {}) {
  return typedRef("styles:alignItems", options);
}

export function alignSelf(options: StringOptions = {}) {
  return StringEnum(["self-auto", "self-start", "self-center", "self-end", "self-stretch"], {
    enumNames: ["Auto", "Start", "Center", "End", "Stretch"],
    default: "self-auto",
    $id: "styles:alignSelf",
    title: "Align self",
    "ui:field": "align-self",
    "ui:responsive": true,
    "ui:styleId": "styles:alignSelf",
    ...options,
  });
}

export type AlignSelfSettings = Static<ReturnType<typeof alignSelf>>;

export function alignSelfRef(options: StringOptions = {}) {
  return typedRef("styles:alignSelf", options);
}
