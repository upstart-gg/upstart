import { type Static, Type, type StringOptions } from "@sinclair/typebox";

export function datarecord(title = "Database", options?: StringOptions) {
  return Type.String({
    "ui:field": "datarecord",
    title,
    ...options,
  });
}

export type DatarecordSettings = Static<ReturnType<typeof datarecord>>;
