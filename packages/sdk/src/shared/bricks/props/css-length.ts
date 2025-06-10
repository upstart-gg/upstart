import { type Static, Type, type StringOptions } from "@sinclair/typebox";
import { prop } from "./helpers";
import { typedRef } from "~/shared/utils/typed-ref";

export function cssLength(options: StringOptions = {}) {
  const units = ["px", "%", "em", "rem", "vh", "vw", "dvh", "dvw", "rlh", "lh", "cqh", "cqw"];
  return prop({
    title: "Length",
    schema: Type.String({
      $id: "styles:cssLength",
      description: `A CSS length value. Must be a number with a unit (e.g. "10px", "50%"). The unit can be one of the following: ${units?.join(", ")}.`,
      title: "Length",
      default: options.default,
      ...options,
      "ui:field": "css-length",
      "ui:css-units": units,
    }),
  });
}

export type CssLength = Static<ReturnType<typeof cssLength>>;

export function cssLengthRef(options: StringOptions = {}) {
  return typedRef("styles:cssLength", options);
}
