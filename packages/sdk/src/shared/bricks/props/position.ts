import { Type, type Static } from "@sinclair/typebox";

export function fixedPositioned(defaultValue = false, title = "Fixed position") {
  return Type.Boolean({
    title,
    default: defaultValue,
    "ui:styleId": "styles:fixedPositioned",
  });
}

export type FixedPositionedSettings = Static<ReturnType<typeof fixedPositioned>>;
