import { type TObject, Type, type UnsafeOptions } from "@sinclair/typebox";
import type { JSONSchemaType } from "ajv";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function typeboxSchemaToJSONSchema<T extends Record<string, any>>(schema: TObject): JSONSchemaType<T> {
  return JSON.parse(JSON.stringify(schema));
}

export const StringEnum = <T extends string[]>(values: [...T], options: Partial<UnsafeOptions> = {}) =>
  Type.Unsafe<T[number]>({
    type: "string",
    enum: values,
    ...options,
  });
