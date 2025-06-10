import type { JSONSchemaType } from "ajv";
import { type Static, Type, type TObject, type UnsafeOptions } from "@sinclair/typebox";

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

export function getLitteralFromEnum(schema: ReturnType<typeof StringEnum>) {
  if (!("enum" in schema) || !("enumNames" in schema)) {
    throw new Error("Schema does not contain enum or enumNames properties");
  }
  const { enum: enumValues, enumNames } = schema as unknown as { enum: string[]; enumNames?: string[] };
  // combine to key-value pairs
  return enumValues.map((value, index) => ({
    const: value,
    title: enumNames ? enumNames[index] : value,
  }));
}
