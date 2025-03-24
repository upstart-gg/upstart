import { Type } from "@sinclair/typebox";
import { prop } from "./helpers";

type BooleanOptions = Record<string, unknown>;

export function boolean(title: string, defaultValue?: boolean, options: BooleanOptions = {}) {
  return prop({
    title,
    schema: Type.Boolean({ default: defaultValue ?? false, ...options }),
  });
}
