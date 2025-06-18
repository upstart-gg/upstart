import { Type, type NumberOptions } from "@sinclair/typebox";
import { prop } from "./helpers";
import type { FieldMetadata } from "./types";

type NumberFieldOptions = NumberOptions & FieldMetadata;

export function number(title: string, options: NumberFieldOptions = {}) {
  return prop({
    title,
    schema: Type.Number(options),
  });
}
