import { Type, type UnsafeOptions } from "@sinclair/typebox";

export type StringEnumOptions = Partial<UnsafeOptions> & {
  enumNames?: string[];
};

export const StringEnum = <T extends string[]>(values: [...T], options: StringEnumOptions = {}) =>
  Type.Unsafe<T[number]>({
    type: "string",
    enum: values,
    ...options,
  });
