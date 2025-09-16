import { type SchemaOptions, type Static, type StringOptions, Type } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/string-enum";
import { typedRef } from "~/shared/utils/typed-ref";

export function direction(options: StringOptions = {}) {
  return StringEnum(["flex-row", "flex-col"], {
    title: "Direction",
    description: "The direction of the layout",
    enumNames: ["Horizontal", "Vertical"],
    // $id: "styles:direction",
    "ui:styleId": "styles:direction",
    examples: ["flex-row", "flex-col"],
    ...options,
  });
}

export type DirectionSettings = Static<ReturnType<typeof direction>>;

export function directionRef(options: SchemaOptions = {}) {
  return typedRef("styles:direction", options);
}
