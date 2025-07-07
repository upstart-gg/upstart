import { Type } from "@sinclair/typebox";

type BooleanOptions = Record<string, unknown>;

export function boolean(title: string, defaultValue?: boolean, options: BooleanOptions = {}) {
  return Type.Boolean({ title, default: defaultValue ?? false, ...options });
}
