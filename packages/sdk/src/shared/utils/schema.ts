import { type TObject, Type, type UnsafeOptions } from "@sinclair/typebox";
import type { JSONSchemaType } from "ajv";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function typeboxSchemaToJSONSchema<T extends Record<string, any>>(schema: TObject): JSONSchemaType<T> {
  return JSON.parse(JSON.stringify(schema));
}

type StringEnumOptions = Partial<UnsafeOptions> & {
  enumNames?: string[];
};

export const StringEnum = <T extends string[]>(values: [...T], options: StringEnumOptions = {}) =>
  Type.Unsafe<T[number]>({
    type: "string",
    enum: values,
    ...options,
  });
