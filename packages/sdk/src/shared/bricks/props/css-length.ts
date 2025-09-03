import { type Static, Type, type StringOptions } from "@sinclair/typebox";
import { typedRef } from "~/shared/utils/typed-ref";

export const cssUnits = ["px", "%", "em", "rem", "vh", "vw", "dvh", "dvw", "rlh", "lh", "cqh", "cqw"];

export function cssLength(options: StringOptions = {}) {
  return Type.String({
    title: "Length",
    $id: "styles:cssLength",
    description: `A CSS length value. Must be a number with a unit (e.g. "10px", "50%"). The unit can be one of the following: ${cssUnits?.join(", ")}.`,
    default: options.default,
    "ui:field": "css-length",
    "ui:css-units": cssUnits,
    examples: ["100px", "50%", "2em", "1.5rem"],
    ...options,
  });
}

export type CssLength = Static<ReturnType<typeof cssLength>>;

export function cssLengthRef(options: StringOptions = {}) {
  return typedRef("styles:cssLength", options);
}

export function isCssLength(value: string | number | undefined): boolean {
  if (typeof value !== "string") {
    return false;
  }
  // Check if the value is something like a number + a css unit (e.g., "20px", "50%")
  const cssLengthPattern = new RegExp(`^-?\\d+(?:\\.\\d+)?\\s*(${cssUnits.join("|")})$`);
  return cssLengthPattern.test(value);
}
