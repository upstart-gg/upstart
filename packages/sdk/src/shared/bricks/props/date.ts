import { Type, type StringOptions } from "@sinclair/typebox";
import { prop } from "./helpers";

export function date(title = "Date", options?: StringOptions) {
  return prop({
    title,
    schema: Type.String({
      format: "date",
      "ui:field": "date",
      ...options,
    }),
  });
}

export function datetime(title = "Date and Time", options?: StringOptions) {
  return prop({
    title,
    schema: Type.String({
      format: "date-time",
      "ui:field": "datetime",
      ...options,
    }),
  });
}
