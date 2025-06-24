import type { TSchema } from "@sinclair/typebox";
import type { Prop } from "./types";

/**
 * Helper function for creating props with additional metadata
 */
export function prop<T extends TSchema>({ schema, ...rest }: Prop<T>): T {
  Object.assign(schema, rest);
  return schema;
}
