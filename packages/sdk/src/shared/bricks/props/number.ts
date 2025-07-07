import { Type, type NumberOptions } from "@sinclair/typebox";
import type { FieldMetadata } from "./types";

type NumberFieldOptions = NumberOptions & FieldMetadata;

export function number(title: string, options: NumberFieldOptions = {}) {
  return Type.Number({ title, ...options });
}
