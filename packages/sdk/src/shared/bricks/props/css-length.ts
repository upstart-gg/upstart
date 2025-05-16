import { type Static, Type, type StringOptions } from "@sinclair/typebox";
import { prop } from "./helpers";

export function cssLength(
  title: string,
  defaultValue?: string,
  options: Omit<StringOptions, "default"> & { units?: string[] | "width-only" | "height-only" } = {},
) {
  if (options.units === "width-only") {
    options.units = ["px", "%", "em", "rem", "vw", "dvw", "cqw"];
  } else if (options.units === "height-only") {
    options.units = ["px", "%", "em", "rem", "lh", "rlh", "vh", "dvh", "cqh"];
  }
  return prop({
    title,
    schema: Type.String({
      title,
      default: defaultValue,
      ...options,
      "ui:field": "css-length",
      "ui:css-units": options.units ?? [
        "px",
        "%",
        "em",
        "rem",
        "vh",
        "vw",
        "dvh",
        "dvw",
        "rlh",
        "lh",
        "cqh",
        "cqw",
      ],
    }),
  });
}

export type CssLength = Static<ReturnType<typeof cssLength>>;
