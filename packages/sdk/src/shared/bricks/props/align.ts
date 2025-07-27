import { type SchemaOptions, type StringOptions, Type, type Static } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/string-enum";
import { typedRef } from "~/shared/utils/typed-ref";

export function justifyContent(options: StringOptions = {}) {
  return StringEnum(["justify-start", "justify-center", "justify-end", "justify-between", "justify-around"], {
    enumNames: ["Start", "Center", "End", "Between", "Around"],
    $id: "styles:justifyContent",
    title: "Justify bricks",
    "ui:responsive": true,
    "ui:styleId": "styles:justifyContent",
    ...options,
  });
}

export function justifyContentRef(options: StringOptions = {}) {
  return typedRef("styles:justifyContent", options);
}

export function alignItems(options: StringOptions = {}) {
  return StringEnum(["items-start", "items-center", "items-end", "items-stretch"], {
    enumNames: ["Start", "Center", "End", "Stretch"],
    $id: "styles:alignItems",
    title: "Align bricks",
    "ui:responsive": true,
    "ui:styleId": "styles:alignItems",
    ...options,
  });
}

export function alignItemsRef(options: StringOptions = {}) {
  return typedRef("styles:alignItems", options);
}
