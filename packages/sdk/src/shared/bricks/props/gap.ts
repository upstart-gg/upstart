import { Type, type SchemaOptions, type Static, type StringOptions } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/string-enum";
import { typedRef } from "~/shared/utils/typed-ref";

export function basicGap(opts: StringOptions = {}) {
  return Type.Optional(
    StringEnum(
      ["gap-0", "gap-px", "gap-2", "gap-4", "gap-6", "gap-8", "gap-10", "gap-12", "gap-16", "gap-24"],
      {
        $id: "styles:basicGap",
        enumNames: ["No gap", "Minimal", "S", "M", "L", "XL", "2XL", "4XL", "4XL", "6XL"],
        title: "Gap",
        description: "Space between elements",
        default: "gap-4",
        "ui:styleId": "styles:basicGap",
        ...opts,
      },
    ),
  );
}

export type GapBasicSettings = Static<ReturnType<typeof basicGap>>;

export function basicGapRef(options: SchemaOptions = {}) {
  return typedRef("styles:basicGap", options);
}
