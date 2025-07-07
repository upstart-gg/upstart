import { Type, type StringOptions } from "@sinclair/typebox";

export function date(title = "Date", options?: StringOptions) {
  return Type.String({
    title,
    format: "date",
    "ui:field": "date",
    ...options,
  });
}

export function datetime(title = "Date and Time", options?: StringOptions) {
  return Type.String({
    title,
    format: "date-time",
    "ui:field": "datetime",
    ...options,
  });
}
