import { Type, type StringOptions } from "@sinclair/typebox";

export function date(title = "Date", options?: StringOptions) {
  return Type.String({
    title,
    format: "date",
    "ui:field": "date",
    examples: ["2023-03-15"],
    ...options,
  });
}

export function datetime(title = "Date and Time", options?: StringOptions) {
  return Type.String({
    title,
    format: "date-time",
    "ui:field": "datetime",
    examples: ["2023-03-15T12:00:00Z"],
    ...options,
  });
}
