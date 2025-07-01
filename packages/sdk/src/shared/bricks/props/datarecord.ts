import { type Static, Type, type StringOptions } from "@sinclair/typebox";
import { prop } from "./helpers";

export function datarecord(title = "Database", options?: StringOptions) {
  return prop({
    title,
    schema: Type.String({
      "ui:field": "datarecord",
      ...options,
    }),
  });
}

export type DatarecordSettings = Static<ReturnType<typeof datarecord>>;
