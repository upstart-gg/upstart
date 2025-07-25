import type { Static, StringOptions } from "@sinclair/typebox";
import { StringEnum } from "~/shared/utils/string-enum";
import { typedRef } from "~/shared/utils/typed-ref";

export function basicGap(opts: StringOptions & { allowNoGap?: boolean } = {}) {
  const allowNoGap = opts.allowNoGap !== false;
  const values = [
    "gap-0",
    "gap-px",
    "gap-2",
    "gap-4",
    "gap-6",
    "gap-8",
    "gap-10",
    "gap-12",
    "gap-16",
    "gap-24",
  ];
  const names = ["No gap", "Minimal", "S", "M", "L", "XL", "2XL", "4XL", "4XL", "6XL"];
  const filteredValues = allowNoGap ? values : values.slice(1);
  const filteredNames = allowNoGap ? names : names.slice(1);
  return StringEnum(filteredValues, {
    $id: "styles:basicGap",
    enumNames: filteredNames,
    title: "Gap",
    description: "Space between elements",
    "ui:styleId": "styles:basicGap",
    ...opts,
  });
}

export type GapBasicSettings = Static<ReturnType<typeof basicGap>>;

export function basicGapRef(options: StringOptions & { allowNoGap?: boolean } = {}) {
  return typedRef("styles:basicGap", options);
}
