import { Type, type NumberOptions } from "@sinclair/typebox";
import { type FieldMetadata, prop } from "./helpers";

type NumberFieldOptions = NumberOptions & FieldMetadata;

export function number(
  title: string,
  defaultValue?: number,
  options: Omit<NumberFieldOptions, "default"> = {},
) {
  return prop({
    title,
    schema: Type.Number({ default: defaultValue, ...options }),
  });
}
